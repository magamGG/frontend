import styled from 'styled-components';
import { motion } from 'motion/react';
import { X, Send } from 'lucide-react';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  justify-content: flex-end; /* 오른쪽 슬라이드용 배치 */
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  
  /* 전역 커서 제어 */
  * {
    cursor: default !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    
    &:hover {
      cursor: default !important;
    }
    
    &:focus {
      outline: none !important;
      caret-color: transparent !important;
    }
  }
  
  /* 입력 요소만 예외 */
  input[type="text"], input[type="password"], input[type="email"], 
  input[type="search"], input[type="url"], input[type="number"], textarea {
    cursor: text !important;
    user-select: text !important;
    -webkit-user-select: text !important;
    
    &:hover {
      cursor: text !important;
    }
  }
  
  /* 클릭 가능한 요소들 */
  button, [role="button"], .clickable, a, [onclick] {
    cursor: pointer !important;
    
    &:hover {
      cursor: pointer !important;
    }
  }
  
  /* 메시지 내용만 선택 가능 */
  .message-content {
    cursor: text !important;
    user-select: text !important;
    -webkit-user-select: text !important;
    
    &:hover {
      cursor: text !important;
    }
  }
`;

export const ModalContainer = styled(motion.div)`
  width: 360px; /* 400px에서 360px로 축소 */
  height: 100%; /* 우측 사이드바 형태 */
  background-color: var(--background);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 내부 애니메이션 넘침 방지 */
  user-select: none !important; /* 전체 텍스트 선택 방지 */
  cursor: default !important; /* 기본 커서로 설정 */
  
  /* 모든 하위 요소의 강력한 커서 및 포커스 제어 */
  *, *::before, *::after {
    cursor: default !important;
    outline: none !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    
    /* 포커스 시 모든 시각적 효과 제거 */
    &:focus, &:focus-visible, &:focus-within {
      outline: none !important;
      box-shadow: none !important;
      caret-color: transparent !important;
      border: none !important;
    }
    
    /* 호버 시에도 텍스트 커서 방지 */
    &:hover {
      cursor: default !important;
    }
  }
  
  /* 입력 요소들만 예외 처리 */
  input[type="text"], input[type="password"], input[type="email"], 
  input[type="search"], input[type="url"], input[type="number"], textarea {
    cursor: text !important;
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    
    &:focus {
      outline: none !important;
      caret-color: var(--foreground) !important;
    }
    
    &:hover {
      cursor: text !important;
    }
  }
  
  /* 클릭 가능한 요소들 */
  button, [role="button"], .clickable, 
  input[type="button"], input[type="submit"], input[type="reset"],
  a, [onclick] {
    cursor: pointer !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    
    &:hover {
      cursor: pointer !important;
    }
  }
  
  /* 메시지 내용만 선택 가능하도록 */
  .message-content {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    cursor: text !important;
    
    &:hover {
      cursor: text !important;
    }
  }
  
  /* 텍스트 노드에 대한 추가 제어 */
  span, p, div, h1, h2, h3, h4, h5, h6 {
    cursor: default !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    
    &:hover {
      cursor: default !important;
    }
    
    &:focus {
      outline: none !important;
      caret-color: transparent !important;
    }
  }
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
  user-select: none; /* 텍스트 선택 방지 */

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
  overflow-y: scroll;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: default !important; /* 기본 커서로 설정 */
  user-select: none !important; /* 기본적으로 선택 방지 */
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  
  /* 스크롤바 완전히 숨기기 - 모든 브라우저 대응 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* 포커스 방지 */
  &:focus, &:focus-visible, &:focus-within {
    outline: none !important;
    caret-color: transparent !important;
  }
  
  /* 호버 시에도 기본 커서 유지 */
  &:hover {
    cursor: default !important;
  }
  
  /* 모든 자식 요소에 대한 강력한 제어 */
  * {
    cursor: default !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    
    &:hover {
      cursor: default !important;
    }
    
    &:focus {
      outline: none !important;
      caret-color: transparent !important;
    }
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
  gap: 2px;
  max-width: 100%; /* 80%에서 100%로 변경 */
  align-self: ${props => (props.$isMe ? 'flex-end' : 'flex-start')};
  cursor: default !important; /* 기본 커서로 설정 */
  user-select: none; /* 기본적으로 선택 방지 */
  
  /* 포커스 방지 */
  &:focus {
    outline: none !important;
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: ${props => (props.$isMe ? 'row-reverse' : 'row')};
  width: 100%;
  cursor: default !important; /* 기본 커서로 설정 */
  user-select: none; /* 기본적으로 선택 방지 */
  
  /* 포커스 방지 */
  &:focus {
    outline: none !important;
  }
`;

export const ProfileImageContainer = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const ProfileImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
  flex-shrink: 0;
  
  &:hover {
    border-color: var(--primary);
  }
`;

export const DefaultProfile = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  border: 2px solid var(--border);
  flex-shrink: 0;
  
  &:hover {
    border-color: var(--primary);
    background-color: var(--accent);
  }
`;

export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 240px; /* 280px에서 240px로 축소 */
  cursor: default !important; /* 기본 커서로 설정 */
  user-select: none; /* 기본적으로 선택 방지 */
  
  /* 포커스 방지 */
  &:focus {
    outline: none !important;
  }
`;

export const SenderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  cursor: default !important; /* 기본 커서로 설정 */
  user-select: none; /* 선택 방지 */
  
  /* 포커스 방지 */
  &:focus {
    outline: none !important;
  }
`;

export const Bubble = styled.div`
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
  background-color: ${props => (props.$isMe ? 'var(--primary)' : 'var(--card)')};
  color: ${props => (props.$isMe ? 'var(--primary-foreground)' : 'var(--foreground)')};
  border: 1px solid ${props => (props.$isMe ? 'transparent' : 'var(--border)')};
  user-select: text; /* 메시지 내용은 선택 가능 */
  cursor: text !important; /* 메시지 내용에서는 텍스트 커서 */
  outline: none; /* 포커스 아웃라인 제거 */
  
  /* 포커스 시에도 아웃라인 없음 */
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
  
  /* 말풍선 꼬리 쪽 각진 처리 */
  ${props => props.$isMe ? 'border-top-right-radius: 4px' : 'border-top-left-radius: 4px'}
`;

export const MessageTime = styled.span`
  font-size: 11px;
  color: var(--muted-foreground);
  margin: 0 4px;
  align-self: ${props => (props.$isMe ? 'flex-end' : 'flex-start')};
`;

export const SenderName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  cursor: default !important; /* 기본 커서로 설정 */
  user-select: none; /* 선택 방지 */
  
  /* 포커스 방지 */
  &:focus {
    outline: none !important;
  }
`;

/* 채팅방 목록 아이템에도 프로필 추가 */
export const ChatItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background-color: var(--card);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

export const ChatItemProfile = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
  flex-shrink: 0;
`;

export const ChatItemDefaultProfile = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--muted-foreground);
  border: 2px solid var(--border);
  flex-shrink: 0;
`;

export const ChatItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const ChatItemMessage = styled.p`
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  user-select: text; /* 입력창에서는 텍스트 선택 허용 */
  cursor: text !important; /* 입력창에서는 텍스트 커서 */

  &:focus {
    border-color: var(--primary);
    outline: none !important;
    caret-color: var(--foreground) !important;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed !important;
    background-color: var(--muted);
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
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
  user-select: none; /* 텍스트 선택 방지 */

  &:hover {
    transform: scale(1.05);
    color: var(--primary);
  }
`;

/* 채팅방 목록 아이템 내부 컨테이너 */
export const ChatItemMainContent = styled.div`
  flex: 1;
`;

export const ChatItemType = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
`;

export const ChatItemRightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const ChatItemTime = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const UnreadBadge = styled.span`
  background-color: #ff4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
  font-weight: bold;
`;

/* 파일 업로드 버튼 */
export const FileUploadButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border-radius: 50%;
  transition: all 0.2s;
  user-select: none; /* 텍스트 선택 방지 */
  
  &:hover {
    background-color: var(--accent);
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;