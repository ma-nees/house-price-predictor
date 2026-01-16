from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import json
import numpy as np

app = Flask(__name__)
CORS(app)  # 🔥 allow React (5173) to talk to Flask (5000)

# -----------------------------
# Load model and columns
# -----------------------------
with open("model/house_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/columns.json", "r") as f:
    columns = json.load(f)

# -----------------------------
# Home route (test)
# -----------------------------
@app.route("/")
def home():
    return "House Price Prediction API is running"

# -----------------------------
# Locations route (for dropdown)
# -----------------------------
@app.route("/locations", methods=["GET"])
def get_locations():
    locations = [col for col in columns if col not in ["total_sqft", "bhk"]]
    return jsonify(locations)

# -----------------------------
# Prediction route
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Input values
    location = data.get("location")
    total_sqft = float(data.get("total_sqft"))
    bhk = int(data.get("bhk"))

    # Create input array
    x = np.zeros(len(columns))

    # Numerical features
    x[columns.index("total_sqft")] = total_sqft
    x[columns.index("bhk")] = bhk

    # Location one-hot encoding
    if location in columns:
        loc_index = columns.index(location)
    else:
        loc_index = columns.index("other")

    x[loc_index] = 1

    # Prediction
    predicted_price = model.predict([x])[0]
    
    # Convert from Lakhs to Rupees (model returns price in Lakhs)
    predicted_price_rupees = predicted_price * 100000

    return jsonify({
        "predicted_price": round(predicted_price_rupees, 2)
    })

# -----------------------------
# Run server
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
