import React from 'react';
import styles from './Loading.module.css';

const Loading: React.FC = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.spinnerBlade} />
        ))}
      </div>
    </div>
  );
};

export default Loading; 