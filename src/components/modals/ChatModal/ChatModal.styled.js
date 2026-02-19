import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, Send, ChevronLeft } from 'lucide-react';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  justify-content: flex-end; /* 오른쪽 슬라이드용 배치 */
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled(motion.div)`
  width: 400px;
  height: 100%; /* 우측 사이드바 형태 */
  background-color: var(--background);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 내부 애니메이션 넘침 방지 */
`;

/* 헤더 레이아웃 수정 */
export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
  height: 64px; /* 높이 고정으로 가독성 확보 */
  flex-shrink: 0;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PartnerName = styled.h4`
  font-weight: 600;
  font-size: 16px;
  color: var(--foreground);
  margin: 0;
`;

export const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isOnline ? '#22c55e' : '#9ca3af'};
  border: 2px solid var(--card); /* 입체감 부여 */
`;

/* 아이콘 버튼 공통 스타일 */
export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground);
  transition: color 0.2s, transform 0.2s;

  &:hover {
    color: var(--foreground);
    transform: translateX(-2px);
  }
`;

export const CloseIcon = styled(X)`
  width: 20px;
  height: 20px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--destructive);
  }
`;

/* 바디 영역 - 애니메이션을 위해 motion.div로 확장 가능 */
export const ChatBody = styled(motion.div)`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  gap: 16px;

  /* 스크롤바 커스텀 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 10px;
  }
`;

/* 리스트 아이템 스타일 보강 */
export const ChatItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background-color: var(--card);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--accent); /* 호버 시 강조색 적용 */
  }

  .chat-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  
  p {
    font-size: 13px;
    color: var(--muted-foreground);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/* 상세 대시 메시지 스타일 */
export const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 85%;
  align-self: ${props => (props.$isMe ? 'flex-end' : 'flex-start')};
`;

export const Bubble = styled.div`
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
  background-color: ${props => (props.$isMe ? 'var(--primary)' : 'var(--card)')};
  color: ${props => (props.$isMe ? 'var(--primary-foreground)' : 'var(--foreground)')};
  border: 1px solid ${props => (props.$isMe ? 'transparent' : 'var(--border)')};
  /* 말풍선 꼬리 쪽 각진 처리 */
  ${props => props.$isMe ? 'border-top-right-radius: 4px' : 'border-top-left-radius: 4px'}
`;

export const MessageTime = styled.span`
  font-size: 11px;
  color: var(--muted-foreground);
  margin: 0 4px;
  align-self: ${props => (props.$isMe ? 'flex-end' : 'flex-start')};
`;

/* 하단 입력바 */
export const InputContainer = styled.div`
  padding: 16px 20px;
  background-color: var(--card);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ChatInput = styled.input`
  flex: 1;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 20px; /* 라운드 처리로 더 부드럽게 */
  padding: 10px 18px;
  font-size: 14px;
  color: var(--foreground);
  outline: none;

  &:focus {
    border-color: var(--primary);
  }
`;

export const SendIcon = styled(Send)`
  width: 18px;
  height: 18px;
  color: var(--primary);
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
  }
`;

export const SendButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }
`;