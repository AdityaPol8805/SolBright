import os
import torch
import torchvision.transforms.functional as TF
from PIL import Image
from models.hybrid_model import HybridShadowDetectionModel

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CKPT_PATH = "checkpoints/hybrid_model.pth"
TEST_IMAGE_PATH = "py/test/images/$_35.jpg"  # set this
OUT_DIR = "pred_outlines"
THRESH = 0.3  # try 0.3 instead of 0.5


os.makedirs(OUT_DIR, exist_ok=True)

print("Device:", DEVICE)
print("Loading model...")
model = HybridShadowDetectionModel(pretrained=False)
model.load_state_dict(torch.load(CKPT_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

# load image
img = Image.open(TEST_IMAGE_PATH).convert("RGB")
w, h = img.size
print(f"Original image size: {w}x{h}")

# same resize & normalization as dataset
from dataset import ShadowDataset  # to reuse transforms if you defined them there
transform = ShadowDataset.image_transform if hasattr(ShadowDataset, "image_transform") else None
if transform is None:
    # fallback
    import torchvision.transforms as T
    transform = T.Compose([
        T.Resize((256, 256)),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225])
    ])

input_tensor = transform(img).unsqueeze(0).to(DEVICE)

with torch.no_grad():
    logits = model(input_tensor)           # [1,1,H,W]
    probs = torch.sigmoid(logits)[0, 0]   # [H,W] in [0,1]
    print("Pred min/max:", probs.min().item(), probs.max().item())

    # Resize back to original size for saving
    probs_full = TF.resize(probs.unsqueeze(0),
                           (h, w),
                           interpolation=TF.InterpolationMode.BILINEAR)[0]

    # threshold
    binary = (probs_full > THRESH).float()

# save probability heatmap and binary mask
probs_img = (probs_full.cpu().numpy() * 255).astype("uint8")
mask_img = (binary.cpu().numpy() * 255).astype("uint8")

Image.fromarray(mask_img).save(os.path.join(OUT_DIR, "pred_mask.png"))
Image.fromarray(probs_img).save(os.path.join(OUT_DIR, "pred_probs.png"))
print("Saved pred_mask.png and pred_probs.png in", OUT_DIR)
