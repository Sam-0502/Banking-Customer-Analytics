$env:TEMP = 'E:\temp_build'
$env:TMP = 'E:\temp_build'
& "$PSScriptRoot\.venv\Scripts\pip.exe" install --no-cache-dir flask flask-cors sqlalchemy pandas numpy scikit-learn xgboost joblib pyarrow python-dotenv
