# predict_daily_api.py
import calendar
from datetime import datetime
from typing import Optional, Literal
from pathlib import Path

import torch
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pytorch_forecasting import TemporalFusionTransformer, TimeSeriesDataSet
from utils import load_daily_parquet, create_daily_training_dataset

DATA_PATH = Path("output") / "daily_preprocessed.parquet"

# try to auto-find best checkpoint
ckpt_candidates = sorted(Path("output").glob("tft_daily_best*.ckpt"))
if not ckpt_candidates:
    raise FileNotFoundError("No TFT checkpoint found in output/ (tft_daily_best*.ckpt)")
CKPT_PATH = ckpt_candidates[-1]  # latest

app = FastAPI(title="Solar Daily Forecast API")

# CORS so frontend on 5500 can call backend on 8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ForecastRequest(BaseModel):
    mode: Literal["day", "month"]
    date: Optional[str] = None      # YYYY-MM-DD for day mode
    year: Optional[int] = None      # for month mode
    month: Optional[int] = None     # 1–12 for month mode


# globals loaded at startup
model = None
training_ds = None
base_df = None
device = "cpu"


@app.on_event("startup")
def startup_event():
    global model, training_ds, base_df, device

    device = "cuda" if torch.cuda.is_available() else "cpu"

    print("Loading daily_preprocessed.parquet...")
    base_df = load_daily_parquet(str(DATA_PATH))

    print("Creating TimeSeriesDataSet spec...")
    training_ds = create_daily_training_dataset(base_df)

    print(f"Loading TFT checkpoint from {CKPT_PATH}...")
    model = TemporalFusionTransformer.load_from_checkpoint(
        str(CKPT_PATH),
        map_location=device,
        weights_only=False,  # needed for torch >= 2.6 with GroupNormalizer
    )
    model.to(device)
    model.eval()
    print("API startup complete.")


def run_model(df: pd.DataFrame) -> pd.Series:
    """
    Build dataset from df using existing spec and run model.
    Returns a 1D Series of predicted y values (daily energy).
    """
    ds = TimeSeriesDataSet.from_dataset(
        training_ds,
        df,
        predict=True,
        stop_randomization=True,
    )

    loader = ds.to_dataloader(train=False, batch_size=64, num_workers=0)

    with torch.no_grad():
        preds = model.predict(loader)

    preds = preds.detach().cpu().numpy().ravel()
    return pd.Series(preds)


@app.get("/")
def root():
    return {"message": "Solar Daily Forecast API running"}


@app.post("/predict")
def predict(req: ForecastRequest):
    if model is None or training_ds is None or base_df is None:
        return {"error": "Model or data not loaded"}

    # ----- DAY MODE -----
    if req.mode == "day":
        if not req.date:
            return {"error": "date (YYYY-MM-DD) is required for mode='day'"}

        try:
            target_date = datetime.strptime(req.date, "%Y-%m-%d").date()
        except ValueError:
            return {"error": "date must be in format YYYY-MM-DD"}

        # base_df has timestamp column (daily timestamps)
        day_mask = base_df["timestamp"].dt.date == target_date
        df_day = base_df[day_mask].copy()

        if df_day.empty:
            return {"error": f"No rows found for date {req.date}"}

        preds = run_model(df_day)
        # sum over all sites for that day (project-level energy)
        total_y = float(preds.sum())

        return {
            "mode": "day",
            "date": req.date,
            "n_rows": int(len(df_day)),
            "total_energy_y": total_y,
            "unit_note": "y is the same unit as in daily_preprocessed.parquet (approx kWh per day)",
        }

    # ----- MONTH MODE -----
    if req.mode == "month":
        if not (req.year and req.month):
            return {"error": "year and month are required for mode='month'"}

        try:
            days_in_month = calendar.monthrange(req.year, req.month)[1]
        except Exception:
            return {"error": "Invalid year/month"}

        start = datetime(req.year, req.month, 1)
        end = datetime(req.year, req.month, days_in_month)

        mask = (base_df["timestamp"] >= pd.Timestamp(start)) & (
            base_df["timestamp"] <= pd.Timestamp(end)
        )
        df_month = base_df[mask].copy()

        if df_month.empty:
            return {"error": f"No rows for {req.year}-{req.month:02d} in data"}

        preds = run_model(df_month)

        total_month = float(preds.sum())
        avg_day = float(preds.mean())

        return {
            "mode": "month",
            "year": req.year,
            "month": req.month,
            "n_rows": int(len(df_month)),
            "total_energy_y": total_month,
            "average_daily_y": avg_day,
            "unit_note": "y is the same unit as in daily_preprocessed.parquet (approx kWh per day)",
        }

    return {"error": "Invalid mode"}
