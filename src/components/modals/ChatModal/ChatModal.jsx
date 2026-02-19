import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import * as S from './ChatModal.styled';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import { chatService } from '@/api/services';
import websocketService from '@/services/websocketService';
import chatPerformanceMonitor from '@/utils/chatPerformanceMonitor';

export function ChatModal() {
  const {
    isChatOpen,
    viewMode,
    selectedChat,
    chatRooms,
    closeChat,
    backToList,
    openChatDetail,
    openChatList,
    refreshChatRooms,
  } = useChatStore();

  const { user } = useAuthStore();
  
  // 로컬 상태
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  // Refs
  const bottomRef = useRef(null);
  const subscriptionRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const lastReadUpdateRef = useRef(null); // 마지막 읽음 처리 메시지 번호 추적

  // 메모이제이션된 값들
  const currentChatRoomNo = useMemo(() => selectedChat?.chatRoomNo, [selectedChat?.chatRoomNo]);
  const currentMemberNo = useMemo(() => user?.memberNo, [user?.memberNo]);
  const isDetailView = useMemo(() => viewMode === 'detail', [viewMode]);
  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  // debounce된 읽음 처리 함수 (useCallback으로 최적화)
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

  // 정리 함수 (useCallback으로 최적화)
  const cleanup = useCallback(() => {
    // 메시지 상태 초기화
    setMessages([]);
    
    // 읽음 처리 타이머 정리
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // 읽음 처리 참조 초기화
    lastReadUpdateRef.current = null;
    
    // WebSocket 구독 해제
    if (subscriptionRef.current && currentChatRoomNo) {
      websocketService.unsubscribeFromRoom(currentChatRoomNo);
      subscriptionRef.current = null;
    }
  }, [currentChatRoomNo]);

  // 모달이 닫히거나 목록으로 돌아갈 때 정리
  useEffect(() => {
    if (!isChatOpen || viewMode === 'list') {
      cleanup();
    }
  }, [isChatOpen, viewMode, cleanup]);

  // WebSocket 연결 관리 (useCallback으로 최적화)
  const connectWebSocket = useCallback(async () => {
    try {
      if (!websocketService.isConnected() && !websocketService.isConnecting()) {
        await websocketService.connect();
      }
    } catch (error) {
      console.error('❌ [WebSocket] 연결 실패:', error);
    }
  }, []);

  // 채팅 모달이 열릴 때 WebSocket 연결
  useEffect(() => {
    if (isChatOpen) {
      connectWebSocket();
      // 성능 모니터링 시작 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        chatPerformanceMonitor.startAutoMonitoring(30000); // 30초 간격
      }
    } else {
      // 모달이 닫히면 성능 모니터링 중지
      if (process.env.NODE_ENV === 'development') {
        chatPerformanceMonitor.stopAutoMonitoring();
      }
      // 모달이 닫히면 WebSocket 연결 해제 (선택적)
      // websocketService.disconnect();
    }
  }, [isChatOpen, connectWebSocket]);

  // 채팅방 목록 로드 (useCallback으로 최적화)
  const loadChatList = useCallback(() => {
    if (isChatOpen && viewMode === 'list') {
      openChatList();
    }
  }, [isChatOpen, viewMode, openChatList]);

  // 채팅 모달이 열릴 때 채팅방 목록 로드
  useEffect(() => {
    loadChatList();
  }, [loadChatList]);

  /* ===============================
     2️⃣ 채팅방 입장 시 메시지 불러오기 + WebSocket 구독
  =============================== */
  
  // 실시간 메시지 처리 함수 (useCallback으로 최적화)
  const handleNewMessage = useCallback((newMessage) => {
    setMessages((prev) => {
      if (!Array.isArray(prev)) {
        console.warn('⚠️ [WebSocket] prev가 배열이 아님, 새 메시지로 초기화');
        return [newMessage];
      }
      
      // 1. 중복 메시지 방지 (같은 chatNo가 이미 있는지 확인)
      const isDuplicate = prev.some(msg => msg.chatNo === newMessage.chatNo && !msg.isTemp);
      if (isDuplicate) {
        return prev;
      }
      
      // 2. 임시 메시지 제거 (같은 내용의 임시 메시지가 있다면 제거)
      const filteredMessages = prev.filter(msg => {
        if (msg.isTemp && 
            msg.chatMessage === newMessage.chatMessage && 
            msg.memberNo === newMessage.memberNo) {
          return false;
        }
        return true;
      });
      
      // 3. 새 메시지를 맨 뒤에 추가 (최신 메시지는 아래쪽에)
      const updatedMessages = [...filteredMessages, newMessage];
      
      // 새 메시지를 읽음 처리 (debounce 적용)
      if (newMessage.chatNo && currentChatRoomNo) {
        debouncedUpdateLastRead(currentChatRoomNo, newMessage.chatNo);
      }
      
      return updatedMessages;
    });
  }, [currentChatRoomNo, debouncedUpdateLastRead]);

  // 채팅방 입장 시 메시지 불러오기 + WebSocket 구독
  useEffect(() => {
    if (!currentChatRoomNo || !isDetailView) {
      return;
    }

    // 메시지 로드 및 WebSocket 구독을 한 번에 처리
    const initializeChatRoom = async () => {
      try {
        // 1. 채팅방 입장 (멤버 등록)
        await chatService.joinChatRoom(currentChatRoomNo);

        // 2. 메시지 목록 조회
        const res = await chatService.getChatMessages(currentChatRoomNo);
        const messageData = res.data || res;
        
        // 배열인지 확인하고 설정
        if (Array.isArray(messageData)) {
          // 백엔드에서 최신순으로 보내므로 순서를 뒤집어서 오래된 메시지가 위로 오도록 함
          const sortedMessages = [...messageData].reverse();
          setMessages(sortedMessages);
          
          // 채팅방 입장 시에는 자동으로 읽음 처리하지 않음
          // 사용자가 실제로 스크롤해서 메시지를 볼 때만 읽음 처리
          
        } else if (messageData?.content && Array.isArray(messageData.content)) {
          // 페이징된 응답인 경우
          const sortedMessages = [...messageData.content].reverse();
          setMessages(sortedMessages);
          
          // 채팅방 입장 시에는 자동으로 읽음 처리하지 않음
          
        } else {
          setMessages([]);
        }

        // 3. WebSocket 구독 (연결 대기)
        const waitForConnection = () => {
          if (websocketService.isConnected()) {
            // 기존 구독 해제
            if (subscriptionRef.current) {
              websocketService.unsubscribeFromRoom(currentChatRoomNo);
            }

            // 새 채팅방 구독
            try {
              subscriptionRef.current = websocketService.subscribeToRoom(currentChatRoomNo, handleNewMessage);
              
              if (!subscriptionRef.current) {
                console.error('❌ [WebSocket] 채팅방 구독 실패 - null 반환');
              }
            } catch (error) {
              console.error('❌ [WebSocket] 채팅방 구독 실패:', error);
            }
          } else {
            setTimeout(waitForConnection, 500); // 0.5초 후 다시 확인
          }
        };

        waitForConnection();

      } catch (err) {
        console.error('❌ [메시지로드] 메시지 불러오기 실패:', err);
        setMessages([]); // 에러 시 빈 배열로 초기화
      }
    };

    initializeChatRoom();

    // cleanup: 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (subscriptionRef.current && currentChatRoomNo) {
        websocketService.unsubscribeFromRoom(currentChatRoomNo);
        subscriptionRef.current = null;
      }
    };
  }, [currentChatRoomNo, isDetailView]); // fetchMessages, subscribeToRoom 제거

  // 메시지 전송 함수 (useCallback으로 최적화)
  const handleSend = useCallback(async () => {
    if (!message.trim()) {
      return;
    }

    if (!currentChatRoomNo) {
      console.error('❌ [메시지전송] roomId 없음');
      return;
    }

    if (!currentMemberNo) {
      console.error('❌ [메시지전송] memberNo 없음');
      return;
    }

    if (!websocketService.isConnected()) {
      console.error('❌ [메시지전송] WebSocket 연결되지 않음');
      
      try {
        await websocketService.connect();
      } catch (error) {
        console.error('❌ [메시지전송] 재연결 실패:', error);
        return;
      }
    }

    const messageText = message.trim();
    setMessage(''); // 입력창 즉시 클리어

    try {
      // Optimistic update: 메시지를 즉시 UI에 추가
      const tempMessage = {
        chatNo: `temp_${Date.now()}`, // 임시 ID (문자열로 구분)
        chatRoomNo: currentChatRoomNo,
        memberNo: currentMemberNo,
        senderName: user?.memberName || '나',
        chatMessage: messageText,
        chatMessageType: 'TEXT',
        createdAt: new Date().toLocaleTimeString('ko-KR', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        isTemp: true // 임시 메시지 표시
      };
      
      setMessages((prev) => {
        if (!Array.isArray(prev)) {
          return [tempMessage];
        }
        return [...prev, tempMessage];
      });
      
      const success = websocketService.sendMessage(currentChatRoomNo, currentMemberNo, messageText);
      
      if (!success) {
        console.error('❌ [메시지전송] WebSocket 메시지 전송 실패');
        // 실패 시 입력창에 메시지 복원하고 임시 메시지 제거
        setMessage(messageText);
        setMessages((prev) => prev.filter(msg => msg.chatNo !== tempMessage.chatNo));
      }
    } catch (error) {
      console.error('❌ [메시지전송] 메시지 전송 실패:', error);
      // 실패 시 입력창에 메시지 복원하고 임시 메시지 제거
      setMessage(messageText);
      setMessages((prev) => prev.filter(msg => msg.chatNo !== tempMessage.chatNo));
    }
  }, [message, currentChatRoomNo, currentMemberNo, user?.memberName]);

  // 자동 스크롤 및 읽음 처리 (useEffect 최적화)
  useEffect(() => {
    if (hasMessages && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      
      // 스크롤 후 잠시 기다린 다음 읽음 처리 (사용자가 실제로 메시지를 본 것으로 간주)
      setTimeout(() => {
        if (messages.length > 0 && currentChatRoomNo && isDetailView) {
          // 임시 메시지가 아닌 실제 메시지들만 필터링
          const realMessages = messages.filter(msg => !msg.isTemp && typeof msg.chatNo === 'number');
          if (realMessages.length > 0) {
            const lastMessage = realMessages[realMessages.length - 1];
            debouncedUpdateLastRead(currentChatRoomNo, lastMessage.chatNo);
          }
        }
      }, 1000); // 1초 후 읽음 처리 (사용자가 메시지를 읽을 시간 제공)
    }
  }, [messages.length, hasMessages, currentChatRoomNo, isDetailView, messages, debouncedUpdateLastRead]); // messages 배열 길이 변화만 감지

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 타이머 정리
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // 읽음 처리 참조 정리
      lastReadUpdateRef.current = null;
      
      // WebSocket 구독 해제
      if (subscriptionRef.current && currentChatRoomNo) {
        websocketService.unsubscribeFromRoom(currentChatRoomNo);
      }
    };
  }, [currentChatRoomNo]);

  return (
    <AnimatePresence>
      {isChatOpen && (
        <S.ModalOverlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeChat}
        >
          <S.ModalContainer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {viewMode === 'list' ? (
              /* ===============================
                 📌 채팅방 목록 화면
              =============================== */
              <>
                <S.ChatHeader>
                  <S.HeaderInfo>
                    <S.PartnerName>메시지 목록</S.PartnerName>
                  </S.HeaderInfo>
                  <S.CloseIcon onClick={closeChat} />
                </S.ChatHeader>

                <S.ChatBody>
                  {chatRooms.length > 0 ? (
                    chatRooms.map((room) => (
                      <S.ChatItem
                        key={room.chatRoomNo}
                        onClick={() => openChatDetail(room)}
                      >
                        <div style={{ flex: 1 }}>
                          <S.PartnerName>
                            {room.chatRoomName || room.chatRoomTitle || room.partnerName || '채팅방'}
                          </S.PartnerName>
                          <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: '4px 0 0 0' }}>
                            {room.chatRoomType === 'PROJECT' ? '프로젝트 채팅방' : 
                             room.chatRoomType === 'ALL' ? '에이전시 전체 채팅방' : '일반 채팅방'}
                          </p>
                          <p>{room.lastMessage ? (
                            room.lastMessageSenderNo === user?.memberNo 
                              ? `나: ${room.lastMessage}` 
                              : room.lastMessage
                          ) : '대화 없음'}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          {room.lastMessageTime && (
                            <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                              {room.lastMessageTime}
                            </span>
                          )}
                          {room.unreadCount > 0 && (
                            <span style={{
                              backgroundColor: '#ff4444',
                              color: 'white',
                              borderRadius: '10px',
                              padding: '2px 6px',
                              fontSize: '12px',
                              minWidth: '18px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}>
                              {room.unreadCount > 99 ? '99+' : room.unreadCount}
                            </span>
                          )}
                        </div>
                      </S.ChatItem>
                    ))
                  ) : (
                    /* 예시 채팅방 (데이터가 없을 때) */
                    <S.ChatItem
                      onClick={() =>
                        openChatDetail({
                          chatRoomNo: 1,
                          sender: '김철수 편집자',
                        })
                      }
                    >
                      <S.PartnerName>김철수 편집자</S.PartnerName>
                      <p>작가님, 에피소드 42 콘티 확인 부탁드립니다!</p>
                    </S.ChatItem>
                  )}
                </S.ChatBody>
              </>
            ) : (
              /* ===============================
                 💬 실제 채팅 화면
              =============================== */
              <>
                <S.ChatHeader>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <S.IconButton onClick={backToList}>
                      <ChevronLeft size={20} />
                    </S.IconButton>
                    <S.HeaderInfo>
                      <S.PartnerName>
                        {selectedChat?.sender}
                      </S.PartnerName>
                    </S.HeaderInfo>
                  </div>
                  <S.CloseIcon onClick={closeChat} />
                </S.ChatHeader>

                <S.ChatBody>
                  {messages?.map((msg) => (
                    <S.MessageItem
                      key={msg.chatNo}
                      $isMe={msg.memberNo === user?.memberNo}
                    >
                      {/* 상대방 메시지일 때만 이름과 프로필 표시 */}
                      {msg.memberNo !== user?.memberNo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          {/* 프로필 이미지 */}
                          {msg.senderProfile ? (
                            <S.ProfileImage 
                              src={msg.senderProfile} 
                              alt={msg.senderName || '프로필'}
                            />
                          ) : null}
                          <S.DefaultProfile 
                            style={{ display: msg.senderProfile ? 'none' : 'flex' }}
                          >
                            {(msg.senderName || '?')[0]?.toUpperCase()}
                          </S.DefaultProfile>
                          
                          {/* 발신자 이름 */}
                          <S.SenderName>
                            {msg.senderName}
                          </S.SenderName>
                        </div>
                      )}
                      
                      <S.Bubble $isMe={msg.memberNo === user?.memberNo}>
                        {msg.chatMessage}
                      </S.Bubble>
                      <S.MessageTime $isMe={msg.memberNo === user?.memberNo}>
                        {msg.createdAt || new Date(msg.chatMessageCreatedAt || Date.now()).toLocaleTimeString()}
                      </S.MessageTime>
                    </S.MessageItem>
                  ))}
                  <div ref={bottomRef} />
                </S.ChatBody>

                <S.InputContainer>
                  <S.ChatInput
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSend();
                      }
                    }}
                    placeholder="메시지를 입력하세요..."
                  />

                  <S.SendButton
                    onClick={handleSend}
                    type="button"
                  >
                    전송
                  </S.SendButton>
                </S.InputContainer>
              </>
            )}
          </S.ModalContainer>
        </S.ModalOverlay>
      )}
    </AnimatePresence>
  );
}