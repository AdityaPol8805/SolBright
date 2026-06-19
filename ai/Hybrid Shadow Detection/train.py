import os
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from models.hybrid_model import HybridShadowDetectionModel
from dataset import ShadowDataset

# ----------------- CONFIG -----------------
EPOCHS = 20           # increase later if needed
BATCH_SIZE = 4
LEARNING_RATE = 1e-4

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

IMAGE_DIR = "py/train/images"
MASK_DIR  = "py/train/masks"
# -------------------------------------------

def main():
    print("Using device:", DEVICE)
    print("CUDA available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("GPU name:", torch.cuda.get_device_name(0))

    # 1. Check data folders
    assert os.path.exists(IMAGE_DIR), f"Image directory {IMAGE_DIR} does not exist"
    assert os.path.exists(MASK_DIR),  f"Mask directory {MASK_DIR} does not exist"

    # 2. Dataset & DataLoader
    train_dataset = ShadowDataset(image_dir=IMAGE_DIR, mask_dir=MASK_DIR)
    print("Dataset size:", len(train_dataset))

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0
    )

    # 3. Model, loss, optimizer
    model = HybridShadowDetectionModel(pretrained=True).to(DEVICE)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

    # 4. Training loop
    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        start_epoch = time.time()

        for i, batch in enumerate(train_loader):
            images = batch["satellite"].to(DEVICE)     # [B,3,H,W]
            masks  = batch["masks"].to(DEVICE).float() # [B,1,H,W], 0/1

            optimizer.zero_grad()
            logits = model(images)                     # [B,1,H,W]
            loss = criterion(logits, masks)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

            if (i + 1) % 50 == 0:
                print(f"Epoch {epoch+1} Batch {i+1} Loss: {loss.item():.4f}")

        avg_loss = running_loss / len(train_loader)
        duration = time.time() - start_epoch
        print(f"Epoch {epoch+1}/{EPOCHS} finished in {duration:.1f}s "
              f"- Avg loss: {avg_loss:.4f}")

    # 5. Save trained model
    os.makedirs("checkpoints", exist_ok=True)
    torch.save(model.state_dict(), "checkpoints/hybrid_model.pth")
    print("Training complete and model saved to checkpoints/hybrid_model.pth")


if __name__ == "__main__":
    main()
