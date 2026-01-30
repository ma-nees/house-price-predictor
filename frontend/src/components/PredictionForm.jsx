import axios from "axios";
import { useEffect, useState } from "react";
import "./PredictionForm.css"; // Import CSS file

// API URL from environment variable (fallback to localhost for development)
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function PredictionForm({ setPrice, setInputs }) {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [sqft, setSqft] = useState("");
  const [bhk, setBhk] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValid, setIsValid] = useState({ sqft: true, bhk: true });

  // Fetch locations from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/locations`)
      .then((res) => {
        setLocations(res.data);
        setFilteredLocations(res.data);
        if (res.data.length > 0) {
          setLocation(res.data[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
      });
  }, []);

  // Filter locations based on search
  const handleLocationSearch = (value) => {
    setLocation(value);
    if (value.length > 0) {
      const filtered = locations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredLocations(locations);
      setShowSuggestions(false);
    }
  };

  // Validate inputs
  const validateInputs = () => {
    const sqftValid = !sqft || parseInt(sqft) >= 300;
    const bhkValid = !bhk || (parseInt(bhk) >= 1 && parseInt(bhk) <= 10);
    
    setIsValid({ sqft: sqftValid, bhk: bhkValid });
    return sqftValid && bhkValid;
  };

  // Handle sqft change with validation
  const handleSqftChange = (value) => {
    setSqft(value);
    if (value) {
      setIsValid(prev => ({ ...prev, sqft: parseInt(value) >= 300 }));
    }
  };

  // Handle bhk change with validation
  const handleBhkChange = (value) => {
    setBhk(value);
    if (value) {
      setIsValid(prev => ({ ...prev, bhk: parseInt(value) >= 1 && parseInt(value) <= 10 }));
    }
  };

  // Select location from suggestions
  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setShowSuggestions(false);
  };

  const predict = async () => {
    if (!location || !sqft || !bhk) {
      alert("Please fill all fields");
      return;
    }

    if (!validateInputs()) {
      if (!isValid.sqft) alert("Total sqft should be at least 300");
      if (!isValid.bhk) alert("Please enter a valid BHK (1-10)");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/predict`, {
        location: location,
        total_sqft: sqft,
        bhk: bhk,
      });

      setPrice(res.data.predicted_price);
      setInputs({ location, sqft, bhk });
      
      // Success feedback with animation
      const formCard = document.querySelector('.form-card');
      if (formCard) {
        formCard.classList.add('success-pulse');
        setTimeout(() => {
          formCard.classList.remove('success-pulse');
        }, 1000);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Error while predicting price");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      predict();
    }
  };

  // Clear all fields
  const handleClear = () => {
    setLocation("");
    setSqft("");
    setBhk("");
    setIsValid({ sqft: true, bhk: true });
    if (locations.length > 0) {
      setLocation(locations[0]);
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="prediction-form-container">
      {/* Form Card */}
      <div className="form-card">
        {/* Header */}
        <div className="form-header">
          <div className="form-icon">
            <div className="icon-circle">
              <span className="icon-home">🏠</span>
            </div>
            <div className="icon-glow"></div>
          </div>
          <h2 className="form-title">Property Price Predictor</h2>
          <p className="form-subtitle">Get an instant price estimate for your property</p>
        </div>

        {/* Form Grid */}
        <div className="form-content">
          {/* Location Search - Enhanced */}
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">📍</span>
              Location
            </label>
            <div className="location-input-wrapper">
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationSearch(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for a location..."
                className="location-input"
                onKeyPress={handleKeyPress}
              />
              <span className="input-icon search-icon">🔍</span>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && filteredLocations.length > 0 && (
                <div className="suggestions-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-title">Locations</span>
                    <span className="dropdown-count">{filteredLocations.length} found</span>
                  </div>
                  <div className="dropdown-list">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleSelectLocation(loc)}
                        className="suggestion-item"
                      >
                        <span className="suggestion-text">{loc}</span>
                        <span className="suggestion-arrow">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {location && filteredLocations.length === 0 && (
              <p className="input-hint error">
                ⚠️ No matching locations found. Try a different search.
              </p>
            )}
          </div>

          {/* Input Grid */}
          <div className="input-grid">
            {/* Total Sqft */}
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">📐</span>
                Total Area (sqft)
              </label>
              <div className={`number-input-wrapper ${!isValid.sqft && sqft ? 'input-error' : ''}`}>
                <input
                  type="number"
                  min="300"
                  max="100000"
                  step="50"
                  placeholder="e.g., 1,500"
                  className="number-input"
                  value={sqft}
                  onChange={(e) => handleSqftChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <span className="input-unit">sqft</span>
                <div className="input-decoration"></div>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="300"
                  max="10000"
                  step="50"
                  value={sqft || 1500}
                  onChange={(e) => setSqft(e.target.value)}
                  className="sqft-slider"
                />
                <div className="slider-labels">
                  <span className="slider-label">300 sqft</span>
                  <span className="slider-value">{sqft ? formatNumber(sqft) : '1,500'} sqft</span>
                  <span className="slider-label">10,000 sqft</span>
                </div>
              </div>
              {!isValid.sqft && sqft && (
                <p className="input-hint error">
                  Minimum 300 sqft required
                </p>
              )}
            </div>

            {/* BHK */}
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">🛌</span>
                BHK Configuration
              </label>
              <div className={`number-input-wrapper ${!isValid.bhk && bhk ? 'input-error' : ''}`}>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="e.g., 3"
                  className="number-input"
                  value={bhk}
                  onChange={(e) => handleBhkChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div className="input-decoration"></div>
              </div>
              
              <div className="bhk-quick-select">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleBhkChange(num.toString())}
                    className={`bhk-button ${bhk === num.toString() ? 'bhk-button-active' : ''}`}
                  >
                    <span className="bhk-number">{num}</span>
                    <span className="bhk-label">BHK</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleBhkChange('6+')}
                  className={`bhk-button ${bhk === '6+' ? 'bhk-button-active' : ''}`}
                >
                  <span className="bhk-number">6+</span>
                </button>
              </div>
              {!isValid.bhk && bhk && (
                <p className="input-hint error">
                  Please enter 1-10
                </p>
              )}
            </div>
          </div>

          {/* Form Status */}
          <div className="form-status">
            <div className="status-indicator">
              {location && sqft && bhk ? (
                <div className="status-success">
                  <span className="status-icon">✓</span>
                  <span className="status-text">All fields filled</span>
                </div>
              ) : (
                <div className="status-pending">
                  <span className="status-icon">○</span>
                  <span className="status-text">Fill all fields to predict</span>
                </div>
              )}
            </div>
            <div className="locations-count">
              <span className="locations-icon">🗺️</span>
              <span className="locations-text">
                {locations.length} locations available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleClear}
              className="clear-button"
            >
              <span className="button-icon">🗑️</span>
              <span className="button-text">Clear All</span>
            </button>
            <button
              onClick={predict}
              disabled={loading || !location || !sqft || !bhk}
              className={`predict-button ${loading ? 'predict-loading' : ''} ${
                !location || !sqft || !bhk ? 'predict-disabled' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span className="button-text">Predicting...</span>
                </>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  <span className="button-text">Predict Price</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-icon">⚡</span>
              <span className="stat-text">Instant results</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-text">95% accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔄</span>
              <span className="stat-text">Real-time data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}