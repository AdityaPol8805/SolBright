# prepare_daily.py
"""
Robust loader + aggregator for your CSV formats.
Produces: output/daily_preprocessed.parquet

Fixes included:
- dayfirst=True for DATE_TIME parsing
- coerce numeric columns before aggregation
- resample only numeric columns using 'h' (hour)
- use ffill()/bfill() for forward/backfill
- verbose output for debugging
"""
import os
from pathlib import Path
import pandas as pd
import numpy as np

DATA_DIR = Path("data")
GEN1 = DATA_DIR / "Plant_1_Generation_Data.csv"
GEN2 = DATA_DIR / "Plant_2_Generation_Data.csv"
W1   = DATA_DIR / "Plant_1_Weather_Sensor_Data.csv"
W2   = DATA_DIR / "Plant_2_Weather_Sensor_Data.csv"
SOLP = DATA_DIR / "SolarPrediction.csv"

OUT_DIR = Path("output"); OUT_DIR.mkdir(exist_ok=True)
OUT_PARQUET = OUT_DIR / "daily_preprocessed.parquet"

print("prepare_daily.py: start")

def parse_datetime_column(df):
    # Try common timestamp columns & formats; use dayfirst=True for your DD-MM-YYYY inputs
    if "DATE_TIME" in df.columns:
        df = df.rename(columns={"DATE_TIME":"timestamp"})
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce", dayfirst=True)
    elif "UNIXTime" in df.columns:
        df = df.rename(columns={"UNIXTime":"timestamp"})
        # try seconds then milliseconds
        df["timestamp"] = pd.to_datetime(df["timestamp"], unit="s", errors="coerce")
        if df["timestamp"].isna().all():
            df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms", errors="coerce")
    elif {"Data","Time"}.issubset(set(df.columns)):
        df["timestamp"] = pd.to_datetime(df["Data"].astype(str) + " " + df["Time"].astype(str), errors="coerce", dayfirst=True)
    else:
        # attempt to find an object column that parses as datetime
        for c in df.columns:
            if df[c].dtype == object:
                try:
                    _ = pd.to_datetime(df[c].iloc[:5], errors="raise", dayfirst=True)
                    df = df.rename(columns={c:"timestamp"})
                    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce", dayfirst=True)
                    break
                except Exception:
                    continue
    return df

def safe_read_csv(path: Path):
    # robust reader: try common fallbacks
    try:
        return pd.read_csv(path)
    except Exception:
        try:
            return pd.read_csv(path, encoding="latin1")
        except Exception:
            return pd.read_csv(path, sep=';')

def load_generation(path: Path, default_site_id: str):
    print(f"loading generation: {path}")
    if not path.exists():
        print(" -> not found:", path)
        return pd.DataFrame(columns=["site_id","timestamp","power_kw","daily_yield"])
    df = safe_read_csv(path)
    df = parse_datetime_column(df)
    # normalize column names
    if "PLANT_ID" in df.columns:
        df = df.rename(columns={"PLANT_ID":"site_id"})
    if "AC_POWER" in df.columns:
        df = df.rename(columns={"AC_POWER":"power_kw"})
    elif "DC_POWER" in df.columns:
        df = df.rename(columns={"DC_POWER":"power_kw"})
    if "DAILY_YIELD" in df.columns:
        df = df.rename(columns={"DAILY_YIELD":"daily_yield"})
    if "site_id" not in df.columns:
        df["site_id"] = default_site_id
    # keep relevant columns
    keep = [c for c in ["site_id","timestamp","power_kw","daily_yield"] if c in df.columns]
    df = df[keep].copy()
    # coerce numerics
    if "power_kw" in df.columns:
        df["power_kw"] = pd.to_numeric(df["power_kw"], errors="coerce")
    if "daily_yield" in df.columns:
        df["daily_yield"] = pd.to_numeric(df["daily_yield"], errors="coerce")
    # drop rows without timestamp
    df = df.dropna(subset=["timestamp"]).sort_values(["site_id","timestamp"]).reset_index(drop=True)
    print(f" -> loaded {len(df)} rows")
    return df

def load_weather(path: Path):
    print(f"loading weather: {path}")
    if not path.exists():
        print(" -> not found:", path)
        return None
    df = safe_read_csv(path)
    df = parse_datetime_column(df)
    col_map = {}
    for c in df.columns:
        cu = c.upper()
        if "IRRADIAT" in cu or "RADIATION" in cu:
            col_map[c] = "irradiance"
        elif "AMBIENT" in cu and "TEMP" in cu:
            col_map[c] = "temp"
        elif "TEMPERATURE" in cu and "MODULE" not in cu:
            col_map[c] = "temp"
        elif "HUMID" in cu:
            col_map[c] = "humidity"
        elif "PRESS" in cu:
            col_map[c] = "pressure"
        elif "SPEED" in cu or ("WIND" in cu and "SPEED" in cu):
            col_map[c] = "wind_speed"
    df = df.rename(columns=col_map)
    # ensure expected weather cols exist (numeric)
    for col in ["irradiance","temp","humidity","pressure","wind_speed"]:
        if col not in df.columns:
            df[col] = np.nan
        else:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=["timestamp"]).sort_values("timestamp").reset_index(drop=True)
    print(f" -> loaded weather rows: {len(df)}")
    return df

def merge_and_aggregate():
    g1 = load_generation(GEN1, "site_1")
    g2 = load_generation(GEN2, "site_2")
    w1 = load_weather(W1)
    w2 = load_weather(W2)
    sp = load_weather(SOLP)

    if g1.empty and g2.empty:
        print("No generation data found. Please check data/ folder.")
        return None

    def merge_single(gen_df, weather_df, fallback_df=None):
        if gen_df.empty:
            return gen_df
        gen_df = gen_df.copy()
        gen_df["timestamp"] = pd.to_datetime(gen_df["timestamp"], errors="coerce", dayfirst=True)
        # forward/backfill nothing yet; we'll merge with numeric weather
        we = weather_df if weather_df is not None else fallback_df
        if we is not None:
            we = we.copy(); we["timestamp"] = pd.to_datetime(we["timestamp"], errors="coerce", dayfirst=True)
            # resample weather to hourly numeric means if possible
            try:
                # ensure weather numeric columns coerced
                for c in ["irradiance","temp","humidity","pressure","wind_speed"]:
                    if c in we.columns:
                        we[c] = pd.to_numeric(we[c], errors="coerce")
                we = we.set_index("timestamp").resample("h").mean().reset_index()
            except Exception:
                pass
            merged = pd.merge_asof(gen_df.sort_values("timestamp"),
                                   we.sort_values("timestamp"),
                                   on="timestamp", direction="nearest", tolerance=pd.Timedelta("30min"))
        else:
            merged = gen_df.copy()
        # forward/backfill weather numeric columns safely
        for c in ["irradiance","temp","humidity","pressure","wind_speed"]:
            if c in merged.columns:
                merged[c] = merged[c].ffill().bfill()
                merged[c] = pd.to_numeric(merged[c], errors="coerce")
        return merged

    m1 = merge_single(g1, w1, sp)
    m2 = merge_single(g2, w2, sp)

    combined = pd.concat([m1, m2], ignore_index=True, sort=False)
    if combined.empty:
        print("No merged rows after combining — check input CSV contents.")
        return None

    # Determine numeric columns that may exist
    numeric_cols = ["power_kw","irradiance","temp","humidity","pressure","wind_speed"]

    # If power present -> compute hourly means then daily sums (power_kw -> kWh approx)
    if "power_kw" in combined.columns and combined["power_kw"].notna().any():
        print("power_kw detected: computing hourly means then daily sum -> daily energy (approx kWh)")
        combined["timestamp"] = pd.to_datetime(combined["timestamp"], errors="coerce", dayfirst=True)
        hourly_list = []
        for site, grp in combined.groupby("site_id"):
            grp = grp.set_index("timestamp").sort_index()
            # coerce known numeric columns to numeric
            present_numeric = [c for c in numeric_cols if c in grp.columns]
            if not present_numeric:
                continue
            for c in present_numeric:
                grp[c] = pd.to_numeric(grp[c], errors="coerce")
            # resample numeric columns only using 'h' for hour
            hourly_numeric = grp[present_numeric].resample("h").mean().reset_index()
            hourly_numeric["site_id"] = site
            hourly_list.append(hourly_numeric)
        if hourly_list:
            hourly_df = pd.concat(hourly_list, ignore_index=True, sort=False)
        else:
            hourly_df = pd.DataFrame(columns=(numeric_cols + ["timestamp","site_id"]))
        print("Hourly rows after resample:", len(hourly_df))

        # daily aggregation (use only columns present)
        hourly_df["date"] = hourly_df["timestamp"].dt.floor("D")
        agg_map = {}
        if "power_kw" in hourly_df.columns:
            agg_map["power_kw"] = "sum"
        for c in ["irradiance","temp","humidity","pressure","wind_speed"]:
            if c in hourly_df.columns:
                agg_map[c] = "mean"
        if not agg_map:
            print("No numeric columns present to aggregate into daily. Exiting.")
            return None
        daily = hourly_df.groupby(["site_id","date"]).agg(agg_map).reset_index().rename(columns={"date":"timestamp"})
        if "power_kw" in daily.columns:
            daily = daily.rename(columns={"power_kw":"y"})
    else:
        # fallback: use DAILY_YIELD cumulative values if available
        if "daily_yield" in combined.columns and combined["daily_yield"].notna().any():
            print("No power column present — computing daily energy from DAILY_YIELD cumulative values")
            combined["timestamp"] = pd.to_datetime(combined["timestamp"], errors="coerce", dayfirst=True)
            daily_list = []
            for site, grp in combined.groupby("site_id"):
                grp = grp.sort_values("timestamp")
                grp['daily_yield'] = pd.to_numeric(grp['daily_yield'], errors='coerce')
                # take last cumulative reading per day and diff to get daily energy
                daily_vals = grp.set_index("timestamp").resample("D").last().reset_index()
                daily_vals['y'] = daily_vals['daily_yield'].diff().fillna(daily_vals['daily_yield'])
                daily_vals['site_id'] = site
                weather_daily = grp.set_index("timestamp").resample("D").mean().reset_index()
                merged_day = pd.merge(daily_vals[['timestamp','site_id','y']],
                                       weather_daily[['timestamp','irradiance','temp','humidity','pressure','wind_speed']],
                                       on='timestamp', how='left')
                daily_list.append(merged_day)
            if daily_list:
                daily = pd.concat(daily_list, ignore_index=True, sort=False)
                daily['y'] = pd.to_numeric(daily['y'], errors='coerce').clip(lower=0)
            else:
                print("No daily_yield-based daily rows produced.")
                return None
        else:
            print("Neither instantaneous power nor DAILY_YIELD available; cannot compute daily energy.")
            return None

    # finalize daily dataframe
    daily["timestamp"] = pd.to_datetime(daily["timestamp"], errors="coerce", dayfirst=True)
    daily = daily.dropna(subset=["timestamp","y"]).reset_index(drop=True)
    if daily.empty:
        print("Daily dataframe is empty after cleaning.")
        return None

    min_date = daily["timestamp"].min()
    daily["time_idx"] = ((daily["timestamp"] - min_date) / np.timedelta64(1, "D")).astype(int)
    daily["day"] = daily["timestamp"].dt.day
    daily["month"] = daily["timestamp"].dt.month
    daily["dayofweek"] = daily["timestamp"].dt.dayofweek
    daily["is_weekend"] = (daily["dayofweek"] >= 5).astype(int)
    daily = daily.sort_values(["site_id","timestamp"]).reset_index(drop=True)

    # ensure expected columns exist
    expected_cols = ['site_id','timestamp','y','irradiance','temp','humidity','pressure','wind_speed','time_idx','day','month','dayofweek','is_weekend']
    for c in expected_cols:
        if c not in daily.columns:
            daily[c] = np.nan
    daily = daily[expected_cols]

    daily.to_parquet(OUT_PARQUET, index=False)
    print("Saved daily_preprocessed.parquet to:", OUT_PARQUET)
    print("Per-site day counts:", daily.groupby("site_id").size().to_dict())
    return daily

if __name__ == "__main__":
    merge_and_aggregate()
