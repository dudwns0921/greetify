import React, { useState, useRef } from 'react';
import useAnimatedMessages from './hooks/useAnimatedMessages';
import styles from './App.module.css';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import ActionButton from './components/ActionButton/ActionButton';
import usePost from './hooks/usePost';
import Flash from './components/Flash/Flash';
import WebcamModal, { type WebcamModalHandle } from './components/WebcamModal/WebcamModal';
import {
  GREETING_MESSAGES,
  COUNTDOWN_MESSAGES
} from './constants/messages';
import useAppMount from './hooks/useAppMount';
import MessagePortal from './components/MessagePortal/MessagePortal';
import useUpload from './hooks/useUpload';
import playCameraShutter from './util/playCameraShutter';
import Loading from './components/Loading/Loading';
import { useLoading } from './hooks/useLoading';

const App: React.FC = () => {
  // 상태 선언
  const [isFlash, setIsFlash] = useState(false);
  const [cameraDisabled, setCameraDisabled] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const webcamRef = useRef<WebcamModalHandle>(null);
  
  // 훅 선언
  const { loading } = useLoading();
  const { post } = usePost('/greet-from-text');
  const { post: postLocation } = usePost('/save-current-location');
  const { upload: uploadImage } = useUpload('/greet-from-image');
  const {
    showMessage,
    currentMessage,
    pushMessages,
  } = useAnimatedMessages({
    '셋!': async () => {
      
      setIsFlash(true);
      playCameraShutter();
      setTimeout(() => setIsFlash(false), 200);
      setCameraDisabled(false);
      // 캡처 시도
      if (webcamRef.current) {
        const image = webcamRef.current.capture();
        if (image) {
          // data:image/jpeg;base64,... -> Blob 변환
          const blob = await (await fetch(image)).blob();
          const formData = new FormData();
          formData.append('file', blob, 'capture.jpg');
          try {
            const res = await uploadImage(formData);
            // 업로드 결과 메시지 처리 (예시)
            pushMessages(res.data.filter(msg => msg.trim() !== ''));
          } catch {
            pushMessages(['이미지 업로드 실패']);
          }
        }
      }
      setWebcamOpen(false); // 캡처 후 모달 닫기
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
    setWebcamOpen(true);
    pushMessages(COUNTDOWN_MESSAGES);
  }

  // 렌더링
  return (
    <div className={styles.container}>
      {loading && <Loading />}
      {isFlash && <Flash />}
      <WebcamModal ref={webcamRef} open={webcamOpen} onClose={() => setWebcamOpen(false)} />
      <MessagePortal>
        <div className={styles.messageWrapper}>
          <div
            className={
              showMessage
                ? `${styles.messageShow} ${webcamOpen ? styles.messageShowCamera : ''}`
                : `${styles.messageHide} ${webcamOpen ? styles.messageShowCamera : ''}`
            }
          >
            {currentMessage}
          </div>
        </div>
      </MessagePortal>
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
