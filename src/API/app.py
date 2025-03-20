from flask import Flask, request, jsonify
import logging
import pandas as pd
import numpy as np
from sklearn.externals import joblib  # Ensure model is properly loaded

# Initialize Flask app
app = Flask(_name_)
logging.basicConfig(level=logging.INFO)

# Load pre-trained model
model = joblib.load("model.pkl")  # Ensure this file exists

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        user_df = pd.DataFrame([data])
        prediction = model.predict(user_df)[0]
        probabilities = model.predict_proba(user_df)[0]
        response = {
            "predicted_fitness_focus": prediction,
            "confidence_levels": {model.classes_[i]: f"{p:.1%}" for i, p in enumerate(probabilities)}
        }
        return jsonify(response)
    except Exception as e:
        logging.error(f"Prediction Error: {e}")
        return jsonify({"error": str(e)}), 500

if _name_ == '_main_':
    app.run(debug=True)