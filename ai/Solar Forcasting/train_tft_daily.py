# train_tft_daily.py
import os
import torch

from lightning.pytorch import Trainer, seed_everything
from lightning.pytorch.callbacks import EarlyStopping, ModelCheckpoint

from pytorch_forecasting import TemporalFusionTransformer, TimeSeriesDataSet
from pytorch_forecasting.metrics import QuantileLoss

from utils import load_daily_parquet, create_daily_training_dataset

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

MAX_EPOCHS = 50
BATCH_SIZE = 16


def main():
    seed_everything(42)
    print("Loading data from parquet...")
    df_daily = load_daily_parquet("output/daily_preprocessed.parquet")

    # Build training dataset
    training = create_daily_training_dataset(df_daily)

    train_dataloader = training.to_dataloader(
        train=True,
        batch_size=BATCH_SIZE,
        num_workers=0,
    )

    validation = TimeSeriesDataSet.from_dataset(
        training,
        df_daily,
        predict=True,
        stop_randomization=True,
    )

    val_dataloader = validation.to_dataloader(
        train=False,
        batch_size=BATCH_SIZE,
        num_workers=0,
    )

    # Device selection
    if torch.cuda.is_available():
        accelerator = "gpu"
        devices = 1
        precision = "16-mixed"
    else:
        accelerator = "cpu"
        devices = 1
        precision = 32

    print(f"Training on accelerator={accelerator}, devices={devices}")

    early_stop_cb = EarlyStopping(
        monitor="val_loss",
        patience=50,  # effectively disabled given MAX_EPOCHS=50
        mode="min",
    )

    ckpt_cb = ModelCheckpoint(
        dirpath=OUTPUT_DIR,
        filename="tft_daily_best",
        save_top_k=1,
        monitor="val_loss",
        mode="min",
    )

    trainer = Trainer(
        max_epochs=MAX_EPOCHS,
        accelerator=accelerator,
        devices=devices,
        precision=precision,
        callbacks=[early_stop_cb, ckpt_cb],
        logger=False,
    )

    net = TemporalFusionTransformer.from_dataset(
        training,
        learning_rate=1e-3,
        hidden_size=64,
        attention_head_size=4,
        dropout=0.1,
        hidden_continuous_size=32,
        output_size=7,  # 7 quantiles
        loss=QuantileLoss(),
        log_interval=10,
        reduce_on_plateau_patience=6,
    )

    print("Starting training...")
    trainer.fit(
        net,
        train_dataloaders=train_dataloader,
        val_dataloaders=val_dataloader,
    )

    print("Best checkpoint:", ckpt_cb.best_model_path)


if __name__ == "__main__":
    main()
