# 🏠 House Price Predictor

A full-stack machine learning application that predicts house prices in Bangalore, India. Built with a Flask backend serving a trained ML model and a modern React frontend with beautiful UI.

![House Price Predictor](https://img.shields.io/badge/ML-House%20Price%20Prediction-green)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Flask](https://img.shields.io/badge/Flask-3.0-black)

https://house-price-predictor-black.vercel.app/
## ✨ Features

- **🤖 ML-Powered Predictions**: Trained model predicting house prices based on location, area, and BHK
- **📍 Location Search**: Autocomplete search across 200+ Bangalore locations
- **📊 Interactive Charts**: Visualize price trends and market comparisons
- **💰 Price Breakdown**: Detailed analysis including EMI, price per sqft, and more
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **⚡ PWA Support**: Installable as a Progressive Web App
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **Flask** - Web framework
- **Scikit-learn** - Machine learning
- **Pandas & NumPy** - Data processing
- **Flask-CORS** - Cross-origin support

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

## 📁 Project Structure

```
house-price-predictor/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── requirements.txt       # Python dependencies
│   ├── data/
│   │   └── cleaned_house_data.csv
│   ├── model/
│   │   ├── house_model.pkl    # Trained ML model
│   │   ├── columns.json       # Feature columns
│   │   └── train_model.py     # Model training script
│   └── notebooks/
│       └── model_training.ipynb
├── frontend/
│   ├── public/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── PredictionForm.jsx
│   │       ├── ResultCard.jsx
│   │       └── PriceChart.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```
   
   The API will be available at `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

## 📡 API Endpoints

### GET `/locations`
Returns list of available locations.

**Response:**
```json
["1st Block Jayanagar", "1st Phase JP Nagar", "2nd Stage Nagarbhavi", ...]
```

### POST `/predict`
Predicts house price based on input features.

**Request:**
```json
{
  "location": "Whitefield",
  "total_sqft": 1500,
  "bhk": 3
}
```

**Response:**
```json
{
  "predicted_price": 8500000
}
```

## 🧠 Model Training

The ML model is trained on Bangalore house price data. To retrain:

1. Place your dataset in `backend/data/`
2. Run the training script:
   ```bash
   cd backend/model
   python train_model.py
   ```

Or use the Jupyter notebook:
```bash
cd backend/notebooks
jupyter notebook model_training.ipynb
```

## 📸 Screenshots

| Home | Prediction Result |
|------|-------------------|
| Property form with location search | Price breakdown with charts |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- Bangalore House Price Dataset
- React & Vite community
- Flask & Scikit-learn documentation
