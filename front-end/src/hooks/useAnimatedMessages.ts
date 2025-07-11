import { useEffect, useState, useRef } from 'react';

export default function useAnimatedMessages(
  onMessageActionMap?: { [message: string]: () => void }
) {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [showMessage, setShowMessage] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<string[]>([]);

  // 메시지 애니메이션 사이클 처리
  const processNextMessage = () => {
    if (isAnimating) return;
    const currentQueue = messageQueueRef.current;
    if (currentQueue.length === 0) return;
    const nextMessage = currentQueue[0];

    setIsAnimating(true);
    setCurrentMessage(nextMessage);
    setShowMessage(true);
    animationTimeoutRef.current = setTimeout(() => {
      setShowMessage(false);
      // 메시지별 액션 실행
      if (onMessageActionMap && onMessageActionMap[nextMessage]) {
        onMessageActionMap[nextMessage]();
      }
      setIsAnimating(false);
      const hideTimeout = setTimeout(() => {
        if (messageQueueRef.current.length > 0) {
          messageQueueRef.current.shift();
        }
        processNextMessage();
      }, 600);
      return () => clearTimeout(hideTimeout);
    }, 1200);
  };

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
    messageQueueRef.current = [...messageQueueRef.current, message];
    processNextMessage();
  };

  // 여러 메시지를 한번에 큐에 추가
  const pushMessages = (messages: string[]) => {
    messageQueueRef.current = [...messageQueueRef.current, ...messages];
    processNextMessage();
  };

  // 큐 초기화
  const clearQueue = () => {
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