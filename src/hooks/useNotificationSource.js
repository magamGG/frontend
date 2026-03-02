import { useEffect, useState, useRef } from 'react';
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
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const eventSourceRef = useRef(null);
  const maxReconnectAttempts = 10; // 최대 재연결 시도 횟수
  const maxReconnectDelay = 30000; // 최대 재연결 지연 시간 (30초)

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      // 기존 연결이 있으면 닫기
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // EventSource는 프록시를 거치지 않으므로 절대 URL 사용
      // 개발 환경: http://localhost:8888 (API_BASE_URL)
      // 프로덕션: https://api.mgsv.co.kr 등 (API_BASE_URL)
      const baseUrl = API_BASE_URL;
      const url = `${baseUrl}/api/notifications/subscribe?token=${encodeURIComponent(token)}`;
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0; // 연결 성공 시 재시도 횟수 초기화
        console.log('✅ SSE 연결 성공');
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
        const readyState = eventSource.readyState;
        console.error('❌ SSE 연결 오류:', error);
        console.error('SSE 상태:', readyState);  // 0: CONNECTING, 1: OPEN, 2: CLOSED

        // CLOSED 상태면 재연결 시도
        if (readyState === EventSource.CLOSED) {
          setIsConnected(false);
          
          // 최대 재시도 횟수 확인
          if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.error('❌ SSE 최대 재연결 시도 횟수 초과. 재연결을 중단합니다.');
            return;
          }

          // 지수 백오프 재연결 (1초, 2초, 4초, 8초, ... 최대 30초)
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), maxReconnectDelay);
          reconnectAttemptsRef.current++;

          console.log(`🔄 SSE 재연결 시도 ${reconnectAttemptsRef.current}/${maxReconnectAttempts} (${delay}ms 후)`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    };

    // 초기 연결
    connect();

    return () => {
      // 정리: 연결 닫기 및 타이머 취소
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
      reconnectAttemptsRef.current = 0;
    };
  }, [token, onNewNotification]);

  return { isConnected };
}

export default useNotificationSource;
