// App.jsx
import { useState, useEffect } from "react";
import PredictionForm from "./components/PredictionForm";
import PriceChart from "./components/PriceChart";
import ResultCard from "./components/ResultCard";
import "./App.css";

function App() {
  const [price, setPrice] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Mock data for initial state
  useEffect(() => {
    // You can remove this or keep it for demo purposes
    const initialData = {
      location: "Bangalore",
      sqft: 1500,
      bhk: 3
    };
    // setInputs(initialData);
  }, []);

  return (
    <div className="app">
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-wrapper">
            <div className="logo-circle"></div>
            <span className="logo">🏠</span>
          </div>
        </div>
        
        <div className="header-content">
          <h1 className="app-title">AI Property Price Predictor</h1>
          <p className="app-tagline">
            Get accurate property price estimates powered by machine learning and real-time market data
          </p>
          
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">95%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">10K+</span>
              <span className="stat-label">Predictions</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">50+</span>
              <span className="stat-label">Locations</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">24/7</span>
              <span className="stat-label">Real-time Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-content">
        {/* Prediction Form Section */}
        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Property Details</h2>
              <p className="section-subtitle">Enter your property information for an accurate price estimate</p>
            </div>
            <span className="badge">Step 1 of 3</span>
          </div>
          
          <PredictionForm 
            setPrice={setPrice}
            setInputs={setInputs}
          />
        </section>

        {/* Results Section */}
        {price && (
          <>
            <section className="section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Price Prediction</h2>
                  <p className="section-subtitle">Your property value estimate with detailed insights</p>
                </div>
                <span className="badge purple">AI Generated</span>
              </div>
              
              <ResultCard 
                price={price}
                inputs={inputs}
              />
            </section>

            {/* Chart Section */}
            <section className="section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Market Analysis</h2>
                  <p className="section-subtitle">Compare your property with market trends and insights</p>
                </div>
                <span className="badge blue">Interactive</span>
              </div>
              
              <PriceChart 
                price={price}
                previousPrice={price * 0.95} // Mock previous price
                inputs={inputs}
              />
            </section>
          </>
        )}

        {/* How It Works Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
          </div>
          
          <div className="components-grid">
            <div className="component-card">
              <div className="badge">1</div>
              <h3>Enter Details</h3>
              <p>Provide location, area, and configuration details of your property.</p>
            </div>
            
            <div className="component-card">
              <div className="badge purple">2</div>
              <h3>AI Analysis</h3>
              <p>Our AI analyzes market data, trends, and comparable properties.</p>
            </div>
            
            <div className="component-card">
              <div className="badge blue">3</div>
              <h3>Get Results</h3>
              <p>Receive accurate price estimates with detailed insights and analysis.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">
            This AI-powered property price predictor uses machine learning algorithms and real-time market data 
            to provide accurate estimates. All predictions are for informational purposes only.
          </p>
          
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">API Documentation</a>
          </div>
          
          <div className="divider"></div>
          
          <p className="footer-text">
            © {new Date().getFullYear()} AI Property Predictor. All rights reserved. 
            <span style={{ opacity: 0.7, marginLeft: '0.5rem' }}>
              Made with ❤️ for real estate innovation
            </span>
          </p>
        </div>
      </footer>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">Processing your request...</p>
        </div>
      )}
    </div>
  );
}

export default App;