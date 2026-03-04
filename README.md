# CardioGuard AI — Cardiovascular Disease Prediction

A complete Machine Learning project that predicts cardiovascular disease risk using 6 ML algorithms, deployed as a Flask web application with a premium dark-themed UI.

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
├── cardio_train.csv    # Dataset
├── run_pipeline.py     # Generates cleaned data, models & Flask files
└── requirements.txt    # Dependencies
```

## Setup & Run

```bash
git clone <repo-url>
cd ML
pip install -r requirements.txt
python run_pipeline.py
python app.py
```

Open **http://localhost:5000** in your browser.

> `run_pipeline.py` generates the cleaned dataset, trains all 6 models, saves `.pkl` files, and creates the Flask app files.

## Dataset

[Cardiovascular Disease Dataset](https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset) — 70,000 patient records with 12 features.

## Tech Stack

- **ML:** scikit-learn, pandas, numpy, matplotlib, seaborn, plotly
- **Web:** Flask, HTML/CSS/JS, Plotly.js
