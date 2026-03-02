import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '@/api/config';

// setImmediate 폴리필 (브라우저 호환성)
const setImmediate = window.setImmediate || ((fn) => setTimeout(fn, 0));

/** HTTPS 페이지에서는 반드시 https URL 사용 (SecurityError 방지). 배포 시 env 미적용이어도 동작하도록 HTTPS+localhost면 프로덕션 API 호스트 사용 */
const PRODUCTION_WS_BASE = 'https://api.magamgiki.life';

function getWebSocketUrl() {
  const isHttps = typeof window !== 'undefined' && window.location?.protocol === 'https:';
  let base = (API_BASE_URL || 'http://localhost:8888').replace(/\/$/, '');

  if (isHttps) {
    if (base.startsWith('http:')) base = base.replace(/^http:/, 'https:');
    if (base.includes('localhost')) base = PRODUCTION_WS_BASE;
  }
  return `${base}/ws-stomp`;
}

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.connecting = false; // 연결 중 상태 추가
    this.subscriptions = new Map();
    /** 방별 최신 콜백 ref (구독 재사용 시에도 항상 최신 콜백 호출) */
    this.roomCallbackRefs = new Map();
    this.globalMessageListeners = new Set(); // 전역 메시지 리스너들
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.connectionPromise = null; // 연결 Promise 캐싱
  }

  // 연결 상태 확인 (개선된 버전)
  isConnected() {
    return this.connected && this.client && this.client.connected;
  }

  // 연결 중 상태 확인
  isConnecting() {
    return this.connecting;
  }

  connect() {
    // 이미 연결되어 있으면 즉시 반환
    if (this.isConnected()) {
      return Promise.resolve();
    }

    // 연결 중이면 기존 Promise 반환
    if (this.connecting && this.connectionPromise) {
      return this.connectionPromise;
    }
  

    // 새로운 연결 시도
    this.connecting = true;
    this.connectionPromise = new Promise((resolve, reject) => {
      try {
<<<<<<< HEAD
        // SockJS 인스턴스 생성
        const sockjsInstance = new SockJS(`${API_BASE_URL}/ws-stomp`);
=======
        // SockJS 인스턴스 생성 (HTTPS 페이지에서는 항상 https → wss 사용)
        const wsUrl = getWebSocketUrl();
        const sockjsInstance = new SockJS(wsUrl);
>>>>>>> 00fc64d5835277c54c4d7d2b511338a8d1d71726

        // SockJS 에러 핸들링
        sockjsInstance.onerror = (error) => {
          console.error('❌ [WebSocket] SockJS 에러:', error);
          this.connecting = false;
          this.connectionPromise = null;
          reject(error);
        };
        
        sockjsInstance.onclose = (event) => {
          this.connected = false;
          this.connecting = false;
        };

        sockjsInstance.onopen = () => {
          // SockJS 연결 열림
        };

        // STOMP 클라이언트 생성
        this.client = new Client({
          webSocketFactory: () => sockjsInstance,
          debug: (str) => {
            // 프로덕션에서는 debug 로그 비활성화
            if (process.env.NODE_ENV === 'development') {
              // STOMP debug 로그 비활성화
            }
          },
          onConnect: (frame) => {
            this.connected = true;
            this.connecting = false;
            this.reconnectAttempts = 0; // 성공 시 재연결 시도 횟수 리셋
            
      
            
            resolve();
          },
          onDisconnect: (frame) => {
            this.connected = false;
            this.connecting = false;
          },
          onStompError: (frame) => {
            console.error('❌ [WebSocket] STOMP 에러:', frame);
            this.connected = false;
            this.connecting = false;
            this.connectionPromise = null;
            
            reject(new Error(frame.body || 'STOMP 연결 실패'));
          },
          onWebSocketError: (error) => {
            console.error('❌ [WebSocket] WebSocket 에러:', error);
            this.connected = false;
            this.connecting = false;
            this.connectionPromise = null;
            
            reject(error);
          },
          // 재연결 설정 개선
          reconnectDelay: Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000), // 지수 백오프
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        // 연결 시도
        this.client.activate();
      } catch (error) {
        console.error('❌ [WebSocket] 연결 초기화 실패:', error);
        this.connecting = false;
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  disconnect() {
    // 연결 중인 Promise 취소
    if (this.connectionPromise) {
      this.connectionPromise = null;
    }

    // 모든 구독 정리
    this.subscriptions.forEach((subscription, destination) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.warn('⚠️ [WebSocket] 구독 해제 실패:', destination, error);
      }
    });
    this.subscriptions.clear();
    this.roomCallbackRefs.clear();

    // 전역 리스너 정리
    this.globalMessageListeners.clear();

    // 클라이언트 연결 해제
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (error) {
        console.warn('⚠️ [WebSocket] 클라이언트 비활성화 실패:', error);
      }
      this.client = null;
    }

    // 상태 초기화
    this.connected = false;
    this.connecting = false;
    this.reconnectAttempts = 0;
  }

  // 채팅방 구독: 기존 구독이 있으면 해제 후 새로 구독 (방 진입 시 서버에 명확히 전달)
  subscribeToRoom(roomId, callback) {
    if (!this.isConnected()) {
      console.error('❌ [WebSocket] 연결되지 않음, 구독 불가');
      return null;
    }

    const destination = `/topic/room/${roomId}`;

    if (this.subscriptions.has(destination)) {
      this.unsubscribeFromRoom(roomId);
    }

    const callbackRef = { current: callback };
    this.roomCallbackRefs.set(destination, callbackRef);

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const messageData = JSON.parse(message.body);
          if (!messageData) return;

          setTimeout(() => {
            if (messageData.type === 'READ_UPDATE') {
              callbackRef.current?.(messageData);
              return;
            }
            if (!messageData.chatNo) {
              console.warn('⚠️ [WebSocket] 유효하지 않은 메시지:', messageData);
              return;
            }
            this.notifyGlobalListeners(messageData);
            callbackRef.current?.(messageData);
          }, 0);
        } catch (error) {
          console.error('❌ [WebSocket] 메시지 파싱 에러:', error);
        }
      });

      this.subscriptions.set(destination, subscription);
      return subscription;
    } catch (error) {
      console.error('❌ [WebSocket] 채팅방 구독 실패:', error);
      this.roomCallbackRefs.delete(destination);
      return null;
    }
  }

  // 채팅방 구독 해제 (안전한 버전)
  unsubscribeFromRoom(roomId) {
    const destination = `/topic/room/${roomId}`;
    const subscription = this.subscriptions.get(destination);

    if (subscription) {
      try {
        subscription.unsubscribe();
        this.subscriptions.delete(destination);
        this.roomCallbackRefs.delete(destination);
      } catch (error) {
        console.error('❌ [WebSocket] 구독 해제 실패:', roomId, error);
        this.subscriptions.delete(destination);
        this.roomCallbackRefs.delete(destination);
      }
    }
  }

  // 메시지 전송 (최적화된 버전)
  sendMessage(roomId, memberNo, message) {
    // 입력 유효성 검사
    if (!roomId || !memberNo || !message?.trim()) {
      console.error('❌ [WebSocket] 유효하지 않은 메시지 데이터');
      return false;
    }

    if (!this.isConnected()) {
      console.error('❌ [WebSocket] 연결되지 않음, 메시지 전송 불가');
      return false;
    }

    try {
      const messageData = {
        chatRoomNo: roomId,
        memberNo: memberNo,
        chatMessage: message.trim(),
        chatMessageType: 'TEXT'
      };

      this.client.publish({
        destination: '/app/chat/message',
        body: JSON.stringify(messageData)
      });

      return true;
    } catch (error) {
      console.error('❌ [WebSocket] 메시지 전송 실패:', error);
      return false;
    }
  }

  // 전역 메시지 리스너 추가 (중복 방지)
  addGlobalMessageListener(callback) {
    if (typeof callback !== 'function') {
      console.error('❌ [WebSocket] 리스너는 함수여야 합니다');
      return false;
    }

    this.globalMessageListeners.add(callback);
    return true;
  }

  // 전역 메시지 리스너 제거
  removeGlobalMessageListener(callback) {
    return this.globalMessageListeners.delete(callback);
  }

  // 전역 메시지 리스너들에게 메시지 전파 (에러 처리 강화)
  notifyGlobalListeners(messageData) {
    if (this.globalMessageListeners.size === 0) {
      return;
    }

    this.globalMessageListeners.forEach(callback => {
      try {
        callback(messageData);
      } catch (error) {
        console.error('❌ [WebSocket] 전역 리스너 에러:', error);
        // 에러가 발생한 리스너는 제거 (옵션)
        // this.globalMessageListeners.delete(callback);
      }
    });
  }

  // 연결 상태 정보 반환
  getConnectionInfo() {
    return {
      connected: this.connected,
      connecting: this.connecting,
      subscriptionsCount: this.subscriptions.size,
      listenersCount: this.globalMessageListeners.size,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // 모든 구독 정보 반환 (디버깅용)
  getSubscriptions() {
    return Array.from(this.subscriptions.keys());
  }
}

// 싱글톤 인스턴스
const websocketService = new WebSocketService();
export default websocketService;