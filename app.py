from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

scaler = joblib.load("scaler.pkl")

MODEL_MAP = {
    "linear_regression": {"file": "model_linear_regression.pkl", "name": "Linear Regression", "is_regressor": True},
    "logistic_regression": {"file": "model_logistic_regression.pkl", "name": "Logistic Regression", "is_regressor": False},
    "svm": {"file": "model_svm.pkl", "name": "SVM", "is_regressor": False},
    "knn": {"file": "model_knn.pkl", "name": "KNN", "is_regressor": False},
    "decision_tree": {"file": "model_decision_tree.pkl", "name": "Decision Tree", "is_regressor": False},
    "random_forest": {"file": "model_random_forest.pkl", "name": "Random Forest", "is_regressor": False},
}

models = {}
for key, info in MODEL_MAP.items():
    try:
        models[key] = joblib.load(info["file"])
    except Exception as e:
        print(f"Warning: Could not load {info['file']}: {e}")


def prepare_features(data):
    age_years = data["age"]
    height = data["height"]
    weight = data["weight"]
    bmi = round(weight / ((height / 100) ** 2), 2)
    pulse_pressure = data["ap_hi"] - data["ap_lo"]

    features = np.array([[
        data["gender"], height, weight,
        data["ap_hi"], data["ap_lo"],
        data["cholesterol"], data["gluc"],
        data["smoke"], data["alco"], data["active"],
        age_years, bmi, pulse_pressure
    ]])
    return scaler.transform(features)


def get_prediction(model_key, features):
    model = models[model_key]
    info = MODEL_MAP[model_key]

    if info["is_regressor"]:
        raw = model.predict(features)[0]
        pred = 1 if raw >= 0.5 else 0
        conf = raw if pred == 1 else 1 - raw
    elif hasattr(model, "predict_proba"):
        proba = model.predict_proba(features)[0]
        pred = int(np.argmax(proba))
        conf = float(proba[pred])
    else:
        pred = int(model.predict(features)[0])
        conf = 0.75

    return {"model": info["name"], "prediction": pred, "confidence": round(conf, 4)}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = prepare_features(data)
    model_choice = data.get("model", "all")

    if model_choice == "all":
        predictions = [get_prediction(key, features) for key in models]
    else:
        predictions = [get_prediction(model_choice, features)]

    return jsonify({"predictions": predictions})


@app.route("/comparison")
def comparison():
    df = pd.read_csv("cardio_cleaned.csv")
    X = df.drop("cardio", axis=1)
    y = df["cardio"]
    _, X_test, _, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    X_test_scaled = scaler.transform(X_test)

    results = []
    for key, model in models.items():
        info = MODEL_MAP[key]
        if info["is_regressor"]:
            y_pred = (model.predict(X_test_scaled) >= 0.5).astype(int)
        else:
            y_pred = model.predict(X_test_scaled)

        results.append({
            "model": info["name"],
            "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
            "precision": round(float(precision_score(y_test, y_pred)), 4),
            "recall": round(float(recall_score(y_test, y_pred)), 4),
            "f1_score": round(float(f1_score(y_test, y_pred)), 4),
        })

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
