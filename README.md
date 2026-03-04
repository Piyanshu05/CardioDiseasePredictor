# CardioGuard AI — Cardiovascular Disease Prediction

A complete Machine Learning project that predicts cardiovascular disease risk using 6 ML algorithms, deployed as a Flask web application with a premium dark-themed UI.

## 🌐 Live Demo

🔗 [CardioGuard AI on Render](https://cardiodiseasepredictor.onrender.com)

## Models Used

| Rank | Model | Accuracy |
|------|-------|----------|
| 🥇 | Random Forest | 73.66% |
| 🥈 | SVM | 73.56% |
| 🥉 | Logistic Regression | 72.95% |
| 4 | Decision Tree | 72.90% |
| 5 | Linear Regression | 72.72% |
| 6 | KNN | 71.93% |

## Project Structure

```
├── Task1  - Problem Definition & Dataset Exploration
├── Task2  - Data Cleaning & Preprocessing
├── Task3  - Model Creation (6 algorithms + from scratch)
├── Task4  - Model Evaluation
├── Task5  - Advanced Model Training (CV + Tuning)
├── Task6  - Visualization of Metrics
├── Task7  - Flask Project Setup
├── Task8  - Create Frontend
├── Task9  - Create Backend
├── Task10 - Deployment
├── app.py              # Flask backend
├── templates/          # Frontend HTML
├── static/             # CSS & JS
├── cardio_train.csv    # Original dataset
├── cardio_cleaned.csv  # Cleaned dataset
├── *.pkl               # Trained models & scaler
└── requirements.txt    # Dependencies
```

## Deployment (Render)

This app is deployed on [Render](https://render.com) using the following config:

| Setting | Value |
|---------|-------|
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Instance Type** | Free |

> Free instances spin down after inactivity — the first request may take ~30 seconds to load.

## Dataset

[Cardiovascular Disease Dataset](https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset) — 70,000 patient records with 12 features.

## Tech Stack

- **ML:** scikit-learn, pandas, numpy, matplotlib, seaborn, plotly
- **Web:** Flask, Gunicorn, HTML/CSS/JS, Plotly.js
- **Deployment:** Render
