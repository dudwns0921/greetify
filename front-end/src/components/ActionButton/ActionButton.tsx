import React from 'react';
import MicButton from './MicButton';
import CameraButton from './CameraButton';

interface ActionButtonProps {
  recognizing: boolean;
  onClick: () => void;
  supported?: boolean;
  disabled?: boolean;
  isGreeting?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ recognizing, onClick, supported = true, disabled = false, isGreeting = false }) => {
  if (isGreeting) {
    return <CameraButton onClick={onClick} supported={supported} disabled={disabled} />;
  }
  return <MicButton recognizing={recognizing} onClick={onClick} supported={supported} disabled={disabled} />;
};

export default ActionButton; 