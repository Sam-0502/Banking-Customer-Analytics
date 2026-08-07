# 03_clean_data.py
# -------------------------------------------------
# Reads the raw synthetic CSV, applies the same cleaning steps
# that were used in Phase 3, and writes a cleaned CSV ready
# for feature engineering.
# -------------------------------------------------
import pandas as pd
import numpy as np
import os

BASE_DIR = r"e:\Data analyst\Banking Customer Analytics"
RAW_PATH = os.path.join(BASE_DIR, "data", "raw", "space_gravity_telemetry_raw.csv")
CLEAN_PATH = os.path.join(BASE_DIR, "data", "processed", "space_gravity_telemetry_cleaned.csv")

def load_raw(path):
    return pd.read_csv(path)

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    # 1. Drop exact duplicate rows (including the intentional duplicates added in the generator)
    df = df.drop_duplicates().reset_index(drop=True)
    # 2. Standardise text fields (failure_reason, experiment_status, environment_type)
    df['failure_reason'] = (
        df['failure_reason']
        .astype(str)
        .str.strip()
        .str.title()
        .replace({"power surge": "Power Surge", "thermal drift": "Thermal Drift"})
    )
    df['experiment_status'] = df['experiment_status'].astype(str).str.title()
    df['environment_type'] = df['environment_type'].astype(str).str.title()
    # 3. Fill missing numeric columns with the median of each column
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        median_val = df[col].median()
        df[col] = df[col].fillna(median_val)
    # 4. Convert timestamp to datetime and set appropriate dtypes
    df['experiment_timestamp'] = pd.to_datetime(df['timestamp'])
    df['experiment_status'] = df['experiment_status'].astype('category')
    df['environment_type'] = df['environment_type'].astype('category')
    # 5. Remove any rows that still have critical missing values (unlikely after median fill)
    df = df.dropna(subset=['ambient_temp_k', 'chamber_pressure_pa', 'magnetic_field_microtesla'])
    return df

def main():
    os.makedirs(os.path.dirname(CLEAN_PATH), exist_ok=True)
    raw_df = load_raw(RAW_PATH)
    cleaned_df = clean_dataframe(raw_df)
    cleaned_df.to_csv(CLEAN_PATH, index=False)
    print(f"Cleaned dataset written to {CLEAN_PATH} (rows: {len(cleaned_df)})")

if __name__ == "__main__":
    main()
