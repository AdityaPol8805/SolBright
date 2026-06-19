import os
from torch.utils.data import Dataset
from PIL import Image
import torch
import torchvision.transforms as T


class ShadowDataset(Dataset):
    def __init__(self, image_dir, mask_dir):
        self.image_dir = image_dir
        self.mask_dir = mask_dir
        self.image_files = sorted(os.listdir(image_dir))
        self.mask_files = sorted(os.listdir(mask_dir))
        assert len(self.image_files) == len(self.mask_files), "Image and mask counts do not match"

        self.image_transform = T.Compose([
            T.Resize((256, 256)),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        self.mask_transform = T.Compose([
            T.Resize((256, 256)),
            T.ToTensor()
        ])

    def __len__(self):
        return len(self.image_files)

    def __getitem__(self, idx):
        satellite_img = Image.open(os.path.join(self.image_dir, self.image_files[idx])).convert("RGB")
        mask_img = Image.open(os.path.join(self.mask_dir, self.mask_files[idx])).convert("L")

        satellite_img = self.image_transform(satellite_img)
        mask_img = self.mask_transform(mask_img)

        sample = {"satellite": satellite_img, "masks": mask_img}
        return sample
