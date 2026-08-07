-- 03_fact_table.sql
-- Phase 4 – Fact table definition (SQL Server)

USE AntiGravityAnalytics;
GO

/*
   Fact table stores one row per experiment execution.
   Granular level enables rich analytics and Power BI measures.
*/
CREATE TABLE dbo.fact_experiments (
    experiment_id          VARCHAR(20)   PRIMARY KEY,
    [timestamp]            DATETIME      NOT NULL,
    facility_id            VARCHAR(10)   NOT NULL,
    equipment_id           VARCHAR(20)   NOT NULL,
    date_key               DATE          NOT NULL,
    environment_type       VARCHAR(30)   NOT NULL,
    altitude_km            DECIMAL(8,2)  NOT NULL,
    ambient_temp_k         DECIMAL(6,2)  NOT NULL,
    chamber_pressure_pa    DECIMAL(10,2) NOT NULL,
    magnetic_field_microtesla DECIMAL(8,2) NOT NULL,
    theoretical_gravity_ms2 DECIMAL(7,4) NOT NULL,
    measured_gravity_ms2    DECIMAL(7,4) NOT NULL,
    gravity_anomaly_delta   DECIMAL(7,4) NOT NULL,
    energy_consumption_kwh  DECIMAL(8,2) NOT NULL,
    duration_seconds        INT          NOT NULL,
    research_cost_usd       DECIMAL(12,2) NOT NULL,
    sensor_calibration_drift DECIMAL(5,4) NOT NULL,
    anomaly_flag            BIT          NOT NULL,
    experiment_status       VARCHAR(20)  NOT NULL,
    failure_reason          VARCHAR(100) NOT NULL
);
GO

-- Foreign key relationships
ALTER TABLE dbo.fact_experiments
ADD CONSTRAINT FK_fact_experiments_facility
    FOREIGN KEY (facility_id) REFERENCES dbo.dim_facilities(facility_id);
GO

ALTER TABLE dbo.fact_experiments
ADD CONSTRAINT FK_fact_experiments_equipment
    FOREIGN KEY (equipment_id) REFERENCES dbo.dim_equipment(equipment_id);
GO

ALTER TABLE dbo.fact_experiments
ADD CONSTRAINT FK_fact_experiments_date
    FOREIGN KEY (date_key) REFERENCES dbo.dim_date(date_key);
GO

-- Indexes for common query patterns
CREATE NONCLUSTERED INDEX IX_fact_experiments_facility ON dbo.fact_experiments(facility_id);
CREATE NONCLUSTERED INDEX IX_fact_experiments_equipment ON dbo.fact_experiments(equipment_id);
CREATE NONCLUSTERED INDEX IX_fact_experiments_timestamp ON dbo.fact_experiments([timestamp]);
CREATE NONCLUSTERED INDEX IX_fact_experiments_anomaly ON dbo.fact_experiments(anomaly_flag);
GO

-- End of 03_fact_table.sql
