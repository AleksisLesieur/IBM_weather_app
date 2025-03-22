import React from 'react';
import { LoadingSpinnerProps } from '../services/interfaces';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'spin 1.5s linear infinite' }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="40"
        strokeDashoffset="15"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LoadingSpinner;
