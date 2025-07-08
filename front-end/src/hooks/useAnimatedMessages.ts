import { useEffect, useState } from 'react';

export default function useAnimatedMessages(initialMessages: string[]) {
  const [messageList, setMessageList] = useState<string[]>(initialMessages);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    if (messageList.length === 0) return;
    setShowMessage(true);
    const showTimer = setTimeout(() => {
      setShowMessage(false);
      const hideTimer = setTimeout(() => {
        setMessageIndex(idx => (idx + 1) % messageList.length);
        setShowMessage(true);
      }, 600);
      return () => clearTimeout(hideTimer);
    }, 1200);
    return () => clearTimeout(showTimer);
  }, [messageIndex, messageList]);

  useEffect(() => {
    setMessageIndex(0);
  }, [messageList.length]);

  const setAnimatedMessages = (messages: string[]) => {
    setShowMessage(false);
    setTimeout(() => {
      setMessageList(messages);
      setMessageIndex(0);
      setShowMessage(true);
    }, 300);
  };

  return {
    messageList,
    messageIndex,
    showMessage,
    setAnimatedMessages,
    currentMessage: messageList[messageIndex % messageList.length] || '',
  };
} 