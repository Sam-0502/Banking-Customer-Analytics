from flask import Blueprint, jsonify
import os
import joblib
from backend.models import Experiment
from backend import db
from sqlalchemy import desc

predictions_bp = Blueprint('predictions', __name__)

# ----------------------------------------------------------------------
# Load trained models (ensure the paths exist after the ML pipeline runs)
# ----------------------------------------------------------------------
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'models'))

# Helper to safely load a model – returns None if file missing
def _load_model(fname):
    path = os.path.join(MODEL_DIR, fname)
    return joblib.load(path) if os.path.isfile(path) else None

rf_success = _load_model('rf_success.pkl')
rf_gravity = _load_model('rf_gravity.pkl')
rf_equipment = _load_model('rf_equipment_failure.pkl')
iso_forest = _load_model('iso_forest.pkl')

# ----------------------------------------------------------------------
# Utility to turn an Experiment row into the feature dict expected by the models
# ----------------------------------------------------------------------
def _experiment_features(exp):
    return {
        "altitude_km": exp.altitude_km,
        "ambient_temp_k": exp.ambient_temp_k,
        "chamber_pressure_pa": exp.chamber_pressure_pa,
        "magnetic_field_microtesla": exp.magnetic_field_microtesla,
        "energy_consumption_kwh": exp.energy_consumption_kwh,
        "duration_seconds": exp.duration_seconds,
        "research_cost_usd": exp.research_cost_usd,
        "sensor_calibration_drift": exp.sensor_calibration_drift,
        "gravity_anomaly_delta": exp.gravity_anomaly_delta,
        "experiment_status_binary": exp.experiment_status_binary,
    }

# ----------------------------------------------------------------------
# Endpoints
# ----------------------------------------------------------------------
@predictions_bp.route('/predictions/success', methods=['GET'])
def predict_success():
    if not rf_success:
        return jsonify({"error": "Success model not available"}), 404
    experiments = Experiment.query.limit(500).all()
    results = []
    for exp in experiments:
        feats = list(_experiment_features(exp).values())
        prob = rf_success.predict_proba([feats])[0][1]
        results.append({"experiment_id": exp.experiment_id, "success_probability": round(prob, 4)})
    return jsonify(results)

@predictions_bp.route('/predictions/gravity', methods=['GET'])
def predict_gravity():
    if not rf_gravity:
        return jsonify({"error": "Gravity model not available"}), 404
    experiments = Experiment.query.limit(500).all()
    results = []
    for exp in experiments:
        feats = list(_experiment_features(exp).values())
        pred = rf_gravity.predict([feats])[0]
        results.append({"experiment_id": exp.experiment_id, "predicted_gravity_ms2": round(pred, 4)})
    return jsonify(results)

@predictions_bp.route('/predictions/equipment', methods=['GET'])
def predict_equipment():
    if not rf_equipment:
        return jsonify({"error": "Equipment failure model not trained"}), 404
    experiments = Experiment.query.limit(500).all()
    results = []
    for exp in experiments:
        feats = list(_experiment_features(exp).values())
        prob = rf_equipment.predict_proba([feats])[0][1]
        results.append({"experiment_id": exp.experiment_id, "equipment_failure_probability": round(prob, 4)})
    return jsonify(results)

@predictions_bp.route('/predictions/anomalies', methods=['GET'])
def predict_anomalies():
    if not iso_forest:
        return jsonify({"error": "Anomaly detector not trained"}), 404
    experiments = Experiment.query.limit(500).all()
    cols = [
        "altitude_km", "ambient_temp_k", "chamber_pressure_pa",
        "magnetic_field_microtesla", "energy_consumption_kwh",
        "duration_seconds", "research_cost_usd",
        "sensor_calibration_drift", "gravity_anomaly_delta",
        "experiment_status_binary"
    ]
    results = []
    for exp in experiments:
        row = [getattr(exp, c) for c in cols]
        score = iso_forest.decision_function([row])[0]
        results.append({"experiment_id": exp.experiment_id, "anomaly_score": round(score, 4)})
    return jsonify(results)
