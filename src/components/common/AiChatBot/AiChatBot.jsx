import { useState, useRef, useEffect, useCallback } from 'react';
import useAuthStore from '@/store/authStore';
import { aiService } from '@/api/services';
import {
  ChatFab,
  ChatPanel,
  ChatHeader,
  ChatHeaderRow,
  ChatHeaderTitle,
  ChatToneSelect,
  ChatHeaderClose,
  ChatMessages,
  MessageBubble,
  TypingIndicator,
  TypingDot,
  QuickActionGrid,
  QuickActionBtn,
  WelcomeMessage,
} from './AiChatBot.styled';

const CHAT_TONE_STORAGE_KEY = 'magamgg_chat_tone';

const TONE_OPTIONS = [
  { value: 'standard', label: '표준 말투' },
  { value: 'romance_villainess', label: '로맨스판타지 악역영애' },
  { value: 'noble_male', label: '귀족 남자' },
  { value: 'cyworld', label: '싸이월드 감성' },
  { value: 'sageuk', label: '사극/무림' },
  { value: 'butler', label: '집사' },
  { value: 'maid', label: '메이드' },
];

const ROLE_CONFIG = {
  artist: {
    desc: '건강·업무·연차·워케이션 등\nAI가 맞춤 조언을 드려요.',
    quickActions: [
      { id: 'health', label: '건강 상태 AI 분석', action: (tone) => aiService.getArtistHealthFeedback(tone) },
      { id: 'workload', label: '이번 주/달 업무 부담 요약', action: (tone) => aiService.getArtistWorkloadSummary(tone) },
      { id: 'priority', label: '프로젝트별 우선순위 조언', action: (tone) => aiService.getArtistProjectPriorityAdvice(tone) },
      { id: 'workation', label: '워케이션 장소 & 시기 추천', action: (tone) => aiService.getArtistWorkationRecommendation(tone) },
      { id: 'leave', label: '연차 소진율 분석 & 추천', action: (tone) => aiService.getArtistLeaveRecommendation(tone) },
    ],
  },
  manager: {
    desc: '담당 작가 업무 균형·일일 건강·독촉 메시지·워케이션 등\nAI가 분석해 관리 조언을 드려요.',
    quickActions: [
      { id: 'health', label: '작가 건강 현황 분석', action: (tone) => aiService.getManagerHealthSummary(tone) },
      { id: 'workloadBalance', label: '작가별 마감·업무량 균형', action: (tone) => aiService.getManagerArtistWorkloadBalance(tone) },
      { id: 'nudge', label: '업무 독촉 메시지 추천', action: (tone) => aiService.getManagerNudgeMessageRecommendation(tone) },
      { id: 'dailyHealth', label: '작가 일일 건강 체크 분석', action: (tone) => aiService.getManagerArtistDailyHealthSummary(tone) },
      { id: 'workation', label: '워케이션 장소 & 시기 추천', action: (tone) => aiService.getManagerWorkationRecommendation(tone) },
    ],
  },
  agency: {
    desc: '에이전시 전체 구성원의 건강·마감·연차·배정 데이터를\nAI가 분석해 운영·우선순위 제안을 드려요.',
    quickActions: [
      { id: 'overview', label: '조직 전체 건강 현황 분석', action: (tone) => aiService.getAgencyHealthOverview(tone) },
      { id: 'riskSummary', label: '프로젝트·작가 리스크 종합', action: (tone) => aiService.getAgencyRiskSummary(tone) },
      { id: 'leaveOverlap', label: '프로젝트 진행 리스크 분석', action: (tone) => aiService.getAgencyLeaveOverlapAlert(tone) },
      { id: 'assignmentBalance', label: '작가 배정 현황 분석', action: (tone) => aiService.getAgencyArtistAssignmentBalance(tone) },
      { id: 'rejectedReapplied', label: '반려 후 재신청 직원 안내', action: (tone) => aiService.getAgencyRejectedThenReappliedAlert(tone) },
    ],
  },
};

function getRoleType(memberRole) {
  if (!memberRole) return null;
  if (memberRole.includes('작가') || memberRole.includes('어시스트')) return 'artist';
  if (memberRole === '담당자') return 'manager';
  if (memberRole === '에이전시 관리자') return 'agency';
  return null;
}

export function AiChatBot() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatTone, setChatTone] = useState(() => {
    try {
      return localStorage.getItem(CHAT_TONE_STORAGE_KEY) || 'standard';
    } catch {
      return 'standard';
    }
  });
  const messagesEndRef = useRef(null);

  const roleType = getRoleType(user?.memberRole);
  const config = roleType ? ROLE_CONFIG[roleType] : null;

  const handleToneChange = (e) => {
    const value = e.target.value || 'standard';
    setChatTone(value);
    try {
      localStorage.setItem(CHAT_TONE_STORAGE_KEY, value);
    } catch (_) {}
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  if (!config) return null;

  const handleToggle = () => {
    if (isOpen) {
      setClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setClosing(false);
      }, 220);
    } else {
      setIsOpen(true);
    }
  };

  const handleQuickAction = async (qa) => {
    if (loading) return;

    setMessages(prev => [...prev, { role: 'user', text: qa.label }]);
    setLoading(true);

    try {
      const data = await qa.action(chatTone);
      const text = typeof data === 'string' ? data : data?.content || JSON.stringify(data);
      setMessages(prev => [...prev, { role: 'ai', text }]);
    } catch (err) {
      const status = err?.status;
      let errorMsg = 'AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
      if (status === 403) errorMsg = '해당 기능에 대한 접근 권한이 없습니다.';
      else if (status === 401) errorMsg = '로그인 세션이 만료되었습니다. 다시 로그인해주세요.';
      else if (err?.message) errorMsg = err.message;
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ChatFab onClick={handleToggle} aria-label="AI 챗봇 열기">
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
          </svg>
        )}
      </ChatFab>

      {isOpen && (
        <ChatPanel $closing={closing}>
          <ChatHeader>
            <ChatHeaderRow>
              <ChatHeaderTitle>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                </svg>
                마감지기 AI
              </ChatHeaderTitle>
              <ChatHeaderClose onClick={handleToggle} aria-label="닫기">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </ChatHeaderClose>
            </ChatHeaderRow>
            <ChatToneSelect value={chatTone} onChange={handleToneChange} aria-label="챗봇 말투 선택">
              {TONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </ChatToneSelect>
          </ChatHeader>

          <ChatMessages>
            {messages.length === 0 && (
              <WelcomeMessage>
                <strong>안녕하세요, {user?.memberName || '사용자'}님!</strong>
                {config.desc}
              </WelcomeMessage>
            )}

            {messages.map((msg, i) => (
              <MessageBubble key={i} $isUser={msg.role === 'user'}>
                {msg.text}
              </MessageBubble>
            ))}

            {loading && (
              <TypingIndicator>
                <TypingDot $delay="0s" />
                <TypingDot $delay="0.2s" />
                <TypingDot $delay="0.4s" />
              </TypingIndicator>
            )}
            <div ref={messagesEndRef} />
          </ChatMessages>

          <QuickActionGrid>
            {config.quickActions.map(qa => (
              <QuickActionBtn
                key={qa.id}
                onClick={() => handleQuickAction(qa)}
                disabled={loading}
              >
                {qa.label}
              </QuickActionBtn>
            ))}
          </QuickActionGrid>
        </ChatPanel>
      )}
    </>
  );
}
