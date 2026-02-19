import styled from 'styled-components';
import { motion } from 'motion/react';

export const ChatbotWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

export const ChatWindow = styled(motion.div)`
  width: 460px;
  max-width: calc(100vw - 48px);
  height: 730px;
  max-height: calc(100vh - 140px);
  background: color-mix(in srgb, var(--card) 95%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ChatHeader = styled.div`
  padding: 16px 20px;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, black) 100%);
  color: var(--primary-foreground);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const ChatHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
`;

export const ChatHeaderSubtitle = styled.span`
  font-size: 12px;
  opacity: 0.9;
  font-weight: 400;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  padding: 16px 24px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--muted);
    border-radius: 3px;
  }
`;

export const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'stretch')};
  max-width: 100%;
  min-width: 0;
`;

/** 분석 결과 메시지 위에 표시되는 타이틀 (챗봇 분석 느낌) */
export const AnalysisResultTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);

  svg {
    flex-shrink: 0;
  }
`;

export const MessageBubble = styled.div`
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  word-break: keep-all;
  white-space: ${({ $noWrap }) => ($noWrap ? 'nowrap' : 'normal')};

  ${({ $isUser, $isAnalysis }) =>
    $isUser
      ? `
    align-self: flex-end;
    width: fit-content;
    max-width: 85%;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    background: var(--primary);
    color: var(--primary-foreground);
    border-bottom-right-radius: 4px;
  `
      : `
    align-self: flex-start;
    background: color-mix(in srgb, var(--muted) 40%, transparent);
    color: var(--foreground);
    border-bottom-left-radius: 4px;
    ${$isAnalysis ? `border-left: 3px solid var(--primary);` : ''}
  `}
`;

/** 건강관리 분석 - 상태별 글씨 색 (정상/주의/경고/위험) */
export const HealthStateBadge = styled.span`
  font-weight: 600;
  ${({ $state }) => {
    switch ($state) {
      case '정상':
        return 'color: var(--success-main, #10b981);';
      case '주의':
        return 'color: var(--warning-main, #f59e0b);';
      case '경고':
        return 'color: #ea580c;';
      case '위험':
        return 'color: var(--danger-main, #ef4444);';
      default:
        return 'color: var(--muted-foreground);';
    }
  }}
`;

export const InputArea = styled.form`
  padding: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 10px;
  align-items: center;
  background: var(--background);
  flex-shrink: 0;
`;

export const ActionButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

export const BackToTopButton = styled.button`
  padding: 8px 12px;
  font-size: 12px;
  color: var(--muted-foreground);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: var(--primary);
    background: color-mix(in srgb, var(--muted) 30%, transparent);
    border-color: var(--primary);
  }
`;

export const NavigateButton = styled.button`
  padding: 8px 12px;
  font-size: 12px;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  border: 1px solid var(--primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: color-mix(in srgb, var(--primary) 20%, transparent);
  }
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  background: var(--card);
  color: var(--foreground);
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: var(--muted-foreground);
  }
  &:focus {
    border-color: var(--primary);
  }
`;

export const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: var(--primary);
  color: var(--primary-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FloatingButton = styled(motion.button)`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 85%, black) 100%);
  color: var(--primary-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.25);
  }
`;

/* 블럭형 FAQ - 스크린샷 스타일 */
export const FaqBlocksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`;

export const FaqBlock = styled.button`
  padding: 12px 16px;
  font-size: 14px;
  text-align: left;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--muted) 25%, transparent);
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s;
  grid-column: ${({ $span }) => ($span === 2 ? '1 / -1' : 'span 1')};

  &:hover {
    background: color-mix(in srgb, var(--muted) 45%, transparent);
    border-color: var(--primary);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* FAQ 카테고리 버튼 */
export const FaqCategoryButton = styled.button`
  width: 100%;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--muted) 15%, transparent);
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  &:hover {
    background: color-mix(in srgb, var(--primary) 10%, transparent);
    border-color: var(--primary);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    opacity: 0.5;
    flex-shrink: 0;
  }
`;

/* FAQ 카테고리 목록 */
export const FaqCategoryList = styled.div`
  width: 100%;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

/* FAQ 카테고리 헤더 (뒤로가기 포함) */
export const FaqCategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
`;

/* 뒤로가기 버튼 */
export const FaqBackButton = styled.button`
  padding: 6px 10px;
  font-size: 13px;
  color: var(--muted-foreground);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: var(--foreground);
    border-color: var(--foreground);
  }
`;

/* 카테고리 제목 */
export const FaqCategoryTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
`;

/* 질문 목록 (카테고리 내) */
export const FaqQuestionList = styled.div`
  width: 100%;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

/* 개별 질문 버튼 */
export const FaqQuestionButton = styled.button`
  width: 100%;
  padding: 12px 14px;
  font-size: 13px;
  text-align: left;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--muted) 20%, transparent);
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    border-color: var(--primary);
    color: var(--primary);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FaqFooter = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted-foreground);
  flex-shrink: 0;
`;

/* 기타 문의 버튼 - AI 채팅 모드 전환 */
export const OtherInquiryButton = styled.button`
  width: 100%;
  padding: 14px 16px;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  border-radius: 12px;
  border: 1px dashed var(--primary);
  background: color-mix(in srgb, var(--primary) 8%, transparent);
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: color-mix(in srgb, var(--primary) 15%, transparent);
    border-style: solid;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* AI 모드 종료 버튼 */
export const ExitAIModeButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  color: var(--muted-foreground);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;

  &:hover {
    color: var(--destructive);
    border-color: var(--destructive);
  }
`;

/* 하단 액션 시트 - 궁금한 확인내용 버튼 (2x2 그리드) */
export const BottomActionSheet = styled.div`
  flex-shrink: 0;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 98%, var(--muted));
`;

export const BottomActionSheetGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const BottomActionSheetButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s;
  min-height: 56px;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    border-color: var(--primary);
    color: var(--primary);

    svg {
      color: var(--primary);
    }
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    color: var(--primary);
  }
`;

/** 하단 액션 시트 - 서비스 안내 (전체 너비 한 줄) */
export const BottomActionSheetServiceButton = styled(BottomActionSheetButton)`
  grid-column: 1 / -1;
  flex-direction: row;
  gap: 8px;
  min-height: 44px;
`;

/* 서비스 안내 모드 시 하단 헤더 (제목 + 분석 보기 버튼) */
export const ServiceGuideBottomHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;

  span {
    font-size: 13px;
    font-weight: 600;
    color: var(--foreground);
    flex: 1;
  }
`;

export const BackToAnalysisButton = styled.button`
  padding: 6px 10px;
  font-size: 12px;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  border: 1px solid var(--primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: color-mix(in srgb, var(--primary) 18%, transparent);
  }
`;

/* 서비스 안내 질문 버튼 스크롤 영역 */
export const ServiceGuideQuestionScroll = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
  align-content: flex-start;

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--muted);
    border-radius: 2px;
  }
`;

/* 서비스 안내 개별 질문 칩 버튼 */
export const ServiceGuideQuestionChip = styled.button`
  padding: 8px 12px;
  font-size: 12px;
  text-align: left;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s;
  white-space: normal;
  line-height: 1.3;
  max-width: 100%;

  &:hover {
    background: color-mix(in srgb, var(--primary) 12%, transparent);
    border-color: var(--primary);
    color: var(--primary);
  }
`;

