import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <h2>حدث خطأ</h2>
        <p>{message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'}</p>
        <div className="error-actions">
          {onRetry && (
            <button onClick={onRetry} className="retry-btn">
              إعادة المحاولة
            </button>
          )}
          <Link to="/" className="home-btn">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;