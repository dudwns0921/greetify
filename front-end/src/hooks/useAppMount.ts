import { useEffect } from 'react';
import { DEFAULT_MESSAGES } from '../constants/messages';

interface UseAppMountProps {
  postLocation: (data: { latitude: number; longitude: number }) => void;
  pushMessages: (messages: string[]) => void;
}

const useAppMount = ({ postLocation, pushMessages }: UseAppMountProps) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      pushMessages(DEFAULT_MESSAGES);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        postLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        pushMessages(DEFAULT_MESSAGES);
      },
      (error) => {
        // 위치 정보 획득 실패 시 처리 (옵션)
        console.error('위치 정보 획득 실패:', error);
        pushMessages(DEFAULT_MESSAGES);
      }
    );
  }, []);
};

export default useAppMount; 