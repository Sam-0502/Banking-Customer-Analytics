# 06_generate_predictions.py
# -------------------------------------------------
# Load engineered data, apply trained models, and output predictions
# -------------------------------------------------
import os
import pandas as pd
import joblib
import json

# -----------------------------------------------------------------
# Paths – adjust ROOT if you move the project folder.
# -----------------------------------------------------------------
ROOT = r"e:\Data analyst\Banking Customer Analytics"
ENGINEERED_DATA = os.path.join(ROOT, "data", "processed", "engineered_experiments.parquet")
MODEL_DIR = os.path.join(ROOT, "models")
OUTPUT_CSV = os.path.join(ROOT, "data", "processed", "predictions.csv")

# Model filenames – must match those saved in 05_train_models.py
MODEL_FILES = {
    "success": os.path.join(MODEL_DIR, "xgb_success.pkl"),
    "gravity": os.path.join(MODEL_DIR, "xgb_gravity.pkl"),
    "equipment_failure": os.path.join(MODEL_DIR, "rf_equipment_failure.pkl"),
    "anomaly": os.path.join(MODEL_DIR, "iso_forest.pkl"),
}

def load_data(path):
    return pd.read_parquet(path)

def load_models(paths):
    models = {}
    for key, p in paths.items():
        if os.path.exists(p):
            models[key] = joblib.load(p)
        else:
            print(f"Warning: model file {p} not found – skipping {key} predictions.")
    return models

def generate_predictions(df, models):
    """Generate predictions using trained models.

    The engineered dataframe may still contain non‑numeric columns (e.g., strings, timestamps).
    XGBoost and other scikit‑learn models require the input to consist only of numeric, bool or
    categorical dtypes. We therefore create a numeric‑only view of the dataframe for model
    inference while preserving the identifier column for the final output.
    """
    pred_df = pd.DataFrame()
    # Preserve experiment identifier for downstream use
    pred_df["experiment_id"] = df["experiment_id"]

    # Create a numeric‑only feature set for model predictions
    import numpy as np
    numeric_df = df.select_dtypes(include=[np.number, "bool", "category"]).copy()
    # Ensure any missing numeric columns that models expect are present (they were present during training)
    # If a required column is missing, XGBoost will raise an error – let it surface for debugging.

    # Success probability (binary classification)
    if "success" in models:
        # Drop the binary target column used only for training
        success_features = numeric_df.drop(columns=["experiment_status_binary"], errors="ignore")
        probs = models["success"].predict_proba(success_features)[:, 1]
        pred_df["success_probability"] = probs
        pred_df["predicted_success"] = (probs >= 0.5).astype(int)

    # Gravity regression prediction
    if "gravity" in models:
        # Remove the target column that was not used during training
        gravity_features = numeric_df.drop(columns=["measured_gravity_ms2"], errors="ignore")
        pred_df["predicted_gravity_ms2"] = models["gravity"].predict(gravity_features)

    # Equipment failure probability (if model present)
    if "equipment_failure" in models:
        probs_eq = models["equipment_failure"].predict_proba(numeric_df)[:, 1]
        pred_df["equipment_failure_prob"] = probs_eq
        pred_df["predicted_equipment_failure"] = (probs_eq >= 0.5).astype(int)

    # Anomaly score (IsolationForest – the lower the score, the more anomalous)
    if "anomaly" in models:
        iso_scores = -models["anomaly"].decision_function(numeric_df)
        pred_df["anomaly_score"] = iso_scores
        threshold = pred_df["anomaly_score"].quantile(0.95)
        pred_df["is_anomaly"] = (pred_df["anomaly_score"] >= threshold).astype(int)

    return pred_df

def main():
    df = load_data(ENGINEERED_DATA)
    models = load_models(MODEL_FILES)
    predictions = generate_predictions(df, models)
    predictions.to_csv(OUTPUT_CSV, index=False)
    print(f"Predictions written to {OUTPUT_CSV} (rows: {len(predictions)})")

if __name__ == "__main__":
    main()
