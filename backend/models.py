from datetime import datetime
from backend import db

class Facility(db.Model):
    __tablename__ = 'facilities'
    facility_id = db.Column(db.String, primary_key=True)
    facility_name = db.Column(db.String, nullable=False)
    region = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    base_cost = db.Column(db.Float)

class Equipment(db.Model):
    __tablename__ = 'equipment'
    equipment_id = db.Column(db.String, primary_key=True)
    equipment_type = db.Column(db.String)
    precision_rating = db.Column(db.Float)

class Experiment(db.Model):
    __tablename__ = 'experiments'
    experiment_id = db.Column(db.String, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    facility_id = db.Column(db.String, db.ForeignKey('facilities.facility_id'))
    equipment_id = db.Column(db.String, db.ForeignKey('equipment.equipment_id'))
    environment_type = db.Column(db.String)
    altitude_km = db.Column(db.Float)
    ambient_temp_k = db.Column(db.Float)
    chamber_pressure_pa = db.Column(db.Float)
    magnetic_field_microtesla = db.Column(db.Float)
    theoretical_gravity_ms2 = db.Column(db.Float)
    measured_gravity_ms2 = db.Column(db.Float)
    gravity_anomaly_delta = db.Column(db.Float)
    energy_consumption_kwh = db.Column(db.Float)
    duration_seconds = db.Column(db.Integer)
    research_cost_usd = db.Column(db.Float)
    sensor_calibration_drift = db.Column(db.Float)
    anomaly_flag = db.Column(db.Integer)
    experiment_status = db.Column(db.String)
    failure_reason = db.Column(db.String)
    experiment_status_binary = db.Column(db.Integer)
    # Additional derived fields can be added later

    facility = db.relationship('Facility', backref='experiments')
    equipment = db.relationship('Equipment', backref='experiments')
