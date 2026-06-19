# utils.py

import pandas as pd
from pytorch_forecasting import TimeSeriesDataSet
from pytorch_forecasting.data import GroupNormalizer

# forecast horizon (days)
MAX_PRED_DAYS = 30
# max encoder length (history); actual value will be min(this, dataset length)
MAX_ENCODER_DAYS = 180


def load_daily_parquet(path: str = "output/daily_preprocessed.parquet") -> pd.DataFrame:
    """
    Load the preprocessed daily parquet file.
    Expects columns: site_id, timestamp, y, time_idx, day, month, is_weekend, etc.
    """
    df = pd.read_parquet(path)
    required = ["site_id", "timestamp", "y", "time_idx"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"Expected column '{col}' in {path}, but it's missing.")

    # basic conversions
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["site_id"] = df["site_id"].astype(str)

    # clean continuous features
    candidate_unknown_reals = [
        "y",
        "irradiance",
        "temp",
        "humidity",
        "wind_speed",
        "pressure",
    ]
    for col in candidate_unknown_reals:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

    return df


def create_daily_training_dataset(df_daily: pd.DataFrame) -> TimeSeriesDataSet:
    """
    Create a TimeSeriesDataSet for TFT training.
    """
    min_idx = int(df_daily["time_idx"].min())
    max_idx = int(df_daily["time_idx"].max())

    # reserve MAX_PRED_DAYS as future if possible
    training_cutoff = max_idx - MAX_PRED_DAYS

    # if dataset too short, at least leave 1 step for validation
    if training_cutoff <= min_idx:
        training_cutoff = max_idx - 1

    training_df = df_daily[df_daily["time_idx"] <= training_cutoff].copy()

    if training_df.empty:
        raise ValueError(
            f"Training dataframe is empty. time_idx range: [{min_idx}, {max_idx}], "
            f"training_cutoff={training_cutoff}"
        )

    print(
        "create_daily_training_dataset: using time_idx from",
        int(training_df["time_idx"].min()),
        "to",
        int(training_df["time_idx"].max()),
        "->",
        len(training_df),
        "rows",
    )

    candidate_unknown_reals = [
        "y",
        "irradiance",
        "temp",
        "humidity",
        "wind_speed",
        "pressure",
    ]

    present_unknown_reals = []
    for col in candidate_unknown_reals:
        if col in training_df.columns:
            training_df[col] = pd.to_numeric(training_df[col], errors="coerce").fillna(0.0)
            present_unknown_reals.append(col)

    # known reals
    known_reals = ["time_idx", "day", "month", "is_weekend"]
    present_known_reals = [c for c in known_reals if c in training_df.columns]

    if "y" not in present_unknown_reals:
        raise ValueError("Target column 'y' must be present and numeric in training data.")

    training = TimeSeriesDataSet(
        training_df,
        time_idx="time_idx",
        target="y",
        group_ids=["site_id"],
        # encoder/decoder lengths
        min_encoder_length=3,  # small because your dataset is short
        max_encoder_length=min(MAX_ENCODER_DAYS, len(training_df)),
        min_prediction_length=1,
        max_prediction_length=MAX_PRED_DAYS,
        # static & time-varying features
        static_categoricals=["site_id"],
        time_varying_known_reals=present_known_reals,
        time_varying_unknown_reals=present_unknown_reals,
        # normalize target per site
        target_normalizer=GroupNormalizer(
            groups=["site_id"],
            transformation="softplus",
        ),
    )

    return training
