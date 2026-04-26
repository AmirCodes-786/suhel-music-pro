import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" style={{ minHeight: '50vh' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>💥</div>
          <h3>Something went wrong</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            className="retry-btn"
            style={{
              marginTop: 16,
              padding: '12px 32px',
              background: 'var(--accent-gradient)',
              color: 'white',
              borderRadius: 999,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
