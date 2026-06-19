# test_model.py
import torch
import numpy as np
from pytorch_forecasting import TemporalFusionTransformer, TimeSeriesDataSet
from utils import load_daily_parquet, create_daily_training_dataset

CKPT_PATH = r"D:\Solar Forcasting\output\tft_daily_best-v1.ckpt"  # adjust if needed
DATA_PATH = r"D:\Solar Forcasting\output\daily_preprocessed.parquet"


def main():
    print("Loading data...")
    df = load_daily_parquet(DATA_PATH)

    # Recreate the TimeSeriesDataSet in the same way as training
    training_ds = create_daily_training_dataset(df)

    print("Loading model checkpoint...")
    model = TemporalFusionTransformer.load_from_checkpoint(
        CKPT_PATH,
        map_location="cpu",
        weights_only=False,  # important for torch 2.6+
    )
    model.eval()

    print("Building prediction dataset...")
    pred_ds = TimeSeriesDataSet.from_dataset(
        training_ds,
        df,
        predict=True,
        stop_randomization=True,
    )

    pred_loader = pred_ds.to_dataloader(
        train=False,
        batch_size=64,
        num_workers=0,
    )

    print("Running predictions...")
    with torch.no_grad():
        preds = model.predict(pred_loader)

    preds = preds.detach().cpu().numpy().ravel()

    n = min(10, len(preds))
    print(f"\nFirst {n} predicted values:")
    for i in range(n):
        print(f"{i:02d}: {preds[i]:.4f}")

    print("\nPrediction stats:")
    print(f"min:  {preds.min():.4f}")
    print(f"max:  {preds.max():.4f}")
    print(f"mean: {preds.mean():.4f}")


if __name__ == "__main__":
    main()
