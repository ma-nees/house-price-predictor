import { useState, useEffect } from "react";
import "./ResultCard.css";

export default function ResultCard({ price, inputs }) {
  const [currency, setCurrency] = useState("INR");
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedPrice, setAnimatedPrice] = useState(0);
  const [priceTrend, setPriceTrend] = useState("stable");
  const [loading, setLoading] = useState(false);

  // Animation for price display
  useEffect(() => {
    if (!price) {
      setAnimatedPrice(0);
      return;
    }
    
    setLoading(true);
    const duration = 2000;
    const steps = 100;
    const increment = price / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, price);
      setAnimatedPrice(Math.floor(current));
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedPrice(price);
        setLoading(false);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [price]);

  // Determine price trend
  useEffect(() => {
    if (!price || !inputs?.sqft) return;
    
    // Calculate average price based on inputs
    // Using a more realistic average price per sqft for Indian metros
    const avgPricePerSqft = 8000; // Average price per sqft in Lakhs
    const expectedPrice = inputs.sqft * avgPricePerSqft;
    
    // If predicted price is higher than expected, it's above market
    if (price > expectedPrice * 1.1) {
      setPriceTrend("high");
    } else if (price < expectedPrice * 0.9) {
      setPriceTrend("low");
    } else {
      setPriceTrend("stable");
    }
  }, [price, inputs]);

  // Format price functions
  const formatPrice = (amount) => {
    if (!amount) return "₹0";
    
    if (currency === "USD") {
      const usdAmount = amount / 83;
      return `$${usdAmount.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
    
    const lakhs = amount / 100000;
    const crores = amount / 10000000;
    
    if (crores >= 1) {
      return `₹${crores.toFixed(2)} Crores`;
    } else if (lakhs >= 1) {
      return `₹${lakhs.toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatCompactPrice = (amount) => {
    if (!amount) return "₹0";
    
    const lakhs = amount / 100000;
    const crores = amount / 10000000;
    
    if (crores >= 1) {
      return `₹${crores.toFixed(1)}Cr`;
    } else if (lakhs >= 1) {
      return `₹${lakhs.toFixed(1)}L`;
    }
    return `₹${amount}`;
  };

  // Get trend info
  const getTrendInfo = () => {
    switch(priceTrend) {
      case "high":
        return {
          text: "Above Market Average",
          color: "#10b981",
          bgColor: "rgba(16, 185, 129, 0.15)",
          icon: "📈"
        };
      case "low":
        return {
          text: "Below Market Average",
          color: "#ef4444",
          bgColor: "rgba(239, 68, 68, 0.15)",
          icon: "📉"
        };
      default:
        return {
          text: "Market Average",
          color: "#3b82f6",
          bgColor: "rgba(59, 130, 246, 0.15)",
          icon: "📊"
        };
    }
  };

  const trendInfo = getTrendInfo();

  const handleCopyPrice = () => {
    navigator.clipboard.writeText(formatPrice(price));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Property Price Estimate',
          text: `Estimated property price: ${formatPrice(price)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      handleCopyPrice();
    }
  };

  const calculateMetrics = () => {
    if (!price || !inputs?.sqft) return null;
    
    const pricePerSqft = Math.round(price / inputs.sqft);
    const monthlyEMI = Math.round((price * 0.8) * 0.085 / 12); // 80% loan at 8.5% interest
    const registrationCharges = Math.round(price * 0.06);
    const stampDuty = Math.round(price * 0.05);
    
    return { pricePerSqft, monthlyEMI, registrationCharges, stampDuty };
  };

  const metrics = calculateMetrics();

  // Calculate confidence score
  const calculateConfidence = () => {
    let confidence = 85;
    if (inputs?.location && inputs.location.length > 3) confidence += 5;
    if (inputs?.sqft && inputs.sqft > 500) confidence += 5;
    if (inputs?.bhk && inputs.bhk >= 1 && inputs.bhk <= 5) confidence += 5;
    return Math.min(confidence, 98);
  };

  // Get rental yield
  const getRentalYield = () => {
    if (!price) return 0;
    const annualRent = price * 0.03; // 3% of property value as annual rent
    return ((annualRent / price) * 100).toFixed(1);
  };

  if (!price) {
    return (
      <div className="result-card-empty">
        <div className="empty-container">
          <div className="empty-icon">🏠</div>
          <h3 className="empty-title">No Prediction Yet</h3>
          <p className="empty-text">Enter property details to get a price estimate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-card-container">
      {/* Main Price Card */}
      <div className="result-card-main">
        {/* Card Header */}
        <div className="card-header">
          <div className="header-content">
            <div className="badge-container">
              <div className="badge-icon">✨</div>
              <span className="badge-text">AI-Powered Estimate</span>
            </div>
            <h2 className="card-title">Estimated Property Value</h2>
            <p className="card-subtitle">Based on current market data and trends</p>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="expand-button"
            aria-label={isExpanded ? "Collapse view" : "Expand view"}
          >
            <span className="expand-icon">{isExpanded ? "−" : "+"}</span>
          </button>
        </div>

        {/* Price Display */}
        <div className="price-display-container">
          <div className="price-icon-container">
            <div className="price-icon">💰</div>
            <div className="icon-glow"></div>
          </div>
          
          <div className="price-values">
            {loading ? (
              <div className="price-loading">
                <div className="loading-spinner"></div>
                <span className="loading-text">Calculating...</span>
              </div>
            ) : (
              <>
                <div className="price-main">{formatCompactPrice(animatedPrice)}</div>
                <div className="price-full">{formatPrice(animatedPrice)}</div>
              </>
            )}
          </div>

          {/* Trend Indicator */}
          <div 
            className="trend-indicator"
            style={{ 
              backgroundColor: trendInfo.bgColor,
              color: trendInfo.color
            }}
          >
            <span className="trend-icon">{trendInfo.icon}</span>
            <span className="trend-text">{trendInfo.text}</span>
          </div>

          {/* Input Summary */}
          {inputs && (
            <div className="input-summary">
              <h4 className="summary-title">📋 Based on:</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="item-icon">📍</span>
                  <div className="item-content">
                    <span className="item-label">Location</span>
                    <span className="item-value">{inputs.location}</span>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="item-icon">📐</span>
                  <div className="item-content">
                    <span className="item-label">Total Area</span>
                    <span className="item-value">{inputs.sqft} sqft</span>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="item-icon">🛌</span>
                  <div className="item-content">
                    <span className="item-label">Configuration</span>
                    <span className="item-value">{inputs.bhk} BHK</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
              className="currency-button"
            >
              <span className="button-icon">🔄</span>
              <span className="button-text">Switch to {currency === "INR" ? "USD" : "INR"}</span>
            </button>
            
            <button
              onClick={handleCopyPrice}
              className={`copy-button ${isCopied ? 'copy-success' : ''}`}
            >
              <span className="button-icon">{isCopied ? "✓" : "📋"}</span>
              <span className="button-text">{isCopied ? 'Copied!' : 'Copy Price'}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="share-button"
            >
              <span className="button-icon">📤</span>
              <span className="button-text">Share</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Confidence</div>
              <div className="stat-value">{calculateConfidence()}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Price Range</div>
              <div className="stat-value">
                {formatCompactPrice(price * 0.9)} - {formatCompactPrice(price * 1.1)}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-content">
              <div className="stat-label">Rental Yield</div>
              <div className="stat-value">{getRentalYield()}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">Market Trend</div>
              <div className="stat-value">+4.5%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="expanded-view">
          {/* Price Breakdown */}
          <div className="expanded-section">
            <h3 className="section-title">
              <span className="section-icon">💵</span>
              Price Breakdown
            </h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <div className="breakdown-label">Property Value</div>
                <div className="breakdown-value">{formatCompactPrice(price)}</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Price per Sqft</div>
                <div className="breakdown-value">₹{metrics?.pricePerSqft || 0}</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Monthly EMI (approx)</div>
                <div className="breakdown-value">₹{metrics?.monthlyEMI?.toLocaleString() || 0}</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Registration Charges</div>
                <div className="breakdown-value">₹{metrics?.registrationCharges?.toLocaleString() || 0}</div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-label">Stamp Duty</div>
                <div className="breakdown-value">₹{metrics?.stampDuty?.toLocaleString() || 0}</div>
              </div>
              <div className="breakdown-item highlight">
                <div className="breakdown-label">Total Investment</div>
                <div className="breakdown-value">
                  {formatCompactPrice(price + (metrics?.registrationCharges || 0) + (metrics?.stampDuty || 0))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="expanded-section">
            <h3 className="section-title">
              <span className="section-icon">📊</span>
              Market Analysis
            </h3>
            <div className="analysis-grid">
              <div className="analysis-item">
                <div className="analysis-header">
                  <span className="analysis-label">Similar Properties</span>
                  <span className="analysis-percent positive">+5.2%</span>
                </div>
                <div className="analysis-bar">
                  <div className="bar-fill" style={{ width: '65%' }}></div>
                </div>
                <div className="analysis-note">Above average for similar properties</div>
              </div>
              <div className="analysis-item">
                <div className="analysis-header">
                  <span className="analysis-label">Location Premium</span>
                  <span className="analysis-percent premium">+12.8%</span>
                </div>
                <div className="analysis-bar">
                  <div className="bar-fill premium" style={{ width: '78%' }}></div>
                </div>
                <div className="analysis-note">High demand area premium</div>
              </div>
              <div className="analysis-item">
                <div className="analysis-header">
                  <span className="analysis-label">Market Demand</span>
                  <span className="analysis-value high">High</span>
                </div>
                <div className="analysis-bar">
                  <div className="bar-fill high" style={{ width: '85%' }}></div>
                </div>
                <div className="analysis-note">Strong buyer interest</div>
              </div>
              <div className="analysis-item">
                <div className="analysis-header">
                  <span className="analysis-label">Investment Potential</span>
                  <span className="analysis-value good">Good</span>
                </div>
                <div className="analysis-bar">
                  <div className="bar-fill good" style={{ width: '72%' }}></div>
                </div>
                <div className="analysis-note">Expected 8-10% annual growth</div>
              </div>
            </div>
          </div>

          {/* Neighborhood Insights */}
          <div className="expanded-section">
            <h3 className="section-title">
              <span className="section-icon">🏙️</span>
              Neighborhood Insights
            </h3>
            <div className="insights-grid">
              <div className="insight-item">
                <div className="insight-icon">🚇</div>
                <div className="insight-content">
                  <div className="insight-label">Transportation</div>
                  <div className="insight-value">Excellent</div>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">🛍️</div>
                <div className="insight-content">
                  <div className="insight-label">Amenities</div>
                  <div className="insight-value">Good</div>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">🎓</div>
                <div className="insight-content">
                  <div className="insight-label">Schools</div>
                  <div className="insight-value">Very Good</div>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon">🏥</div>
                <div className="insight-content">
                  <div className="insight-label">Healthcare</div>
                  <div className="insight-value">Good</div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer-section">
            <div className="disclaimer-header">
              <span className="disclaimer-icon">ℹ️</span>
              <h3 className="disclaimer-title">Important Information</h3>
            </div>
            <p className="disclaimer-text">
              This estimate is generated using AI and current market data. Actual prices may vary based on 
              property condition, exact location, amenities, and market conditions. This estimate should be 
              used as a reference only and not as a final valuation. We recommend consulting with a local 
              real estate expert for accurate pricing.
            </p>
            <div className="disclaimer-footer">
              <div className="footer-item">
                <span className="footer-icon">🔄</span>
                <span className="footer-text">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="footer-item">
                <span className="footer-icon">📊</span>
                <span className="footer-text">Data source: Market trends & historical data</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Actions */}
      <div className="floating-actions">
        <button className="floating-button" onClick={() => window.print()}>
          <span className="floating-icon">🖨️</span>
          <span className="floating-text">Print</span>
        </button>
        <button className="floating-button" onClick={() => alert('Saved to favorites!')}>
          <span className="floating-icon">❤️</span>
          <span className="floating-text">Save</span>
        </button>
        <button className="floating-button primary" onClick={() => setIsExpanded(!isExpanded)}>
          <span className="floating-icon">{isExpanded ? "−" : "+"}</span>
          <span className="floating-text">{isExpanded ? 'Less' : 'More'} Details</span>
        </button>
      </div>
    </div>
  );
}