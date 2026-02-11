import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/api/config';
import useAuthStore from '@/store/authStore';

/**
 * SSE 기반 실시간 알림 수신 훅
 * @param {(data: object) => void} [onNewNotification] 새 알림 수신 시 콜백 (notificationNo, notificationName, notificationText, notificationType 등)
 * @returns {{ isConnected: boolean }} 연결 상태
 */
export function useNotificationSource(onNewNotification) {
  const token = useAuthStore((state) => state.token);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const baseUrl = API_BASE_URL || '';
    const url = `${baseUrl}/api/notifications/subscribe?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.addEventListener('sse', (e) => {
      // 더미 이벤트 무시
      if (typeof e.data === 'string' && e.data.startsWith('EventStream')) {
        return;
      }
      try {
        const data = JSON.parse(e.data);
        onNewNotification?.(data);
      } catch (err) {
        console.error('알림 데이터 파싱 오류:', err);
      }
    });

    eventSource.onerror = () => {
      eventSource.close();
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [token, onNewNotification]);

  return { isConnected };
}

export default useNotificationSource;
