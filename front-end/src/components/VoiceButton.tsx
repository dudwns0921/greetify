import React from 'react';
import styles from './VoiceButton.module.css';

interface VoiceButtonProps {
  recognizing: boolean;
  onClick: () => void;
  supported?: boolean;
  disabled?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({ recognizing, onClick, supported = true, disabled = false }) => {
  return (
    <button
      className={styles.voiceButton}
      onClick={onClick}
      aria-label="음성 인식 시작"
      disabled={disabled || !supported || recognizing}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        className={recognizing ? styles.blinkingMic : undefined}
      >
        <path d="M12 16a4 4 0 0 0 4-4V7a4 4 0 1 0-8 0v5a4 4 0 0 0 4 4zm5-4a1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21a1 1 0 1 1-2 0v-2.08A7 7 0 0 1 5 12a1 1 0 1 1 2 0 5 5 0 0 0 10 0z" fill={recognizing ? "#fff" : "currentColor"}/>
      </svg>
    </button>
  );
};

export default VoiceButton; 