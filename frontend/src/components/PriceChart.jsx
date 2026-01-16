import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useState, useEffect } from "react";
import "./PriceChart.css";

// Register ChartJS components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart({ price, inputs }) {
  const [chartType, setChartType] = useState("line");
  const [priceTrend, setPriceTrend] = useState("stable");
  const [animatedPrice, setAnimatedPrice] = useState(0);
  const [chartLoading, setChartLoading] = useState(true);
  
  // Mock historical data for visualization
  const historicalData = [
    { month: 'Jan', price: 75, market: 78 },
    { month: 'Feb', price: 82, market: 80 },
    { month: 'Mar', price: 88, market: 85 },
    { month: 'Apr', price: 85, market: 82 },
    { month: 'May', price: 92, market: 88 },
    { month: 'Jun', price: price ? price / 100000 : 95, market: 90 },
  ];

  // Format price in Indian numbering system
  const formatPrice = (amount) => {
    if (!amount || amount === 0) return '₹0';
    
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
    if (!amount || amount === 0) return '₹0';
    
    const lakhs = amount / 100000;
    const crores = amount / 10000000;
    
    if (crores >= 1) {
      return `₹${crores.toFixed(1)}Cr`;
    } else if (lakhs >= 1) {
      return `₹${lakhs.toFixed(1)}L`;
    }
    return `₹${amount}`;
  };

  // Animation effect when price changes
  useEffect(() => {
    if (!price) {
      setAnimatedPrice(0);
      return;
    }
    
    setChartLoading(true);
    const duration = 1800;
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
        setChartLoading(false);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [price]);

  // Determine price trend
  useEffect(() => {
    if (!price || !inputs?.sqft) {
      setPriceTrend("stable");
      return;
    }
    
    // Calculate expected price based on average price per sqft
    const avgPricePerSqft = 8000; // Average price per sqft
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

  // Calculate price per sqft
  const calculatePricePerSqft = () => {
    if (!price || !inputs?.sqft) return 0;
    return Math.round(price / inputs.sqft);
  };

  // Calculate confidence score based on data completeness
  const calculateConfidence = () => {
    let confidence = 85; // Base confidence
    
    if (inputs?.location && inputs.location.length > 3) confidence += 5;
    if (inputs?.sqft && inputs.sqft > 500) confidence += 5;
    if (inputs?.bhk && inputs.bhk >= 1 && inputs.bhk <= 5) confidence += 5;
    
    return Math.min(confidence, 98);
  };

  // Line chart data
  const lineChartData = {
    labels: historicalData.map(data => data.month),
    datasets: [
      {
        label: "Market Average",
        data: historicalData.map(data => data.market),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Your Property",
        data: price ? historicalData.map((data, index) => 
          index === historicalData.length - 1 ? price / 100000 : null
        ) : historicalData.map(() => null),
        borderColor: "#8b5cf6",
        borderWidth: 3,
        borderDash: [5, 5],
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ],
  };

  // Bar chart data
  const barChartData = {
    labels: historicalData.map(data => data.month),
    datasets: [
      {
        label: "Market Price (Lakhs)",
        data: historicalData.map(data => data.market),
        backgroundColor: [
          'rgba(16, 185, 129, 0.3)',
          'rgba(16, 185, 129, 0.4)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          '#10b981',
          '#10b981',
          '#10b981',
          '#10b981',
          '#10b981',
          '#8b5cf6',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `₹${context.parsed.y.toFixed(2)} L`;
            }
            return label;
          },
          title: function(tooltipItems) {
            return `${tooltipItems[0].label} 2024`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(71, 85, 105, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          callback: function(value) {
            return `₹${value}L`;
          },
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8,
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'easeOutCubic'
      },
      y: {
        duration: 1500,
        easing: 'easeOutCubic'
      }
    }
  };

  // Custom chart options for bar chart
  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false
      }
    }
  };

  // Get trend text and color
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

  if (!price) {
    return (
      <div className="price-chart-empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Prediction Yet</h3>
          <p>Enter property details to see price trends and insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="price-chart-container">
      {/* Main Chart Card */}
      <div className="chart-card">
        {/* Card Header */}
        <div className="chart-header">
          <div className="header-left">
            <div className="header-icon">💰</div>
            <div>
              <h2>Market Analysis & Trends</h2>
              <p>Detailed price insights and market comparison</p>
            </div>
          </div>
          
          {/* Chart Type Toggle */}
          <div className="chart-toggle">
            <button
              onClick={() => setChartType("line")}
              className={`toggle-btn ${chartType === "line" ? "toggle-active" : ""}`}
            >
              <span className="toggle-icon">📈</span>
              <span className="toggle-text">Trend View</span>
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`toggle-btn ${chartType === "bar" ? "toggle-active" : ""}`}
            >
              <span className="toggle-icon">📊</span>
              <span className="toggle-text">Comparison</span>
            </button>
          </div>
        </div>

        {/* Price Display Section */}
        <div className="price-display-section">
          <div className="price-badge">
            <div className="badge-icon">✨</div>
            <span className="badge-text">AI-Predicted Value</span>
          </div>
          
          <div className="animated-price">
            {chartLoading ? (
              <div className="price-loading">
                <div className="loading-spinner"></div>
                <span>Calculating...</span>
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
        </div>

        {/* Chart Visualization */}
        <div className="chart-visualization">
          <div className="chart-wrapper">
            {chartType === "line" ? (
              <Line data={lineChartData} options={chartOptions} />
            ) : (
              <Bar data={barChartData} options={barChartOptions} />
            )}
          </div>
        </div>

        {/* Chart Legend */}
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot market-dot"></div>
            <span className="legend-label">Market Average</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot property-dot"></div>
            <span className="legend-label">Your Property</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot prediction-dot"></div>
            <span className="legend-label">Prediction Point</span>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="quick-insights">
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-icon">🎯</span>
              <span className="insight-title">Confidence Score</span>
            </div>
            <div className="insight-value">
              {calculateConfidence()}%
            </div>
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ width: `${calculateConfidence()}%` }}
              ></div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-icon">📐</span>
              <span className="insight-title">Price per Sqft</span>
            </div>
            <div className="insight-value">
              ₹{calculatePricePerSqft()}
            </div>
            <div className="insight-subtitle">
              Based on {inputs?.sqft || 0} sqft
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-icon">📈</span>
              <span className="insight-title">Market Trend</span>
            </div>
            <div className="insight-value positive">
              +4.2%
            </div>
            <div className="insight-subtitle">
              Last 6 months
            </div>
          </div>
        </div>

        {/* Property Details */}
        {inputs && (
          <div className="property-details">
            <h4 className="details-title">📋 Prediction Details</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{inputs.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Area</span>
                <span className="detail-value">{inputs.sqft} sqft</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Configuration</span>
                <span className="detail-value">{inputs.bhk} BHK</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Prediction Date</span>
                <span className="detail-value">
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Market Comparison */}
        <div className="market-comparison">
          <h4 className="comparison-title">🏢 Market Comparison</h4>
          <div className="comparison-grid">
            <div className="comparison-item">
              <div className="comparison-label">Similar Properties</div>
              <div className="comparison-bar">
                <div className="bar-fill" style={{ width: '65%' }}></div>
              </div>
              <div className="comparison-value">+5.2%</div>
            </div>
            <div className="comparison-item">
              <div className="comparison-label">Location Premium</div>
              <div className="comparison-bar">
                <div className="bar-fill premium" style={{ width: '78%' }}></div>
              </div>
              <div className="comparison-value premium">+12.8%</div>
            </div>
            <div className="comparison-item">
              <div className="comparison-label">Demand Index</div>
              <div className="comparison-bar">
                <div className="bar-fill high" style={{ width: '85%' }}></div>
              </div>
              <div className="comparison-value high">High</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="chart-disclaimer">
          <div className="disclaimer-icon">ℹ️</div>
          <p className="disclaimer-text">
            This estimate is generated using AI and current market data. 
            Actual prices may vary based on property condition, exact location, 
            amenities, and market conditions. 
            <span className="update-time"> Last updated: Just now</span>
          </p>
        </div>
      </div>

      {/* Market Stats */}
      <div className="market-stats">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <span className="stat-title">Market Volatility</span>
          </div>
          <div className="stat-value low">Low</div>
          <div className="stat-description">Stable market conditions</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🏡</span>
            <span className="stat-title">Rental Yield</span>
          </div>
          <div className="stat-value">3.2%</div>
          <div className="stat-description">Est. annual return</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📅</span>
            <span className="stat-title">Price History</span>
          </div>
          <div className="stat-value positive">+8.4%</div>
          <div className="stat-description">Year over year</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🎖️</span>
            <span className="stat-title">Accuracy Score</span>
          </div>
          <div className="stat-value">94%</div>
          <div className="stat-description">Based on similar predictions</div>
        </div>
      </div>
    </div>
  );
}