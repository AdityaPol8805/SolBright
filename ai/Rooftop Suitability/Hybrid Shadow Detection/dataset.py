import os
from torch.utils.data import Dataset
from PIL import Image
import torchvision.transforms as T
import torch

# Shared image transform for training and inference
IMAGE_TRANSFORM = T.Compose([
    T.Resize((256, 256)),
    T.ToTensor(),
    T.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

# Mask transforms: resize + to tensor + hard binarize
MASK_RESIZE = T.Resize((256, 256))
MASK_TO_TENSOR = T.ToTensor()


def _list_images(folder):
    exts = (".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp")
    return sorted(
        f for f in os.listdir(folder)
        if f.lower().endswith(exts)
    )


class ShadowDataset(Dataset):
    def __init__(self, image_dir: str, mask_dir: str):
        self.image_dir = image_dir
        self.mask_dir = mask_dir

        image_files = _list_images(image_dir)
        mask_files = _list_images(mask_dir)

        # match by basename (without extension) to be safe
        img_stems = {os.path.splitext(f)[0]: f for f in image_files}
        mask_stems = {os.path.splitext(f)[0]: f for f in mask_files}

        common_stems = sorted(set(img_stems.keys()) & set(mask_stems.keys()))

        if not common_stems:
            raise RuntimeError(
                f"No matching image/mask pairs found between\n"
                f"  images: {image_dir}\n"
                f"  masks:  {mask_dir}"
            )

        self.image_files = [img_stems[s] for s in common_stems]
        self.mask_files = [mask_stems[s] for s in common_stems]

        assert len(self.image_files) == len(self.mask_files), \
            f"Image and mask counts do not match after pairing: " \
            f"{len(self.image_files)} vs {len(self.mask_files)}"

        self.image_transform = IMAGE_TRANSFORM

    def __len__(self):
        return len(self.image_files)

    def __getitem__(self, idx: int):
        img_name = self.image_files[idx]
        mask_name = self.mask_files[idx]

        img_path = os.path.join(self.image_dir, img_name)
        mask_path = os.path.join(self.mask_dir, mask_name)

        # RGB satellite image
        satellite_img = Image.open(img_path).convert("RGB")
        satellite_img = self.image_transform(satellite_img)  # [3,256,256]

        # Mask (0/255 or 0/1) -> resize -> tensor in [0,1] -> hard 0/1
        mask_img = Image.open(mask_path).convert("L")
        mask_resized = MASK_RESIZE(mask_img)
        mask_tensor = MASK_TO_TENSOR(mask_resized)          # [1,H,W] float in [0,1]
        mask_binary = (mask_tensor > 0.5).float()           # strict 0/1

        sample = {
            "satellite": satellite_img,  # [3,256,256]
            "masks": mask_binary,        # [1,256,256]
        }
        return sample
