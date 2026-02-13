import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        console.log('🔌 이미 WebSocket 연결됨');
        resolve();
        return;
      }

      console.log('🔌 WebSocket 연결 시도 - URL: ws://localhost:8888/ws-stomp');

      // 네이티브 WebSocket 사용 (SockJS 대신)
      this.client = new Client({
        brokerURL: 'ws://localhost:8888/ws-stomp',
        debug: (str) => {
          console.log('🔌 WebSocket Debug:', str);
        },
        onConnect: (frame) => {
          console.log('✅ WebSocket 연결 성공', frame);
          this.connected = true;
          resolve();
        },
        onDisconnect: (frame) => {
          console.log('❌ WebSocket 연결 해제', frame);
          this.connected = false;
        },
        onStompError: (frame) => {
          console.error('❌ WebSocket STOMP 에러:', frame);
          this.connected = false;
          reject(new Error(frame.body || 'STOMP 연결 실패'));
        },
        onWebSocketError: (error) => {
          console.error('❌ WebSocket 에러:', error);
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
        this.client.activate();
        console.log('🔌 WebSocket 클라이언트 활성화 완료');
      } catch (error) {
        console.error('❌ WebSocket 클라이언트 활성화 실패:', error);
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
    if (!this.connected) {
      console.error('WebSocket이 연결되지 않았습니다.');
      return null;
    }

    const destination = `/topic/room/${roomId}`;
    
    if (this.subscriptions.has(destination)) {
      console.log('이미 구독 중인 채팅방:', roomId);
      return this.subscriptions.get(destination);
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const messageData = JSON.parse(message.body);
        console.log('📨 실시간 메시지 수신:', messageData);
        callback(messageData);
      } catch (error) {
        console.error('메시지 파싱 에러:', error);
      }
    });

    this.subscriptions.set(destination, subscription);
    console.log('📡 채팅방 구독 시작:', roomId);
    
    return subscription;
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

  isConnected() {
    return this.connected;
  }
}

// 싱글톤 인스턴스
const websocketService = new WebSocketService();
export default websocketService;