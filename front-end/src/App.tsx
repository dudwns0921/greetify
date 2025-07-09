import React, { useState, useRef } from 'react';
import useAnimatedMessages from './hooks/useAnimatedMessages';
import styles from './App.module.css';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import ActionButton from './components/ActionButton/ActionButton';
import usePost from './hooks/usePost';
import Flash from './components/Flash/Flash';

const defaultMessages: string[] = [
  '안녕하세요?',
  '제게 인사를 건네주세요'
];

// 심즈 스타일의 독특한 로딩 문구 배열
const loadingMessages = [
  '자, 그럼 이제 당신에 대해 더 알아볼게요...',
  '당신의 매력을 분석하는 중이에요...',
  '인공지능이 당신의 미소를 해석하고 있어요!',
  '감탄할 준비를 하는 중입니다...',
  '유니크함을 데이터베이스에 저장 중...',
  '당신의 인사를 복습하고 있어요!',
  '곧 멋진 결과를 보여드릴게요...',
  '웃음 바이러스를 전파하는 중...',
  '당신의 긍정 에너지를 측정 중입니다!',
  'AI가 감동받고 있어요...',
  '로딩 중... 잠시만 기다려주세요!'
];

const App: React.FC = () => {
  const {
    showMessage,
    currentMessage,
    setAnimatedMessages
  } = useAnimatedMessages(defaultMessages);

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
      setAnimatedMessages(['저에게 인사를 해주셨군요!', '이제 당신의 모습을 사진으로 담을게요!'])
      setIsGreeting(true); // 인사 감지 시 true로 변경
    } else {
      setAnimatedMessages(response.reason.split('.'))
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
    const countdownMessages = ['하나', '둘', '셋!'];
    setAnimatedMessages(countdownMessages);
    cameraTimerRef.current = setTimeout(() => {
      setIsFlash(true);
      flashTimerRef.current = setTimeout(() => {
        setIsFlash(false);
        setAnimatedMessages(loadingMessages);
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
