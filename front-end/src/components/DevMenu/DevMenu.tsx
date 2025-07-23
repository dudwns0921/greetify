import React from 'react';
import styles from './DevMenu.module.css';

interface DevMenuProps {
  handleSpeechResult: (text: string) => void | Promise<void>;
}

const DevMenu: React.FC<DevMenuProps> = ({ handleSpeechResult }) => {
  const devButtons = [
    {
      label: '인사말 보내기',
      onClick: () => handleSpeechResult('안녕'),
    },
    {
      label: '다른 말 보내기',
      onClick: () => handleSpeechResult('날씨 어때'),
    },
    // 추가 버튼은 여기에 객체로 계속 추가
  ];

  return (
    <div className={styles['dev-menu']}>
      <div className={styles['dev-menu-content']}>
        <div className={styles['dev-menu-title']}>DEV MENU</div>
        {devButtons.map((btn, idx) => (
          <button
            key={btn.label + idx}
            className={styles['dev-menu-btn']}
            onClick={btn.onClick}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DevMenu; 