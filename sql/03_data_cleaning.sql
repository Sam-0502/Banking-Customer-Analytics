-- 03_data_cleaning.sql
-- Phase 3: Data Cleaning Scripts (SQL Server T‑SQL)
-- Assumes raw data is loaded into staging table dbo.stg_space_gravity_telemetry_raw

-----------------------------------------------------------------
-- 1. Create staging table (if not already existing)
-----------------------------------------------------------------
IF OBJECT_ID('dbo.stg_space_gravity_telemetry_raw', 'U') IS NOT NULL
    DROP TABLE dbo.stg_space_gravity_telemetry_raw;

CREATE TABLE dbo.stg_space_gravity_telemetry_raw (
    experiment_id           VARCHAR(20)    NOT NULL,
    [timestamp]             DATETIME       NOT NULL,
    facility_id            VARCHAR(10)    NOT NULL,
    facility_name          VARCHAR(100)   NOT NULL,
    region                 VARCHAR(50)    NOT NULL,
    latitude               DECIMAL(8,6)   NOT NULL,
    longitude              DECIMAL(9,6)   NOT NULL,
    environment_type       VARCHAR(30)    NOT NULL,
    altitude_km            DECIMAL(8,2)   NOT NULL,
    ambient_temp_k         DECIMAL(6,2)   NULL,
    chamber_pressure_pa    DECIMAL(10,2)  NULL,
    magnetic_field_microtesla DECIMAL(8,2) NULL,
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

-----------------------------------------------------------------
-- 2. Load raw CSV into staging (use BULK INSERT or OPENROWSET in practice)
-----------------------------------------------------------------
-- Example (commented, adjust path as needed):
-- BULK INSERT dbo.stg_space_gravity_telemetry_raw
-- FROM '$(ProjectRoot)\\data\\raw\\space_gravity_telemetry_raw.csv'
-- WITH (FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n', CODEPAGE = '65001');

-----------------------------------------------------------------
-- 3. Data Cleaning Steps
-----------------------------------------------------------------

-- 3.1 Remove exact duplicate rows (all columns match)
WITH cte_duplicates AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY experiment_id, [timestamp], facility_id, equipment_id,
                                 ambient_temp_k, chamber_pressure_pa, magnetic_field_microtesla,
                                 measured_gravity_ms2, energy_consumption_kwh, research_cost_usd,
                                 anomaly_flag, experiment_status, failure_reason
                                 ORDER BY (SELECT NULL)) AS rn
    FROM dbo.stg_space_gravity_telemetry_raw
)
DELETE FROM cte_duplicates WHERE rn > 1;

-- 3.2 Standardise textual columns (trim, proper case)
UPDATE dbo.stg_space_gravity_telemetry_raw
SET failure_reason = CASE
        WHEN LTRIM(RTRIM(UPPER(failure_reason))) = 'POWER SURGE' THEN 'Power Surge'
        WHEN LTRIM(RTRIM(UPPER(failure_reason))) = 'THERMAL DRIFT' THEN 'Thermal Drift'
        WHEN LTRIM(RTRIM(UPPER(failure_reason))) = 'NONE' THEN 'None'
        ELSE LTRIM(RTRIM(failure_reason))
    END,
    environment_type = LTRIM(RTRIM(environment_type)),
    experiment_status = LTRIM(RTRIM(experiment_status));

-- 3.3 Impute missing numeric values with median (example for ambient_temp_k)
DECLARE @median_temp_k DECIMAL(6,2);
SELECT @median_temp_k = PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ambient_temp_k)
FROM dbo.stg_space_gravity_telemetry_raw WHERE ambient_temp_k IS NOT NULL;
UPDATE dbo.stg_space_gravity_telemetry_raw
SET ambient_temp_k = @median_temp_k
WHERE ambient_temp_k IS NULL;

-- Repeat for chamber_pressure_pa and magnetic_field_microtesla
DECLARE @median_pressure DECIMAL(10,2);
SELECT @median_pressure = PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY chamber_pressure_pa)
FROM dbo.stg_space_gravity_telemetry_raw WHERE chamber_pressure_pa IS NOT NULL;
UPDATE dbo.stg_space_gravity_raw
SET chamber_pressure_pa = @median_pressure
WHERE chamber_pressure_pa IS NULL;

DECLARE @median_magnetic DECIMAL(8,2);
SELECT @median_magnetic = PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY magnetic_field_microtesla)
FROM dbo.stg_space_gravity_telemetry_raw WHERE magnetic_field_microtesla IS NOT NULL;
UPDATE dbo.stg_space_gravity_telemetry_raw
SET magnetic_field_microtesla = @median_magnetic
WHERE magnetic_field_microtesla IS NULL;

-- 3.4 Outlier handling – cap extreme research_cost_usd & measured_gravity_ms2
DECLARE @cost_upper_limit DECIMAL(12,2) = (SELECT PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY research_cost_usd) FROM dbo.stg_space_gravity_telemetry_raw);
DECLARE @gravity_upper_limit DECIMAL(7,4) = (SELECT PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY measured_gravity_ms2) FROM dbo.stg_space_gravity_telemetry_raw);

UPDATE dbo.stg_space_gravity_telemetry_raw
SET research_cost_usd = CASE WHEN research_cost_usd > @cost_upper_limit THEN @cost_upper_limit ELSE research_cost_usd END,
    measured_gravity_ms2 = CASE WHEN measured_gravity_ms2 > @gravity_upper_limit THEN @gravity_upper_limit ELSE measured_gravity_ms2 END;

-- 3.5 Ensure referential integrity – flag rows with unknown facility/equipment for later review
-- (Assumes dim_facilities and dim_equipment will be loaded later)
-- Here we just create a view of “clean” rows:
CREATE OR ALTER VIEW dbo.vw_clean_space_gravity AS
SELECT *
FROM dbo.stg_space_gravity_telemetry_raw;

-----------------------------------------------------------------
-- 4. Insert cleaned data into fact table (to be created in Phase 4)
-----------------------------------------------------------------
-- INSERT INTO dbo.fact_experiments (... columns ...) SELECT ... FROM dbo.vw_clean_space_gravity;

-- End of 03_data_cleaning.sql
