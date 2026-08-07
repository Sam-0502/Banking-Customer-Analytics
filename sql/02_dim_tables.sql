-- 02_dim_tables.sql
-- Phase 4 – Dimensional tables (SQL Server)

-- 1. Dimensional table: Facilities (dim_facilities)
CREATE TABLE dbo.dim_facilities (
    facility_id      VARCHAR(10)   PRIMARY KEY,
    facility_name    VARCHAR(100) NOT NULL,
    region           VARCHAR(50)  NOT NULL,
    latitude         DECIMAL(8,6) NOT NULL,
    longitude        DECIMAL(9,6) NOT NULL,
    base_cost_usd    DECIMAL(12,2) NOT NULL
);

-- 2. Dimensional table: Equipment (dim_equipment)
CREATE TABLE dbo.dim_equipment (
    equipment_id     VARCHAR(20)   PRIMARY KEY,
    equipment_type   VARCHAR(50)  NOT NULL,
    precision_rating DECIMAL(4,3) NOT NULL
);

-- 3. Dimensional table: Date (dim_date)
CREATE TABLE dbo.dim_date (
    date_key        DATE PRIMARY KEY,
    year            INT NOT NULL,
    quarter         CHAR(2) NOT NULL,
    month           TINYINT NOT NULL,
    day_of_month    TINYINT NOT NULL,
    week_of_year    TINYINT NOT NULL,
    is_weekend      BIT NOT NULL,
    day_name        VARCHAR(10) NOT NULL,
    month_name      VARCHAR(10) NOT NULL
);

-- Populate dim_date for the range 2023‑01‑01 to 2025‑12‑31 (run once)
INSERT INTO dbo.dim_date (date_key, year, quarter, month, day_of_month, week_of_year, is_weekend, day_name, month_name)
SELECT
    CAST(DATEADD(DAY, n, '2023-01-01') AS DATE) AS date_key,
    YEAR(DATEADD(DAY, n, '2023-01-01')) AS year,
    CASE DATEPART(QUARTER, DATEADD(DAY, n, '2023-01-01'))
        WHEN 1 THEN 'Q1'
        WHEN 2 THEN 'Q2'
        WHEN 3 THEN 'Q3'
        WHEN 4 THEN 'Q4'
    END AS quarter,
    MONTH(DATEADD(DAY, n, '2023-01-01')) AS month,
    DAY(DATEADD(DAY, n, '2023-01-01')) AS day_of_month,
    DATEPART(ISO_WEEK, DATEADD(DAY, n, '2023-01-01')) AS week_of_year,
    CASE WHEN DATEPART(WEEKDAY, DATEADD(DAY, n, '2023-01-01')) IN (1,7) THEN 1 ELSE 0 END AS is_weekend,
    DATENAME(WEEKDAY, DATEADD(DAY, n, '2023-01-01')) AS day_name,
    DATENAME(MONTH, DATEADD(DAY, n, '2023-01-01')) AS month_name
FROM (SELECT TOP (DATEDIFF(DAY, '2023-01-01', '2025-12-31') + 1) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS n FROM sys.objects) AS numbers;

-- End of 02_dim_tables.sql
