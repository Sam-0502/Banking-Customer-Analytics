# 05_train_models.py
# -------------------------------------------------
# Train machine‑learning models for the Anti‑Gravity analytics project.
# -------------------------------------------------
import os
import argparse
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import (accuracy_score, f1_score, roc_auc_score,
                             mean_squared_error, mean_absolute_error,
                             classification_report, confusion_matrix)
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, IsolationForest
from sklearn.linear_model import LogisticRegression, LinearRegression
import xgboost as xgb
import joblib

# -----------------------------------------------------------------
# Paths – adjust ROOT if you move the project folder.
# -----------------------------------------------------------------
ROOT = r"e:\Data analyst\Banking Customer Analytics"
ENGINEERED_DATA = os.path.join(ROOT, "data", "processed", "engineered_experiments.parquet")
MODEL_DIR = os.path.join(ROOT, "models")
METRICS_FILE = os.path.join(MODEL_DIR, "metrics.json")

os.makedirs(MODEL_DIR, exist_ok=True)

# -----------------------------------------------------------------
# Helper functions
# -----------------------------------------------------------------
def load_data(path):
    return pd.read_parquet(path)

def split_data(df, target, test_size=0.2, random_state=42):
    # Drop target and identifier columns that are non‑numeric strings
    id_cols = ["experiment_id", "equipment_id", "facility_id"]
    cols_to_drop = [target] + [col for col in id_cols if col in df.columns]
    
    X = df.drop(columns=cols_to_drop)
    # Select only numeric features
    X = X.select_dtypes(include=[np.number])
    y = df[target]
    
    return train_test_split(X, y, test_size=test_size, random_state=random_state)

def evaluate_classifier(model, X_test, y_test):
    probs = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else model.decision_function(X_test)
    preds = model.predict(X_test)
    return {
        "accuracy": accuracy_score(y_test, preds),
        "f1": f1_score(y_test, preds, pos_label=1),
        "roc_auc": roc_auc_score(y_test, probs),
        "confusion_matrix": confusion_matrix(y_test, preds).tolist(),
        "classification_report": classification_report(y_test, preds, output_dict=True)
    }

def evaluate_regressor(model, X_test, y_test):
    preds = model.predict(X_test)
    return {
        "rmse": np.sqrt(mean_squared_error(y_test, preds)),
        "mae": mean_absolute_error(y_test, preds),
        "r2": model.score(X_test, y_test)
    }

# -----------------------------------------------------------------
# Model training pipelines
# -----------------------------------------------------------------
def train_success_classifier(df):
    # Target column is assumed to be binary 1=Success, 0=Failed
    df = df.copy()
    # experiment_status_binary already created in feature engineering
    X_train, X_test, y_train, y_test = split_data(df, "experiment_status_binary")

    # Baseline Logistic Regression
    log_reg = LogisticRegression(max_iter=500, solver="liblinear")
    log_reg.fit(X_train, y_train)
    log_metrics = evaluate_classifier(log_reg, X_test, y_test)
    joblib.dump(log_reg, os.path.join(MODEL_DIR, "logreg_success.pkl"))

    # Random Forest (tuned via simple grid)
    rf = RandomForestClassifier(n_estimators=200, max_depth=None, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    rf_metrics = evaluate_classifier(rf, X_test, y_test)
    joblib.dump(rf, os.path.join(MODEL_DIR, "rf_success.pkl"))

    # XGBoost (binary logistic)
    xgb_clf = xgb.XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="logloss",
        n_jobs=-1,
        random_state=42,
    )
    xgb_clf.fit(X_train, y_train)
    xgb_metrics = evaluate_classifier(xgb_clf, X_test, y_test)
    joblib.dump(xgb_clf, os.path.join(MODEL_DIR, "xgb_success.pkl"))

    return {
        "logistic_regression": log_metrics,
        "random_forest": rf_metrics,
        "xgboost": xgb_metrics,
    }

def train_gravity_regressor(df):
    # Target column for regression is measured_gravity_ms2
    X_train, X_test, y_train, y_test = split_data(df, "measured_gravity_ms2")

    # Linear Regression baseline
    lin_reg = LinearRegression()
    lin_reg.fit(X_train, y_train)
    lin_metrics = evaluate_regressor(lin_reg, X_test, y_test)
    joblib.dump(lin_reg, os.path.join(MODEL_DIR, "linreg_gravity.pkl"))

    # Random Forest Regressor
    rf_reg = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
    rf_reg.fit(X_train, y_train)
    rf_metrics = evaluate_regressor(rf_reg, X_test, y_test)
    joblib.dump(rf_reg, os.path.join(MODEL_DIR, "rf_gravity.pkl"))

    # XGBoost Regressor
    xgb_reg = xgb.XGBRegressor(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror",
        eval_metric="rmse",
        n_jobs=-1,
        random_state=42,
    )
    xgb_reg.fit(X_train, y_train)
    xgb_metrics = evaluate_regressor(xgb_reg, X_test, y_test)
    joblib.dump(xgb_reg, os.path.join(MODEL_DIR, "xgb_gravity.pkl"))

    return {
        "linear_regression": lin_metrics,
        "random_forest": rf_metrics,
        "xgboost": xgb_metrics,
    }

def train_equipment_failure_classifier(df):
    # Assume column `equipment_failure_flag` exists (1 = failure)
    if "equipment_failure_flag" not in df.columns:
        raise KeyError("equipment_failure_flag column not found in dataset")
    X_train, X_test, y_train, y_test = split_data(df, "equipment_failure_flag")

    rf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    rf_metrics = evaluate_classifier(rf, X_test, y_test)
    joblib.dump(rf, os.path.join(MODEL_DIR, "rf_equipment_failure.pkl"))
    return {"random_forest": rf_metrics}

def train_anomaly_detector(df):
    # Use only numeric columns for IsolationForest
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    iso = IsolationForest(n_estimators=200, contamination=0.05, random_state=42)
    iso.fit(df[numeric_cols])
    joblib.dump(iso, os.path.join(MODEL_DIR, "iso_forest.pkl"))
    return {"status": "trained"}

def main():
    parser = argparse.ArgumentParser(description="Train ML models for Anti‑Gravity analytics")
    parser.add_argument("--test-size", type=float, default=0.2, help="Proportion of data for test set")
    args = parser.parse_args()

    df = load_data(ENGINEERED_DATA)

    print("Training Success Classification models …")
    success_metrics = train_success_classifier(df)

    print("Training Gravity Regression models …")
    gravity_metrics = train_gravity_regressor(df)

    # Optional equipment failure model – only if column exists
    if "equipment_failure_flag" in df.columns:
        print("Training Equipment Failure Classification model …")
        equipment_metrics = train_equipment_failure_classifier(df)
    else:
        equipment_metrics = None
        print("No equipment_failure_flag column – skipping that model.")

    print("Training Isolation Forest for anomaly detection …")
    anomaly_metrics = train_anomaly_detector(df)

    # Consolidate metrics
    all_metrics = {
        "success_classification": success_metrics,
        "gravity_regression": gravity_metrics,
        "equipment_failure": equipment_metrics,
        "anomaly_detection": anomaly_metrics,
    }
    # Write metrics to JSON for later reference
    with open(METRICS_FILE, "w", encoding="utf-8") as f:
        json.dump(all_metrics, f, indent=2)
    print(f"Metrics written to {METRICS_FILE}")

if __name__ == "__main__":
    main()
