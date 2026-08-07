"""
Phase 1 & 2: Dataset Generator Script
Anti-Gravity Research & Space Physics Analytics Dashboard
Generates 50,000 synthetic records simulating space physics telemetry, microgravity lab experiments,
and orbital gravimetry measurements with realistic physics equations and intentional data anomalies.
"""

import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_telemetry_dataset(num_records=50000, random_seed=42):
    np.random.seed(random_seed)
    
    # 1. Facilities Dimension Data
    facilities = [
        {"facility_id": "FAC-USA-01", "facility_name": "Kennedy Space Physics Lab", "region": "North America", "lat": 28.5721, "lon": -80.6480, "base_cost": 25000},
        {"facility_id": "FAC-EUR-02", "facility_name": "ESTEC Gravity Research Center", "region": "Europe", "lat": 52.2197, "lon": 4.4195, "base_cost": 22000},
        {"facility_id": "FAC-JPN-03", "facility_name": "JAXA Tsukuba Space Center", "region": "Asia-Pacific", "lat": 36.0645, "lon": 140.1275, "base_cost": 28000},
        {"facility_id": "FAC-ISS-04", "facility_name": "ISS Microgravity Laboratory", "region": "Low Earth Orbit", "lat": 0.0000, "lon": 0.0000, "base_cost": 75000},
        {"facility_id": "FAC-CHL-05", "facility_name": "Atacama High-Altitude Physics Array", "region": "South America", "lat": -23.0234, "lon": -67.7538, "base_cost": 18000},
        {"facility_id": "FAC-AUS-06", "facility_name": "Woomera Deep Space Gravimetry Site", "region": "Oceania", "lat": -31.1986, "lon": 136.8256, "base_cost": 20000}
    ]
    
    # 2. Equipment Types
    equipment_list = [
        {"equipment_id": f"EQ-GRAV-{i:02d}", "equipment_type": "Superconducting Quantum Gravimeter", "precision_rating": 0.999}
        for i in range(1, 11)
    ] + [
        {"equipment_id": f"EQ-MAG-{i:02d}", "equipment_type": "Fluxgate Magnetometer Array", "precision_rating": 0.995}
        for i in range(1, 11)
    ] + [
        {"equipment_id": f"EQ-ACCEL-{i:02d}", "equipment_type": "Laser Interferometer Accelerometer", "precision_rating": 0.998}
        for i in range(1, 11)
    ]
    
    # 3. Environment Types & Altitudes
    environments = ["Ground Lab", "Drop Tower", "Parabolic Flight", "Orbital Satellite"]
    
    # Generate temporal range over 3 years (2023-01-01 to 2025-12-31)
    start_date = datetime(2023, 1, 1)
    timestamps = [start_date + timedelta(minutes=int(m)) for m in np.random.randint(0, 3 * 365 * 24 * 60, size=num_records)]
    timestamps.sort()
    
    records = []
    
    for i in range(num_records):
        exp_id = f"EXP-2025-{i+1:05d}"
        ts = timestamps[i]
        
        fac = np.random.choice(facilities)
        eq = np.random.choice(equipment_list)
        env = np.random.choice(environments, p=[0.4, 0.25, 0.2, 0.15])
        
        # Altitude calculation based on environment
        if env == "Ground Lab":
            altitude_km = np.random.uniform(0.0, 0.5)
        elif env == "Drop Tower":
            altitude_km = np.random.uniform(0.1, 0.8)
        elif env == "Parabolic Flight":
            altitude_km = np.random.uniform(8.0, 12.0)
        else: # Orbital Satellite
            altitude_km = np.random.uniform(300.0, 500.0)
            
        # Physical parameters
        # Earth radius R_E = 6371 km, standard gravity g0 = 9.80665 m/s^2
        g0 = 9.80665
        RE = 6371.0
        
        # Theoretical gravity decay with altitude h: g = g0 * (RE / (RE + h))^2
        theoretical_g = g0 * ((RE / (RE + altitude_km)) ** 2)
        
        # Environmental conditions
        ambient_temp_k = np.random.uniform(4.0, 320.0) if env != "Orbital Satellite" else np.random.uniform(150.0, 390.0)
        chamber_pressure_pa = np.random.exponential(scale=1000.0) if env != "Ground Lab" else np.random.normal(101325, 500)
        chamber_pressure_pa = max(1e-6, chamber_pressure_pa)
        
        magnetic_field_microtesla = np.random.uniform(25.0, 65.0) + (np.sin(i / 100.0) * 5.0)
        
        # Sensor noise and intentional anomaly injection
        sensor_drift = np.random.normal(0, 0.005)
        is_anomaly = np.random.choice([0, 1], p=[0.94, 0.06])
        
        if is_anomaly == 1:
            # Gravity anomaly perturbation (synthetic anomaly spike)
            anomaly_delta = np.random.choice([-0.85, -0.45, 0.35, 0.75]) + np.random.normal(0, 0.05)
        else:
            anomaly_delta = sensor_drift + np.random.normal(0, 0.001)
            
        measured_g = max(-0.05, theoretical_g + anomaly_delta)
        actual_delta = measured_g - theoretical_g
        
        # Energy and financial cost calculations
        duration_seconds = int(np.random.gamma(shape=2.0, scale=1800.0))
        duration_seconds = max(10, min(86400, duration_seconds))
        
        energy_kwh = (duration_seconds / 3600.0) * np.random.uniform(15.0, 150.0) + (altitude_km * 0.5)
        research_cost = fac["base_cost"] + (energy_kwh * 2.5) + (duration_seconds * 0.8) + np.random.uniform(500, 5000)
        
        # Experiment status logic
        if is_anomaly == 1 and np.random.rand() > 0.4:
            status = "Failed"
            failure_reason = np.random.choice(["Power Surge", "Thermal Drift", "Sensor Saturation", "Vacuum Leak", "Cryogenic Collapse"])
        elif np.random.rand() < 0.03:
            status = "Aborted"
            failure_reason = "Manual Safety Abort"
        else:
            status = "Success"
            failure_reason = "None"
            
        records.append({
            "experiment_id": exp_id,
            "timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
            "facility_id": fac["facility_id"],
            "facility_name": fac["facility_name"],
            "region": fac["region"],
            "latitude": round(fac["lat"], 6),
            "longitude": round(fac["lon"], 6),
            "environment_type": env,
            "altitude_km": round(altitude_km, 2),
            "ambient_temp_k": round(ambient_temp_k, 2),
            "chamber_pressure_pa": round(chamber_pressure_pa, 2),
            "magnetic_field_microtesla": round(magnetic_field_microtesla, 2),
            "theoretical_gravity_ms2": round(theoretical_g, 4),
            "measured_gravity_ms2": round(measured_g, 4),
            "gravity_anomaly_delta": round(actual_delta, 4),
            "energy_consumption_kwh": round(energy_kwh, 2),
            "duration_seconds": duration_seconds,
            "research_cost_usd": round(research_cost, 2),
            "equipment_id": eq["equipment_id"],
            "sensor_calibration_drift": round(sensor_drift, 4),
            "anomaly_flag": is_anomaly,
            "experiment_status": status,
            "failure_reason": failure_reason
        })
        
    df = pd.DataFrame(records)
    
    # 4. Introduce Dirty Data (For Phase 3 Data Cleaning Demonstration)
    print("Introducing intentional data imperfections for Phase 3 cleaning steps...")
    
    # Inject missing values (NULLs) in ~1.5% of rows
    df.loc[df.sample(frac=0.015).index, "ambient_temp_k"] = np.nan
    df.loc[df.sample(frac=0.012).index, "chamber_pressure_pa"] = np.nan
    df.loc[df.sample(frac=0.010).index, "magnetic_field_microtesla"] = np.nan
    
    # Inject duplicate records (~500 duplicate rows)
    duplicates = df.sample(n=500, random_state=42)
    df = pd.concat([df, duplicates], ignore_index=True)
    
    # Inject extreme outliers in research_cost_usd and measured_gravity_ms2
    outlier_idx = df.sample(n=50, random_state=99).index
    df.loc[outlier_idx, "research_cost_usd"] = df.loc[outlier_idx, "research_cost_usd"] * 50
    df.loc[outlier_idx, "measured_gravity_ms2"] = 99.9999 # Sensor overflow artifact
    
    # Inject inconsistent text casing / whitespace in failure_reason
    df.loc[df["failure_reason"] == "Power Surge", "failure_reason"] = " power surge "
    df.loc[df["failure_reason"] == "Thermal Drift", "failure_reason"] = "THERMAL DRIFT"
    
    return df

if __name__ == "__main__":
    raw_dir = os.path.join("data", "raw")
    os.makedirs(raw_dir, exist_ok=True)
    
    print("Generating synthetic space physics dataset (50,000+ rows)...")
    df_raw = generate_telemetry_dataset(num_records=50000)
    
    output_path = os.path.join(raw_dir, "space_gravity_telemetry_raw.csv")
    df_raw.to_csv(output_path, index=False)
    print(f"Dataset successfully created at: {output_path}")
    print(f"Total Rows: {len(df_raw)}, Total Columns: {len(df_raw.columns)}")
