import React, { useState, useRef } from 'react';
import useAnimatedMessages from './hooks/useAnimatedMessages';
import styles from './App.module.css';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import ActionButton from './components/ActionButton/ActionButton';
import usePost from './hooks/usePost';
import Flash from './components/Flash/Flash';
import {
  DEFAULT_MESSAGES,
  GREETING_MESSAGES,
  LOADING_MESSAGES,
  COUNTDOWN_MESSAGES
} from './constants/messages';

const App: React.FC = () => {
  const {
    showMessage,
    currentMessage,
    setAnimatedMessages
  } = useAnimatedMessages(DEFAULT_MESSAGES);

  // isGreeting 상태 추가
  const [isGreeting, setIsGreeting] = useState(false);

  // usePost 훅으로 /greet-from-text POST 요청 준비
  const { post } = usePost('/greet-from-text');

  // 카운트다운 메시지와 플래시 상태 추가
  const [isFlash, setIsFlash] = useState(false);

  // 플래시 및 카운트다운 타이머 관리용 ref 추가
  const cameraTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 음성 인식 결과를 받아서 /greet-from-text로 전송
  const handleSpeechResult = async (text: string) => {
    const response = await post({ text });
    if(response.is_greeting) {
      setAnimatedMessages(GREETING_MESSAGES);
      setIsGreeting(true); // 인사 감지 시 true로 변경
    } else {
      setAnimatedMessages(response.reason.split('.'));
      setIsGreeting(false); // 인사가 아니면 false로 변경
    }
  };

  // 카메라 버튼 클릭 시 동작
  const handleCameraClick = () => {
    // 기존 타이머가 있으면 삭제
    if (cameraTimerRef.current) {
      clearTimeout(cameraTimerRef.current);
      cameraTimerRef.current = null;
    }
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }
    setAnimatedMessages(COUNTDOWN_MESSAGES);
    cameraTimerRef.current = setTimeout(() => {
      setIsFlash(true);
      flashTimerRef.current = setTimeout(() => {
        setIsFlash(false);
        setAnimatedMessages(LOADING_MESSAGES);
      }, 200);
    }, 5400);
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
      />
    </div>
  );
};

export default App;
