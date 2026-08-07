-- 04_load_data.sql
-- Phase 4 – Load cleaned data into the star schema (SQL Server)

USE AntiGravityAnalytics;
GO

/****************************************************************************************
* 1. Create a staging table that mirrors the cleaned CSV layout.
*    This table is temporary – it will be dropped after the load.
****************************************************************************************/
IF OBJECT_ID('dbo.stg_fact_experiments_raw', 'U') IS NOT NULL
    DROP TABLE dbo.stg_fact_experiments_raw;

CREATE TABLE dbo.stg_fact_experiments_raw (
    experiment_id           VARCHAR(20)    NOT NULL,
    [timestamp]             DATETIME       NOT NULL,
    facility_id            VARCHAR(10)    NOT NULL,
    facility_name          VARCHAR(100)   NOT NULL,
    region                 VARCHAR(50)    NOT NULL,
    latitude               DECIMAL(8,6)   NOT NULL,
    longitude              DECIMAL(9,6)   NOT NULL,
    environment_type       VARCHAR(30)    NOT NULL,
    altitude_km            DECIMAL(8,2)   NOT NULL,
    ambient_temp_k         DECIMAL(6,2)   NOT NULL,
    chamber_pressure_pa    DECIMAL(10,2)  NOT NULL,
    magnetic_field_microtesla DECIMAL(8,2) NOT NULL,
    theoretical_gravity_ms2 DECIMAL(7,4) NOT NULL,
    measured_gravity_ms2    DECIMAL(7,4) NOT NULL,
    gravity_anomaly_delta   DECIMAL(7,4) NOT NULL,
    energy_consumption_kwh  DECIMAL(8,2) NOT NULL,
    duration_seconds        INT           NOT NULL,
    research_cost_usd       DECIMAL(12,2) NOT NULL,
    equipment_id            VARCHAR(20)   NOT NULL,
    sensor_calibration_drift DECIMAL(5,4) NOT NULL,
    anomaly_flag            BIT           NOT NULL,
    experiment_status       VARCHAR(20)   NOT NULL,
    failure_reason          VARCHAR(100)  NOT NULL
);
GO

/****************************************************************************************
* 2. Bulk‑insert the cleaned CSV into the staging table.
*    Adjust the path if the project root changes.
****************************************************************************************/
BULK INSERT dbo.stg_fact_experiments_raw
FROM 'e:\\Data analyst\\Banking Customer Analytics\\data\\processed\\space_gravity_telemetry_cleaned.csv'
WITH (
    FIRSTROW = 2,                -- skip header line
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    CODEPAGE = '65001',          -- UTF‑8
    TABLOCK
);
GO

/****************************************************************************************
* 3. Populate dimension tables from distinct values in the staging table.
*    (dim_date was already populated in Phase 4.)
****************************************************************************************/
-- Facilities dimension
INSERT INTO dbo.dim_facilities (facility_id, facility_name, region, latitude, longitude, base_cost_usd)
SELECT DISTINCT
    facility_id,
    facility_name,
    region,
    latitude,
    longitude,
    0.0   -- placeholder; real cost can be derived later
FROM dbo.stg_fact_experiments_raw;
GO

-- Equipment dimension
INSERT INTO dbo.dim_equipment (equipment_id, equipment_type, precision_rating)
SELECT DISTINCT
    equipment_id,
    CASE WHEN equipment_id LIKE 'EQ-GRAV%' THEN 'Superconducting Quantum Gravimeter'
         WHEN equipment_id LIKE 'EQ-MAG%'  THEN 'Fluxgate Magnetometer Array'
         WHEN equipment_id LIKE 'EQ-ACCEL%' THEN 'Laser Interferometer Accelerometer'
         ELSE 'Unknown'
    END AS equipment_type,
    0.999   -- default precision; can be refined later
FROM dbo.stg_fact_experiments_raw;
GO

/****************************************************************************************
* 4. Insert the cleaned fact rows.
*    date_key is derived from the timestamp (snowflake model).
****************************************************************************************/
INSERT INTO dbo.fact_experiments (
    experiment_id,
    [timestamp],
    facility_id,
    equipment_id,
    date_key,
    environment_type,
    altitude_km,
    ambient_temp_k,
    chamber_pressure_pa,
    magnetic_field_microtesla,
    theoretical_gravity_ms2,
    measured_gravity_ms2,
    gravity_anomaly_delta,
    energy_consumption_kwh,
    duration_seconds,
    research_cost_usd,
    sensor_calibration_drift,
    anomaly_flag,
    experiment_status,
    failure_reason
)
SELECT
    experiment_id,
    [timestamp],
    facility_id,
    equipment_id,
    CAST([timestamp] AS DATE) AS date_key,
    environment_type,
    altitude_km,
    ambient_temp_k,
    chamber_pressure_pa,
    magnetic_field_microtesla,
    theoretical_gravity_ms2,
    measured_gravity_ms2,
    gravity_anomaly_delta,
    energy_consumption_kwh,
    duration_seconds,
    research_cost_usd,
    sensor_calibration_drift,
    anomaly_flag,
    experiment_status,
    failure_reason
FROM dbo.stg_fact_experiments_raw;
GO

/****************************************************************************************
* 5. Clean‑up: drop the staging table – it is no longer needed.
****************************************************************************************/
DROP TABLE dbo.stg_fact_experiments_raw;
GO

-- End of 04_load_data.sql
