"""
Model Training Pipeline:
Downscales global planetary boundary conditions (ENSO, IOD, MJO) to block-level precipitation outcomes:
1. Rainfall Amount Regression (LightGBM/XGBoost)
2. Monsoon Dry Spell / Break Phase Probability Classifier (Calibrated Logistic / XGBoost)
3. Heavy Rainfall Event Classifier (>64.5mm)
4. Monsoon Onset Probabilistic Scorer
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, roc_auc_score, brier_score_loss
from sklearn.preprocessing import OneHotEncoder
from lightgbm import LGBMRegressor, LGBMClassifier

def train_and_export_models():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "teleconnections_block_dataset.csv")
    df = pd.read_csv(csv_path)

    features = [
        "month", "day_of_year", "lat", "lon",
        "enso_oni", "iod_dmi", "mjo_phase", "mjo_amplitude", "rmm1", "rmm2"
    ]
    
    # One-hot encode block_id
    encoded_blocks = pd.get_dummies(df["block_id"], prefix="blk", drop_first=True)
    X = pd.concat([df[features], encoded_blocks], axis=1)
    feature_columns = list(X.columns)
    
    # 1. Rainfall Regression Model
    y_rain = df["rainfall_mm"]
    X_train, X_test, y_train, y_test = train_test_split(X, y_rain, test_size=0.2, random_state=42)
    
    print("Training Rainfall Downscaling Regressor...")
    rain_model = LGBMRegressor(n_estimators=120, learning_rate=0.06, random_state=42)
    rain_model.fit(X_train, y_train)
    rain_preds = rain_model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, rain_preds))
    print(f"Rainfall Regressor RMSE: {rmse:.2f} mm")

    # 2. Dry Spell (Break Monsoon) Probability Classifier
    y_dry = df["dry_spell_4d"]
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_dry, test_size=0.2, random_state=42)
    
    print("Training Break Phase (Dry Spell) Probability Classifier...")
    dry_model = LGBMClassifier(n_estimators=100, learning_rate=0.05, random_state=42)
    dry_model.fit(X_train_c, y_train_c)
    dry_probs = dry_model.predict_proba(X_test_c)[:, 1]
    dry_auc = roc_auc_score(y_test_c, dry_probs)
    print(f"Dry Spell Classifier AUC: {dry_auc:.3f}")

    # 3. Heavy Rain Event Classifier
    y_heavy = df["is_heavy_rain"]
    X_train_h, X_test_h, y_train_h, y_test_h = train_test_split(X, y_heavy, test_size=0.2, random_state=42)
    
    print("Training Heavy Rain Classifier...")
    heavy_model = LGBMClassifier(n_estimators=80, learning_rate=0.05, scale_pos_weight=4, random_state=42)
    heavy_model.fit(X_train_h, y_train_h)
    heavy_probs = heavy_model.predict_proba(X_test_h)[:, 1]
    heavy_auc = roc_auc_score(y_test_h, heavy_probs)
    print(f"Heavy Rain Classifier AUC: {heavy_auc:.3f}")

    # Save artifacts
    artifacts = {
        "features": feature_columns,
        "rain_model": rain_model,
        "dry_model": dry_model,
        "heavy_model": heavy_model
    }
    
    model_pkg_path = os.path.join(base_dir, "monsoon_downscaling_models.joblib")
    joblib.dump(artifacts, model_pkg_path)
    print(f"Successfully serialized model bundle to: {model_pkg_path}")

if __name__ == "__main__":
    train_and_export_models()
