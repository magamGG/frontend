import { useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import * as S from './ChatModal.styled';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import websocketService from '@/services/websocketService';
import { sortChatRoomsByTime } from '@/utils/dateUtils';
import { ChatDetailModal } from '../ChatDetailModal/ChatDetailModal';

export function ChatModal() {
  const {
    isChatOpen,
    viewMode,
    chatRooms,
    closeChat,
    openChatDetail,
    openChatList,
  } = useChatStore();

  const { user } = useAuthStore();

  // 채팅방 목록 정렬 최적화 (useMemo 사용)
  const sortedChatRooms = useMemo(() => {
    return sortChatRoomsByTime(chatRooms);
  }, [chatRooms]);

  // WebSocket 연결 관리 (useCallback으로 최적화)
  const connectWebSocket = useCallback(async () => {
    try {
      if (!websocketService.isConnected() && !websocketService.isConnecting()) {
        await websocketService.connect();
      }
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
    }
  }, []);

  // 채팅 모달이 열릴 때 WebSocket 연결
  useEffect(() => {
    if (isChatOpen) {
      connectWebSocket();}
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

  return (
    <>
      <AnimatePresence>
        {isChatOpen && viewMode === 'list' && (
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
              <S.ChatHeader>
                <S.HeaderInfo>
                  <S.PartnerName>메시지 목록</S.PartnerName>
                 
                </S.HeaderInfo>
                <S.CloseIcon onClick={closeChat} />
              </S.ChatHeader>

              <S.ChatBody>
                {sortedChatRooms.length > 0 ? (
                  sortedChatRooms.map((room) => (
                      <S.ChatItem
                        key={room.chatRoomNo}
                        onClick={() => {
                          openChatDetail(room);
                        }}
                      >
                        <S.ChatItemMainContent>
                          <S.PartnerName>
                            {room.chatRoomName || room.chatRoomTitle || room.partnerName || '채팅방'}
                          </S.PartnerName>
                          <S.ChatItemType>
                            {room.chatRoomType === 'PROJECT' ? '프로젝트 채팅방' : 
                             room.chatRoomType === 'ALL' ? '에이전시 전체 채팅방' : '일반 채팅방'}
                          </S.ChatItemType>
                          <p>{room.lastMessage ? (
                            room.lastMessageSenderNo === user?.memberNo 
                              ? `나: ${room.lastMessage}` 
                              : room.lastMessage
                          ) : '대화 없음'}</p>
                        </S.ChatItemMainContent>
                        <S.ChatItemRightSection>
                          {room.lastMessageTime && (
                            <S.ChatItemTime>
                              {room.lastMessageTime}
                            </S.ChatItemTime>
                          )}
                          {room.unreadCount > 0 && (
                            <S.UnreadBadge>
                              {room.unreadCount > 99 ? '99+' : room.unreadCount}
                            </S.UnreadBadge>
                          )}
                        </S.ChatItemRightSection>
                      </S.ChatItem>
                    ))
                ) : (
                  /* 예시 채팅방 (데이터가 없을 때) */
                  <S.ChatItem>
                    <p>채팅방이 없습니다</p>
                  </S.ChatItem>
                )}
              </S.ChatBody>
            </S.ModalContainer>
          </S.ModalOverlay>
        )}
      </AnimatePresence>
      
      {/* 채팅 상세 모달 */}
      <ChatDetailModal />
    </>
  );
}