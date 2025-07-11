import React, { useState } from 'react';
import useAnimatedMessages from './hooks/useAnimatedMessages';
import styles from './App.module.css';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import ActionButton from './components/ActionButton/ActionButton';
import usePost from './hooks/usePost';
import Flash from './components/Flash/Flash';
import {
  GREETING_MESSAGES,
  COUNTDOWN_MESSAGES
} from './constants/messages';
import useAppMount from './hooks/useAppMount';

const App: React.FC = () => {
  // 상태 선언
  const [isFlash, setIsFlash] = useState(false);
  const [cameraDisabled, setCameraDisabled] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);

  // 훅 선언
  const { post } = usePost('/greet-from-text');
  const { post: postLocation } = usePost('/save-current-location');
  const {
    showMessage,
    currentMessage,
    pushMessages,
  } = useAnimatedMessages({
    '셋!': () => {
      setIsFlash(true);
      setTimeout(() => setIsFlash(false), 200);
      setCameraDisabled(false);
    }
  });
  useAppMount({ postLocation, pushMessages });
  const { recognizing, start, supported } = useSpeechRecognition(handleSpeechResult);

  // 핸들러 선언
  async function handleSpeechResult(text: string) {
    const response = await post({ text });
    setIsGreeting(response.data.is_greeting)
    if(response.data.is_greeting) {
      pushMessages(GREETING_MESSAGES)
    } else {
      pushMessages(response.data.reason.split('.'))
    }
  }

  function handleCameraClick() {
    setCameraDisabled(true);
    pushMessages(COUNTDOWN_MESSAGES);
  }

  // 렌더링
  return (
    <div className={styles.container}>
      {isFlash && <Flash />}
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
