import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Webcam from 'react-webcam';
import styles from './WebcamModal.module.css';

interface WebcamModalProps {
  open: boolean;
  onClose: () => void;
}

export interface WebcamModalHandle {
  capture: () => string | null;
}

const WebcamModal = forwardRef<WebcamModalHandle, WebcamModalProps>(({ open }, ref) => {
  const webcamRef = useRef<Webcam>(null);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (webcamRef.current) {
        return webcamRef.current.getScreenshot();
      }
      return null;
    }
  }));

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={styles.webcam}
        />
      </div>
    </div>
  );
});

export default WebcamModal; 