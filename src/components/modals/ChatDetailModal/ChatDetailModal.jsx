import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, Loader2, Plus } from 'lucide-react';
import * as S from '../ChatModal/ChatModal.styled';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';
import { chatService } from '@/api/services';
import api from '@/api/axios';
import { getChatAttachmentUrl, getMemberProfileUrl, MEMBER_AVATAR_PLACEHOLDER } from '@/api/config';
import websocketService from '@/services/websocketService';
import { ChatProfileModal } from '../ChatProfileModal';

export function ChatDetailModal() {
  const { isChatOpen, selectedChat, closeChat, backToList, refreshChatRooms } = useChatStore();
  const { user } = useAuthStore();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatRoomMembers, setChatRoomMembers] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedMemberNo, setSelectedMemberNo] = useState(null);
  const [initError, setInitError] = useState(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // 파일 업로드 상태

  const bottomRef = useRef(null);
  const chatBodyRef = useRef(null);
  const lastReadUpdateRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const fileInputRef = useRef(null); // 파일 입력 참조
  
  // 💡 핵심: 무한 스크롤 상태를 즉각적으로 판별하기 위해 useRef 사용
  const isInfiniteScrollingRef = useRef(false);
  const lastMessageIdRef = useRef(null);

  const currentChatRoomNo = useMemo(() => selectedChat?.chatRoomNo, [selectedChat?.chatRoomNo]);
  const currentMemberNo = useMemo(() => user?.memberNo, [user?.memberNo]);

  // --- [1. 읽음 처리 로직] ---
  const debouncedUpdateLastRead = useCallback((chatRoomNo, lastChatNo) => {
    if (lastReadUpdateRef.current && lastReadUpdateRef.current >= lastChatNo) return;
    lastReadUpdateRef.current = lastChatNo;

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        await chatService.updateLastReadMessage(chatRoomNo, lastChatNo);
        refreshChatRooms();
      } catch (error) {
        // 읽음 처리 실패 시 무시 (사용자 경험에 영향 없음)
      } finally {
        lastReadUpdateRef.current = null;
      }
    }, 1000);
  }, [refreshChatRooms]);

  // --- [2. 무한 스크롤 및 위치 보정] ---
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMoreMessages || !currentChatRoomNo) return;

    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    const scrollTopBefore = chatBody.scrollTop;
    const scrollHeightBefore = chatBody.scrollHeight;
    
    setIsLoadingMore(true);
    isInfiniteScrollingRef.current = true;

    try {
      const nextPage = currentPage + 1;
      const res = await chatService.getChatMessages(currentChatRoomNo, nextPage, 20);
      const messageData = res.data || res;

      let newMessages = [];
      let isLast = false;

      if (Array.isArray(messageData)) {
        newMessages = [...messageData].reverse();
        isLast = messageData.length < 20;
      } else if (messageData?.content) {
        newMessages = [...messageData.content].reverse();
        const lastPage = messageData.last === true;
        const noNext = messageData.hasNext === false;
        isLast = lastPage || noNext;
      }

      if (newMessages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.chatNo));
          const uniqueNew = newMessages.filter((m) => !existingIds.has(m.chatNo));
          return [...uniqueNew, ...prev];
        });
        
        setCurrentPage(nextPage);
        setHasMoreMessages(!isLast);

        requestAnimationFrame(() => {
          const scrollHeightAfter = chatBody.scrollHeight;
          const heightDiff = scrollHeightAfter - scrollHeightBefore;
          if (heightDiff > 0) {
            chatBody.scrollTop = scrollTopBefore + heightDiff;
          }
          setTimeout(() => {
            isInfiniteScrollingRef.current = false;
            setLastMessageCount(prev => prev + newMessages.length);
          }, 100);
        });
      } else {
        setHasMoreMessages(false);
        isInfiniteScrollingRef.current = false;
      }
    } catch (error) {
      console.error('❌ [무한스크롤] API 호출 실패:', error);
      // 무한 스크롤 에러 처리
      isInfiniteScrollingRef.current = false;
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreMessages, currentChatRoomNo, currentPage, messages.length]);

  const handleScroll = useCallback(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody || !currentChatRoomNo || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = chatBody;

    if (scrollTop < 50 && hasMoreMessages && !isInfiniteScrollingRef.current) {
      loadMoreMessages();
    }

    if (scrollTop + clientHeight >= scrollHeight - 100 && messages.length > 0) {
      const realMsgs = messages.filter((m) => !m.isTemp);
      if (realMsgs.length > 0) {
        debouncedUpdateLastRead(currentChatRoomNo, realMsgs[realMsgs.length - 1].chatNo);
      }
    }
  }, [currentChatRoomNo, messages, hasMoreMessages, isLoadingMore, loadMoreMessages, debouncedUpdateLastRead]);

  // --- [3. 메시지 자동 스크롤 제어] ---
  useEffect(() => {
    // 무한 스크롤 중이거나 초기 로딩 중이면 자동 스크롤 로직 스킵
    if (isInitialLoad || isLoadingMore || isInfiniteScrollingRef.current) return;

    const chatBody = chatBodyRef.current;
    if (!chatBody || messages.length === 0) return;

    const currentCount = messages.length;
    const lastMsg = messages[currentCount - 1];

    // 메시지 개수가 늘지 않았거나, 마지막 메시지가 이전과 같다면 중단
    if (currentCount <= lastMessageCount || lastMsg.chatNo === lastMessageIdRef.current) {
      setLastMessageCount(currentCount);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = chatBody;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 350;
    const isMyMessage = lastMsg?.memberNo === user?.memberNo;

    // 자동 스크롤 조건: 내가 썼거나 하단에 가까울 때만
    if (isMyMessage || isNearBottom) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    setLastMessageCount(currentCount);
    lastMessageIdRef.current = lastMsg.chatNo;
  }, [messages, isInitialLoad, isLoadingMore, user?.memberNo, lastMessageCount]);

  // --- [4. 초기화 및 WebSocket] ---
  useEffect(() => {
    if (!currentChatRoomNo || !isChatOpen) return;

    // 상태 초기화
    setMessages([]);
    setCurrentPage(0);
    setHasMoreMessages(true);
    setIsLoadingMore(false);
    setIsInitialLoad(true);
    setLastMessageCount(0);
    isInfiniteScrollingRef.current = false;
    lastMessageIdRef.current = null;

    const initialize = async () => {
      try {
        await chatService.joinChatRoom(currentChatRoomNo);
        const [mRes, msgRes] = await Promise.all([
          chatService.getChatRoomMembers(currentChatRoomNo),
          chatService.getChatMessages(currentChatRoomNo, 0, 20),
        ]);

        const membersMap = {};
        (mRes.data || mRes).forEach((m) => { membersMap[m.memberNo] = m; });
        setChatRoomMembers(membersMap);

        const initialMsgs = (msgRes.content || msgRes.data?.content || msgRes.data || msgRes || []).reverse();
        
        setMessages(initialMsgs);
        setLastMessageCount(initialMsgs.length);
        
        const sliceData = msgRes.data ?? msgRes;
        if (typeof sliceData.hasNext === 'boolean') {
          setHasMoreMessages(sliceData.hasNext);
        } else if (typeof sliceData.last === 'boolean') {
          setHasMoreMessages(!sliceData.last);
        } else {
          setHasMoreMessages(initialMsgs.length === 20);
        }
        
        if (initialMsgs.length > 0) {
          lastMessageIdRef.current = initialMsgs[initialMsgs.length - 1].chatNo;
        }

        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'instant' });
          setIsInitialLoad(false);
          // 스크롤이 없을 정도로 짧은 채팅방도 열었을 때 읽음 처리 (스크롤 이벤트가 안 나오므로)
          if (initialMsgs.length > 0) {
            const lastChatNo = initialMsgs[initialMsgs.length - 1].chatNo;
            debouncedUpdateLastRead(currentChatRoomNo, lastChatNo);
          }
        }, 100);
      } catch (e) {
        setInitError('채팅을 불러오는데 실패했습니다.');
      }
    };

    initialize();

    const subscription = websocketService.subscribeToRoom(currentChatRoomNo, (newMsg) => {
      setMessages((prev) => {
        const isDup = prev.some((m) => m.chatNo === newMsg.chatNo);
        if (isDup) return prev;
        const filtered = prev.filter((m) => !(m.isTemp && m.chatMessage === newMsg.chatMessage && m.memberNo === newMsg.memberNo));
        return [...filtered, newMsg];
      });
    });

    return () => {
      websocketService.unsubscribeFromRoom(currentChatRoomNo);
    };
  }, [currentChatRoomNo, isChatOpen]);

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody || isInitialLoad) return;

    chatBody.addEventListener('scroll', handleScroll);
    return () => chatBody.removeEventListener('scroll', handleScroll);
  }, [handleScroll, isInitialLoad]);

  const handleSend = useCallback(async () => {
    if (!message.trim() || !currentChatRoomNo || !currentMemberNo) return;
    const messageText = message.trim();
    setMessage('');

    const tempMessage = {
      chatNo: `temp-${Date.now()}`,
      chatRoomNo: currentChatRoomNo,
      memberNo: currentMemberNo,
      senderName: user?.memberName || '나',
      chatMessage: messageText,
      chatMessageType: 'TEXT',
      createdAt: new Date().toLocaleTimeString(),
      isTemp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    websocketService.sendMessage(currentChatRoomNo, currentMemberNo, messageText);
  }, [message, currentChatRoomNo, currentMemberNo, user?.memberName]);

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file || !currentChatRoomNo || !currentMemberNo) return;

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하만 업로드 가능합니다.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 파일 업로드 (백엔드에서 WebSocket으로 메시지 전송됨)
      const response = await api.post(`/api/chat/rooms/${currentChatRoomNo}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Member-No': currentMemberNo,
        },
      });
      
      // 업로드 성공 - WebSocket을 통해 메시지가 자동으로 추가됨
      
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [currentChatRoomNo, currentMemberNo]);

  // 파일 다운로드 핸들러
  const handleFileDownload = useCallback(async (attachmentUrl, fileName) => {
    try {
      // attachmentUrl에서 파일명 추출
      const urlFileName = attachmentUrl.split('/').pop();
      
      // API 호출 URL 생성
      const downloadUrl = `/api/chat/rooms/${currentChatRoomNo}/files/download/${urlFileName}`;
      
      // 채팅방 번호를 포함한 경로로 변경
      const response = await api.get(downloadUrl, {
        responseType: 'blob'
      });
      
      // 원본 파일명 추출 (chatMessage에서)
      const originalFileName = fileName ? fileName.split(' (')[0] : urlFileName;
      
      // 강제 다운로드 처리
      const url = window.URL.createObjectURL(response.data);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = originalFileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      link.click();
      
      // 정리
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error("=== 파일 다운로드 에러 ===");
      console.error("에러 객체:", error);
      console.error("에러 메시지:", error.message);
      
      // axios 인터셉터에 의해 가공되기 전의 원본 에러 정보 확인
      if (error.response) {
        console.error("원본 응답 상태:", error.response.status);
        console.error("원본 응답 데이터:", error.response.data);
        console.error("원본 응답 헤더:", error.response.headers);
        console.error("원본 요청 URL:", error.response.config?.url);
      } else if (error.request) {
        console.error("요청은 보냈지만 응답 없음:", error.request);
      } else {
        console.error("요청 설정 중 에러:", error.message);
      }
      
      // 가공된 에러 정보
      console.error("가공된 응답 상태:", error.status);
      console.error("가공된 응답 데이터:", error.data);
      
      alert('파일 다운로드에 실패했습니다.');
    }
  }, [currentChatRoomNo, currentMemberNo]);

  // 파일 선택 버튼 클릭 핸들러
  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!selectedChat) return null;

  return (
    <AnimatePresence>
      {isChatOpen && (
        <S.ModalOverlay
          key="chat-modal"
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeChat}
        >
          <S.ModalContainer
            as={motion.div}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
              // 입력 요소가 아닌 경우에만 기본 동작 방지
              if (!e.target.matches('input, textarea, button, [role="button"], .message-content, .message-content *')) {
                e.preventDefault();
              }
            }}
            style={{
              cursor: 'default',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            <S.ChatHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <S.IconButton onClick={backToList}><ChevronLeft size={20} /></S.IconButton>
                <S.HeaderInfo>
                  <S.PartnerName>{selectedChat.chatRoomName || '채팅방'}</S.PartnerName>
                </S.HeaderInfo>
              </div>
              <S.CloseIcon onClick={closeChat} />
            </S.ChatHeader>

            <S.ChatBody 
              ref={chatBodyRef} 
              onScroll={handleScroll} 
              style={{ 
                overflowY: 'auto', 
                overflowAnchor: 'none',
                cursor: 'default',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
              onMouseDown={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {isLoadingMore && (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto' }} />
                </div>
              )}

              {messages.map((msg, idx) => (
                <S.MessageItem key={msg.chatNo || `msg-${idx}`} $isMe={msg.memberNo === user?.memberNo}>
                  <S.MessageContainer $isMe={msg.memberNo === user?.memberNo}>
                    <S.MessageContent>
                      {msg.memberNo !== user?.memberNo && (
                        <S.SenderInfo>
                          <S.ProfileImageContainer onClick={() => {
                            setSelectedMemberNo(msg.memberNo);
                            setIsProfileModalOpen(true);
                          }}>
                            <S.ProfileImage 
                              src={(() => {
                                const member = chatRoomMembers[msg.memberNo];
                                const profileUrl = getMemberProfileUrl(member?.profileImage) || MEMBER_AVATAR_PLACEHOLDER;
                                return profileUrl;
                              })()}
                              alt={msg.senderName || '사용자'}
                              onError={(e) => {
                                e.target.src = MEMBER_AVATAR_PLACEHOLDER;
                              }}
                            />
                          </S.ProfileImageContainer>
                          <S.SenderName>{msg.senderName}</S.SenderName>
                        </S.SenderInfo>
                      )}
                      <S.Bubble $isMe={msg.memberNo === user?.memberNo} className="message-content">
                        {(msg.chatMessageType === 'FILE' || msg.chatMessageType === 'IMAGE') && msg.attachmentUrl ? (
                          <div>
                            <div style={{ marginBottom: '8px' }}>{msg.chatMessage}</div>
                            {/* 이미지 파일인 경우 미리보기 표시 */}
                            {msg.chatMessageType === 'IMAGE' || (msg.attachmentUrl && (msg.attachmentUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i))) ? (
                              <div style={{ marginBottom: '8px' }}>
                                <img 
                                  src={getChatAttachmentUrl(msg.attachmentUrl)} 
                                  alt="첨부 이미지"
                                  style={{ 
                                    maxWidth: '200px', 
                                    maxHeight: '200px', 
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => window.open(getChatAttachmentUrl(msg.attachmentUrl), '_blank')}
                                />
                              </div>
                            ) : null}
                            <button
                              onClick={() => handleFileDownload(msg.attachmentUrl, msg.chatMessage.split(' (')[0])}
                              style={{ 
                                background: 'none',
                                border: 'none',
                                color: msg.memberNo === user?.memberNo ? 'rgba(255,255,255,0.8)' : 'var(--primary)',
                                textDecoration: 'underline',
                                fontSize: '12px',
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              다운로드
                            </button>
                          </div>
                        ) : (
                          msg.chatMessage
                        )}
                      </S.Bubble>
                      <S.MessageTime $isMe={msg.memberNo === user?.memberNo}>{msg.createdAt}</S.MessageTime>
                    </S.MessageContent>
                  </S.MessageContainer>
                </S.MessageItem>
              ))}
              <div ref={bottomRef} style={{ height: '1px' }} />
            </S.ChatBody>

            <S.InputContainer>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept="*/*"
              />
              <S.FileUploadButton 
                onClick={handleFileButtonClick}
                disabled={isUploading}
                title="파일 첨부"
              >
                <Plus size={18} />
              </S.FileUploadButton>
              <S.ChatInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="메시지를 입력하세요..."
                disabled={isUploading}
              />
              <S.SendButton onClick={handleSend} disabled={!message.trim() || isUploading}>
                {isUploading ? '업로드 중...' : '전송'}
              </S.SendButton>
            </S.InputContainer>
          </S.ModalContainer>
        </S.ModalOverlay>
      )}

      <ChatProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        memberNo={selectedMemberNo}
        memberInfo={chatRoomMembers[selectedMemberNo]}
      />
    </AnimatePresence>
  );
}