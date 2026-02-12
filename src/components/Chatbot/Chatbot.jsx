import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ExternalLink, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import useAuthStore from '@/store/authStore';
import {
  projectService,
  leaveService,
  notificationService,
  chatService,
} from '@/api';
import {
  ChatbotWrapper,
  ChatWindow,
  ChatHeader,
  ChatHeaderTitle,
  ChatHeaderSubtitle,
  CloseButton,
  MessageList,
  MessageGroup,
  MessageBubble,
  InputArea,
  ChatInput,
  SendButton,
  FloatingButton,
  FaqBlocksGrid,
  FaqFooter,
  ActionButtonsRow,
  BackToTopButton,
  NavigateButton,
  OtherInquiryButton,
  AIModeNotice,
  ExitAIModeButton,
  FaqCategoryButton,
  FaqCategoryList,
  FaqCategoryHeader,
  FaqBackButton,
  FaqCategoryTitle,
  FaqQuestionList,
  FaqQuestionButton,
} from './Chatbot.styled';

const GREETING_LINES = ['안녕하세요. 챗봇 지지 입니다.', '무엇을 도와드릴까요?'];

/* ===== 역할별 카테고리 기반 FAQ ===== */

// 작가(individual) FAQ 카테고리
const FAQ_CATEGORIES_INDIVIDUAL = [
  {
    id: 'about',
    label: '서비스 안내',
    icon: '📌',
    questions: [
      'MagamGG가 무엇인가요?',
      'MagamGG에서 어떤 일을 할 수 있나요?',
      '처음 사용할 때 뭐부터 해야 하나요?',
    ],
  },
  {
    id: 'feature',
    label: '기능 관련 질문',
    icon: '⚙️',
    questions: [
      '프로젝트 어디서 확인하나요?',
      '칸반 보드는 어떻게 사용하나요?',
      '캘린더에서 일정 확인은 어떻게 하나요?',
      '마감일 알림은 어디서 확인하나요?',
      '대시보드에서 뭘 볼 수 있나요?',
    ],
  },
  {
    id: 'attendance',
    label: '근태/휴가 관련',
    icon: '📅',
    questions: [
      '휴가 신청 어디서 하나요?',
      '휴가 잔여 며칠인가요?',
      '휴가 신청 취소는 어떻게 하나요?',
      '병가 신청은 어떻게 하나요?',
      '출퇴근 기록은 어디서 보나요?',
    ],
  },
  {
    id: 'work',
    label: '업무 관련',
    icon: '📋',
    questions: [
      '오늘 할 일이 몇 개인가요?',
      '마감 임박한 업무가 있나요?',
      '피드백은 어디서 확인하나요?',
      '작업 진행률 어디서 보나요?',
    ],
  },
  {
    id: 'health',
    label: '건강 관리',
    icon: '💚',
    questions: [
      '건강 검진은 어디서 하나요?',
      '건강 설문은 어떻게 제출하나요?',
      '내 건강 상태는 어디서 확인하나요?',
    ],
  },
];

// 담당자(manager) FAQ 카테고리
const FAQ_CATEGORIES_MANAGER = [
  {
    id: 'about',
    label: '서비스 안내',
    icon: '📌',
    questions: [
      'MagamGG가 무엇인가요?',
      'MagamGG에서 담당자는 뭘 할 수 있나요?',
      '작가 관리는 어떻게 시작하나요?',
    ],
  },
  {
    id: 'feature',
    label: '기능 관련 질문',
    icon: '⚙️',
    questions: [
      '프로젝트 어디서 확인하나요?',
      '칸반 보드에서 업무 배정은 어떻게 하나요?',
      '캘린더에서 팀 일정 확인은 어떻게 하나요?',
      '마감 현황은 어디서 보나요?',
      '직원 관리 어디서 하나요?',
      '원격 관리 페이지는 어디인가요?',
    ],
  },
  {
    id: 'attendance',
    label: '근태/휴가 관련',
    icon: '📅',
    questions: [
      '근태 신청 어디서 하나요?',
      '휴가 잔여 며칠인가요?',
      '작가 근태 현황은 어디서 보나요?',
      '휴가 신청 승인은 어떻게 하나요?',
      '작가 출퇴근 현황은 어디서 보나요?',
    ],
  },
  {
    id: 'work',
    label: '업무 관리',
    icon: '📋',
    questions: [
      '오늘 할 일이 몇 개인가요?',
      '담당 작가들 마감 현황은 어디서 보나요?',
      '프로젝트 진행률 어디서 확인하나요?',
      '피드백은 어떻게 남기나요?',
    ],
  },
  {
    id: 'health',
    label: '건강 관리',
    icon: '💚',
    questions: [
      '작가 건강 현황은 어디서 보나요?',
      '건강 검진 일정은 어디서 확인하나요?',
      '미검진 작가 알림은 어떻게 보내나요?',
    ],
  },
];

// 에이전시 관리자(agency) FAQ 카테고리
const FAQ_CATEGORIES_AGENCY = [
  {
    id: 'about',
    label: '서비스 안내',
    icon: '📌',
    questions: [
      'MagamGG가 무엇인가요?',
      '에이전시 관리자는 뭘 할 수 있나요?',
      '전체 현황은 어디서 확인하나요?',
    ],
  },
  {
    id: 'feature',
    label: '기능 관련 질문',
    icon: '⚙️',
    questions: [
      '전체 프로젝트 현황은 어디서 보나요?',
      '전체 직원 현황은 어디서 보나요?',
      '요청 관리 어디서 하나요?',
      '할당 관리 어디서 하나요?',
      '원격 관리 페이지는 어디인가요?',
      '연차 설정 어디서 하나요?',
    ],
  },
  {
    id: 'approval',
    label: '결재/승인 관련',
    icon: '✅',
    questions: [
      '결재 대기 몇 건인가요?',
      '근태 신청 승인은 어디서 하나요?',
      '가입 요청 승인은 어디서 하나요?',
      '신청 반려는 어떻게 하나요?',
    ],
  },
  {
    id: 'stats',
    label: '통계/현황',
    icon: '📊',
    questions: [
      '전체 마감 현황은 어디서 보나요?',
      '출석 현황은 어디서 확인하나요?',
      '프로젝트별 작가 분포는 어디서 보나요?',
      '마감 준수율 추이는 어디서 확인하나요?',
    ],
  },
  {
    id: 'health',
    label: '건강 관리',
    icon: '💚',
    questions: [
      '전체 직원 건강 현황은 어디서 보나요?',
      '건강 검진 설정은 어디서 하나요?',
      '미검진 인원 일괄 알림은 어떻게 보내나요?',
    ],
  },
];

/* ===== 역할별 메뉴 가이드 ===== */
// 작가(individual): 대시보드, 프로젝트 관리, 캘린더, 건강관리 (원격관리 없음)
const MENU_GUIDE_INDIVIDUAL = {
  '휴가': { text: '상단 헤더바의 근태 신청 버튼을 클릭해서 신청하시면 돼요!', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '연차': { text: '상단 헤더바의 근태 신청 버튼을 클릭해서 신청하시면 돼요!', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '근태': { text: '상단 헤더바의 근태 신청 버튼을 클릭해서 신청하시면 돼요!', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '대시보드': { text: '대시보드 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '할 일': { text: '대시보드 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '프로젝트': { text: '프로젝트 관리 페이지에서 작업할 수 있어요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '캘린더': { text: '캘린더 페이지에서 일정을 확인할 수 있어요.', actionType: 'section', actionLabel: '캘린더 이동', sectionKeyword: '캘린더' },
  '일정': { text: '캘린더 페이지에서 일정을 확인할 수 있어요.', actionType: 'section', actionLabel: '캘린더 이동', sectionKeyword: '캘린더' },
  '건강': { text: '건강관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '건강관리 이동', sectionKeyword: '건강' },
  '검진': { text: '건강관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '건강관리 이동', sectionKeyword: '건강' },
};

// 담당자(manager): 대시보드, 프로젝트 관리, 캘린더, 직원 관리, 원격 관리, 건강 검사, 작가 건강관리
const MENU_GUIDE_MANAGER = {
  '휴가': { text: '상단 헤더바의 근태 신청 버튼을 클릭해서 신청하시면 돼요!', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '연차': { text: '상단 헤더바의 근태 신청 버튼을 클릭해서 신청하시면 돼요!', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '근태': { text: '상단 헤더바의 근태 신청 버튼을 클릭해서 신청하시면 돼요!', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '워케이션': { text: '원격 관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' },
  '원격': { text: '원격 관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' },
  '대시보드': { text: '대시보드 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '할 일': { text: '대시보드 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '프로젝트': { text: '프로젝트 관리 페이지에서 작업할 수 있어요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '캘린더': { text: '캘린더 페이지에서 일정을 확인할 수 있어요.', actionType: 'section', actionLabel: '캘린더 이동', sectionKeyword: '캘린더' },
  '일정': { text: '캘린더 페이지에서 일정을 확인할 수 있어요.', actionType: 'section', actionLabel: '캘린더 이동', sectionKeyword: '캘린더' },
  '직원': { text: '직원 관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '직원 관리 이동', sectionKeyword: '직원' },
  '건강': { text: '작가 건강관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '건강관리 이동', sectionKeyword: '건강' },
  '검진': { text: '건강 검사 페이지에서 내 검진 내역을 확인할 수 있어요.', actionType: 'section', actionLabel: '건강 검사 이동', sectionKeyword: '건강 검사' },
};

// 에이전시(agency): 대시보드, 전체 프로젝트, 전체 직원, 요청 관리, 건강관리, 원격 관리, 할당 관리, 연차 설정
const MENU_GUIDE_AGENCY = {
  '결재': { text: '요청 관리 페이지에서 처리할 수 있어요.', actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' },
  '승인': { text: '요청 관리 페이지에서 처리할 수 있어요.', actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' },
  '요청': { text: '요청 관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' },
  '워케이션': { text: '원격 관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' },
  '원격': { text: '원격 관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' },
  '대시보드': { text: '대시보드 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '프로젝트': { text: '전체 프로젝트 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '직원': { text: '전체 직원 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '전체 직원 이동', sectionKeyword: '직원' },
  '건강': { text: '건강관리 페이지에서 확인할 수 있어요.', actionType: 'section', actionLabel: '건강관리 이동', sectionKeyword: '건강' },
  '할당': { text: '할당 관리 페이지에서 설정할 수 있어요.', actionType: 'section', actionLabel: '할당 관리 이동', sectionKeyword: '할당' },
  '연차': { text: '연차 설정 페이지에서 관리할 수 있어요.', actionType: 'section', actionLabel: '연차 설정 이동', sectionKeyword: '연차' },
};

/* 역할에 따른 가이드 선택 함수 */
const getMenuGuideForRole = (role) => {
  if (role === 'individual' || role === '작가') return MENU_GUIDE_INDIVIDUAL;
  if (role === 'manager' || role === '담당자') return MENU_GUIDE_MANAGER;
  if (role === 'agency' || role === '에이전시 관리자') return MENU_GUIDE_AGENCY;
  return MENU_GUIDE_INDIVIDUAL; // 기본값
};

const getFaqCategoriesForRole = (role) => {
  if (role === 'individual' || role === '작가') return FAQ_CATEGORIES_INDIVIDUAL;
  if (role === 'manager' || role === '담당자') return FAQ_CATEGORIES_MANAGER;
  if (role === 'agency' || role === '에이전시 관리자') return FAQ_CATEGORIES_AGENCY;
  return FAQ_CATEGORIES_INDIVIDUAL; // 기본값
};

const getMenuGuideResult = (text, role) => {
  const menuGuide = getMenuGuideForRole(role);
  const lower = text.replace(/\?|요|이요|에서|할|은|는|어디|봐/g, '').trim();
  for (const [key, guide] of Object.entries(menuGuide)) {
    if (lower.includes(key)) {
      return { answer: guide.text, action: guide };
    }
  }
  return null;
};

let messageIdCounter = 0;
const getNextId = () => `msg-${Date.now()}-${++messageIdCounter}`;

export function Chatbot({ sections = [], onNavigateToSection, onOpenAttendanceModal, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);  // AI 모드 상태
  const [aiHistory, setAiHistory] = useState([]);   // AI 대화 히스토리
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 FAQ 카테고리
  const listRef = useRef(null);
  const user = useAuthStore((state) => state.user);

  // 역할 결정: props로 받은 userRole 또는 user.memberRole 사용
  const effectiveRole = userRole || user?.memberRole || 'individual';
  const faqCategories = getFaqCategoriesForRole(effectiveRole);

  /* 섹션 키워드로 해당 섹션 인덱스 찾기 */
  const findSectionIndex = (keyword) => {
    if (!keyword || !sections.length) return -1;
    const lowerKeyword = keyword.toLowerCase();
    return sections.findIndex(
      (s) => s.title?.toLowerCase().includes(lowerKeyword) || s.id?.toLowerCase().includes(lowerKeyword)
    );
  };

  /* 네비게이션 버튼 클릭 핸들러 */
  const handleNavigate = (action) => {
    if (!action) return;
    if (action.actionType === 'attendance' && onOpenAttendanceModal) {
      onOpenAttendanceModal();
    } else if (action.actionType === 'section' && onNavigateToSection) {
      const idx = findSectionIndex(action.sectionKeyword);
      if (idx >= 0) {
        onNavigateToSection(idx);
      }
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: getNextId(),
          text: GREETING_LINES.join('\n'),
          isUser: false,
          isGreeting: true,
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const addMessage = (text, isUser, action = null) => {
    setMessages((prev) => [
      ...prev,
      { id: getNextId(), text, isUser, action },
    ]);
  };

  const handleApiResponse = async (query) => {
    const q = query.trim().toLowerCase();
    const memberNo = user?.memberNo;
    const agencyNo = user?.agencyNo;
    const memberRole = user?.memberRole || '';

    try {
      // MagamGG 소개/사용법 (역할별 정적 답변)
      if (
        q.includes('magamgg') ||
        (q.includes('사용법') && (q.includes('알려') || q.includes('어떻게') || q.includes('뭐')))
      ) {
        let intro = 'MagamGG는 웹툰 작가·담당자·에이전시를 위한 작가 관리 시스템이에요. ';
        if (effectiveRole === 'individual' || effectiveRole === '작가') {
          intro += '대시보드에서 오늘 할 일을 확인하고, 프로젝트 관리 페이지에서 칸반 보드로 작업을 관리할 수 있어요. 휴가·연차 신청은 상단 헤더의 근태 신청 버튼을 눌러주세요!';
        } else if (effectiveRole === 'manager' || effectiveRole === '담당자') {
          intro += '대시보드에서 할 일과 근태 현황을 확인하고, 프로젝트 관리 페이지에서 칸반 보드로 작업을 관리할 수 있어요. 작가들의 근태 현황은 원격 관리 페이지에서 확인해 주세요!';
        } else {
          intro += '대시보드에서 전체 현황을 확인하고, 요청 관리 페이지에서 결재를 처리할 수 있어요. 직원 할당은 할당 관리 페이지에서 설정해 주세요!';
        }
        addMessage(intro, false);
        return true;
      }

      // 오늘 할 일 몇 개?
      if (q.includes('할 일') || q.includes('할일') || q.includes('오늘') && (q.includes('몇') || q.includes('개'))) {
        const tasks = await projectService.getMyTodayTasks();
        const count = Array.isArray(tasks) ? tasks.length : 0;
        addMessage(
          `오늘 할 일 ${count}건이에요. 자세한 내용은 대시보드 페이지에서 확인해 주세요.`,
          false,
          { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
        );
        return true;
      }

      // 휴가/연차 잔여 (역할별 안내)
      if ((q.includes('휴가') || q.includes('연차')) && (q.includes('잔여') || q.includes('며칠') || q.includes('몇'))) {
        if (!memberNo) {
          addMessage('로그인 후 조회할 수 있어요.', false);
          return true;
        }
        const balance = await leaveService.getLeaveBalance(memberNo);
        const remain = balance?.leaveBalanceRemainDays ?? 0;
        const year = balance?.leaveBalanceYear || String(new Date().getFullYear());
        
        // 작가는 원격관리 페이지가 없으므로 다른 안내
        if (effectiveRole === 'individual' || effectiveRole === '작가') {
          addMessage(
            `${year}년 연차 잔여 ${remain}일이에요. 휴가 신청은 상단 헤더의 근태 신청 버튼을 눌러주세요!`,
            false,
            { actionType: 'attendance', actionLabel: '근태 신청 열기' }
          );
        } else {
          addMessage(
            `${year}년 연차 잔여 ${remain}일이에요. 사용 내역은 원격 관리 페이지에서 확인할 수 있어요.`,
            false,
            { actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' }
          );
        }
        return true;
      }

      // 결재 대기 (에이전시)
      if ((q.includes('결재') || q.includes('승인') || q.includes('대기')) && (q.includes('몇') || q.includes('건'))) {
        if (!agencyNo) {
          addMessage(
            '에이전시 관리자만 확인할 수 있어요. 담당자는 대시보드 페이지에서 근태 신청 현황을 확인해 주세요.',
            false,
            { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
          );
          return true;
        }
        const pending = await leaveService.getAgencyPendingRequests(agencyNo);
        const count = Array.isArray(pending) ? pending.length : 0;
        addMessage(
          `승인 대기 ${count}건이에요. 처리는 요청 관리 페이지에서 해 주세요.`,
          false,
          { actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' }
        );
        return true;
      }

      // 읽지 않은 알림
      if (q.includes('알림') && (q.includes('몇') || q.includes('있어') || q.includes('개'))) {
        const list = await notificationService.getNotifications();
        const unread = Array.isArray(list) ? list.filter((n) => n.notificationStatus === 'Y').length : 0;
        addMessage(
          `읽지 않은 알림 ${unread}건이에요. 헤더의 알림 아이콘을 눌러 확인해 주세요.`,
          false
        );
        return true;
      }

      // 담당자: 담당 작가 근태 신청
      if (memberRole === '담당자' && (q.includes('근태') || q.includes('신청')) && (q.includes('몇') || q.includes('건'))) {
        const list = await leaveService.getManagerRequests();
        const pending = Array.isArray(list) ? list.filter((r) => r.attendanceRequestStatus === 'PENDING').length : 0;
        addMessage(
          `대기 중인 근태 신청 ${pending}건이에요. 대시보드 또는 원격 관리 페이지에서 확인해 주세요.`,
          false,
          { actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' }
        );
        return true;
      }

      // 어디서 해요? (위치 안내) - 네비게이션 액션 포함
      const guideResult = getMenuGuideResult(query, effectiveRole);
      if (guideResult) {
        addMessage(guideResult.answer, false, guideResult.action);
        return true;
      }

      return false;
    } catch (err) {
      addMessage('조회 중 오류가 났어요. 잠시 후 다시 시도해 주세요.', false);
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    addMessage(trimmed, true);
    setInput('');
    setIsLoading(true);

    // AI 모드일 경우 Ollama API 호출
    if (isAIMode) {
      await handleAIResponse(trimmed);
    } else {
      const handled = await handleApiResponse(trimmed);
      if (!handled) {
        addMessage(
          '무엇을 도와드릴까요? "오늘 할 일 몇 개야?", "휴가 잔여 며칠이야?", "그거 어디서 해요?" 같이 물어보세요.',
          false
        );
      }
    }
    setIsLoading(false);
  };

  /* AI 모드에서 Ollama API 호출 */
  const handleAIResponse = async (message) => {
    try {
      // 히스토리에 사용자 메시지 추가
      const newHistory = [...aiHistory, { role: 'user', content: message }];
      
      // axios 인터셉터가 response.data를 직접 반환하므로 data가 바로 응답 객체
      const data = await chatService.sendMessage(message, effectiveRole, aiHistory);

      // AI 응답을 히스토리에 추가
      setAiHistory([...newHistory, { role: 'assistant', content: data.message }]);

      // 액션이 있으면 포함해서 메시지 추가
      if (data.action) {
        setMessages((prev) => [
          ...prev,
          {
            id: getNextId(),
            text: data.message,
            isUser: false,
            action: data.action,
            isAIResponse: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: getNextId(), text: data.message, isUser: false, isAIResponse: true },
        ]);
      }
    } catch (error) {
      console.error('AI 응답 오류:', error);
      console.error('에러 상세:', JSON.stringify(error, null, 2));
      
      // 에러 메시지 구성
      let errorMsg = 'AI 서비스 오류가 발생했어요.\n\n';
      if (error?.message) {
        errorMsg += `오류: ${error.message}\n\n`;
      }
      if (error?.status) {
        errorMsg += `상태 코드: ${error.status}\n\n`;
      }
      errorMsg += '"처음으로" 버튼을 눌러 FAQ를 이용해주세요.';
      
      addMessage(errorMsg, false);
    }
  };

  /* 기타 문의 클릭 - AI 모드 시작 */
  const handleOtherInquiry = () => {
    setIsAIMode(true);
    setAiHistory([]);
    addMessage(
      '기타 문의 모드입니다. 자유롭게 질문해주세요!\n(AI가 답변하므로 응답이 조금 느릴 수 있어요)',
      false
    );
  };

  /* AI 모드 종료 */
  const exitAIMode = () => {
    setIsAIMode(false);
    setAiHistory([]);
    goToStart();
  };

  const goToStart = () => {
    setIsAIMode(false);
    setAiHistory([]);
    setSelectedCategory(null); // 카테고리 선택 초기화
    setMessages([
      {
        id: getNextId(),
        text: GREETING_LINES.join('\n'),
        isUser: false,
        isGreeting: true,
      },
    ]);
    setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const handleFaqClick = async (question) => {
    addMessage(question, true);
    setIsLoading(true);

    const handled = await handleApiResponse(question);
    if (!handled) {
      addMessage(
        '아직 그 질문에는 답할 수 없어요. "오늘 할 일 몇 개야?", "휴가 신청 어디서 해요?" 같이 물어보세요.',
        false
      );
    }
    setIsLoading(false);
  };

  return (
    <ChatbotWrapper>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <ChatHeader>
              <ChatHeaderTitle>
                {isAIMode ? <Sparkles size={22} /> : <MessageCircle size={22} />}
                <div>
                  <div>챗봇 지지 {isAIMode && '(AI)'}</div>
                  <ChatHeaderSubtitle>
                    {isAIMode ? 'AI 대화 모드' : '가벼운 확인 · 메뉴 안내'}
                  </ChatHeaderSubtitle>
                </div>
              </ChatHeaderTitle>
              {isAIMode && (
                <ExitAIModeButton onClick={exitAIMode} aria-label="AI 모드 종료">
                  종료
                </ExitAIModeButton>
              )}
              <CloseButton onClick={() => setIsOpen(false)} aria-label="닫기">
                <X size={20} />
              </CloseButton>
            </ChatHeader>

            <MessageList ref={listRef}>
              {messages.map((msg) => (
                <MessageGroup key={msg.id} $isUser={msg.isUser}>
                  <MessageBubble $isUser={msg.isUser}>
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </MessageBubble>
                  {!msg.isUser && !msg.isGreeting && (
                    <ActionButtonsRow>
                      <BackToTopButton
                        type="button"
                        onClick={goToStart}
                        aria-label="처음으로"
                      >
                        처음으로
                      </BackToTopButton>
                      {msg.action && (
                        <NavigateButton
                          type="button"
                          onClick={() => handleNavigate(msg.action)}
                          aria-label={msg.action.actionLabel}
                        >
                          {msg.action.actionLabel}
                          <ExternalLink size={12} />
                        </NavigateButton>
                      )}
                    </ActionButtonsRow>
                  )}
                  {msg.isGreeting && messages.length === 1 && !isAIMode && (
                    <>
                      {!selectedCategory ? (
                        /* 카테고리 목록 */
                        <FaqCategoryList>
                          {faqCategories.map((category) => (
                            <FaqCategoryButton
                              key={category.id}
                              type="button"
                              onClick={() => setSelectedCategory(category)}
                              disabled={isLoading}
                            >
                              <span>{category.icon} {category.label}</span>
                              <ChevronRight size={16} />
                            </FaqCategoryButton>
                          ))}
                        </FaqCategoryList>
                      ) : (
                        /* 선택된 카테고리의 질문 목록 */
                        <>
                          <FaqCategoryHeader>
                            <FaqBackButton
                              type="button"
                              onClick={() => setSelectedCategory(null)}
                            >
                              <ArrowLeft size={14} />
                              뒤로
                            </FaqBackButton>
                            <FaqCategoryTitle>
                              {selectedCategory.icon} {selectedCategory.label}
                            </FaqCategoryTitle>
                          </FaqCategoryHeader>
                          <FaqQuestionList>
                            {selectedCategory.questions.map((question) => (
                              <FaqQuestionButton
                                key={question}
                                type="button"
                                onClick={() => handleFaqClick(question)}
                                disabled={isLoading}
                              >
                                {question}
                              </FaqQuestionButton>
                            ))}
                          </FaqQuestionList>
                        </>
                      )}
                      <OtherInquiryButton
                        type="button"
                        onClick={handleOtherInquiry}
                        disabled={isLoading}
                      >
                        <Sparkles size={16} />
                        기타 문의 (AI 상담)
                      </OtherInquiryButton>
                      <FaqFooter>
                        <Bot size={14} style={{ opacity: 0.7 }} />
                        AI Assistant · 방금 전
                      </FaqFooter>
                    </>
                  )}
                </MessageGroup>
              ))}
            </MessageList>

            <InputArea onSubmit={handleSubmit}>
              <ChatInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAIMode ? "AI에게 자유롭게 질문하세요..." : "질문을 입력하세요..."}
                disabled={isLoading}
                maxLength={500}
              />
              <SendButton type="submit" disabled={isLoading || !input.trim()}>
                <Send size={20} />
              </SendButton>
            </InputArea>
          </ChatWindow>
        )}
      </AnimatePresence>

      <FloatingButton
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? '챗봇 닫기' : '챗봇 열기'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle size={28} />
      </FloatingButton>
    </ChatbotWrapper>
  );
}
