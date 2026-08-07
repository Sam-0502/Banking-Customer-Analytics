<#
.SYNOPSIS
Bootstrap a Power BI (.pbix) file with the AntiGravityAnalytics model,
apply the space‑dark theme, and create placeholder pages.
#>

# ==== 1. Parameters (adjust if needed) ====
$pbixPath = "e:\\Data analyst\\Banking Customer Analytics\\power_bi\\anti_gravity_space_analytics.pbix"
$themePath = "C:\\Users\\Sam Roshan\\.gemini\\antigravity-ide\\brain\\60001d67-6ee1-49f6-bad0-e1ace72fb22f\\theme_space_dark.json"
$dbName = "AntiGravityAnalytics"
# ==== 2. Start Power BI Desktop (must be installed) ====
Write-Host "Launching Power BI Desktop…" -ForegroundColor Cyan
Start-Process -FilePath "pbidesktop.exe" -ArgumentList "/q" -PassThru | Out-Null
Start-Sleep -Seconds 5   # give the app a moment to start

# ==== 3. Create a temporary .pbit template (manual step) ====
# Power BI Desktop does not expose a CLI to build a model from scratch.
# The easiest approach is to first create a .pbit template manually:
#   1. Open Power BI Desktop.
#   2. Get Data → SQL Server → Server = $serverName, Database = $dbName.
#   3. Select tables: fact_experiments, dim_facilities, dim_equipment, dim_date.
#   4. Click "File → Export → Power BI template" and save as "anti_gravity_template.pbit"
#   5. Place that file in the same folder as this script.
# The script will then open the template, apply the theme, and you can Save As.

$templatePath = Join-Path $PSScriptRoot "anti_gravity_template.pbit"
if (-Not (Test-Path $templatePath)) {
    Write-Error "Template file not found at $templatePath. Please create a .pbit template manually as described in step 3."
    exit 1
}

# ==== 4. Open the template in Power BI Desktop ====
Start-Process -FilePath "pbidesktop.exe" -ArgumentList "\"$templatePath\"" -Wait

# ==== 5. Apply the dark theme ====
Start-Process -FilePath "pbidesktop.exe" -ArgumentList "/theme `"$themePath`"" -Wait

# ==== 6. Prompt user to Save As ====
Write-Host "✅ Model loaded and theme applied. Please **Save As** the report to:" $pbixPath -ForegroundColor Green
