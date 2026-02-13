import { create } from 'zustand';
import apiServices from '@/api/services';
import useAuthStore from '@/store/authStore';
import websocketService from '@/services/websocketService';

const { chatService } = apiServices;

const useChatStore = create((set, get) => ({
  isChatOpen: false,
  viewMode: 'list', // 'list' | 'detail'
  selectedChat: null,
  chatRooms: [],    // DB에서 가져온 채팅방 목록
  isLoading: false,
  isLoadingChatList: false, // 채팅방 목록 로딩 상태 추가
  globalMessageListener: null, // 전역 메시지 리스너 참조

  // 전역 메시지 리스너 초기화
  initializeGlobalMessageListener: () => {
    const { globalMessageListener } = get();
    
    // 이미 등록된 리스너가 있으면 제거
    if (globalMessageListener) {
      websocketService.removeGlobalMessageListener(globalMessageListener);
    }
    
    // 새 리스너 생성 및 등록
    const listener = async (messageData) => {
      console.log('🔍 [전역리스너] 메시지 수신:', messageData);
      
      const { selectedChat, viewMode } = get();
      const currentChatRoomNo = selectedChat?.chatRoomNo;
      
      // 현재 보고 있는 채팅방이 아닌 다른 채팅방에서 메시지가 온 경우
      if (messageData.chatRoomNo !== currentChatRoomNo || viewMode !== 'detail') {
        console.log('🔍 [전역리스너] 다른 채팅방 메시지, unread count 업데이트');
        
        try {
          // 해당 채팅방의 정확한 unread count 조회
          const response = await chatService.getUnreadCount(messageData.chatRoomNo);
          const unreadCount = response.data || response;
          
          console.log('🔍 [전역리스너] 새로운 unread count:', unreadCount);
          
          // 해당 채팅방의 unread count 업데이트
          set((state) => ({
            chatRooms: state.chatRooms.map(room => 
              room.chatRoomNo === messageData.chatRoomNo 
                ? { ...room, unreadCount }
                : room
            )
          }));
        } catch (error) {
          console.error('❌ [전역리스너] unread count 조회 실패:', error);
          // 실패 시 전체 목록 새로고침
          get().refreshChatRooms();
        }
      }
    };
    
    websocketService.addGlobalMessageListener(listener);
    set({ globalMessageListener: listener });
    console.log('✅ [전역리스너] 전역 메시지 리스너 등록 완료');
  },

  // 전역 메시지 리스너 정리
  cleanupGlobalMessageListener: () => {
    const { globalMessageListener } = get();
    if (globalMessageListener) {
      websocketService.removeGlobalMessageListener(globalMessageListener);
      set({ globalMessageListener: null });
      console.log('✅ [전역리스너] 전역 메시지 리스너 정리 완료');
    }
  },

  // [목록 열기] 헤더의 메시지 아이콘 클릭 시 호출
  openChatList: async () => {
    // 이미 로딩 중이면 중복 실행 방지
    if (get().isLoadingChatList) {
      console.log('🔵 [채팅] 이미 로딩 중이므로 중복 실행 방지');
      return;
    }

    console.log('🔵 [채팅] openChatList 시작');
    set({ isChatOpen: true, viewMode: 'list', isLoading: true, isLoadingChatList: true });
    try {
      const { user } = useAuthStore.getState();
      console.log('🔵 [채팅] 현재 사용자 정보:', user);
      
      // agencyNo는 user 객체에 직접 있음
      const agencyNo = user?.agencyNo;
      console.log('🔵 [채팅] 에이전시 번호:', agencyNo);
      
      if (!agencyNo) {
        console.error('❌ [채팅] 에이전시 정보가 없습니다.');
        set({ chatRooms: [] });
        return;
      }

      console.log('🔵 [채팅] API 호출 시작 - getChatRoomsByAgency:', agencyNo, 'all');
      // agencyNo로 채팅방 목록 조회 (type: 'all'이면 같은 에이전시의 모든 멤버가 참여 가능한 채팅방들)
      const response = await chatService.getChatRoomsByAgency(agencyNo, 'all');
      console.log('🔵 [채팅] API 응답 원본:', response);
      
      const data = response?.data || response;
      console.log('🔵 [채팅] 처리된 데이터:', data);

      // 배열인지 확인하고 설정
      if (Array.isArray(data)) {
        set({ chatRooms: data });
        console.log(`✅ [채팅] 채팅방 ${data.length}개 로드 완료:`, data);
        
        // 전역 메시지 리스너 초기화 (채팅방 목록 로드 후)
        get().initializeGlobalMessageListener();
      } else {
        console.warn('⚠️ [채팅] 채팅방 목록이 배열이 아닙니다:', data);
        set({ chatRooms: [] });
      }
    } catch (error) {
      console.error("❌ [채팅] 채팅 목록 로드 실패:", error);
      console.error("❌ [채팅] 에러 상세:", {
        message: error.message,
        status: error.status,
        data: error.data,
        stack: error.stack
      });
      set({ chatRooms: [] });
    } finally {
      set({ isLoading: false, isLoadingChatList: false });
      console.log('🔵 [채팅] openChatList 완료');
    }
  },

  // [대화방 입장] 목록에서 특정 방 클릭 시 호출
  openChatDetail: async (room) => {
    console.log('🔵 [채팅스토어] openChatDetail 시작:', room);
    
    // 룸 ID 추출 (chatRoomNo 필드명 사용)
    const roomId = room.chatRoomNo || room.roomId || room.roomNo || room.id;
    console.log('🔵 [채팅스토어] roomId:', roomId);

    set({ isChatOpen: true, viewMode: 'detail', selectedChat: room, isLoading: true });

    try {
      console.log('🔵 [채팅스토어] 메시지 로드 시작');
      const response = await chatService.getChatMessages(roomId);
      const data = response.data || response;
      console.log('🔵 [채팅스토어] 메시지 응답:', data);
      
      // 스토어의 messages는 사용하지 않음 (ChatModal에서 로컬 상태 사용)
      // set({ messages: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("❌ [채팅스토어] 메시지 로드 실패:", error);
    } finally {
      set({ isLoading: false });
      console.log('🔵 [채팅스토어] openChatDetail 완료');
    }
  },

  // [메시지 전송]
  sendNewMessage: async (text) => {
    const { selectedChat, messages } = get();
    const roomId = selectedChat?.chatRoomNo || selectedChat?.roomId || selectedChat?.roomNo || selectedChat?.id;

    if (!roomId || !text.trim()) return;

    try {
      // WebSocket을 통한 메시지 전송은 websocketService에서 처리
      console.log('메시지 전송:', text);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  },

  // 총 읽지 않은 메시지 개수 계산
  getTotalUnreadCount: () => {
    const { chatRooms } = get();
    const totalCount = chatRooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
    return totalCount;
  },

  // 채팅방 목록 새로고침 (unread count 업데이트용)
  refreshChatRooms: async () => {
    console.log('🔵 [채팅] refreshChatRooms 시작');
    try {
      const { user } = useAuthStore.getState();
      const agencyNo = user?.agencyNo;
      
      if (!agencyNo) {
        console.error('❌ [채팅] 에이전시 정보가 없습니다.');
        return;
      }

      const response = await chatService.getChatRoomsByAgency(agencyNo, 'all');
      const data = response?.data || response;

      if (Array.isArray(data)) {
        set({ chatRooms: data });
        console.log(`✅ [채팅] 채팅방 목록 새로고침 완료: ${data.length}개`);
        
        // 전역 메시지 리스너 초기화 (새로고침 후에도)
        get().initializeGlobalMessageListener();
      }
    } catch (error) {
      console.error("❌ [채팅] 채팅방 목록 새로고침 실패:", error);
    }
  },

  // 특정 채팅방의 unread count 업데이트
  updateChatRoomUnreadCount: (chatRoomNo, unreadCount) => {
    console.log('🔵 [채팅] updateChatRoomUnreadCount:', { chatRoomNo, unreadCount });
    set((state) => ({
      chatRooms: state.chatRooms.map(room => 
        room.chatRoomNo === chatRoomNo 
          ? { ...room, unreadCount } 
          : room
      )
    }));
  },

  // 모달 닫기
  closeChat: () => {
    // 전역 메시지 리스너 정리
    get().cleanupGlobalMessageListener();
    set({ isChatOpen: false, viewMode: 'list', selectedChat: null });
  },

  // 상세에서 목록으로 돌아가기
  backToList: () => {
    set({ viewMode: 'list', selectedChat: null });
    // 돌아갈 때는 목록을 다시 로드하지 않음 (이미 로드된 상태 유지)
  },
}));

export default useChatStore;