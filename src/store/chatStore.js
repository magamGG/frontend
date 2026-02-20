import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import apiServices from '@/api/services';
import useAuthStore from '@/store/authStore';
import websocketService from '@/services/websocketService';
import chatPerformanceMonitor from '@/utils/chatPerformanceMonitor';

const { chatService } = apiServices;

// 캐시 및 debounce 관리 (전역 레벨)
const cache = new Map();
const debounceTimers = new Map();
const requestCache = new Map(); // API 요청 중복 방지용 캐시

// 유틸리티 함수들
const debounce = (key, fn, delay = 300) => {
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key));
  }
  
  const timer = setTimeout(() => {
    fn();
    debounceTimers.delete(key);
  }, delay);
  
  debounceTimers.set(key, timer);
};

const getCacheKey = (agencyNo, type) => `chatRooms_${agencyNo}_${type}`;

// API 요청 중복 방지 함수
const withRequestDeduplication = async (key, apiCall) => {
  // 이미 같은 요청이 진행 중이면 기다림
  if (requestCache.has(key)) {
    return requestCache.get(key);
  }
  
  // 새 요청 시작
  const promise = apiCall().finally(() => {
    requestCache.delete(key);
  });
  
  requestCache.set(key, promise);
  return promise;
};

const useChatStore = create(
  subscribeWithSelector((set, get) => ({
    // 상태
    isChatOpen: false,
    viewMode: 'list', // 'list' | 'detail'
    selectedChat: null,
    chatRooms: [],    // DB에서 가져온 채팅방 목록
    isLoading: false,
    isLoadingChatList: false, // 채팅방 목록 로딩 상태
    globalMessageListener: null, // 전역 메시지 리스너 참조
    lastRefreshTime: null, // 마지막 새로고침 시간
    
    // 성능 최적화를 위한 메모이제이션된 값들
    _memoizedTotalUnreadCount: 0,
    _lastChatRoomsHash: null,

    // 채팅방 목록 해시 계산 (변경 감지용)
    _calculateChatRoomsHash: (chatRooms) => {
      return chatRooms.map(room => `${room.chatRoomNo}_${room.unreadCount || 0}`).join('|');
    },

    // 전역 메시지 리스너 초기화 (최적화된 버전)
    initializeGlobalMessageListener: () => {
      const { globalMessageListener } = get();
      
      // 이미 등록된 리스너가 있으면 제거
      if (globalMessageListener) {
        websocketService.removeGlobalMessageListener(globalMessageListener);
      }
      
      // 새 리스너 생성 및 등록 (debounce 적용)
      const listener = (messageData) => {
        const { selectedChat, viewMode } = get();
        const currentChatRoomNo = selectedChat?.chatRoomNo;
        
        // 현재 보고 있는 채팅방이 아닌 다른 채팅방에서 메시지가 온 경우
        if (messageData.chatRoomNo !== currentChatRoomNo || viewMode !== 'detail') {
          // debounce를 적용하여 과도한 API 호출 방지
          debounce('refreshChatRooms', () => {
            get().refreshChatRooms();
          }, 500);
        }
      };
      
      websocketService.addGlobalMessageListener(listener);
      set({ globalMessageListener: listener });
    },

    // 전역 메시지 리스너 정리 (안전한 버전)
    cleanupGlobalMessageListener: () => {
      const { globalMessageListener } = get();
      if (globalMessageListener) {
        websocketService.removeGlobalMessageListener(globalMessageListener);
        set({ globalMessageListener: null });
      }
      
      // 관련 debounce 타이머도 정리
      if (debounceTimers.has('refreshChatRooms')) {
        clearTimeout(debounceTimers.get('refreshChatRooms'));
        debounceTimers.delete('refreshChatRooms');
      }
    },

    // [목록 열기] 헤더의 메시지 아이콘 클릭 시 호출 (성능 최적화)
    openChatList: async () => {
      const startTime = performance.now();
      
      // 이미 로딩 중이면 중복 실행 방지
      if (get().isLoadingChatList) {
        return;
      }

      const { user } = useAuthStore.getState();
      const agencyNo = user?.agencyNo;
      
      if (!agencyNo) {
        console.error('❌ [채팅] 에이전시 정보가 없습니다.');
        set({ chatRooms: [], isChatOpen: true, viewMode: 'list' });
        return;
      }

      set({ isChatOpen: true, viewMode: 'list', isLoading: true, isLoadingChatList: true });
      
      try {
        // 1. 먼저 채팅방 목록을 빠르게 조회하여 UI 표시 (느린 렌더링 해결)
        const response = await chatService.getChatRoomsByAgency(agencyNo, 'all');
        const data = response?.data || response;

        // 배열인지 확인하고 설정
        if (Array.isArray(data)) {
          // 메모이제이션된 값들 계산
          const currentHash = get()._calculateChatRoomsHash(data);
          const totalUnreadCount = data.reduce((total, room) => total + (room.unreadCount || 0), 0);
          
          set({ 
            chatRooms: data,
            lastRefreshTime: Date.now(),
            _memoizedTotalUnreadCount: totalUnreadCount,
            _lastChatRoomsHash: currentHash,
            isLoading: false,
            isLoadingChatList: false
          });
          
          // 전역 메시지 리스너 초기화 (채팅방 목록 로드 후)
          get().initializeGlobalMessageListener();
          
          // 2. 백그라운드에서 채팅방 자동 생성 (UI 블로킹 없이, 비동기 처리)
          // 느린 렌더링 해결을 위해 Promise를 기다리지 않고 백그라운드에서 실행
          chatService.ensureChatRooms()
            .then(async () => {
              // 생성 후 목록 다시 조회 (조용히)
              const updatedResponse = await chatService.getChatRoomsByAgency(agencyNo, 'all');
              const updatedData = updatedResponse?.data || updatedResponse;
              
              if (Array.isArray(updatedData)) {
                const newHash = get()._calculateChatRoomsHash(updatedData);
                const newTotalUnreadCount = updatedData.reduce((total, room) => total + (room.unreadCount || 0), 0);
                
                set({ 
                  chatRooms: updatedData,
                  lastRefreshTime: Date.now(),
                  _memoizedTotalUnreadCount: newTotalUnreadCount,
                  _lastChatRoomsHash: newHash
                });
              }
            })
            .catch(error => {
              console.error('❌ [채팅] 백그라운드 채팅방 생성 실패:', error);
            });
          
        } else {
          console.warn('⚠️ [채팅] 채팅방 목록이 배열이 아닙니다:', data);
          set({ chatRooms: [], _memoizedTotalUnreadCount: 0, _lastChatRoomsHash: null });
        }
      } catch (error) {
        console.error("❌ [채팅] 채팅 목록 로드 실패:", error);
        set({ chatRooms: [], _memoizedTotalUnreadCount: 0, _lastChatRoomsHash: null });
      } finally {
        set({ isLoading: false, isLoadingChatList: false });
        
        // 성능 기록
        const duration = performance.now() - startTime;
        chatPerformanceMonitor.recordRenderTime('openChatList_api', duration);
      }
    },

    // [대화방 입장] 목록에서 특정 방 클릭 시 호출 (chatRoomNo를 통해 chatMember로 조회)
    openChatDetail: async (room) => {
      // 룸 ID 추출 (chatRoomNo 필드명 사용)
      const roomId = room.chatRoomNo || room.roomId || room.roomNo || room.id;

      if (!roomId) {
        console.error('❌ [채팅스토어] 유효하지 않은 방 ID:', room);
        return;
      }

      // 이미 같은 방을 보고 있다면 중복 처리 방지
      const { selectedChat } = get();

      if (selectedChat?.chatRoomNo === roomId) {
        set({ viewMode: 'detail' });
        return;
      }

      set({ isChatOpen: true, viewMode: 'detail', selectedChat: room, isLoading: true });

      try {
        // 메시지 로드는 ChatModal에서 처리하므로 여기서는 상태만 설정
        // 필요시 미리 로드할 수도 있지만, 현재는 ChatModal에서 처리
      } catch (error) {
        console.error("❌ [채팅스토어] 채팅방 입장 실패:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    // [메시지 전송] (최적화된 버전)
    sendNewMessage: async (text) => {
      const { selectedChat } = get();
      const roomId = selectedChat?.chatRoomNo || selectedChat?.roomId || selectedChat?.roomNo || selectedChat?.id;

      if (!roomId || !text.trim()) return;

      try {
        // WebSocket을 통한 메시지 전송은 websocketService에서 처리
        // 메시지 전송 후 채팅방 목록 새로고침 (debounce 적용)
        debounce('refreshAfterSend', () => {
          get().refreshChatRooms();
        }, 1000);
      } catch (error) {
        console.error("❌ [채팅] 메시지 전송 실패:", error);
      }
    },

    // 총 읽지 않은 메시지 개수 계산 (메모이제이션 강화)
    getTotalUnreadCount: () => {
      const { chatRooms, _memoizedTotalUnreadCount, _lastChatRoomsHash } = get();
      
      // 채팅방 목록이 변경되지 않았으면 캐시된 값 반환
      const currentHash = get()._calculateChatRoomsHash(chatRooms);
      if (currentHash === _lastChatRoomsHash && _memoizedTotalUnreadCount !== undefined) {
        return _memoizedTotalUnreadCount;
      }
      
      // 변경되었으면 다시 계산하고 캐시
      const totalCount = chatRooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
      set({ 
        _memoizedTotalUnreadCount: totalCount,
        _lastChatRoomsHash: currentHash
      });
      
      return totalCount;
    },

    // 채팅방 목록 새로고침 (캐싱 비활성화)
    refreshChatRooms: async (force = false) => {
      const { user } = useAuthStore.getState();
      const agencyNo = user?.agencyNo;
      
      if (!agencyNo) {
        console.error('❌ [채팅] 에이전시 정보가 없습니다.');
        return;
      }

      // 강제 새로고침이 아니고 최근에 새로고침했다면 스킵 (1초 이내)
      const { lastRefreshTime } = get();
      const now = Date.now();
      if (!force && lastRefreshTime && (now - lastRefreshTime) < 1000) {
        return;
      }

      try {
        // 캐시 사용하지 않고 항상 최신 데이터 조회
        const response = await chatService.getChatRoomsByAgency(agencyNo, 'all');
        const data = response?.data || response;

        if (Array.isArray(data)) {
          // 메모이제이션된 값들 계산
          const currentHash = get()._calculateChatRoomsHash(data);
          const totalUnreadCount = data.reduce((total, room) => total + (room.unreadCount || 0), 0);
          
          set({ 
            chatRooms: data,
            lastRefreshTime: now,
            _memoizedTotalUnreadCount: totalUnreadCount,
            _lastChatRoomsHash: currentHash
          });
          
          // 전역 메시지 리스너 초기화 (새로고침 후에도)
          get().initializeGlobalMessageListener();
        }
      } catch (error) {
        console.error("❌ [채팅] 채팅방 목록 새로고침 실패:", error);
      }
    },

    // 특정 채팅방의 unread count 업데이트 (최적화된 버전)
    updateChatRoomUnreadCount: (chatRoomNo, unreadCount) => {
      set((state) => {
        // 변경이 필요한지 먼저 확인
        const targetRoom = state.chatRooms.find(room => room.chatRoomNo === chatRoomNo);
        if (!targetRoom || targetRoom.unreadCount === unreadCount) {
          return state; // 변경이 없으면 기존 상태 반환
        }

        // 변경이 필요한 경우에만 새 배열 생성
        const newChatRooms = state.chatRooms.map(room => 
          room.chatRoomNo === chatRoomNo 
            ? { ...room, unreadCount } 
            : room
        );
        
        // 메모이제이션된 값들도 업데이트
        const currentHash = state._calculateChatRoomsHash(newChatRooms);
        const totalUnreadCount = newChatRooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
        
        return {
          chatRooms: newChatRooms,
          _memoizedTotalUnreadCount: totalUnreadCount,
          _lastChatRoomsHash: currentHash
        };
      });
    },

    // 모달 닫기 (리소스 정리 강화)
    closeChat: () => {
      // 전역 메시지 리스너 정리
      get().cleanupGlobalMessageListener();
      
      // 모든 debounce 타이머 정리
      debounceTimers.forEach((timer, key) => {
        clearTimeout(timer);
      });
      debounceTimers.clear();
      
      // 진행 중인 API 요청 캐시 정리
      requestCache.clear();
      
      set({ isChatOpen: false, viewMode: 'list', selectedChat: null });
    },

    // 상세에서 목록으로 돌아가기
    backToList: () => {
      set({ viewMode: 'list', selectedChat: null });
      // 돌아갈 때는 목록을 다시 로드하지 않음 (이미 로드된 상태 유지)
    },

    // 캐시 정리 함수 (메모리 관리)
    clearCache: () => {
      cache.clear();
      debounceTimers.forEach((timer) => clearTimeout(timer));
      debounceTimers.clear();
      requestCache.clear();
      set({ 
        _memoizedTotalUnreadCount: 0,
        _lastChatRoomsHash: null
      });
    },

    // 강제 캐시 무효화 및 새로고침 (디버깅용)
    forceClearAndRefresh: async () => {
      console.log('🔄 [채팅] 강제 캐시 무효화 및 새로고침 시작...');
      
      // 1. chatService 캐시 무효화
      chatService.clearCache();
      console.log('✅ chatService 캐시 삭제');
      
      // 2. chatStore 캐시 무효화
      get().clearCache();
      console.log('✅ chatStore 캐시 삭제');
      
      // 3. 상태 초기화
      set({ 
        chatRooms: [],
        lastRefreshTime: 0,
        _memoizedTotalUnreadCount: 0,
        _lastChatRoomsHash: null
      });
      console.log('✅ 상태 초기화');
      
      // 4. 강제 새로고침
      await get().refreshChatRooms(true);
      console.log('✅ 채팅방 목록 강제 새로고침 완료');
    },
  }))
);

export default useChatStore;