import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.globalMessageListeners = new Set(); // 전역 메시지 리스너들
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log('🔍 [DEBUG] connect() 시작');
      
      if (this.connected) {
        console.log('🔌 이미 WebSocket 연결됨');
        resolve();
        return;
      }

      console.log('🔍 [DEBUG] WebSocket 연결 시도 시작');
      console.log('🔍 [DEBUG] 연결 URL: http://localhost:8888/ws-stomp');

      // SockJS 생성 테스트
      let sockjsInstance;
      try {
        console.log('🔍 [DEBUG] SockJS 인스턴스 생성 시도');
        sockjsInstance = new SockJS('http://localhost:8888/ws-stomp');
        console.log('✅ [DEBUG] SockJS 인스턴스 생성 성공:', sockjsInstance);
      } catch (error) {
        console.error('❌ [DEBUG] SockJS 인스턴스 생성 실패:', error);
        reject(error);
        return;
      }

      // SockJS 이벤트 리스너 추가
      sockjsInstance.onopen = () => {
        console.log('✅ [DEBUG] SockJS 연결 열림');
      };
      
      sockjsInstance.onmessage = (event) => {
        console.log('📨 [DEBUG] SockJS 메시지 수신:', event.data);
      };
      
      sockjsInstance.onerror = (error) => {
        console.error('❌ [DEBUG] SockJS 에러:', error);
      };
      
      sockjsInstance.onclose = (event) => {
        console.log('🔒 [DEBUG] SockJS 연결 닫힘:', event.code, event.reason);
      };

      // STOMP 클라이언트 생성
      console.log('🔍 [DEBUG] STOMP 클라이언트 생성 시도');
      this.client = new Client({
        webSocketFactory: () => {
          console.log('🔍 [DEBUG] webSocketFactory 호출됨');
          return sockjsInstance;
        },
        debug: (str) => {
          console.log('🔌 [STOMP DEBUG]:', str);
        },
        onConnect: (frame) => {
          console.log('✅ [DEBUG] STOMP 연결 성공', frame);
          this.connected = true;
          resolve();
        },
        onDisconnect: (frame) => {
          console.log('❌ [DEBUG] STOMP 연결 해제', frame);
          this.connected = false;
        },
        onStompError: (frame) => {
          console.error('❌ [DEBUG] STOMP 에러:', frame);
          this.connected = false;
          reject(new Error(frame.body || 'STOMP 연결 실패'));
        },
        onWebSocketError: (error) => {
          console.error('❌ [DEBUG] WebSocket 에러:', error);
          this.connected = false;
          reject(error);
        },
        // 재연결 설정
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // 연결 시도
      try {
        console.log('🔍 [DEBUG] STOMP 클라이언트 활성화 시도');
        this.client.activate();
        console.log('✅ [DEBUG] STOMP 클라이언트 활성화 완료');
      } catch (error) {
        console.error('❌ [DEBUG] STOMP 클라이언트 활성화 실패:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  // 채팅방 구독
  subscribeToRoom(roomId, callback) {
    console.log('🔍 [DEBUG] subscribeToRoom 호출:', { roomId, connected: this.connected, client: !!this.client });
    
    if (!this.connected || !this.client) {
      console.error('WebSocket이 연결되지 않았습니다.');
      return null;
    }

    // STOMP 클라이언트가 실제로 연결되어 있는지 확인
    if (!this.client.connected) {
      console.error('STOMP 클라이언트가 연결되지 않았습니다.');
      return null;
    }

    const destination = `/topic/room/${roomId}`;

    if (this.subscriptions.has(destination)) {
      console.log('이미 구독 중인 채팅방:', roomId);
      return this.subscriptions.get(destination);
    }

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const messageData = JSON.parse(message.body);
          console.log('📨 실시간 메시지 수신:', messageData);
          
          // 전역 리스너들에게 메시지 전파
          this.notifyGlobalListeners(messageData);
          
          // 특정 채팅방 콜백 실행
          callback(messageData);
        } catch (error) {
          console.error('메시지 파싱 에러:', error);
        }
      });

      this.subscriptions.set(destination, subscription);
      console.log('📡 채팅방 구독 시작:', roomId);

      return subscription;
    } catch (error) {
      console.error('채팅방 구독 실패:', error);
      return null;
    }
  }

  // 채팅방 구독 해제
  unsubscribeFromRoom(roomId) {
    const destination = `/topic/room/${roomId}`;
    const subscription = this.subscriptions.get(destination);

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log('📡 채팅방 구독 해제:', roomId);
    }
  }

  // 메시지 전송 (WebSocket)
  sendMessage(roomId, memberNo, message) {
    if (!this.connected || !this.client) {
      console.error('WebSocket이 연결되지 않았습니다.');
      return false;
    }

    try {
      const messageData = {
        chatRoomNo: roomId,
        memberNo: memberNo,
        chatMessage: message,
        chatMessageType: 'TEXT'
      };

      this.client.publish({
        destination: '/app/chat/message',
        body: JSON.stringify(messageData)
      });

      console.log('📤 WebSocket 메시지 전송:', messageData);
      return true;
    } catch (error) {
      console.error('WebSocket 메시지 전송 실패:', error);
      return false;
    }
  }

  // 전역 메시지 리스너 추가 (모든 채팅방 메시지 수신)
  addGlobalMessageListener(callback) {
    this.globalMessageListeners.add(callback);
    console.log('🔍 [DEBUG] 전역 메시지 리스너 추가됨, 총 개수:', this.globalMessageListeners.size);
  }

  // 전역 메시지 리스너 제거
  removeGlobalMessageListener(callback) {
    this.globalMessageListeners.delete(callback);
    console.log('🔍 [DEBUG] 전역 메시지 리스너 제거됨, 총 개수:', this.globalMessageListeners.size);
  }

  // 전역 메시지 리스너들에게 메시지 전파
  notifyGlobalListeners(messageData) {
    this.globalMessageListeners.forEach(callback => {
      try {
        callback(messageData);
      } catch (error) {
        console.error('전역 메시지 리스너 에러:', error);
      }
    });
  }

  isConnected() {
    return this.connected;
  }
}

// 싱글톤 인스턴스
const websocketService = new WebSocketService();
export default websocketService;