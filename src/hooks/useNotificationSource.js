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
    if (!token) {
      console.log('토큰이 없어 SSE 연결을 시작하지 않습니다.');
      return;
    }

    // EventSource는 프록시를 거치지 않으므로 절대 URL 사용
    // 개발 환경: http://localhost:8888
    // 프로덕션: API_BASE_URL 사용
    const baseUrl = API_BASE_URL || 'http://localhost:8888';
    const url = `${baseUrl}/api/notifications/subscribe?token=${encodeURIComponent(token)}`;
    
    console.log('🔗 SSE 연결 시도:', url);
    
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log('✅ SSE 연결 성공');
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

    eventSource.onerror = (error) => {
      console.error('❌ SSE 연결 오류:', error);
      console.error('SSE 상태:', eventSource.readyState);  // 0: CONNECTING, 1: OPEN, 2: CLOSED
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
