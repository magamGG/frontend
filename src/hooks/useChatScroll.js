import { useRef, useCallback, useEffect } from 'react';
import { chatService } from '@/api/services';

/**
 * 채팅 스크롤 관리 커스텀 훅
 * - 무한 스크롤 (이전 메시지 로드)
 * - 읽음 처리 (스크롤 위치 기반)
 * - 스크롤 위치 복원 (새 메시지 로드 시)
 */
export const useChatScroll = ({
  currentChatRoomNo,
  messages,
  currentPage,
  hasMoreMessages,
  isLoadingMore,
  isDataReady,
  refreshChatRooms,
  setMessages,
  setCurrentPage,
  setHasMoreMessages,
  setIsLoadingMore
}) => {
  // Refs
  const bottomRef = useRef(null);
  const chatBodyRef = useRef(null);
  const topRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const lastReadUpdateRef = useRef(null);
  const lastReadMessageRef = useRef(null);

  // debounce된 읽음 처리 함수
  const debouncedUpdateLastRead = useCallback((chatRoomNo, lastChatNo) => {
    // 이미 더 큰 번호로 읽음 처리가 진행 중이면 스킵
    if (lastReadUpdateRef.current && lastReadUpdateRef.current >= lastChatNo) {
      return;
    }
    
    // 현재 처리 중인 메시지 번호 업데이트
    lastReadUpdateRef.current = lastChatNo;
    
    // 기존 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // 새 타이머 설정 (1초 후 실행)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // 현재 메시지 목록에서 실제 최신 메시지 확인 (임시 메시지 제외)
        if (messages.length > 0) {
          // 임시 메시지가 아닌 실제 메시지들만 필터링하고 숫자인 chatNo만 추출
          const realMessages = messages.filter(msg => !msg.isTemp && typeof msg.chatNo === 'number');
          
          if (realMessages.length > 0) {
            // 실제 메시지 중 가장 큰 chatNo 찾기
            const maxChatNo = Math.max(...realMessages.map(msg => msg.chatNo));
            // 전달받은 lastChatNo와 실제 최대 chatNo 중 더 큰 값 사용
            const finalChatNo = Math.max(lastChatNo, maxChatNo);
            
            await chatService.updateLastReadMessage(chatRoomNo, finalChatNo);
          } else {
            // 실제 메시지가 없으면 전달받은 값 그대로 사용
            await chatService.updateLastReadMessage(chatRoomNo, lastChatNo);
          }
        } else {
          await chatService.updateLastReadMessage(chatRoomNo, lastChatNo);
        }
        
        // 채팅방 목록 새로고침 (서버에서 최신 unread count 가져오기)
        setTimeout(() => {
          refreshChatRooms();
        }, 500);
        
      } catch (error) {
        console.error('❌ [읽음처리] 실패:', error);
      } finally {
        // 처리 완료 후 참조 초기화
        lastReadUpdateRef.current = null;
      }
    }, 1000);
  }, [messages, refreshChatRooms]);

  // 추가 메시지 로드 함수 (무한 스크롤)
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMoreMessages || !currentChatRoomNo) {
      return;
    }
    setIsLoadingMore(true);
    
    // 현재 스크롤 위치와 높이 저장
    let chatBody = chatBodyRef.current;
    if (!chatBody) {
      chatBody = document.querySelector('[data-chat-body]');
    }
    
    if (!chatBody) {
      setIsLoadingMore(false);
      return;
    }
    
    const scrollTopBefore = chatBody.scrollTop;
    const scrollHeightBefore = chatBody.scrollHeight;
    
    // 현재 화면에 보이는 메시지들의 ID를 저장 (더 정확한 기준점)
    const messageElements = chatBody.querySelectorAll('[data-message-id]');
    const visibleMessages = [];
    
    // 현재 뷰포트에 보이는 메시지들 찾기
    for (let element of messageElements) {
      const rect = element.getBoundingClientRect();
      const chatBodyRect = chatBody.getBoundingClientRect();
      
      // 채팅 바디 영역 내에 보이는 메시지들
      if (rect.top >= chatBodyRect.top && rect.top <= chatBodyRect.bottom) {
        visibleMessages.push({
          id: element.getAttribute('data-message-id'),
          element: element,
          offsetTop: element.offsetTop,
          distanceFromTop: rect.top - chatBodyRect.top
        });
      }
    }
    
    // 가장 위쪽에 보이는 메시지를 기준점으로 사용
    const referenceMessage = visibleMessages.length > 0 ? visibleMessages[0] : null;
    
    try {
      const nextPage = currentPage + 1;
      const res = await chatService.getChatMessages(currentChatRoomNo, nextPage, 20);
      const messageData = res.data || res;
      let newMessages = [];
      if (Array.isArray(messageData)) {
        // 유효한 메시지만 필터링
        const validMessages = messageData.filter(msg => 
          msg && (msg.chatNo || msg.chatNo === 0) && msg.chatMessage
        );
        newMessages = [...validMessages].reverse();
      } else if (messageData?.content && Array.isArray(messageData.content)) {
        // 유효한 메시지만 필터링
        const validMessages = messageData.content.filter(msg => 
          msg && (msg.chatNo || msg.chatNo === 0) && msg.chatMessage
        );
        newMessages = [...validMessages].reverse();
        setHasMoreMessages(!messageData.last && messageData.content.length > 0);
      }
      
      if (newMessages.length > 0) {
        // 기존 메시지 앞에 새 메시지들 추가 (강화된 중복 제거)
        setMessages(prev => {
          // 기존 메시지의 chatNo 집합 (임시 메시지 제외)
          const existingChatNos = new Set(
            prev.filter(msg => msg.chatNo && !msg.isTemp).map(msg => msg.chatNo)
          );
          
          // 새 메시지 중 중복되지 않는 것만 필터링
          const uniqueNewMessages = newMessages.filter(msg => 
            msg.chatNo && !existingChatNos.has(msg.chatNo)
          );
          return [...uniqueNewMessages, ...prev];
        });
        
        setCurrentPage(nextPage);
        
        const adjustScroll = (attempts = 0) => {
          if (attempts > 3) {
            return;
          }
          
          // requestAnimationFrame을 사용하여 부드러운 조정
          requestAnimationFrame(() => {
            if (referenceMessage) {
              // 기준점 메시지를 다시 찾기
              const newReferenceElement = chatBody.querySelector(`[data-message-id="${referenceMessage.id}"]`);
              
              if (newReferenceElement) {
                const newOffsetTop = newReferenceElement.offsetTop;
                const targetScrollTop = newOffsetTop - referenceMessage.distanceFromTop;
                const currentScroll = chatBody.scrollTop;
                const scrollDiff = Math.abs(currentScroll - targetScrollTop);
                
                if (scrollDiff > 5) {
                  // 부드러운 스크롤 조정 (큰 차이가 있을 때만)
                  const smoothScroll = (start, target, duration = 100) => {
                    const startTime = performance.now();
                    
                    const animate = (currentTime) => {
                      const elapsed = currentTime - startTime;
                      const progress = Math.min(elapsed / duration, 1);
                      
                      // easeOutQuart 함수로 부드러운 애니메이션
                      const easeProgress = 1 - Math.pow(1 - progress, 4);
                      const currentPosition = start + (target - start) * easeProgress;
                      
                      chatBody.scrollTop = currentPosition;
                      
                      if (progress < 1) {
                        requestAnimationFrame(animate);
                      }
                    };
                    
                    requestAnimationFrame(animate);
                  };
                  
                  smoothScroll(currentScroll, targetScrollTop);
                }
              } else {
                setTimeout(() => adjustScroll(attempts + 1), 50);
                setTimeout(() => adjustScroll(attempts + 1), 50);
              }
            } else {
              const scrollHeightAfter = chatBody.scrollHeight;
              const heightDifference = scrollHeightAfter - scrollHeightBefore;
              const newScrollTop = scrollTopBefore + heightDifference;
              const currentScroll = chatBody.scrollTop;
              const scrollDiff = Math.abs(currentScroll - newScrollTop);
              
              if (scrollDiff > 5) {
                chatBody.style.scrollBehavior = 'smooth';
                chatBody.scrollTop = newScrollTop;
                setTimeout(() => {
                  chatBody.style.scrollBehavior = 'auto';
                }, 200);
              }
            }
          });
        };
        
        adjustScroll();
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('❌ [무한스크롤] API 호출 실패:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreMessages, currentChatRoomNo, currentPage, setIsLoadingMore, setMessages, setCurrentPage, setHasMoreMessages]);

  // 스크롤 이벤트 처리 (읽음 처리 + 무한 스크롤)
  const handleScroll = useCallback(() => {
    let chatBody = chatBodyRef.current;
    if (!chatBody) {
      chatBody = document.querySelector('[data-chat-body]');
    }
    
    if (!chatBody || !currentChatRoomNo) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatBody;
    
    // 1. 읽음 처리
    const isNearBottom = scrollTop + clientHeight >= scrollHeight * 0.9;
    if (isNearBottom && messages.length > 0) {
      const realMessages = messages.filter(msg => !msg.isTemp && typeof msg.chatNo === 'number');
      if (realMessages.length > 0) {
        const lastMessage = realMessages[realMessages.length - 1];
        debouncedUpdateLastRead(currentChatRoomNo, lastMessage.chatNo);
      }
    }
    
    // 2. 무한 스크롤 (더 부드러운 트리거)
    const isNearTop = scrollTop <= 300; // 500에서 300으로 줄여서 더 빨리 로드
    if (isNearTop && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }
  }, [currentChatRoomNo, messages, debouncedUpdateLastRead, hasMoreMessages, isLoadingMore, loadMoreMessages]);

  // debounced scroll handler (더 부드러운 응답)
  const debouncedHandleScroll = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(handleScroll, 16); // 60fps에 맞춰 16ms로 더 부드럽게
  }, [handleScroll]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    if (!isDataReady) return;
    
    let chatBody = chatBodyRef.current || document.querySelector('[data-chat-body]');
    if (chatBody) {
      chatBody.addEventListener('scroll', debouncedHandleScroll);
      return () => chatBody.removeEventListener('scroll', debouncedHandleScroll);
    }
  }, [isDataReady, debouncedHandleScroll]);

  // 맨 아래로 스크롤하는 함수
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, []);

  // 특정 메시지로 스크롤하는 함수
  const scrollToMessage = useCallback((messageRef, behavior = 'instant', block = 'center') => {
    if (messageRef && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior, block });
    }
  }, []);

  // 정리 함수
  const cleanup = useCallback(() => {
    // 모든 타이머 정리
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // 읽음 처리 참조 초기화
    lastReadUpdateRef.current = null;
    lastReadMessageRef.current = null;
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    // Refs
    bottomRef,
    chatBodyRef,
    topRef,
    lastReadMessageRef,
    
    // Functions
    debouncedUpdateLastRead,
    loadMoreMessages,
    scrollToBottom,
    scrollToMessage,
    cleanup
  };
};