import { useEffect, useState, useRef } from 'react';
import { LOADING_MESSAGES } from '../constants/messages';

export default function useAnimatedMessages(initialMessages: string[] = []) {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<string[]>(initialMessages);

  // 큐에서 다음 메시지를 가져오는 함수
  const getNextMessage = () => {
    const currentQueue = messageQueueRef.current;
    console.log('🔍 큐에서 다음 메시지 확인 중... (현재 큐 길이:', currentQueue.length, ')');
    if (currentQueue.length === 0) {
      // 큐가 비어있으면 기본 메시지 중 하나를 랜덤하게 선택
      const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
      const defaultMessage = LOADING_MESSAGES[randomIndex];
      console.log('🔵 큐가 비어있음 - 기본 메시지 자동 추가:', defaultMessage);
      return defaultMessage;
    }
    const nextMessage = currentQueue[0];
    console.log('📋 큐에서 다음 메시지 가져옴:', nextMessage, `(큐 길이: ${currentQueue.length})`);
    return nextMessage;
  };

  // 메시지 애니메이션 사이클 처리
  const processNextMessage = () => {
    console.log('🔄 processNextMessage 호출됨, isAnimating:', isAnimating);
    if (isAnimating) {
      console.log('⏸️ 이미 애니메이션 중이므로 리턴');
      return;
    }

    const nextMessage = getNextMessage();
    console.log('nextMessage:', nextMessage);
    if (!nextMessage) return;

    console.log('▶️ 애니메이션 시작:', nextMessage);
    setIsAnimating(true);
    setCurrentMessage(nextMessage);
    setShowMessage(true);

    // 메시지 표시 시간 (1.2초)
    console.log('⏰ 1.2초 타이머 설정됨');
    animationTimeoutRef.current = setTimeout(() => {
      console.log('👁️ 메시지 숨김 시작');
      setShowMessage(false);
      setIsAnimating(false); // 애니메이션 상태를 여기서 해제
      
      // 페이드 아웃 시간 (0.6초)
      console.log('⏰ 0.6초 타이머 설정됨');
      const hideTimeout = setTimeout(() => {
        console.log('🏁 애니메이션 완료, 메시지 제거 시작');
        // 큐에서 메시지 제거 (pop)
        if (messageQueueRef.current.length > 0) {
          const removedMessage = messageQueueRef.current[0];
          messageQueueRef.current.pop();
          messageQueueRef.current = messageQueueRef.current || []; // pop 후 null 체크
          console.log('🗑️ 큐에서 메시지 제거:', removedMessage, `(새 큐 길이: ${messageQueueRef.current.length})`);
        }
        
        console.log('🔚 다음 메시지 처리 시작');
        // 다음 메시지 처리
        processNextMessage();
      }, 600);

      return () => clearTimeout(hideTimeout);
    }, 1200);
  };

  // 컴포넌트 마운트 시 첫 메시지 처리
  useEffect(() => {
    processNextMessage();
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // 메시지 큐에 새 메시지 추가
  const pushMessage = (message: string) => {
    const newQueue = [...messageQueueRef.current, message];
    console.log('기존 큐:', messageQueueRef.current);
    console.log('새 메시지:', message);
    messageQueueRef.current = newQueue;
    console.log('➕ 단일 메시지 추가:', message, `(새 큐 길이: ${newQueue.length})`);
  };

  // 여러 메시지를 한번에 큐에 추가
  const pushMessages = (messages: string[]) => {
    const newQueue = [...messageQueueRef.current, ...messages];
    messageQueueRef.current = newQueue;
    console.log('📦 여러 메시지 추가:', messages, `(새 큐 길이: ${newQueue.length})`);
  };

  // 큐 초기화
  const clearQueue = () => {
    console.log('🧹 큐 초기화');
    messageQueueRef.current = [];
    setCurrentMessage('');
    setShowMessage(false);
    setIsAnimating(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
  };

  return {
    currentMessage,
    showMessage,
    messageQueue: messageQueueRef.current,
    pushMessage,
    pushMessages,
    clearQueue,
    isAnimating,
  };
} 