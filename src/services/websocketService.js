import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import chatPerformanceMonitor from '@/utils/chatPerformanceMonitor';

// setImmediate 폴리필 (브라우저 호환성)
const setImmediate = window.setImmediate || ((fn) => setTimeout(fn, 0));

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.connecting = false; // 연결 중 상태 추가
    this.subscriptions = new Map();
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

    // 성능 모니터링 시작
    const connectStartTime = performance.now();
    chatPerformanceMonitor.recordWebSocketEvent('connection_attempt');

    // 새로운 연결 시도
    this.connecting = true;
    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        // SockJS 인스턴스 생성
        const sockjsInstance = new SockJS('http://localhost:8888/ws-stomp');

        // SockJS 에러 핸들링
        sockjsInstance.onerror = (error) => {
          console.error('❌ [WebSocket] SockJS 에러:', error);
          chatPerformanceMonitor.recordWebSocketEvent('connection_error', { error: error.message });
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
            
            // 성능 모니터링
            const connectDuration = performance.now() - connectStartTime;
            chatPerformanceMonitor.recordWebSocketEvent('connection_success', { 
              duration: connectDuration 
            });
            
            resolve();
          },
          onDisconnect: (frame) => {
            this.connected = false;
            this.connecting = false;
            chatPerformanceMonitor.recordWebSocketEvent('disconnection');
          },
          onStompError: (frame) => {
            console.error('❌ [WebSocket] STOMP 에러:', frame);
            this.connected = false;
            this.connecting = false;
            this.connectionPromise = null;
            
            chatPerformanceMonitor.recordWebSocketEvent('stomp_error', { 
              error: frame.body || 'STOMP 연결 실패' 
            });
            
            reject(new Error(frame.body || 'STOMP 연결 실패'));
          },
          onWebSocketError: (error) => {
            console.error('❌ [WebSocket] WebSocket 에러:', error);
            this.connected = false;
            this.connecting = false;
            this.connectionPromise = null;
            
            chatPerformanceMonitor.recordWebSocketEvent('websocket_error', { 
              error: error.message 
            });
            
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

  // 채팅방 구독 (최적화된 버전)
  subscribeToRoom(roomId, callback) {
    if (!this.isConnected()) {
      console.error('❌ [WebSocket] 연결되지 않음, 구독 불가');
      return null;
    }

    const destination = `/topic/room/${roomId}`;

    // 기존 구독이 있으면 반환
    if (this.subscriptions.has(destination)) {
      return this.subscriptions.get(destination);
    }

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const messageData = JSON.parse(message.body);
          
          // 메시지 유효성 검사
          if (!messageData || !messageData.chatNo) {
            console.warn('⚠️ [WebSocket] 유효하지 않은 메시지:', messageData);
            return;
          }
          
          // 성능 모니터링
          chatPerformanceMonitor.recordWebSocketEvent('message_received', {
            roomId,
            messageLength: messageData.chatMessage?.length || 0
          });
          
          // 전역 리스너들에게 메시지 전파 (비동기로 처리)
          setImmediate(() => {
            this.notifyGlobalListeners(messageData);
          });
          
          // 특정 채팅방 콜백 실행
          callback(messageData);
        } catch (error) {
          console.error('❌ [WebSocket] 메시지 파싱 에러:', error);
          chatPerformanceMonitor.recordWebSocketEvent('message_parse_error', {
            error: error.message
          });
        }
      });

      this.subscriptions.set(destination, subscription);
      return subscription;
    } catch (error) {
      console.error('❌ [WebSocket] 채팅방 구독 실패:', error);
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
      } catch (error) {
        console.error('❌ [WebSocket] 구독 해제 실패:', roomId, error);
        // 에러가 발생해도 Map에서는 제거
        this.subscriptions.delete(destination);
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

      // 성능 모니터링
      chatPerformanceMonitor.recordWebSocketEvent('message_send', {
        roomId,
        messageLength: message.trim().length
      });

      this.client.publish({
        destination: '/app/chat/message',
        body: JSON.stringify(messageData)
      });

      return true;
    } catch (error) {
      console.error('❌ [WebSocket] 메시지 전송 실패:', error);
      chatPerformanceMonitor.recordWebSocketEvent('message_send_error', {
        error: error.message
      });
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