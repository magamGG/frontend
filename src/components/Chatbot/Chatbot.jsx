import { useState, useRef, useEffect } from 'react';
import { X, ExternalLink, ArrowLeft, BarChart3, AlertTriangle, Flame, AlertCircle, TrendingDown, Circle, ArrowDown, FolderOpen, PersonStanding, Calendar, ClipboardList, CalendarRange, Heart, UserCheck, Bell } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import useAuthStore from '@/store/authStore';
import { TbMessageChatbot } from "react-icons/tb";
import { MdOutlineInfo } from "react-icons/md";
import { chatService } from '@/api';
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
  FloatingButton,
  FaqBlocksGrid,
  ActionButtonsRow,
  BackToTopButton,
  NavigateButton,
  FaqCategoryHeader,
  FaqBackButton,
  FaqCategoryTitle,
  FaqQuestionList,
  FaqQuestionButton,
  BottomActionSheet,
  BottomActionSheetGrid,
  BottomActionSheetButton,
  BottomActionSheetServiceButton,
  AnalysisResultTitle,
  ServiceGuideBottomHeader,
  ServiceGuideQuestionScroll,
  ServiceGuideQuestionChip,
  BackToAnalysisButton,
  HealthStateBadge,
} from './Chatbot.styled';

const GREETING_LINES = ['안녕하세요. 챗봇 지지입니다.', '아래 버튼을 눌러 원하는 분석을 확인해 보세요.'];

/** 메시지/버튼 텍스트 내 유니코드 이모지 → Lucide React 아이콘 (윈도우 이모지 대신 일관된 표시) */
const EMOJI_TO_ICON = {
  '📉': TrendingDown,
  '🔴': Circle,
  '🟡': Circle,
  '👇': ArrowDown,
  '🔥': Flame,
  '😱': AlertTriangle,
  '⚠️': AlertTriangle,
  '📂': FolderOpen,
  '📊': BarChart3,
  '🏃‍♂️': PersonStanding,
  '🏃': PersonStanding,
};

const EMOJI_REGEX = /(📉|🔴|🟡|👇|🔥|😱|⚠️|📂|📊|🏃‍♂️|🏃)/gu;

/** 건강관리 분석용: "상태: 정상|주의|경고|위험" 구간을 색상 스팬으로 감싼 React 노드 반환 */
const HEALTH_STATE_REGEX = /(상태: (정상|주의|경고|위험|확인 필요))/g;
function renderHealthAnalysisLine(line, iconSize = 14) {
  if (!line || typeof line !== 'string') return line;
  const parts = [];
  let lastIndex = 0;
  let key = 0;
  let match;
  HEALTH_STATE_REGEX.lastIndex = 0;
  while ((match = HEALTH_STATE_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{renderWithIcons(line.slice(lastIndex, match.index), iconSize)}</span>);
    }
    const stateText = match[1];
    const state = match[2] || '';
    parts.push(<HealthStateBadge key={key++} $state={state}>{stateText}</HealthStateBadge>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) {
    parts.push(<span key={key++}>{renderWithIcons(line.slice(lastIndex), iconSize)}</span>);
  }
  return parts.length > 0 ? parts : renderWithIcons(line, iconSize);
}

/** 문자열을 이모지 구간별로 쪼개서 React 노드 배열로 반환 (텍스트 + 아이콘) */
function renderWithIcons(str, iconSize = 14) {
  if (!str || typeof str !== 'string') return str;
  const parts = [];
  let lastIndex = 0;
  let key = 0;
  let match;
  EMOJI_REGEX.lastIndex = 0;
  while ((match = EMOJI_REGEX.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{str.slice(lastIndex, match.index)}</span>);
    }
    const Icon = EMOJI_TO_ICON[match[0]];
    if (Icon) {
      const isRed = match[0] === '🔴';
      const isYellow = match[0] === '🟡';
      parts.push(
        <Icon
          key={key++}
          size={iconSize}
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginLeft: 2,
            marginRight: 2,
            ...(isRed && { color: 'var(--red-500, #ef4444)', fill: 'var(--red-500, #ef4444)' }),
            ...(isYellow && { color: 'var(--amber-500, #f59e0b)', fill: 'var(--amber-500, #f59e0b)' }),
          }}
        />
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < str.length) {
    parts.push(<span key={key++}>{str.slice(lastIndex)}</span>);
  }
  return parts.length > 0 ? parts : str;
}

/* ===== 챗봇 분석 버튼 (역할별) ===== */
const QUICK_REPORT_ARTIST = [
  { type: 'leave_balance', label: '연차 분석' },
  { type: 'today_deadline', label: '오늘 마감 분석' },
  { type: 'leave_summary', label: '휴가·휴재 분석' },
  { type: 'latest_health', label: '건강관리 분석' },
];
const QUICK_REPORT_MANAGER = [
  { type: 'compliance_top3', label: '준수율 분석', icon: AlertTriangle },
  { type: 'deadline_urgent', label: '마감 임박 분석', icon: Flame },
  { type: 'attendance_status', label: '출근 현황 분석' },
  { type: 'top3_leave_artists', label: '휴재 작가 분석' },
  { type: 'pending_approvals', label: '결재 대기 분석' },
];
const QUICK_REPORT_AGENCY = [
  { type: 'compliance_top3', label: '준수율 분석', icon: AlertTriangle },
  { type: 'company_compliance', label: '전사 준수율 분석' },
  { type: 'at_risk_projects', label: '주의 프로젝트 분석', icon: AlertCircle },
  { type: 'join_approval_requests', label: '가입·승인 분석' },
  { type: 'health_distribution', label: '건강 분포 분석' },
];

function getQuickReportItems(role) {
  if (role === 'manager' || role === '담당자') return QUICK_REPORT_MANAGER;
  if (role === 'agency' || role === '에이전시 관리자') return QUICK_REPORT_AGENCY;
  return QUICK_REPORT_ARTIST;
}

/** 하단 버튼용 아이콘 (역할별 미지정 시 기본값) */
const QUICK_REPORT_ICON_BY_TYPE = {
  leave_balance: Calendar,
  today_deadline: ClipboardList,
  leave_summary: CalendarRange,
  latest_health: Heart,
  compliance_top3: AlertTriangle,
  deadline_urgent: Flame,
  attendance_status: UserCheck,
  top3_leave_artists: PersonStanding,
  pending_approvals: Bell,
  company_compliance: BarChart3,
  at_risk_projects: AlertCircle,
  join_approval_requests: Bell,
  health_distribution: Heart,
};
function getQuickReportIcon(item) {
  return item.icon ?? QUICK_REPORT_ICON_BY_TYPE[item.type] ?? BarChart3;
}

/* ===== 역할별 카테고리 기반 FAQ ===== */

// ARTIST(작가) FAQ 카테고리 - 모두 서비스 안내로 통합
const FAQ_CATEGORIES_ARTIST = [
  {
    id: 'quick_report',
    label: '내 현황 퀵 리포트',
    icon: BarChart3,
    quickReport: true,
  },
  {
    id: 'about',
    label: '서비스 안내',
    icon: MdOutlineInfo,
    questions: [
      'MagamGG가 무엇인가요?',
      'MagamGG에서 어떤 일을 할 수 있나요?',
      '처음 사용할 때 뭐부터 해야 하나요?',
      '프로젝트 어디서 확인하나요?',
      '칸반 보드는 어떻게 사용하나요?',
      '캘린더에서 일정 확인은 어떻게 하나요?',
      '마감일 알림은 어디서 확인하나요?',
      '대시보드에서 뭘 볼 수 있나요?',
      '건강 검진은 어디서 하나요?',
      '건강 설문은 어떻게 제출하나요?',
      '내 건강 상태는 어디서 확인하나요?',
      '휴가 신청 어디서 하나요?',
      '휴가 신청 취소는 어떻게 하나요?',
      '병가 신청은 어떻게 하나요?',
      '출퇴근 기록은 어디서 보나요?',
      '피드백은 어디서 확인하나요?',
      '작업 진행률 어디서 보나요?',
    ],
  },
];

// 담당자(manager) FAQ 카테고리
const FAQ_CATEGORIES_MANAGER = [
  {
    id: 'quick_report',
    label: '담당 작가 리스크 관리',
    icon: BarChart3,
    quickReport: true,
  },
  {
    id: 'about',
    label: '서비스 안내',
    icon: MdOutlineInfo,
    questions: [
      'MagamGG가 무엇인가요?',
      'MagamGG에서 담당자는 뭘 할 수 있나요?',
      '작가 관리는 어떻게 시작하나요?',
      '프로젝트 어디서 확인하나요?',
      '칸반 보드에서 업무 배정은 어떻게 하나요?',
      '캘린더에서 팀 일정 확인은 어떻게 하나요?',
      '마감 현황은 어디서 보나요?',
      '직원 관리 어디서 하나요?',
      '원격 관리 페이지는 어디인가요?',
      '작가 건강 현황은 어디서 보나요?',
      '건강 검진 일정은 어디서 확인하나요?',
      '미검진 작가 알림은 어떻게 보내나요?',
      '근태 신청 어디서 하나요?',
      '작가 근태 현황은 어디서 보나요?',
      '휴가 신청 승인은 어떻게 하나요?',
      '작가 출퇴근 현황은 어디서 보나요?',
      '담당 작가들 마감 현황은 어디서 보나요?',
      '프로젝트 진행률 어디서 확인하나요?',
      '피드백은 어떻게 남기나요?',
    ],
  },
];

// 에이전시 관리자(agency) FAQ 카테고리
const FAQ_CATEGORIES_AGENCY = [
  {
    id: 'quick_report',
    label: '전사 운영 인사이트',
    icon: BarChart3,
    quickReport: true,
  },
  {
    id: 'about',
    label: '서비스 안내',
    icon: MdOutlineInfo,
    questions: [
      'MagamGG가 무엇인가요?',
      '에이전시 관리자는 뭘 할 수 있나요?',
      '전체 현황은 어디서 확인하나요?',
      '전체 프로젝트 현황은 어디서 보나요?',
      '전체 직원 현황은 어디서 보나요?',
      '요청 관리 어디서 하나요?',
      '할당 관리 어디서 하나요?',
      '원격 관리 페이지는 어디인가요?',
      '연차 설정 어디서 하나요?',
      '근태 신청 승인은 어디서 하나요?',
      '가입 요청 승인은 어디서 하나요?',
      '신청 반려는 어떻게 하나요?',
      '전체 마감 현황은 어디서 보나요?',
      '출석 현황은 어디서 확인하나요?',
      '프로젝트별 작가 분포는 어디서 보나요?',
      '마감 준수율 추이는 어디서 확인하나요?',
      '전체 직원 건강 현황은 어디서 보나요?',
      '건강 검진 설정은 어디서 하나요?',
      '미검진 인원 일괄 알림은 어떻게 보내나요?',
    ],
  },
];

/* ===== 역할별 메뉴 가이드 (사용자 친화적 상세 설명) ===== */
// ARTIST(작가): 대시보드, 프로젝트 관리, 캘린더, 건강관리 (원격관리 없음)
const MENU_GUIDE_ARTIST = {
  '휴가': {
    text: '상단 헤더의 근태 신청 버튼을 누르세요. 연차, 병가, 워케이션, 재택, 휴재, 반차, 반반차 중에서 고를 수 있어요. 시작일과 종료일, 사유를 적고 제출하면 담당자 승인을 기다리게 돼요.',
    actionType: 'attendance',
    actionLabel: '근태 신청 열기',
  },
  '연차': {
    text: '상단 헤더의 근태 신청 버튼을 눌러서 신청하세요. 남은 연차 일수 안에서 연차·대체휴무·특별휴가를 선택해 신청할 수 있어요.',
    actionType: 'attendance',
    actionLabel: '근태 신청 열기',
  },
  '근태': {
    text: '상단 헤더의 근태 신청 버튼을 클릭하세요. 연차, 병가, 워케이션, 재택, 휴재, 반차, 반반차 중 선택할 수 있어요. 병가는 의료 증명서 첨부가 필요해요. 제출 후 담당자가 승인하면 적용돼요.',
    actionType: 'attendance',
    actionLabel: '근태 신청 열기',
  },
  '병가': {
    text: '근태 신청에서 "병가"를 선택하세요. 의료 증명서를 첨부해야 해요. 시작일, 종료일, 사유를 입력하고 제출하면 담당자 승인을 기다리면 돼요.',
    actionType: 'attendance',
    actionLabel: '근태 신청 열기',
  },
  '취소': {
    text: '휴가 신청은 아직 승인 대기 중일 때만 취소할 수 있어요. 근태 신청 화면에서 내 신청 목록을 열고, 대기 중인 건을 골라 취소하시면 돼요. 이미 승인되거나 반려된 건은 취소할 수 없어요.',
    actionType: 'attendance',
    actionLabel: '근태 신청 열기',
  },
  '출퇴근': {
    text: '대시보드에서 오늘 출근·퇴근 기록을 확인할 수 있어요. 출근할 때 건강 체크를 하신 뒤 기록이 남아요.',
    actionType: 'section',
    actionLabel: '대시보드 이동',
    sectionKeyword: '대시보드',
  },
  '출근': {
    text: '대시보드에서 오늘의 출근·퇴근 상태를 확인할 수 있어요.',
    actionType: 'section',
    actionLabel: '대시보드 이동',
    sectionKeyword: '대시보드',
  },
  '대시보드': {
    text: '대시보드에서 볼 수 있는 것:\n• 오늘 할 일: 마감일이 오늘인 미완료 작업 목록\n• 연차 잔여: 남은 연차 일수\n• 다음 연재: 다음 연재 예정일\n• 피드백: 담당자가 남긴 코멘트',
    actionType: 'section',
    actionLabel: '대시보드 이동',
    sectionKeyword: '대시보드',
  },
  '할 일': {
    text: '오늘 할 일은 제가 담당한 작업 중 마감일이 오늘이고 아직 안 끝난 것들이에요. 대시보드에서 목록을 확인할 수 있어요.',
    actionType: 'section',
    actionLabel: '대시보드 이동',
    sectionKeyword: '대시보드',
  },
  '프로젝트': {
    text: '프로젝트 관리에서 내가 참여 중인 프로젝트 목록을 볼 수 있어요. 리더, 메인작가, 어시스트 등 역할에 따라 보이는 내용이 달라요. 프로젝트를 선택하면 칸반 보드로 작업을 관리할 수 있어요.',
    actionType: 'section',
    actionLabel: '프로젝트 이동',
    sectionKeyword: '프로젝트',
  },
  '칸반': {
    text: '칸반 보드 사용 방법:\n1. 프로젝트 관리에서 프로젝트를 선택하세요\n2. 보드별로 작업 카드가 보여요\n3. 카드를 드래그해서 미완료→완료로 바꿀 수 있어요\n4. 각 카드에 마감일이 표시돼요\n5. 담당자 피드백도 카드에서 확인할 수 있어요',
    actionType: 'section',
    actionLabel: '프로젝트 이동',
    sectionKeyword: '프로젝트',
  },
  '보드': {
    text: '칸반 보드는 프로젝트별 작업을 정리하는 곳이에요. 작업 카드에 이름, 설명, 시작일, 마감일이 있고, 드래그로 완료 처리할 수 있어요.',
    actionType: 'section',
    actionLabel: '프로젝트 이동',
    sectionKeyword: '프로젝트',
  },
  '캘린더': {
    text: '캘린더에서는 담당한 작업의 기간이 색깔별로 표시돼요. 캘린더 메모도 일정에 함께 보여요.',
    actionType: 'section',
    actionLabel: '캘린더 이동',
    sectionKeyword: '캘린더',
  },
  '일정': {
    text: '캘린더 페이지에서 작업 마감일과 캘린더 메모를 확인할 수 있어요.',
    actionType: 'section',
    actionLabel: '캘린더 이동',
    sectionKeyword: '캘린더',
  },
  '마감': {
    text: '마감일이 오늘인 미완료 작업은 대시보드에서, 전체 일정은 캘린더에서 확인할 수 있어요.',
    actionType: 'section',
    actionLabel: '대시보드 이동',
    sectionKeyword: '대시보드',
  },
  '알림': {
    text: '헤더의 알림 아이콘을 누르면 마감 알림, 피드백 알림 등을 확인할 수 있어요. 읽지 않은 알림이 있을 때 표시돼요.',
    actionType: 'section',
    actionLabel: '대시보드 이동',
    sectionKeyword: '대시보드',
  },
  '피드백': {
    text: '담당자가 남긴 피드백은 대시보드와 프로젝트 칸반 카드에서 볼 수 있어요. 작업 카드에 달린 코멘트 형태로 보여요.',
    actionType: 'section',
    actionLabel: '대시보드 이동',
    sectionKeyword: '대시보드',
  },
  '진행률': {
    text: '프로젝트 칸반 보드에서 작업 카드별로 미완료/완료 상태를 확인할 수 있어요. 카드를 드래그해서 완료로 바꾸시면 돼요.',
    actionType: 'section',
    actionLabel: '프로젝트 이동',
    sectionKeyword: '프로젝트',
  },
  '건강': {
    text: '건강관리 페이지에서 건강 설문을 제출하고, 수면시간·불편도 같은 일일 건강 체크도 할 수 있어요. 정신/신체 검진 점수와 상태를 확인할 수 있어요.',
    actionType: 'section',
    actionLabel: '건강관리 이동',
    sectionKeyword: '건강',
  },
  '검진': {
    text: '건강 검진은 에이전시에서 정한 주기에 따라 진행돼요. 건강관리 페이지에서 설문에 답하고, 점수로 결과를 확인할 수 있어요.',
    actionType: 'section',
    actionLabel: '건강관리 이동',
    sectionKeyword: '건강',
  },
  '설문': {
    text: '건강 설문은 건강관리 페이지에서 제출할 수 있어요. 질문에 답하시면 검진 결과로 반영돼요.',
    actionType: 'section',
    actionLabel: '건강관리 이동',
    sectionKeyword: '건강',
  },
};

// 담당자(manager): 대시보드, 프로젝트 관리, 캘린더, 직원 관리, 원격 관리, 건강 검사, 작가 건강관리
const MENU_GUIDE_MANAGER = {
  '휴가': { text: '상단 헤더의 근태 신청 버튼으로 연차, 병가, 워케이션, 재택, 휴재, 반차, 반반차 중 선택해 신청하세요.', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '연차': { text: '근태 신청에서 연차를 선택하세요. 남은 연차 일수 범위 안에서 신청할 수 있어요.', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '근태': { text: '본인 근태 신청은 헤더 버튼으로 하시고, 담당 작가들의 근태 신청 현황은 대시보드에서 확인하세요. 승인 대기 중인 건을 승인하거나 반려할 수 있어요.', actionType: 'attendance', actionLabel: '근태 신청 열기' },
  '워케이션': { text: '원격 관리에서는 담당 작가들이 지금 재택근무인지, 워케이션인지, 휴가 중인지 확인할 수 있어요. 기간별로 잘 보여줘요.', actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' },
  '원격': { text: '원격 관리에서 담당 작가들이 재택근무인지, 워케이션 상태인지 확인할 수 있어요. 각 신청의 시작일~종료일과 승인 여부를 볼 수 있어요.', actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' },
  '대시보드': { text: '대시보드에서 볼 수 있는 것: 담당 프로젝트 현황, 담당 작가들의 근태 신청 중 승인 대기 건수, 마감 임박한 작업, 출퇴근 현황이에요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '할 일': { text: '담당 작가들에게 배정한 작업 중 마감일이 오늘인 미완료 건을 대시보드에서 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '프로젝트': { text: '프로젝트 관리에서 담당 작가들이 참여한 프로젝트를 보고, 칸반 보드로 업무를 배정할 수 있어요. 작업 카드에 담당 작가나 어시스트를 지정하시면 돼요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '칸반': { text: '칸반 보드에서 작업 카드를 추가·수정하고, 담당자를 배정할 수 있어요. 마감일을 정하고, 카드에 코멘트로 피드백을 남길 수 있어요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '배정': { text: '칸반 카드를 만들거나 수정할 때 담당 작가나 어시스트를 골라 배정할 수 있어요. 프로젝트에 참여한 멤버 중에서 선택하시면 돼요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '캘린더': { text: '캘린더에서 담당 프로젝트의 모든 작업 일정을 팀 단위로 확인할 수 있어요.', actionType: 'section', actionLabel: '캘린더 이동', sectionKeyword: '캘린더' },
  '일정': { text: '담당 프로젝트의 작업 일정을 캘린더에서 확인할 수 있어요.', actionType: 'section', actionLabel: '캘린더 이동', sectionKeyword: '캘린더' },
  '마감': { text: '대시보드와 캘린더에서 마감 임박한 작업 현황을 확인할 수 있어요. 다음 연재일도 같이 표시돼요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '직원': { text: '직원 관리에서 내가 담당하는 작가 목록을 확인할 수 있어요. 웹툰 작가, 웹소설 작가, 어시스트 등 역할별로 볼 수 있어요.', actionType: 'section', actionLabel: '직원 관리 이동', sectionKeyword: '직원' },
  '승인': { text: '대시보드에서 담당 작가들이 신청한 근태 중 승인 대기 건을 골라 승인하거나 반려할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '출퇴근': { text: '담당 작가들의 출근·퇴근 기록을 대시보드에서 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '피드백': { text: '프로젝트 칸반 보드의 작업 카드에 코멘트로 피드백을 남길 수 있어요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '진행률': { text: '프로젝트와 대시보드에서 작업 카드별 완료 여부를 확인할 수 있어요. 마감 기한 대비 정상/주의 상태도 볼 수 있어요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '건강': { text: '작가 건강관리에서 담당 작가들의 건강 검진 현황을 확인할 수 있어요.', actionType: 'section', actionLabel: '건강관리 이동', sectionKeyword: '건강' },
  '검진': { text: '건강 검사에서는 내 검진 내역을, 작가 건강관리에서는 담당 작가들의 검진 결과와 미검진 목록을 확인할 수 있어요.', actionType: 'section', actionLabel: '건강 검사 이동', sectionKeyword: '건강 검사' },
  '미검진': { text: '작가 건강관리에서 아직 검진을 안 한 담당 작가 목록을 보고, 검진 알림을 보낼 수 있어요.', actionType: 'section', actionLabel: '건강관리 이동', sectionKeyword: '건강' },
};

// 에이전시(agency): 대시보드, 전체 프로젝트, 전체 직원, 요청 관리, 건강관리, 원격 관리, 할당 관리, 연차 설정
const MENU_GUIDE_AGENCY = {
  '결재': { text: '요청 관리에서 처리할 수 있어요. ① 근태 신청 중 승인 대기 건을 승인하거나 반려하고, ② 에이전시 가입 요청 중 대기 건을 승인하거나 거절할 수 있어요. 반려할 때는 사유를 적어 주세요.', actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' },
  '승인': { text: '요청 관리에서 근태 신청이나 가입 요청을 승인할 수 있어요. 가입 요청을 승인하면 해당 회원이 에이전시 소속으로 들어와요.', actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' },
  '요청': { text: '요청 관리에서 우리 에이전시로 들어온 근태 신청과 가입 요청을 한 번에 확인하고 처리할 수 있어요.', actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' },
  '가입': { text: '에이전시로 가입 요청한 건이 요청 관리에 쌓여요. 대기 중인 건을 골라 승인하거나 거절하시면 돼요.', actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' },
  '반려': { text: '근태 신청이나 가입 요청을 반려할 때는 사유를 적어 주세요. 요청 관리에서 해당 건을 선택한 뒤 반려 사유를 입력하시면 돼요.', actionType: 'section', actionLabel: '요청 관리 이동', sectionKeyword: '요청' },
  '워케이션': { text: '원격 관리에서 직원들이 워케이션·재택·휴가 중인지 기간별로 확인할 수 있어요. 워케이션 장소도 볼 수 있어요.', actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' },
  '원격': { text: '원격 관리에서는 직원들이 지금 재택근무인지, 워케이션 중인지, 휴가 중인지 한눈에 확인할 수 있어요.', actionType: 'section', actionLabel: '원격 관리 이동', sectionKeyword: '원격' },
  '대시보드': { text: '대시보드에서 볼 수 있는 것: 활동 작가 수, 진행 중인 프로젝트 수, 마감 준수율, 결재 대기 건수(근태·가입), 출석 분포, 건강 검진 분포예요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '프로젝트': { text: '전체 프로젝트에서 에이전시 소속 모든 프로젝트를 볼 수 있어요. 연재/휴재/완결 상태, 연재 주기, 플랫폼 등 정보가 표시돼요.', actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' },
  '직원': { text: '전체 직원에서 에이전시 소속 회원 목록을 확인할 수 있어요. 웹툰 작가, 담당자, 에이전시 관리자 등 역할별로, 활성/휴면 상태별로 볼 수 있어요.', actionType: 'section', actionLabel: '전체 직원 이동', sectionKeyword: '직원' },
  '건강': { text: '건강관리에서 직원들의 정신·신체 검진 현황을 확인하고, 검진 주기 설정, 미검진 인원 목록, 검진 알림 보내기를 할 수 있어요.', actionType: 'section', actionLabel: '건강관리 이동', sectionKeyword: '건강' },
  '할당': { text: '할당 관리에서 담당자와 작가를 연결해 배정할 수 있어요. 누가 누구를 담당하는지 설정하는 곳이에요.', actionType: 'section', actionLabel: '할당 관리 이동', sectionKeyword: '할당' },
  '연차': { text: '연차 설정에서 기본 연차 일수를 정하고, 직원별 연차 잔액을 조정할 수 있어요. 경력 인정, 징계, 포상으로 연차를 더하거나 뺄 수 있어요.', actionType: 'section', actionLabel: '연차 설정 이동', sectionKeyword: '연차' },
  '마감': { text: '대시보드에서 오늘부터 4일 후까지 마감 예정인 작업 현황을 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '출석': { text: '대시보드에서 오늘 출근한 사람, 재택·휴가·미출석 인원 분포를 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '분포': { text: '대시보드에서 프로젝트별로 참여한 작가·어시스트 수를 확인할 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '준수율': { text: '마감 준수율은 마감일 안에 완료한 비율이에요. 대시보드에서 월별로 어떻게 변하는지 볼 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
  '미검진': { text: '건강관리에서 아직 검진을 안 한 직원 목록을 보고, 검진 알림을 한 번에 보낼 수 있어요.', actionType: 'section', actionLabel: '건강관리 이동', sectionKeyword: '건강' },
  '현황': { text: '대시보드에서 활동 작가, 진행 프로젝트, 마감 준수율, 결재 대기, 출석·건강 분포 등 전체 현황을 한눈에 볼 수 있어요.', actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' },
};

/* 역할에 따른 가이드 선택 함수 */
const getMenuGuideForRole = (role) => {
  if (role === 'artist' || role === '작가') return MENU_GUIDE_ARTIST;
  if (role === 'manager' || role === '담당자') return MENU_GUIDE_MANAGER;
  if (role === 'agency' || role === '에이전시 관리자') return MENU_GUIDE_AGENCY;
  return MENU_GUIDE_ARTIST; // 기본값
};

const getFaqCategoriesForRole = (role) => {
  if (role === 'artist' || role === '작가') return FAQ_CATEGORIES_ARTIST;
  if (role === 'manager' || role === '담당자') return FAQ_CATEGORIES_MANAGER;
  if (role === 'agency' || role === '에이전시 관리자') return FAQ_CATEGORIES_AGENCY;
  return FAQ_CATEGORIES_ARTIST; // 기본값
};

const getMenuGuideResult = (text, role) => {
  const menuGuide = getMenuGuideForRole(role);
  const lower = text.replace(/\?|요|이요|에서|할|은|는|어디|봐|하나|확인|어떻게|몇|개|건/g, '').trim().toLowerCase();
  const raw = text.toLowerCase();
  for (const [key, guide] of Object.entries(menuGuide)) {
    if (lower.includes(key) || raw.includes(key)) {
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bottomMode, setBottomMode] = useState('analysis'); // 'analysis' | 'serviceGuide'
  const [quickReportLoading, setQuickReportLoading] = useState(false);
  const listRef = useRef(null);
  const user = useAuthStore((state) => state.user);

  // 역할 결정: props로 받은 userRole 또는 user.memberRole 사용
  const effectiveRole = userRole || user?.memberRole || 'artist';
  const faqCategories = getFaqCategoriesForRole(effectiveRole);
  const serviceGuideQuestions = faqCategories.find((c) => c.id === 'about')?.questions ?? [];

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

  const addMessage = (text, isUser, action = null, analysisTitle = null) => {
    setMessages((prev) => [
      ...prev,
      { id: getNextId(), text, isUser, action, analysisTitle },
    ]);
  };

  const handleApiResponse = (query) => {
    const q = query.trim().toLowerCase();

    // 서비스 안내 - 질문별 고정 답변만 (API 조회 없음)

    // 1. MagamGG가 무엇인가요? (공통 기본 소개)
    if (q.includes('magamgg') && (q.includes('무엇') || q.includes('뭐야') || q.includes('뭔가'))) {
      addMessage(
        'MagamGG는 웹툰 작가·담당자·에이전시를 위한 작가 관리 시스템이에요. 프로젝트 관리, 근태·휴가, 건강 관리, 마감 알림 등을 한곳에서 처리할 수 있어요.',
        false
      );
      return true;
    }

    // 2. ARTIST(작가): 어떤 일을 할 수 있나요?
    if ((effectiveRole === 'artist' || effectiveRole === '작가') &&
        (q.includes('어떤 일') || q.includes('뭘 할 수') || q.includes('뭘 할수'))) {
      addMessage(
        '작가로서 할 수 있는 일: 대시보드에서 오늘 할 일 확인, 프로젝트 칸반 보드로 작업 관리, 휴가·연차 신청, 건강 설문 제출, 캘린더로 일정 확인이에요. 마감일 알림도 받을 수 있어요!',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
      );
      return true;
    }

    // 2. 담당자: 담당자는 뭘 할 수 있나요?
    if ((effectiveRole === 'manager' || effectiveRole === '담당자') &&
        (q.includes('담당자') && (q.includes('뭘') || q.includes('할 수')))) {
      addMessage(
        '담당자로서 할 수 있는 일: 담당 작가의 업무·근태 관리, 칸반 보드에서 작업 배정·피드백, 근태 신청 승인, 원격 관리로 재택·워케이션 확인, 작가 건강 현황 확인 등이에요.',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
      );
      return true;
    }

    // 2. 에이전시: 에이전시 관리자는 뭘 할 수 있나요?
    if ((effectiveRole === 'agency' || effectiveRole === '에이전시 관리자') &&
        (q.includes('에이전시') && (q.includes('뭘') || q.includes('할 수')))) {
      addMessage(
        '에이전시 관리자로서 할 수 있는 일: 전체 프로젝트·직원 현황 확인, 근태·가입 요청 결재, 담당자-작가 할당, 연차 설정, 건강 검진 관리, 원격 관리로 전체 직원 상태 확인 등이에요.',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
      );
      return true;
    }

    // 3. ARTIST(작가): 처음 사용할 때 뭐부터 해야 하나요?
    if ((effectiveRole === 'artist' || effectiveRole === '작가') &&
        (q.includes('처음') || q.includes('뭐부터') || q.includes('해야'))) {
      addMessage(
        '처음 사용 시 순서: ① 대시보드에서 오늘 할 일 확인 ② 프로젝트 관리에서 내 프로젝트 선택 ③ 칸반 보드에서 작업 상태 확인 ④ 필요하면 상단 근태 신청으로 휴가 신청하세요!',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
      );
      return true;
    }

    // 3. 담당자: 작가 관리는 어떻게 시작하나요?
    if ((effectiveRole === 'manager' || effectiveRole === '담당자') &&
        (q.includes('작가') && (q.includes('관리') || q.includes('시작')))) {
      addMessage(
        '작가 관리 시작 순서: ① 직원 관리에서 담당 작가 목록 확인 ② 프로젝트 관리에서 칸반 보드로 작업 배정 ③ 대시보드에서 근태 승인 대기 건 확인 ④ 원격 관리에서 재택·워케이션 현황 파악하세요!',
        false,
        { actionType: 'section', actionLabel: '직원 관리 이동', sectionKeyword: '직원' }
      );
      return true;
    }

    // 3. 에이전시: 전체 현황은 어디서 확인하나요?
    if ((effectiveRole === 'agency' || effectiveRole === '에이전시 관리자') &&
        (q.includes('전체') && (q.includes('현황') || q.includes('확인')))) {
      addMessage(
        '대시보드에서 활동 작가 수, 진행 프로젝트, 마감 준수율, 결재 대기, 출석·건강 분포 등 전체 현황을 한눈에 확인할 수 있어요.',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
      );
      return true;
    }

    // 오늘 할 일 몇 개? → 안내만
    if (q.includes('할 일') || q.includes('할일') || (q.includes('오늘') && (q.includes('몇') || q.includes('개')))) {
      addMessage(
        '오늘 할 일은 대시보드에서 확인할 수 있어요. 마감일이 오늘인 미완료 작업이 목록에 표시돼요.',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
      );
      return true;
    }

    // 마감 임박한 업무 → 안내만
    if (q.includes('마감') && (q.includes('임박') || q.includes('있') || q.includes('몇'))) {
      addMessage(
        '마감 임박한 업무는 대시보드나 캘린더에서 확인할 수 있어요.',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
      );
      return true;
    }

    // 내 프로젝트 몇 개? → 안내만
    if (q.includes('프로젝트') && (q.includes('몇') || q.includes('개'))) {
      addMessage(
        '참여 중인 프로젝트는 프로젝트 관리 페이지에서 확인해 주세요.',
        false,
        { actionType: 'section', actionLabel: '프로젝트 이동', sectionKeyword: '프로젝트' }
      );
      return true;
    }

    // 휴가/연차 잔여 → 안내만
    if ((q.includes('휴가') || q.includes('연차')) && (q.includes('잔여') || q.includes('며칠') || q.includes('몇'))) {
      addMessage(
        '연차 잔여 일수는 대시보드나 근태 신청 화면에서 확인할 수 있어요. 휴가 신청은 상단 헤더의 근태 신청 버튼을 이용해 주세요.',
        false,
        { actionType: 'attendance', actionLabel: '근태 신청 열기' }
      );
      return true;
    }

    // 결재/승인 대기 → 안내만
    if ((q.includes('결재') || q.includes('승인') || q.includes('대기')) && (q.includes('몇') || q.includes('건'))) {
      addMessage(
        '승인 대기 건수는 에이전시 관리자는 대시보드·요청 관리에서, 담당자는 대시보드에서 확인할 수 있어요.',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
      );
      return true;
    }

    // 읽지 않은 알림 → 안내만
    if (q.includes('알림') && (q.includes('몇') || q.includes('있어') || q.includes('개'))) {
      addMessage(
        '읽지 않은 알림은 헤더의 알림 아이콘을 눌러 확인해 주세요.',
        false
      );
      return true;
    }

    // 담당자: 담당 작가 근태 신청 → 안내만
    if ((effectiveRole === 'manager' || effectiveRole === '담당자') && (q.includes('근태') || q.includes('신청')) && (q.includes('몇') || q.includes('건'))) {
      addMessage(
        '대기 중인 근태 신청은 대시보드에서 확인해 주세요.',
        false,
        { actionType: 'section', actionLabel: '대시보드 이동', sectionKeyword: '대시보드' }
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
  };

  const goToStart = () => {
    setSelectedCategory(null);
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

  const handleFaqClick = (question) => {
    addMessage(question, true);
    const handled = handleApiResponse(question);
    if (!handled) {
      addMessage(
        '아직 그 질문에는 답할 수 없어요. 다른 질문을 선택해 보세요.',
        false
      );
    }
  };

  const handleQuickReportClick = async (item) => {
    addMessage(item.label, true);
    setQuickReportLoading(true);
    try {
      const res = await chatService.getQuickReport(item.type);
      const text = res?.message ?? '조회 결과를 불러올 수 없습니다.';
      const actions = res?.actions ?? [];
      addMessage(text, false, actions.length > 0 ? { actionType: 'quickReportActions', actions } : null, item.label);
    } catch (err) {
      const msg = err?.message ?? '분석을 불러오는 중 오류가 발생했습니다.';
      addMessage(msg, false, null, item.label);
    } finally {
      setQuickReportLoading(false);
    }
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
                <TbMessageChatbot size={22} />
                <div>
                  <div>챗봇 지지</div>
                  <ChatHeaderSubtitle>
                    데이터 분석 · 메뉴 안내
                  </ChatHeaderSubtitle>
                </div>
              </ChatHeaderTitle>
              <CloseButton onClick={() => setIsOpen(false)} aria-label="닫기">
                <X size={20} />
              </CloseButton>
            </ChatHeader>

            <MessageList ref={listRef}>
              {messages.map((msg) => (
                <MessageGroup key={msg.id} $isUser={msg.isUser}>
                  {!msg.isUser && msg.analysisTitle && (
                    <AnalysisResultTitle>
                      <BarChart3 size={14} />
                      <span>분석 결과: {msg.analysisTitle}</span>
                    </AnalysisResultTitle>
                  )}
                  <MessageBubble $isUser={msg.isUser} $isAnalysis={!!msg.analysisTitle} $noWrap={msg.isUser && typeof msg.text === 'string' && !msg.text.includes('\n')}>
                    {(typeof msg.text === 'string' ? msg.text.split(/\r?\n/) : [msg.text ?? '']).map((line, i, arr) => (
                      <span key={i}>
                        {msg.analysisTitle === '건강관리 분석'
                          ? renderHealthAnalysisLine(line)
                          : renderWithIcons(line)}
                        {i < arr.length - 1 && <br />}
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
                      {msg.action?.actionType === 'quickReportActions' && msg.action.actions?.length > 0
                        ? msg.action.actions.map((a, idx) => (
                            <NavigateButton
                              key={idx}
                              type="button"
                              onClick={() => handleNavigate({ actionType: 'section', actionLabel: a.label, sectionKeyword: a.sectionKeyword })}
                              aria-label={a.label}
                            >
                              {renderWithIcons(a.label, 12)}
                              <ExternalLink size={12} />
                            </NavigateButton>
                          ))
                        : msg.action && (
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
                </MessageGroup>
              ))}
            </MessageList>

            {/* 하단: 분석 모드 vs 서비스 안내 모드 */}
            <BottomActionSheet>
              {bottomMode === 'serviceGuide' ? (
                <>
                  <ServiceGuideBottomHeader>
                    <MdOutlineInfo size={18} />
                    <span>서비스 안내</span>
                    <BackToAnalysisButton
                      type="button"
                      onClick={() => setBottomMode('analysis')}
                      aria-label="분석 보기"
                    >
                      <ArrowLeft size={14} />
                      분석 보기
                    </BackToAnalysisButton>
                  </ServiceGuideBottomHeader>
                  <ServiceGuideQuestionScroll>
                    {serviceGuideQuestions.map((question) => (
                      <ServiceGuideQuestionChip
                        key={question}
                        type="button"
                        onClick={() => handleFaqClick(question)}
                        aria-label={question}
                      >
                        {question}
                      </ServiceGuideQuestionChip>
                    ))}
                  </ServiceGuideQuestionScroll>
                </>
              ) : (
                <BottomActionSheetGrid>
                  {getQuickReportItems(effectiveRole)
                    .slice(0, 4)
                    .map((item) => {
                      const Icon = getQuickReportIcon(item);
                      return (
                        <BottomActionSheetButton
                          key={item.type}
                          type="button"
                          onClick={() => handleQuickReportClick(item)}
                          disabled={quickReportLoading}
                          aria-label={item.label}
                        >
                          <Icon size={20} />
                          <span>{item.label}</span>
                        </BottomActionSheetButton>
                      );
                    })}
                  <BottomActionSheetServiceButton
                    type="button"
                    onClick={() => setBottomMode('serviceGuide')}
                    aria-label="서비스 안내"
                  >
                    <MdOutlineInfo size={20} />
                    <span>서비스 안내</span>
                  </BottomActionSheetServiceButton>
                </BottomActionSheetGrid>
              )}
            </BottomActionSheet>
          </ChatWindow>
        )}
      </AnimatePresence>

      <FloatingButton
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? '챗봇 닫기' : '챗봇 열기'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <TbMessageChatbot size={28} />
      </FloatingButton>
    </ChatbotWrapper>
  );
}
