import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import * as S from './ChatModal.styled';
import useChatStore from '@/store/chatStore';
import { chatService } from '@/api/services';

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
  } = useChatStore();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  /* ===============================
     0️⃣ 채팅 모달이 열릴 때 채팅방 목록 로드
  =============================== */
  useEffect(() => {
    if (isChatOpen && viewMode === 'list') {
      openChatList();
    }
  }, [isChatOpen, viewMode]); // openChatList 의존성 제거로 무한 루프 방지

  /* ===============================
     1️⃣ 채팅방 입장 시 메시지 불러오기
  =============================== */
  useEffect(() => {
    if (!selectedChat?.chatRoomNo) return;

    const fetchMessages = async () => {
      try {
        const res = await chatService.getMessages(
          selectedChat.chatRoomNo
        );
        setMessages(res.data);
      } catch (err) {
        console.error('메시지 불러오기 실패:', err);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  /* ===============================
     2️⃣ 메시지 전송
  =============================== */
  const handleSend = async () => {
    if (!message.trim()) return;

    const roomId = selectedChat?.chatRoomNo;
    if (!roomId) {
      console.error('roomId 없음');
      return;
    }

    // Optimistic UI
    const tempMessage = {
      chatNo: Date.now(),
      message,
      createdAt: new Date(),
      isMe: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessage('');

    try {
      await chatService.sendMessage(roomId, { message });
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  /* ===============================
     3️⃣ 메시지 추가될 때 자동 스크롤
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
                  {chatRooms.length > 0 ? (
                    chatRooms.map((room) => (
                      <S.ChatItem
                        key={room.chatRoomNo}
                        onClick={() => openChatDetail(room)}
                      >
                        <S.PartnerName>
                          {room.chatRoomTitle || room.partnerName || '채팅방'}
                        </S.PartnerName>
                        <p>{room.lastMessage || '대화 없음'}</p>
                        {room.unreadCount > 0 && (
                          <span style={{ 
                            backgroundColor: '#ff4444', 
                            color: 'white', 
                            borderRadius: '10px', 
                            padding: '2px 6px', 
                            fontSize: '12px',
                            marginLeft: 'auto'
                          }}>
                            {room.unreadCount}
                          </span>
                        )}
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
                      $isMe={msg.isMe}
                    >
                      <S.Bubble $isMe={msg.isMe}>
                        {msg.message}
                      </S.Bubble>
                      <S.MessageTime>
                        {new Date(
                          msg.createdAt
                        ).toLocaleTimeString()}
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
