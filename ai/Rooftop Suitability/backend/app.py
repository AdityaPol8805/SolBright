import sys
import os
import math
import io
import base64

from flask import Flask, request, jsonify
from flask_cors import CORS

import torch
import torch.nn.functional as F
import numpy as np
import requests
import cv2

from PIL import Image
from torchvision import transforms
from torchvision.transforms import functional as TF
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Add your Hybrid Shadow Detection path to sys.path
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "Hybrid Shadow Detection")
    )
)

from models.hybrid_model import HybridShadowDetectionModel  # noqa: E402

# Load Google Maps API Key from backend/.env
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

if not GOOGLE_API_KEY or GOOGLE_API_KEY.strip() == "":
    raise RuntimeError(
        "No GOOGLE_MAPS_API_KEY found in .env file! Please add it in backend/.env"
    )

# Device and model loading
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODEL_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "Hybrid Shadow Detection",
        "checkpoints",
        "hybrid_model.pth",
    )
)
print(f"Loading model from: {MODEL_PATH}")

model = HybridShadowDetectionModel(pretrained=False)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()
model.to(DEVICE)

# ----------------- MAP / GEO HELPERS -----------------


def fetch_satellite_image(coords, zoom=20, size=640):
    """
    Fetch a square satellite image centered on the polygon.
    Returns: (PIL.Image, center_lat, center_lng, zoom, size)
    """
    lats = [point["lat"] for point in coords]
    lngs = [point["lng"] for point in coords]
    center_lat = (min(lats) + max(lats)) / 2.0
    center_lng = (min(lngs) + max(lngs)) / 2.0

    size_str = f"{size}x{size}"
    map_type = "satellite"

    url = (
        "https://maps.googleapis.com/maps/api/staticmap?"
        f"center={center_lat},{center_lng}&zoom={zoom}&size={size_str}"
        f"&maptype={map_type}&key={GOOGLE_API_KEY}"
    )

    print("API Request URL:", url)
    response = requests.get(url)

    print("Status Code:", response.status_code)
    print("Content Type:", response.headers.get("Content-Type", "Unknown"))

    if "image" not in response.headers.get("Content-Type", "").lower():
        print("Google Maps API ERROR:\n", response.text[:300])
        raise Exception(
            "Google Maps Static API returned an error. Check your API key or billing."
        )

    try:
        img = Image.open(io.BytesIO(response.content)).convert("RGB")
        img = img.resize((size, size))  # enforce exact size
        return img, center_lat, center_lng, zoom, size
    except Exception as e:
        print("Error while reading image:", str(e))
        raise Exception("Unable to open image from Google API response.")


def latlng_to_world_pixel(lat, lng, zoom, tile_size=256):
    """
    Convert lat/lng to global pixel coordinates in Web Mercator.
    """
    sin_lat = math.sin(lat * math.pi / 180.0)
    n = 2.0 ** zoom
    x = (lng + 180.0) / 360.0 * tile_size * n
    y = (
        (0.5 - math.log((1 + sin_lat) / (1 - sin_lat)) / (4 * math.pi))
        * tile_size
        * n
    )
    return x, y


def polygon_latlng_to_image_pixels(coords, center_lat, center_lng, zoom, size):
    """
    Map polygon lat/lng vertices to pixel coords in the fetched image.
    Assumes the image is centered at (center_lat, center_lng) at given zoom.
    """
    cx, cy = latlng_to_world_pixel(center_lat, center_lng, zoom)
    pixels = []
    for p in coords:
        px, py = latlng_to_world_pixel(p["lat"], p["lng"], zoom)
        # shift relative to center, then put into image coordinates
        ix = px - cx + size / 2.0
        iy = py - cy + size / 2.0
        pixels.append((ix, iy))
    return pixels


def meters_per_pixel_at_lat(lat, zoom, tile_size=256, earth_radius=6378137.0):
    """
    Approximate meters per pixel at a given latitude and zoom.
    """
    return (
        math.cos(lat * math.pi / 180.0)
        * 2
        * math.pi
        * earth_radius
        / (tile_size * (2 ** zoom))
    )


def polygon_to_mask(polygon_pixels, width, height):
    """
    Build a binary mask of the polygon in image pixel space.
    """
    mask = np.zeros((height, width), dtype=np.uint8)
    pts = np.array(polygon_pixels, dtype=np.int32).reshape((-1, 1, 2))
    cv2.fillPoly(mask, [pts], 1)
    return mask


# ----------------- MODEL INFERENCE -----------------


def run_shadow_detection(image_pil, threshold=0.3):
    """
    Run the shadow detection model and return:
      - mask_img: PIL image of binary mask
      - binary_full: numpy array [H,W] 0/1 of shadow mask
    """
    preprocess = transforms.Compose(
        [
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ]
    )

    w, h = image_pil.size
    input_tensor = preprocess(image_pil).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = model(satellite_image=input_tensor)  # [1,1,256,256]
        probs = torch.sigmoid(logits)[0, 0]  # [256,256] in [0,1]

        # Resize back to original image size
        probs_full = TF.resize(
            probs.unsqueeze(0),
            (h, w),
            interpolation=TF.InterpolationMode.BILINEAR,
        )[0]

        binary_full = (probs_full > threshold).float()

    binary_np = binary_full.cpu().numpy()
    mask_img = Image.fromarray((binary_np * 255).astype("uint8"))

    return mask_img, binary_np


def compute_shadow_stats(binary_full, polygon_pixels, center_lat, zoom, size):
    """
    Compute area stats inside polygon based on shadow mask.
    Returns a dict with areas in m^2 and percentage.
    """
    height, width = binary_full.shape
    # clamp polygon pixels to image bounds
    clamped_pixels = []
    for x, y in polygon_pixels:
        ix = min(max(int(round(x)), 0), width - 1)
        iy = min(max(int(round(y)), 0), height - 1)
        clamped_pixels.append([ix, iy])

    roof_mask = polygon_to_mask(clamped_pixels, width, height)  # 0/1

    rooftop_pixels = (roof_mask == 1).sum()
    shadow_on_roof_pixels = np.logical_and(roof_mask == 1, binary_full == 1).sum()
    usable_roof_pixels = rooftop_pixels - shadow_on_roof_pixels

    m_per_pixel = meters_per_pixel_at_lat(center_lat, zoom)
    area_per_pixel_m2 = m_per_pixel ** 2

    rooftop_area_m2 = rooftop_pixels * area_per_pixel_m2
    shadow_area_m2 = shadow_on_roof_pixels * area_per_pixel_m2
    usable_area_m2 = usable_roof_pixels * area_per_pixel_m2
    usable_pct = (
        (usable_roof_pixels / rooftop_pixels * 100.0) if rooftop_pixels > 0 else 0.0
    )

    return {
        "roof_area_m2": rooftop_area_m2,
        "shadow_area_m2": shadow_area_m2,
        "usable_area_m2": usable_area_m2,
        "usable_pct": usable_pct,
        "pixels": {
            "rooftop": int(rooftop_pixels),
            "shadow_on_roof": int(shadow_on_roof_pixels),
            "usable_roof": int(usable_roof_pixels),
        },
    }


# ----------------- FLASK ROUTES -----------------


@app.route("/detect_shadow", methods=["POST"])
def detect_shadow():
    try:
        data = request.get_json()
        coords = data.get("coords", None)

        if not coords:
            return jsonify({"error": "Missing polygon coordinates."}), 400

        print("Received coordinates:", coords)

        # 1. Fetch satellite image centered on polygon
        satellite_img, center_lat, center_lng, zoom, size = fetch_satellite_image(
            coords,
            zoom=20,
            size=640,
        )

        # 2. Run shadow detection model
        shadow_mask_img, binary_full = run_shadow_detection(satellite_img)

        # 3. Map polygon lat/lng to image pixels
        polygon_pixels = polygon_latlng_to_image_pixels(
            coords, center_lat, center_lng, zoom, size
        )

        # 4. Compute stats inside polygon
        stats = compute_shadow_stats(
            binary_full,
            polygon_pixels,
            center_lat=center_lat,
            zoom=zoom,
            size=size,
        )

        # 5. Convert shadow mask (for visualization) to base64
        buf = io.BytesIO()
        shadow_mask_img.save(buf, format="PNG")
        encoded_mask = base64.b64encode(buf.getvalue()).decode("utf-8")

        return jsonify(
            {
                "shadow_mask": f"data:image/png;base64,{encoded_mask}",
                "stats": stats,
                "center": {"lat": center_lat, "lng": center_lng},
                "zoom": zoom,
            }
        ), 200

    except Exception as e:
        print("ERROR in /detect_shadow:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Flask backend running on http://127.0.0.1:5000 or http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
