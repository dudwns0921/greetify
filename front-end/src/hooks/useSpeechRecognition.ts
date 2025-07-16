import { useRef, useEffect, useState, useCallback } from 'react';

// any 제거: SpeechRecognition 관련 타입 직접 선언
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

interface ISpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognitionErrorEvent extends Event {
  error: string;
}

export default function useSpeechRecognition(onResult: (text: string) => void) {
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition: ISpeechRecognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
      console.error('음성 인식 오류:', event.error);
    };
    recognition.onstart = () => {
      setRecognizing(true);
      console.log('음성 인식 시작');
    };
    recognition.onend = () => {
      setRecognizing(false);
    };
    recognitionRef.current = recognition;
    return () => {
      recognition.abort();
    };
  }, []);

  const start = useCallback(() => {
    if (recognitionRef.current && supported && !recognizing) {
      recognitionRef.current.start();
    }
  }, [supported, recognizing]);

  return { recognizing, start, supported };
} 