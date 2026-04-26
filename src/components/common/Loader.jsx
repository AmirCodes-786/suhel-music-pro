import React from 'react';
import './Loader.css';

export const Spinner = ({ size = 'default' }) => (
  <div className="loader-container">
    <div className={`spinner ${size === 'small' ? 'small' : ''}`} />
  </div>
);

export const SkeletonCard = () => (
  <div className="skeleton-card animate-shimmer">
    <div className="skeleton-image animate-shimmer" />
    <div className="skeleton-text medium animate-shimmer" />
    <div className="skeleton-text short animate-shimmer" />
  </div>
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonRow = () => (
  <div className="skeleton-row">
    <div className="skeleton-avatar animate-shimmer" />
    <div className="skeleton-lines">
      <div className="skeleton-text medium animate-shimmer" />
      <div className="skeleton-text short animate-shimmer" />
    </div>
  </div>
);

export const SkeletonRows = ({ count = 6 }) => (
  <div>
    {Array.from({ length: count }, (_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

export const ErrorDisplay = ({ message = 'Something went wrong', onRetry }) => (
  <div className="error-container animate-fade-in">
    <div className="error-icon">⚠️</div>
    <h3>Oops!</h3>
    <p>{message}</p>
    {onRetry && (
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

export const EmptyState = ({ icon = '🎵', title, message }) => (
  <div className="empty-state animate-fade-in">
    <div className="empty-icon">{icon}</div>
    <h3>{title || 'Nothing here yet'}</h3>
    <p>{message || 'Start exploring to discover music'}</p>
  </div>
);
