# 04_feature_engineering.py
# -------------------------------------------------
# Load cleaned telemetry data, create derived features, and save for modeling.
# -------------------------------------------------
import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import OrdinalEncoder

# Paths – adjust if needed
BASE_DIR = r"e:\Data analyst\Banking Customer Analytics"
INPUT_CSV = os.path.join(BASE_DIR, "data", "processed", "space_gravity_telemetry_cleaned.csv")
OUTPUT_PARQUET = os.path.join(BASE_DIR, "data", "processed", "engineered_experiments.parquet")

def load_data(path: str) -> pd.DataFrame:
    return pd.read_csv(path)

def add_derived_features(df: pd.DataFrame) -> pd.DataFrame:
    # Energy per hour
    df["energy_per_hour"] = df["energy_consumption_kwh"] / (df["duration_seconds"] / 3600)
    # Gravity anomaly delta (if not already present)
    if "gravity_anomaly_delta" not in df.columns:
        df["gravity_anomaly_delta"] = df["measured_gravity_ms2"] - df["expected_gravity_ms2"]
    # Date related columns (assuming timestamp column exists)
    if "experiment_timestamp" in df.columns:
        df["experiment_timestamp"] = pd.to_datetime(df["experiment_timestamp"])
        df["year"] = df["experiment_timestamp"].dt.year
        df["month"] = df["experiment_timestamp"].dt.month
        df["quarter"] = df["experiment_timestamp"].dt.quarter
    return df

def encode_categorical(df: pd.DataFrame) -> pd.DataFrame:
    # Encode only columns that exist in the raw data.
    # The raw CSV includes facility_name, environment_type, and experiment_status.
    # equipment_type is not present (only equipment_id), so we omit it.
    cat_cols = [
        "facility_name",
        "environment_type",
        "experiment_status",
    ]
    df[cat_cols] = df[cat_cols].fillna("Unknown")
    encoder = OrdinalEncoder()
    df[cat_cols] = encoder.fit_transform(df[cat_cols])
    return df

def main():
    df = load_data(INPUT_CSV)
    df = add_derived_features(df)
    # Create binary success flag for classification models
    df['experiment_status_binary'] = (df['experiment_status'] == 'Success').astype(int)
    # Encode remaining categorical columns
    df = encode_categorical(df)
    df.to_parquet(OUTPUT_PARQUET, index=False)
    print(f"Engineered dataset saved to {OUTPUT_PARQUET}")

if __name__ == "__main__":
    main()
