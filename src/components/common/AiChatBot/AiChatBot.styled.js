import styled, { keyframes } from 'styled-components';

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const fadeOutScale = keyframes`
  from { opacity: 1; transform: scale(1) translateY(0); }
  to   { opacity: 0; transform: scale(0.95) translateY(8px); }
`;

const pulse = keyframes`
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
`;

export const ChatFab = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1055;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--primary);
  color: var(--primary-foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  &:active {
    transform: scale(0.96);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ChatPanel = styled.div`
  position: fixed;
  bottom: 88px;
  right: 24px;
  z-index: 1055;
  width: 380px;
  max-width: calc(100vw - 32px);
  height: 680px;
  max-height: calc(100vh - 100px);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${props => props.$closing ? fadeOutScale : fadeInScale} 0.25s ease forwards;
`;

export const ChatHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  background: var(--primary);
  color: var(--primary-foreground);
  flex-shrink: 0;
`;

export const ChatHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ChatHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;

  svg { width: 18px; height: 18px; }
`;

export const ChatToneSelect = styled.select`
  width: 100%;
  padding: 6px 10px;
  font-size: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.15);
  color: var(--primary-foreground);
  cursor: pointer;

  option {
    background: var(--card);
    color: var(--foreground);
  }
`;

export const ChatHeaderClose = styled.button`
  background: none;
  border: none;
  color: var(--primary-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.15); }
  svg { width: 18px; height: 18px; }
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 2px;
  }
`;

export const MessageBubble = styled.div`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  line-height: 1.55;
  word-break: keep-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;

  ${props => props.$isUser ? `
    align-self: flex-end;
    background: var(--primary);
    color: var(--primary-foreground);
    border-bottom-right-radius: 4px;
  ` : `
    align-self: flex-start;
    background: var(--muted);
    color: var(--foreground);
    border-bottom-left-radius: 4px;
  `}
`;

export const TypingIndicator = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: var(--muted);
  border-radius: 12px;
  border-bottom-left-radius: 4px;
`;

export const TypingDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted-foreground);
  animation: ${pulse} 1.2s infinite;
  animation-delay: ${props => props.$delay || '0s'};
`;

export const ChatInputArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--card);
  flex-shrink: 0;
`;

export const QuickActionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 16px 4px;
`;

export const QuickActionBtn = styled.button`
  width: 100%;
  padding: 10px 14px;
  background: var(--muted);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
  line-height: 1.4;

  &:hover {
    background: var(--accent);
    color: var(--accent-foreground);
    border-color: var(--accent);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const WelcomeMessage = styled.div`
  text-align: center;
  padding: 24px 16px;
  color: var(--muted-foreground);
  font-size: 0.82rem;
  line-height: 1.6;
  
  strong {
    display: block;
    color: var(--foreground);
    font-size: 0.92rem;
    margin-bottom: 8px;
  }
`;
