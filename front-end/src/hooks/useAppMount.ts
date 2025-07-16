import { useEffect } from 'react';
import { DEFAULT_MESSAGES } from '../constants/messages';

interface UseAppMountProps {
  postLocation: (data: { latitude: number; longitude: number }) => Promise<{ status: string; data: { session_id: string } }>;
  pushMessages: (messages: string[]) => void;
}

const useAppMount = ({ postLocation, pushMessages }: UseAppMountProps) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      pushMessages(DEFAULT_MESSAGES);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const res = await postLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        if (res?.data?.session_id) {
          localStorage.setItem('session_id', res.data.session_id);
        }
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