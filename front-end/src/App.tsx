import React, { useEffect } from 'react';
import useAnimatedMessages from './hooks/useAnimatedMessages';
import styles from './App.module.css';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import VoiceButton from './components/VoiceButton';
import usePost from './hooks/usePost';

const defaultMessages: string[] = [
  '안녕하세요?',
  '제게 인사를 건네주세요'
];

const App: React.FC = () => {
  const {
    showMessage,
    currentMessage,
    setAnimatedMessages
  } = useAnimatedMessages(defaultMessages);

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
  }, []);

  // 음성 인식 결과를 받아서 /greet-from-text로 전송
  const handleSpeechResult = async (text: string) => {
    const response = await post({ text });
    if(response.is_greeting) {
      setAnimatedMessages(['저에게 인사를 해주셨군요!', '이제 당신의 모습을 사진으로 담을게요!'])
    } else {
      setAnimatedMessages(response.reason.split('.'))
    }
  };

  // 음성 인식 훅 사용 (콜백 전달)
  const { recognizing, start, supported } = useSpeechRecognition(handleSpeechResult);

  return (
    <div className={styles.container}>
      {/* 애니메이션 메시지 */}
      <div className={styles.messageWrapper}>
        <div className={showMessage ? styles.messageShow : styles.messageHide}>
          {currentMessage}
        </div>
      </div>
      <VoiceButton recognizing={recognizing} onClick={start} supported={supported} />
    </div>
  );
};

export default App;
