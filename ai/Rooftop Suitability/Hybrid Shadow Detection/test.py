import os
import torch
import torchvision.transforms.functional as TF
from PIL import Image

from models.hybrid_model import HybridShadowDetectionModel
from dataset import IMAGE_TRANSFORM  # same as training

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

CKPT_PATH = "checkpoints/hybrid_model.pth"
TEST_IMAGE_PATH = "py/test/images/$_35.jpg"  # <-- change to your test image path
OUT_DIR = "pred_outlines"

THRESH = 0.2  # start slightly low, you can tune 0.1–0.4

os.makedirs(OUT_DIR, exist_ok=True)

print("Device:", DEVICE)
print("Loading model...")
model = HybridShadowDetectionModel(pretrained=False)
model.load_state_dict(torch.load(CKPT_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

# Load test image
img = Image.open(TEST_IMAGE_PATH).convert("RGB")
w, h = img.size
print(f"Original image size: {w}x{h}")

# Same preprocessing as training
input_tensor = IMAGE_TRANSFORM(img).unsqueeze(0).to(DEVICE)

with torch.no_grad():
    logits = model(input_tensor)           # [1,1,256,256]
    probs = torch.sigmoid(logits)[0, 0]    # [256,256] in [0,1]
    print("Pred min/max:", probs.min().item(), probs.max().item())

    # Resize back to original resolution for inspection
    probs_full = TF.resize(
        probs.unsqueeze(0),
        (h, w),
        interpolation=TF.InterpolationMode.BILINEAR,
    )[0]

    binary = (probs_full > THRESH).float()

# Save probability heatmap and binary mask
probs_img = (probs_full.cpu().numpy() * 255).astype("uint8")
mask_img = (binary.cpu().numpy() * 255).astype("uint8")

Image.fromarray(mask_img).save(os.path.join(OUT_DIR, "pred_mask.png"))
Image.fromarray(probs_img).save(os.path.join(OUT_DIR, "pred_probs.png"))
print("Saved pred_mask.png and pred_probs.png in", OUT_DIR)
