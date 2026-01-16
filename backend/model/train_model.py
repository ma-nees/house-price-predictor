import pandas as pd
import json
import pickle
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# -----------------------------
# Load cleaned dataset
# -----------------------------
df = pd.read_csv("../data/cleaned_house_data.csv")

# -----------------------------
# One-hot encode location
# -----------------------------
dummies = pd.get_dummies(df.location)
df = pd.concat([df.drop("location", axis=1), dummies], axis=1)

# -----------------------------
# Split features & target
# -----------------------------
X = df.drop("price", axis=1)
y = df["price"]

# -----------------------------
# Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# Train Linear Regression
# -----------------------------
model = LinearRegression()
model.fit(X_train, y_train)

# -----------------------------
# Model accuracy
# -----------------------------
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy (R²): {accuracy:.2f}")

# -----------------------------
# Save model
# -----------------------------
with open("house_model.pkl", "wb") as f:
    pickle.dump(model, f)

# -----------------------------
# Save columns (for API)
# -----------------------------
with open("columns.json", "w") as f:
    json.dump(list(X.columns), f)

print("Model training completed.")
print("Files saved: house_model.pkl, columns.json")
