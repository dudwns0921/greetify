import React, { useState, useEffect } from 'react';
import useAnimatedMessages from './hooks/useAnimatedMessages';
import styles from './App.module.css';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import ActionButton from './components/ActionButton/ActionButton';
import usePost from './hooks/usePost';
import Flash from './components/Flash/Flash';
import {
  GREETING_MESSAGES,
  COUNTDOWN_MESSAGES,
  DEFAULT_MESSAGES
} from './constants/messages';

const App: React.FC = () => {
  const [isFlash, setIsFlash] = useState(false);
  const [cameraDisabled, setCameraDisabled] = useState(false);

  // useAnimatedMessages에 플래시 트리거 콜백 및 카메라 활성화 콜백 전달
  const {
    showMessage,
    currentMessage,
    pushMessages,
  } = useAnimatedMessages({
    '셋!': () => {
      setIsFlash(true);
      setTimeout(() => setIsFlash(false), 200);
      setCameraDisabled(false); // 셋! 시점에 다시 활성화
    }
  });

  // isGreeting 상태 추가
  const [isGreeting, setIsGreeting] = useState(false);

  // usePost 훅으로 /greet-from-text POST 요청 준비
  const { post } = usePost('/greet-from-text');
  const { post: postLocation } = usePost('/save-current-location');

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        postLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        // 위치 정보 획득 실패 시 처리 (옵션)
        console.error('위치 정보 획득 실패:', error);
      }
    );
      pushMessages(DEFAULT_MESSAGES);
  }, []);

  // 음성 인식 결과를 받아서 /greet-from-text로 전송
  const handleSpeechResult = async (text: string) => {
    const response = await post({ text });
    setIsGreeting(response.data.is_greeting)
    if(response.data.is_greeting) {
      pushMessages(GREETING_MESSAGES)
    } else {
      pushMessages(response.data.reason.split('.'))
    }
  };

  // 카메라 버튼 클릭 시 동작
  const handleCameraClick = () => {
    setCameraDisabled(true);
    pushMessages(COUNTDOWN_MESSAGES);
  };

  // 음성 인식 훅 사용 (콜백 전달)
  const { recognizing, start, supported } = useSpeechRecognition(handleSpeechResult);

  return (
    <div className={styles.container}>
      {/* 플래시 효과 */}
      {isFlash && <Flash />}
      {/* 애니메이션 메시지 */}
      <div className={styles.messageWrapper}>
        <div className={showMessage ? styles.messageShow : styles.messageHide}>
          {currentMessage}
        </div>
      </div>
      <ActionButton
        recognizing={recognizing}
        onClick={isGreeting ? handleCameraClick : start}
        supported={supported}
        isGreeting={isGreeting}
        disabled={cameraDisabled}
      />
    </div>
  );
};

export default App;
