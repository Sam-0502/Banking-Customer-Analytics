@echo off
set TEMP=E:\temp_build
set TMP=E:\temp_build
".venv\Scripts\pip.exe" install --no-cache-dir flask flask-cors sqlalchemy pandas numpy scikit-learn xgboost joblib pyarrow python-dotenv
