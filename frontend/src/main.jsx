import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import './index.css';

// Initialize performance monitoring
if (import.meta.env.PROD) {
  // Import and initialize performance monitoring tools
  console.log('🚀 Production mode enabled');
  
  // Error tracking
  window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
    // In production, you would send this to your error tracking service
  });

  // Performance monitoring
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
    }
  });

  perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful');
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}

// Load fonts and assets preload
const preloadResources = () => {
  // Preload critical fonts
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://fonts.googleapis.com';
  document.head.appendChild(link);

  const link2 = document.createElement('link');
  link2.rel = 'preconnect';
  link2.href = 'https://fonts.gstatic.com';
  link2.crossOrigin = 'anonymous';
  document.head.appendChild(link2);

  const link3 = document.createElement('link');
  link3.rel = 'preload';
  link3.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap';
  link3.as = 'style';
  link3.onload = () => link3.rel = 'stylesheet';
  document.head.appendChild(link3);
};

// Execute preload on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadResources);
} else {
  preloadResources();
}

// Create root with error boundary
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
  // This is a simple error boundary for the root
  // In a real app, you might want a more sophisticated one
  try {
    return children;
  } catch (error) {
    console.error('Error in root component:', error);
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#f8fafc',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</h1>
          <h2>Something went wrong</h2>
          <p style={{ marginTop: '1rem', opacity: 0.8 }}>
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '0.75rem',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

// Theme persistence
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Add theme change listener
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
};

// Initialize theme
initializeTheme();

// Performance monitoring
const measurePerformance = () => {
  if (import.meta.env.DEV) {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                     window.performance.timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  }
};

// Create root and render
const root = createRoot(container);

// Function to render app with loading state
const renderApp = () => {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <BrowserRouter>
            <App />
            {import.meta.env.PROD && <Analytics />}
          </BrowserRouter>
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );

  // Measure performance after render
  setTimeout(measurePerformance, 1000);
};

// Show loading state initially
container.innerHTML = `
  <div class="app-loading">
    <div class="loading-content">
      <div class="loading-logo">
        <div class="loading-spinner"></div>
        <span>🏠</span>
      </div>
      <h2 class="loading-text">Property Price Predictor</h2>
      <p class="loading-subtext">Loading your real estate assistant...</p>
    </div>
  </div>
`;

// Add loading styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
  .app-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
  
  .loading-content {
    text-align: center;
    animation: fadeIn 0.5s ease-out;
  }
  
  .loading-logo {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 2rem;
  }
  
  .loading-spinner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: #10b981;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .loading-logo span {
    position: relative;
    z-index: 2;
    font-size: 48px;
    line-height: 120px;
  }
  
  .loading-text {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff 0%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
  }
  
  .loading-subtext {
    color: #94a3b8;
    font-size: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

document.head.appendChild(loadingStyles);

// Render app after a short delay to show loading screen
setTimeout(renderApp, 1000);

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button (optional)
  const installButton = document.createElement('button');
  installButton.id = 'install-button';
  installButton.textContent = 'Install App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  `;
  
  installButton.onmouseover = () => {
    installButton.style.transform = 'translateY(-2px)';
    installButton.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4)';
  };
  
  installButton.onmouseout = () => {
    installButton.style.transform = 'translateY(0)';
    installButton.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
  };
  
  installButton.onclick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
    installButton.remove();
  };
  
  document.body.appendChild(installButton);
  
  // Auto-hide install button after 10 seconds
  setTimeout(() => {
    if (installButton && installButton.parentNode) {
      installButton.remove();
    }
  }, 10000);
});

// Network status monitoring
window.addEventListener('online', () => {
  console.log('You are now online');
  // You could show a toast notification here
});

window.addEventListener('offline', () => {
  console.log('You are now offline');
  // You could show a warning notification here
});

// Cleanup function
const cleanup = () => {
  // Remove any global event listeners or cleanup tasks
  window.removeEventListener('online', () => {});
  window.removeEventListener('offline', () => {});
  window.removeEventListener('beforeinstallprompt', () => {});
};

// Handle page unload
window.addEventListener('beforeunload', cleanup);

// Export for potential use in service worker
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Development tools
if (import.meta.env.DEV) {
  // Add dev tools shortcut
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      console.log('🚀 Development Tools Activated');
      // You could open a dev panel or show debug info
    }
  });
}

// Optional: Initialize Sentry or other error tracking
const initErrorTracking = () => {
  if (import.meta.env.PROD) {
    // Initialize your error tracking service here
    // Example: Sentry.init({ dsn: 'YOUR_DSN' });
  }
};

initErrorTracking();