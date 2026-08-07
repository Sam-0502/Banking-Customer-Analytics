-- 01_schema_creation.sql
-- Phase 4 – Database creation (SQL Server syntax)

-- 1. Create the database (if it does not exist)
IF DB_ID('AntiGravityAnalytics') IS NULL
BEGIN
    CREATE DATABASE AntiGravityAnalytics;
    PRINT 'Database AntiGravityAnalytics created.';
END
ELSE
BEGIN
    PRINT 'Database AntiGravityAnalytics already exists.';
END
GO

-- 2. Switch context to the new database
USE AntiGravityAnalytics;
GO

-- 3. Optional: set a simple recovery model for a dev environment
ALTER DATABASE AntiGravityAnalytics SET RECOVERY SIMPLE;
GO
