import { create } from 'zustand';
import apiServices from '@/api/services';

const { chatService } = apiServices;

const useChatStore = create((set, get) => ({
  isChatOpen: false,
  viewMode: 'list', // 'list' | 'detail'
  selectedChat: null,
  chatRooms: [],    // DB에서 가져온 채팅방 목록
  messages: [],     // DB에서 가져온 대화 내역
  isLoading: false,

  // [목록 열기] 헤더의 메시지 아이콘 클릭 시 호출
  openChatList: async () => {
    set({ isChatOpen: true, viewMode: 'list', isLoading: true });
    try {
      const response = await chatService.getChatList();
      // 응답 데이터 확인 및 설정
      const data = response?.data || response;
      console.log('채팅방 목록 응답:', data);
      
      // 배열인지 확인하고 설정
      if (Array.isArray(data)) {
        set({ chatRooms: data });
        console.log(`채팅방 ${data.length}개 로드 완료`);
      } else {
        console.warn('채팅방 목록이 배열이 아닙니다:', data);
        set({ chatRooms: [] });
      }
    } catch (error) {
      console.error("채팅 목록 로드 실패:", error);
      set({ chatRooms: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // [대화방 입장] 목록에서 특정 방 클릭 시 호출
  openChatDetail: async (room) => {
    // 룸 ID 추출 (chatRoomNo 필드명 사용)
    const roomId = room.chatRoomNo || room.roomId || room.roomNo || room.id;
    
    set({ isChatOpen: true, viewMode: 'detail', selectedChat: room, isLoading: true, messages: [] });
    
    try {
      const response = await chatService.getMessages(roomId);
      const data = response.data || response;
      set({ messages: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("메시지 로드 실패:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // [메시지 전송]
  sendNewMessage: async (text) => {
    const { selectedChat, messages } = get();
    const roomId = selectedChat?.chatRoomNo || selectedChat?.roomId || selectedChat?.roomNo || selectedChat?.id;
    
    if (!roomId || !text.trim()) return;

    try {
      const response = await chatService.sendMessage(roomId, text);
      const newMessage = response.data || response;
      
      // 서버에서 받은 새 메시지를 기존 목록에 추가
      set({ messages: [...messages, newMessage] });
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  },

  // 모달 닫기
  closeChat: () => set({ isChatOpen: false, viewMode: 'list', selectedChat: null, messages: [] }),
  
  // 상세에서 목록으로 돌아가기
  backToList: () => {
    set({ viewMode: 'list', selectedChat: null, messages: [] });
    get().openChatList(); // 돌아올 때 목록 최신화 (선택 사항)
  },
}));

export default useChatStore;