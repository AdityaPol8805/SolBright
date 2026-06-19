import torch
import torch.nn as nn
from torchvision.models import resnet18, ResNet18_Weights


class HybridShadowDetectionModel(nn.Module):
    """
    Satellite-only binary shadow segmentation model.
    Outputs logits; use BCEWithLogitsLoss during training.
    """

    def __init__(self, pretrained: bool = True):
        super().__init__()

        weights = ResNet18_Weights.DEFAULT if pretrained else None

        # Encoder: ResNet18 backbone without avgpool + fc
        backbone = resnet18(weights=weights)
        self.encoder = nn.Sequential(*list(backbone.children())[:-2])  # [B, 512, H/32, W/32]

        # Simple decoder/head
        self.decoder = nn.Sequential(
            nn.Conv2d(512, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 1, kernel_size=1)  # <- logits, NO Sigmoid here
        )

    def forward(self, satellite_image: torch.Tensor) -> torch.Tensor:
        """
        Args:
            satellite_image: [B, 3, H, W], normalized RGB.
        Returns:
            logits: [B, 1, H, W]
        """
        feats = self.encoder(satellite_image)          # [B, 512, H/32, W/32]
        x = self.decoder(feats)                        # [B, 1, H/32, W/32]

        # Upsample logits to input resolution
        logits = nn.functional.interpolate(
            x, size=satellite_image.shape[2:], mode="bilinear", align_corners=False
        )
        return logits
