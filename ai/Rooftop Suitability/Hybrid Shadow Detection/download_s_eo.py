import os
from datasets import load_dataset
from PIL import Image
import numpy as np

# Output folders for your training data
OUT_IMAGE_DIR = "py/train/images"
OUT_MASK_DIR  = "py/train/masks"

os.makedirs(OUT_IMAGE_DIR, exist_ok=True)
os.makedirs(OUT_MASK_DIR, exist_ok=True)

print("⏳ Loading S-EO dataset from HuggingFace (emasquil/shadow-eo)...")
ds = load_dataset("emasquil/shadow-eo")

# Use these splits (you can trim later if too large)
splits = ["train", "validation"]

MAX_SAMPLES = None  # e.g. 2000 to limit, or None for all

count = 0
for split in splits:
    print(f"📦 Processing split: {split}...")
    for example in ds[split]:
        if MAX_SAMPLES is not None and count >= MAX_SAMPLES:
            break

        # RGB image: typically H x W x 3 uint8
        rgb = example["rgb"]
        mask = example["mask_shadow"]  # H x W, 0/1

        img = Image.fromarray(rgb.astype(np.uint8))
        mask_img = Image.fromarray((mask.astype(np.uint8) * 255))

        img_path = os.path.join(OUT_IMAGE_DIR, f"{count}.png")
        mask_path = os.path.join(OUT_MASK_DIR, f"{count}.png")

        img.save(img_path)
        mask_img.save(mask_path)

        count += 1
        if count % 500 == 0:
            print(f"  -> Saved {count} samples so far...")

print("✅ DONE!")
print(f"Total samples saved: {count}")
print(f"Images in: {OUT_IMAGE_DIR}")
print(f"Masks in:  {OUT_MASK_DIR}")
