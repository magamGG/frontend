import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import * as S from './ChatModal.styled';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import { chatService } from '@/api/services';
import websocketService from '@/services/websocketService';

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
    updateChatRoomUnreadCount,
    refreshChatRooms,
  } = useChatStore();

  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const subscriptionRef = useRef(null);

  // 마지막 읽은 메시지 업데이트 함수
  const updateLastReadMessage = async (chatRoomNo, lastChatNo) => {
    try {
      console.log('🔍 [DEBUG] 마지막 읽은 메시지 업데이트 시도:', { chatRoomNo, lastChatNo });
      console.log('🔍 [DEBUG] 현재 사용자:', user?.memberNo, user?.memberName);
      
      // 현재 메시지 목록에서 실제 최신 메시지 확인
      console.log('🔍 [DEBUG] 현재 messages 상태:', messages.length, '개');
      if (messages.length > 0) {
        const actualLastMessage = messages[messages.length - 1];
        console.log('🔍 [DEBUG] 실제 화면의 마지막 메시지:', actualLastMessage.chatNo, actualLastMessage.chatMessage);
        
        // 전달받은 lastChatNo와 실제 마지막 메시지가 다르면 실제 마지막 메시지로 업데이트
        const finalChatNo = Math.max(lastChatNo, actualLastMessage.chatNo);
        console.log('🔍 [DEBUG] 최종 업데이트할 chatNo:', finalChatNo);
        
        const response = await chatService.updateLastReadMessage(chatRoomNo, finalChatNo);
        console.log('✅ [DEBUG] 마지막 읽은 메시지 업데이트 API 응답:', response);
        console.log('✅ [DEBUG] 마지막 읽은 메시지 업데이트 완료:', { chatRoomNo, finalChatNo });
        
        // unread count를 0으로 업데이트
        updateChatRoomUnreadCount(chatRoomNo, 0);
        console.log('✅ [DEBUG] unread count 0으로 업데이트 완료');
        
        // 채팅방 목록 새로고침 (서버에서 최신 unread count 가져오기)
        setTimeout(() => {
          console.log('🔄 [DEBUG] 채팅방 목록 새로고침 시작');
          refreshChatRooms();
        }, 500);
        
        // 잠시 후 실제 unread count 다시 확인
        setTimeout(async () => {
          try {
            const unreadResponse = await chatService.getUnreadCount(chatRoomNo);
            const actualUnreadCount = unreadResponse.data || unreadResponse;
            console.log('🔍 [DEBUG] 업데이트 후 실제 unread count 확인:', actualUnreadCount);
            
            if (actualUnreadCount !== 0) {
              console.warn('⚠️ [DEBUG] unread count가 0이 아님! 실제값으로 업데이트:', actualUnreadCount);
              updateChatRoomUnreadCount(chatRoomNo, actualUnreadCount);
            }
          } catch (error) {
            console.error('❌ [DEBUG] unread count 재확인 실패:', error);
          }
        }, 1000); // 1초 후 확인
      } else {
        console.warn('⚠️ [DEBUG] messages가 비어있음, 전달받은 값으로 업데이트');
        const response = await chatService.updateLastReadMessage(chatRoomNo, lastChatNo);
        console.log('✅ [DEBUG] 마지막 읽은 메시지 업데이트 완료:', { chatRoomNo, lastChatNo });
        updateChatRoomUnreadCount(chatRoomNo, 0);
      }
      
    } catch (error) {
      console.error('❌ [DEBUG] 마지막 읽은 메시지 업데이트 실패:', error);
      console.error('❌ [DEBUG] 에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
  };

  // 모달이 닫히거나 목록으로 돌아갈 때 messages 초기화
  useEffect(() => {
    if (!isChatOpen || viewMode === 'list') {
      console.log('🔵 [채팅모달] messages 초기화');
      setMessages([]);
      
      // WebSocket 구독 해제
      if (subscriptionRef.current && selectedChat?.chatRoomNo) {
        console.log('🔵 [WebSocket] 채팅방 구독 해제:', selectedChat.chatRoomNo);
        websocketService.unsubscribeFromRoom(selectedChat.chatRoomNo);
        subscriptionRef.current = null;
      }
    }
  }, [isChatOpen, viewMode, selectedChat?.chatRoomNo]);

  /* ===============================
     0️⃣ 채팅 모달이 열릴 때 WebSocket 연결
  =============================== */
  useEffect(() => {
    console.log('🔍 [DEBUG] 채팅 모달 useEffect 실행:', { isChatOpen });
    
    if (isChatOpen) {
      console.log('🔵 [WebSocket] 채팅 모달 열림, WebSocket 연결 시도');
      
      const connectWebSocket = async () => {
        try {
          console.log('🔍 [DEBUG] connectWebSocket 함수 시작');
          console.log('🔍 [DEBUG] 현재 연결 상태:', websocketService.isConnected());
          
          if (!websocketService.isConnected()) {
            console.log('🔍 [DEBUG] WebSocket 연결되지 않음, 연결 시도');
            await websocketService.connect();
            console.log('✅ [WebSocket] 연결 성공');
          } else {
            console.log('🔍 [DEBUG] WebSocket 이미 연결됨');
          }
        } catch (error) {
          console.error('❌ [WebSocket] 연결 실패:', error);
          console.error('❌ [DEBUG] 에러 상세:', error.message, error.stack);
        }
      };
      
      connectWebSocket();
    } else {
      // 모달이 닫히면 WebSocket 연결 해제
      console.log('🔵 [WebSocket] 채팅 모달 닫힘, WebSocket 연결 해제');
      websocketService.disconnect();
    }
  }, [isChatOpen]);

  /* ===============================
     1️⃣ 채팅 모달이 열릴 때 채팅방 목록 로드
  =============================== */
  useEffect(() => {
    console.log('🔵 [채팅모달] useEffect 실행:', { isChatOpen, viewMode });
    if (isChatOpen && viewMode === 'list') {
      console.log('🔵 [채팅모달] openChatList 호출');
      openChatList();
    }
  }, [isChatOpen]); // viewMode 의존성 제거 - viewMode 변경으로 인한 중복 실행 방지

  /* ===============================
     2️⃣ 채팅방 입장 시 메시지 불러오기 + WebSocket 구독
  =============================== */
  useEffect(() => {
    console.log('🔵 [메시지로드] useEffect 실행:', { 
      selectedChat, 
      chatRoomNo: selectedChat?.chatRoomNo,
      viewMode 
    });
    
    if (!selectedChat?.chatRoomNo) {
      console.log('🔵 [메시지로드] selectedChat 없음, 종료');
      return;
    }

    if (viewMode !== 'detail') {
      console.log('🔵 [메시지로드] viewMode가 detail이 아님, 종료:', viewMode);
      return;
    }

    const fetchMessages = async () => {
      console.log('🔵 [메시지로드] fetchMessages 시작:', selectedChat.chatRoomNo);
      
      try {
        // 1. 채팅방 입장 (멤버 등록)
        console.log('🔵 [메시지로드] 채팅방 입장 API 호출');
        await chatService.joinChatRoom(selectedChat.chatRoomNo);
        console.log('✅ [메시지로드] 채팅방 입장 완료');

        // 2. 메시지 목록 조회
        console.log('🔵 [메시지로드] 메시지 목록 조회 API 호출');
        const res = await chatService.getChatMessages(selectedChat.chatRoomNo);
        console.log('🔵 [메시지로드] API 응답 전체:', res);
        
        const messageData = res.data || res;
        console.log('🔵 [메시지로드] 처리된 메시지 데이터:', messageData, 'type:', typeof messageData, 'isArray:', Array.isArray(messageData));
        
        // 배열인지 확인하고 설정
        if (Array.isArray(messageData)) {
          console.log('✅ [메시지로드] 메시지 설정:', messageData.length, '개');
          // 백엔드에서 최신순으로 보내므로 순서를 뒤집어서 오래된 메시지가 위로 오도록 함
          const sortedMessages = [...messageData].reverse();
          setMessages(sortedMessages);
          
          // 마지막 메시지가 있으면 읽음 처리 (debounce 적용)
          if (sortedMessages.length > 0) {
            const lastMessage = sortedMessages[sortedMessages.length - 1];
            console.log('🔍 [DEBUG] 배열 응답 - 마지막 메시지로 읽음 처리 예약:', lastMessage.chatNo);
            // debounce 적용
            clearTimeout(window.chatReadTimeout);
            window.chatReadTimeout = setTimeout(() => {
              console.log('🔍 [DEBUG] 배열 응답 - 읽음 처리 실행:', lastMessage.chatNo);
              updateLastReadMessage(selectedChat.chatRoomNo, lastMessage.chatNo);
            }, 1000);
          }
        } else if (messageData?.content && Array.isArray(messageData.content)) {
          // 페이징된 응답인 경우
          console.log('✅ [메시지로드] 페이징된 메시지 설정:', messageData.content.length, '개');
          // 백엔드에서 최신순으로 보내므로 순서를 뒤집어서 오래된 메시지가 위로 오도록 함
          const sortedMessages = [...messageData.content].reverse();
          setMessages(sortedMessages);
          
          // 마지막 메시지가 있으면 읽음 처리 (debounce 적용)
          if (sortedMessages.length > 0) {
            const lastMessage = sortedMessages[sortedMessages.length - 1];
            console.log('🔍 [DEBUG] 페이징 응답 - 마지막 메시지로 읽음 처리 예약:', lastMessage.chatNo);
            // debounce 적용
            clearTimeout(window.chatReadTimeout);
            window.chatReadTimeout = setTimeout(() => {
              console.log('🔍 [DEBUG] 페이징 응답 - 읽음 처리 실행:', lastMessage.chatNo);
              updateLastReadMessage(selectedChat.chatRoomNo, lastMessage.chatNo);
            }, 1000);
          }
        } else {
          console.warn('⚠️ [메시지로드] 메시지 데이터가 배열이 아님, 빈 배열로 설정');
          console.log('🔍 [DEBUG] messageData 구조:', messageData);
          setMessages([]);
        }
      } catch (err) {
        console.error('❌ [메시지로드] 메시지 불러오기 실패:', err);
        console.error('❌ [DEBUG] 에러 상세:', err.response?.data, err.message);
        setMessages([]); // 에러 시 빈 배열로 초기화
      }
    };

    const subscribeToRoom = () => {
      if (!websocketService.isConnected()) {
        console.warn('⚠️ [WebSocket] 연결되지 않음, 구독 불가');
        return;
      }

      // 기존 구독 해제
      if (subscriptionRef.current) {
        console.log('🔵 [WebSocket] 기존 구독 해제');
        websocketService.unsubscribeFromRoom(selectedChat.chatRoomNo);
      }

      // 새 채팅방 구독
      console.log('🔵 [WebSocket] 채팅방 구독 시작:', selectedChat.chatRoomNo);
      try {
        subscriptionRef.current = websocketService.subscribeToRoom(
          selectedChat.chatRoomNo,
          (newMessage) => {
          console.log('� [WebSocket] 실시간 메시지 수신:', newMessage);
          console.log('� [DEBUG] 메시지 구조:', {
            chatNo: newMessage.chatNo,
            senderName: newMessage.senderName,
            chatMessage: newMessage.chatMessage,
            createdAt: newMessage.createdAt,
            memberNo: newMessage.memberNo
          });
          
          // 실시간 메시지를 messages 상태에 추가
          setMessages((prev) => {
            console.log('🔍 [DEBUG] 이전 메시지들:', prev);
            if (!Array.isArray(prev)) {
              console.warn('⚠️ [WebSocket] prev가 배열이 아님, 새 메시지로 초기화');
              return [newMessage];
            }
            
            // 1. 중복 메시지 방지 (같은 chatNo가 이미 있는지 확인)
            const isDuplicate = prev.some(msg => msg.chatNo === newMessage.chatNo && !msg.isTemp);
            if (isDuplicate) {
              console.log('🔍 [DEBUG] 중복 메시지 무시:', newMessage.chatNo);
              return prev;
            }
            
            // 2. 임시 메시지 제거 (같은 내용의 임시 메시지가 있다면 제거)
            const filteredMessages = prev.filter(msg => {
              if (msg.isTemp && 
                  msg.chatMessage === newMessage.chatMessage && 
                  msg.memberNo === newMessage.memberNo) {
                console.log('🔍 [DEBUG] 임시 메시지 제거:', msg.chatNo);
                return false;
              }
              return true;
            });
            
            // 3. 새 메시지를 맨 뒤에 추가 (최신 메시지는 아래쪽에)
            const updatedMessages = [...filteredMessages, newMessage];
            
            console.log('🔍 [DEBUG] 업데이트된 메시지들:', updatedMessages);
            
            // 새 메시지를 읽음 처리 (debounce 적용)
            if (newMessage.chatNo) {
              console.log('🔍 [DEBUG] 새 메시지 읽음 처리 예약:', newMessage.chatNo);
              // 즉시 처리하지 말고 debounce 적용 (500ms 후 마지막 메시지로 처리)
              clearTimeout(window.chatReadTimeout);
              window.chatReadTimeout = setTimeout(() => {
                console.log('🔍 [DEBUG] 새 메시지 읽음 처리 실행:', newMessage.chatNo);
                updateLastReadMessage(selectedChat.chatRoomNo, newMessage.chatNo);
              }, 500);
            }
            
            return updatedMessages;
          });
        }
      );
      
      if (subscriptionRef.current) {
        console.log('✅ [WebSocket] 채팅방 구독 완료');
      } else {
        console.error('❌ [WebSocket] 채팅방 구독 실패 - null 반환');
      }
    } catch (error) {
      console.error('❌ [WebSocket] 채팅방 구독 실패:', error);
    }
    };

    // 메시지 로드 후 WebSocket 구독 (연결 상태 확인 후)
    fetchMessages().then(() => {
      // WebSocket 연결이 완료될 때까지 기다린 후 구독
      const waitForConnection = () => {
        if (websocketService.isConnected()) {
          subscribeToRoom();
        } else {
          console.log('🔍 [DEBUG] WebSocket 연결 대기 중...');
          setTimeout(waitForConnection, 500); // 0.5초 후 다시 확인
        }
      };
      
      waitForConnection();
    });

    // cleanup: 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (subscriptionRef.current && selectedChat?.chatRoomNo) {
        console.log('� [WebSocket] cleanup - 구독 해제:', selectedChat.chatRoomNo);
        websocketService.unsubscribeFromRoom(selectedChat.chatRoomNo);
        subscriptionRef.current = null;
      }
    };
  }, [selectedChat, viewMode]);

  /* ===============================
     3️⃣ 메시지 전송 (WebSocket)
  =============================== */
  const handleSend = async () => {
    console.log('🔵 [메시지전송] handleSend 시작:', { message: message.trim() });
    
    if (!message.trim()) {
      console.log('🔍 [DEBUG] 메시지가 비어있음, 전송 중단');
      return;
    }

    const roomId = selectedChat?.chatRoomNo;
    const memberNo = user?.memberNo;
    
    console.log('🔵 [메시지전송] 전송 정보:', { roomId, memberNo, selectedChat, user });
    console.log('🔍 [DEBUG] WebSocket 연결 상태 확인:', websocketService.isConnected());
    
    if (!roomId) {
      console.error('❌ [메시지전송] roomId 없음');
      return;
    }

    if (!memberNo) {
      console.error('❌ [메시지전송] memberNo 없음');
      return;
    }

    if (!websocketService.isConnected()) {
      console.error('❌ [메시지전송] WebSocket 연결되지 않음');
      console.log('🔍 [DEBUG] 재연결 시도');
      
      try {
        await websocketService.connect();
        console.log('✅ [DEBUG] 재연결 성공');
      } catch (error) {
        console.error('❌ [DEBUG] 재연결 실패:', error);
        return;
      }
    }

    const messageText = message.trim();
    setMessage(''); // 입력창 즉시 클리어

    try {
      // WebSocket으로 메시지 전송
      console.log('🔵 [메시지전송] WebSocket 메시지 전송 시도');
      console.log('🔍 [DEBUG] 전송할 데이터:', { roomId, memberNo, messageText });
      
      // Optimistic update: 메시지를 즉시 UI에 추가
      const tempMessage = {
        chatNo: `temp_${Date.now()}`, // 임시 ID (문자열로 구분)
        chatRoomNo: roomId,
        memberNo: memberNo,
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
      
      console.log('🔍 [DEBUG] Optimistic update 메시지:', tempMessage);
      
      setMessages((prev) => {
        if (!Array.isArray(prev)) {
          return [tempMessage];
        }
        return [...prev, tempMessage];
      });
      
      const success = websocketService.sendMessage(roomId, memberNo, messageText);
      
      if (success) {
        console.log('✅ [메시지전송] WebSocket 메시지 전송 성공');
      } else {
        console.error('❌ [메시지전송] WebSocket 메시지 전송 실패');
        // 실패 시 입력창에 메시지 복원하고 임시 메시지 제거
        setMessage(messageText);
        setMessages((prev) => prev.filter(msg => msg.chatNo !== tempMessage.chatNo));
      }
    } catch (error) {
      console.error('❌ [메시지전송] 메시지 전송 실패:', error);
      console.error('❌ [DEBUG] 에러 상세:', error.message, error.stack);
      // 실패 시 입력창에 메시지 복원하고 임시 메시지 제거
      setMessage(messageText);
      setMessages((prev) => prev.filter(msg => msg.chatNo !== tempMessage.chatNo));
    }
  };

  /* ===============================
     4️⃣ 메시지 추가될 때 자동 스크롤
  =============================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
                  {(() => {
                    console.log('🔵 [채팅모달] 채팅방 목록 렌더링:', { 
                      chatRoomsLength: chatRooms.length, 
                      chatRooms: chatRooms 
                    });
                    // unreadCount 디버깅
                    chatRooms.forEach(room => {
                      console.log(`🔍 [DEBUG] 채팅방 ${room.chatRoomNo} (${room.chatRoomName}) unreadCount: ${room.unreadCount}`);
                    });
                    return null;
                  })()}
                  {chatRooms.length > 0 ? (
                    chatRooms.map((room) => (
                      <S.ChatItem
                        key={room.chatRoomNo}
                        onClick={() => openChatDetail(room)}
                      >
                        <div style={{ flex: 1 }}>
                          <S.PartnerName>
                            {room.chatRoomType === 'PROJECT' && '📋 '}
                            {room.chatRoomType === 'ALL' && '🏢 '}
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
                      {/* 상대방 메시지일 때만 이름 표시 */}
                      {msg.memberNo !== user?.memberNo && (
                        <S.SenderName>
                          {msg.senderName}
                        </S.SenderName>
                      )}
                      <S.Bubble $isMe={msg.memberNo === user?.memberNo}>
                        {msg.chatMessage}
                      </S.Bubble>
                      <S.MessageTime>
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