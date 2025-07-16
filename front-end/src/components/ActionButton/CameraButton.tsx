import React from 'react';
import styles from './ActionButton.module.css';

interface CameraButtonProps {
  onClick: () => void;
  supported?: boolean;
  disabled?: boolean;
}

const CameraButton: React.FC<CameraButtonProps> = ({ onClick, supported = true, disabled = false }) => (
  <button
    className={styles.actionButton}
    onClick={onClick}
    aria-label="사진 촬영 시작"
    disabled={disabled || !supported}
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  </button>
);

export default CameraButton; 