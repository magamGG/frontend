import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import {
  Play,
  Square,
  AlertCircle,
  MessageSquare,
  FileText,
  Clock,
  Edit2,
  Trash2,
  Building2,
  Home,
  Calendar,
  Palmtree,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { leaveService, attendanceService, calendarService } from '@/api/services';
import useAuthStore from '@/store/authStore';
import { LeaveRequestEditModal } from '@/components/modals/LeaveRequestEditModal';
import {
  ArtistDashboardRoot,
  ArtistDashboardBody,
  MainLayoutGrid,
  MainColumn,
  SidebarColumn,
  TodayStatusCard,
  TodayStatusHeader,
  TodayStatusHeaderLeft,
  TodayStatusTitleRow,
  TodayStatusTitle,
  TodayStatusDate,
  TodayStatusHeaderRight,
  HealthCheckWarning,
  StatusSelectContainer,
  StatusSelectLabel,
  StatusSelect,
  AttendanceStatusCard,
  AttendanceStatusContent,
  AttendanceStatusLeft,
  AttendanceStatusIconContainer,
  AttendanceStatusText,
  AttendanceStatusTitle,
  AttendanceStatusDescription,
  AttendancePeriodBox,
  AttendancePeriodLabel,
  AttendancePeriodValue,
  EmptyStatusCard,
  EmptyStatusIcon,
  EmptyStatusTitle,
  EmptyStatusDescription,
  QuickInfoGrid,
  QuickInfoCard,
  QuickInfoHeader,
  QuickInfoTitle,
  QuickInfoList,
  ModalTitleWrapper,
  FeedbackItem,
  FeedbackItemHeader,
  FeedbackProject,
  FeedbackUnreadDot,
  FeedbackContent,
  FeedbackMeta,
  DeadlineItem,
  DeadlineName,
  DeadlineMeta,
  DeadlineDate,
  AttendanceRequestItem,
  AttendanceRequestHeader,
  AttendanceRequestType,
  AttendanceRequestDate,
  TasksCard,
  TasksTitle,
  TasksList,
  TaskItem,
  TaskItemHeader,
  TaskProject,
  TaskCompleteButton,
  TaskContent,
  TaskTitle,
  TaskBadgeContainer,
  TaskBadge,
  TaskDescription,
  TaskModalList,
  TaskModalItem,
  TaskModalItemHeader,
  TaskModalBadge,
  TaskModalTitleLabel,
  TaskModalTitle,
  TaskModalDescriptionLabel,
  TaskModalDescription,
  TaskModalMeta,
  MemoButton,
  MemoCard,
  MemoHeader,
  MemoTitle,
  MemoActions,
  MemoContent,
  ModalForm,
  FormRow,
  FormLabel,
  ConditionButtonGrid,
  ConditionButton,
  FormInput,
  RangeContainer,
  RangeLabels,
  RangeValue,
  FormTextarea,
  ModalActions,
  WarningBox,
  WarningContent,
  WarningTitle,
  WarningDescription,
  ModalList,
  ModalListItem,
  ModalListItemHeader,
  ModalListItemContent,
  ModalListItemBadges,
  ModalListItemTitle,
  ModalListItemText,
  ModalListItemMeta,
  ModalListItemMetaLeft,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  AttendanceRequestModalContent,
  AttendanceRequestList,
  AttendanceRequestCard,
  AttendanceRequestCardContent,
  AttendanceRequestStatusBadge,
  AttendanceRequestInfo,
  AttendanceRequestTypeText,
  AttendanceRequestDateText,
  AttendanceRequestActions,
  AttendanceRequestSummary,
  AttendanceRequestSummaryItem,
  AttendanceRequestSummaryNumber,
  AttendanceRequestSummaryLabel,
  AttendanceRequestCardHeader,
  AttendanceRequestCardList,
  AttendanceRequestCardItem,
  AttendanceRequestCardItemContent,
  AttendanceRequestCardItemTitle,
  AttendanceRequestCardItemDate,
  AttendanceRequestCardItemBadge,
} from './ArtistDashboardPage.styled';

// 근태 상태 타입 정의
const ATTENDANCE_TYPE = {
  OFFICE: '출근',
  REMOTE: '재택근무',
  LEAVE: '휴가',
  WORKATION: '워케이션',
};

// 근태 상태별 색상 설정 (스크린샷 참고)
const ATTENDANCE_STATUS_CONFIG = {
  [ATTENDANCE_TYPE.OFFICE]: {
    bgColor: '#E0F2FE', // 연한 파란색 배경
    borderColor: 'rgba(59, 130, 246, 0.3)',
    iconBgColor: 'rgba(59, 130, 246, 0.15)',
    iconColor: '#3B82F6', // 파란색
    icon: Building2,
  },
  [ATTENDANCE_TYPE.REMOTE]: {
    bgColor: '#FFF7ED', // 연한 주황색 배경
    borderColor: 'rgba(249, 115, 22, 0.3)',
    iconBgColor: 'rgba(249, 115, 22, 0.15)',
    iconColor: '#F97316', // 주황색
    icon: Home,
  },
  [ATTENDANCE_TYPE.LEAVE]: {
    bgColor: '#F5F5F5', // 회색 배경
    borderColor: 'rgba(107, 114, 128, 0.3)',
    iconBgColor: 'rgba(107, 114, 128, 0.15)',
    iconColor: '#6B7280', // 회색
    icon: Calendar,
  },
  [ATTENDANCE_TYPE.WORKATION]: {
    bgColor: '#FAF5FF', // 연한 보라색 배경
    borderColor: 'rgba(168, 85, 247, 0.3)',
    iconBgColor: 'rgba(168, 85, 247, 0.15)',
    iconColor: '#A855F7', // 보라색
    icon: Palmtree,
  },
};

// 근태 신청 상태 정의
const REQUEST_STATUS = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '반려',
};

// 작업 상태 타입
const TASK_STATUS = {
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

// 건강 컨디션 타입
const HEALTH_CONDITION = {
  TIRED: 'tired',
  NORMAL: 'normal',
  GOOD: 'good',
  EXCELLENT: 'excellent',
};

// 건강 컨디션 옵션
const HEALTH_CONDITION_OPTIONS = [
  { value: HEALTH_CONDITION.TIRED, label: '피곤함' },
  { value: HEALTH_CONDITION.NORMAL, label: '보통' },
  { value: HEALTH_CONDITION.GOOD, label: '좋음' },
  { value: HEALTH_CONDITION.EXCELLENT, label: '최상' },
];

// 메모 색상 배열
const MEMO_COLORS = [
  { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900' },
  { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900' },
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
  { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900' },
  { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900' },
  { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900' },
];

// 상태 배지 색상 매핑
const getStatusBadgeColor = (status) => {
  const colorMap = {
    [REQUEST_STATUS.PENDING]: 'bg-yellow-500',
    [REQUEST_STATUS.APPROVED]: 'bg-green-500',
    [REQUEST_STATUS.REJECTED]: 'bg-red-500',
  };
  return colorMap[status] || 'bg-gray-500';
};

// 랜덤 색상 선택 함수
const getRandomColor = () => {
  return Math.floor(Math.random() * MEMO_COLORS.length);
};

// 마감일 포맷 헬퍼 (날짜 → "오늘 자정" | "N월 N일")
const formatDeadlineDisplay = (dateStr) => {
  if (!dateStr) return '';
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const today = new Date();
  if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()) {
    return '오늘 자정';
  }
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
};

// 근태 신청 타입 매핑 (백엔드 → 프론트 표시, LeaveRequestModal에서 전송하는 타입 포함)
const ATTENDANCE_TYPE_MAP = {
  연차: { type: ATTENDANCE_TYPE.LEAVE, typeName: '연차' },
  반차: { type: ATTENDANCE_TYPE.LEAVE, typeName: '반차' },
  반반차: { type: ATTENDANCE_TYPE.LEAVE, typeName: '반반차' },
  병가: { type: ATTENDANCE_TYPE.LEAVE, typeName: '병가' },
  휴재: { type: ATTENDANCE_TYPE.LEAVE, typeName: '휴재' },
  휴가: { type: ATTENDANCE_TYPE.LEAVE, typeName: '휴가' },
  재택: { type: ATTENDANCE_TYPE.REMOTE, typeName: '재택근무' },
  재택근무: { type: ATTENDANCE_TYPE.REMOTE, typeName: '재택근무' },
  워케이션: { type: ATTENDANCE_TYPE.WORKATION, typeName: '워케이션' },
};

// 근태 신청 상태 매핑 (백엔드 PENDING/APPROVED/REJECTED/CANCELLED → 프론트)
const REQUEST_STATUS_MAP = {
  PENDING: REQUEST_STATUS.PENDING,
  APPROVED: REQUEST_STATUS.APPROVED,
  REJECTED: REQUEST_STATUS.REJECTED,
  CANCELLED: REQUEST_STATUS.REJECTED,
};

const TASK_STORAGE_KEY = 'artistTaskCompletions';

export function ArtistDashboardPage() {
  const [isWorking, setIsWorking] = useState(false);
  const [healthCheckCompleted, setHealthCheckCompleted] = useState(false);
  const [showHealthSurvey, setShowHealthSurvey] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [currentMemoTitle, setCurrentMemoTitle] = useState('');
  const [currentMemoText, setCurrentMemoText] = useState('');
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [memos, setMemos] = useState([]);
  const [showDeleteMemoConfirm, setShowDeleteMemoConfirm] = useState(false);
  const [memoToDelete, setMemoToDelete] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState({});
  const [currentAttendanceType, setCurrentAttendanceType] = useState(null);
  const [currentAttendanceData, setCurrentAttendanceData] = useState(null);
  const [healthSurvey, setHealthSurvey] = useState({
    condition: HEALTH_CONDITION.NORMAL,
    sleepHours: '',
    discomfortLevel: 0,
    notes: '',
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [deadlineProjects, setDeadlineProjects] = useState([]);
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [isLoadingAttendanceRequests, setIsLoadingAttendanceRequests] = useState(false);
  const [isLoadingDeadlineProjects, setIsLoadingDeadlineProjects] = useState(false);
  const [attendanceRequestsRefreshTrigger, setAttendanceRequestsRefreshTrigger] = useState(0);
  const [editingAttendanceRequest, setEditingAttendanceRequest] = useState(null);
  const [showEditAttendanceModal, setShowEditAttendanceModal] = useState(false);

  const today = new Date();
  const todayString = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const todayFullDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${weekdays[today.getDay()]}`;

  const getCurrentStatusText = () => {
    const displayType = currentAttendanceType || ATTENDANCE_TYPE.OFFICE;
    return `${displayType} 중`;
  };

  // localStorage에서 메모 로드
  useEffect(() => {
    const storedMemos = localStorage.getItem('artistMemos');
    if (storedMemos) {
      setMemos(JSON.parse(storedMemos));
    }
  }, []);

  // localStorage에서 오늘 할 일 완료 상태 로드
  useEffect(() => {
    const stored = localStorage.getItem(TASK_STORAGE_KEY);
    if (stored) {
      try {
        setTaskStatuses(JSON.parse(stored));
      } catch {
        setTaskStatuses({});
      }
    }
  }, []);

  // 오늘 할 일 (캘린더 DB 연동) - 오늘 마감 + 앞으로 할 일
  useEffect(() => {
    const fetchTasks = async () => {
      const memberNo = useAuthStore.getState().user?.memberNo;
      if (!memberNo) return;

      setIsLoadingTasks(true);
      try {
        const response = await calendarService.getUpcomingEvents(20);
        const list = Array.isArray(response) ? response : [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const mapped = list.map((item) => {
          const endDate = item.calendarEventEndedAt ? new Date(item.calendarEventEndedAt) : null;
          endDate?.setHours(0, 0, 0, 0);
          const isToday = endDate && endDate.getTime() === today.getTime();
          const daysLeft = endDate ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) : null;

          let badge = '일정';
          let badgeColor = 'blue';
          if (isToday) {
            badge = 'D-0 마감';
            badgeColor = 'destructive';
          } else if (daysLeft !== null && daysLeft > 0) {
            badge = `D-${daysLeft}`;
            badgeColor = 'blue';
          } else if (daysLeft !== null && daysLeft < 0) {
            badge = '기한 경과';
            badgeColor = 'destructive';
          }

          return {
            id: item.calendarEventNo,
            project: item.calendarEventType || '일정',
            title: item.calendarEventName || '일정',
            description: item.calendarEventContent || '',
            daysLeft,
            badge,
            badgeColor,
            urgent: !!isToday,
          };
        });

        setTasks(mapped);
      } catch (error) {
        console.error('오늘 할 일 조회 실패:', error);
        setTasks([]);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  // taskStatuses 변경 시 localStorage 저장
  useEffect(() => {
    if (Object.keys(taskStatuses).length > 0) {
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(taskStatuses));
    }
  }, [taskStatuses]);

  // 메모 저장 시 localStorage에도 저장
  useEffect(() => {
    if (memos.length > 0) {
      localStorage.setItem('artistMemos', JSON.stringify(memos));
    }
  }, [memos]);

  // 현재 적용 중인 근태 상태 조회 (API 호출)
  useEffect(() => {
    const fetchCurrentAttendanceStatus = async () => {
      try {
        const response = await leaveService.getCurrentStatus();
        const data = response;
        if (data && data.attendanceRequestType) {
          const typeMap = {
            '연차': ATTENDANCE_TYPE.LEAVE,
            '반차': ATTENDANCE_TYPE.LEAVE,
            '병가': ATTENDANCE_TYPE.LEAVE,
            '워케이션': ATTENDANCE_TYPE.WORKATION,
            '재택근무': ATTENDANCE_TYPE.REMOTE,
            '재택': ATTENDANCE_TYPE.REMOTE,
            '휴가': ATTENDANCE_TYPE.LEAVE,
            '휴재': ATTENDANCE_TYPE.LEAVE,
          };
          const displayType = typeMap[data.attendanceRequestType] || data.attendanceRequestType;
          setCurrentAttendanceType(displayType);
          setCurrentAttendanceData(data);
        } else {
          setCurrentAttendanceType(null);
          setCurrentAttendanceData(null);
        }
      } catch (error) {
        console.error('현재 근태 상태 조회 실패:', error);
        setCurrentAttendanceType(null);
        setCurrentAttendanceData(null);
      }
    };

    fetchCurrentAttendanceStatus();
    const interval = setInterval(fetchCurrentAttendanceStatus, 300000);
    return () => clearInterval(interval);
  }, []);

  // 오늘 출근 상태 및 신청 현황 조회 (페이지 로드 시, 포커스 시 - 에이전시 승인/반려 반영)
  useEffect(() => {
    const fetchTodayAttendanceStatus = async () => {
      try {
        const response = await attendanceService.getTodayStatus();
        const data = response;
        if (data && data.isWorking && data.lastAttendanceType === '출근') {
          setIsWorking(true);
          setHealthCheckCompleted(true);
        } else {
          setIsWorking(false);
          setHealthCheckCompleted(false);
        }
      } catch (error) {
        console.error('오늘 출근 상태 조회 실패:', error);
        setIsWorking(false);
        setHealthCheckCompleted(false);
      }
    };

    const handleFocus = () => {
      fetchTodayAttendanceStatus();
      setAttendanceRequestsRefreshTrigger((prev) => prev + 1);
    };

    fetchTodayAttendanceStatus();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 신청 현황 (근태 신청 목록) - leaveService.getMyRequests API 연동
  // 근태 신청 모달에서 신청 성공 시 leaveRequestSuccess 이벤트로 자동 새로고침
  useEffect(() => {
    const fetchAttendanceRequests = async () => {
      const memberNo = useAuthStore.getState().user?.memberNo;
      if (!memberNo) return;

      setIsLoadingAttendanceRequests(true);
      try {
        const response = await leaveService.getMyRequests();
        const list = Array.isArray(response) ? response : [];
        const filtered = list.filter((item) => item.attendanceRequestStatus !== 'CANCELLED');
        const mapped = filtered.map((item) => {
          const typeConfig = ATTENDANCE_TYPE_MAP[item.attendanceRequestType] || {
            type: ATTENDANCE_TYPE.LEAVE,
            typeName: item.attendanceRequestType || '휴가',
          };
          const status = REQUEST_STATUS_MAP[item.attendanceRequestStatus] || REQUEST_STATUS.PENDING;
          const formatReqDate = (dt) => {
            if (!dt) return '';
            const d = typeof dt === 'string' ? new Date(dt) : dt;
            return `${d.getMonth() + 1}월 ${d.getDate()}일`;
          };
          return {
            id: String(item.attendanceRequestNo),
            type: typeConfig.type,
            typeName: typeConfig.typeName,
            startDate: formatReqDate(item.attendanceRequestStartDate),
            endDate: formatReqDate(item.attendanceRequestEndDate),
            status,
            rawStatus: item.attendanceRequestStatus,
            raw: item,
          };
        });
        setAttendanceRequests(mapped);
      } catch (error) {
        console.error('신청 현황 조회 실패:', error);
        setAttendanceRequests([]);
      } finally {
        setIsLoadingAttendanceRequests(false);
      }
    };

    fetchAttendanceRequests();
  }, [attendanceRequestsRefreshTrigger]);

  // 근태 신청 모달에서 신청 성공 시 신청 현황 새로고침
  useEffect(() => {
    const handleLeaveRequestSuccess = () => {
      setAttendanceRequestsRefreshTrigger((prev) => prev + 1);
    };
    window.addEventListener('leaveRequestSuccess', handleLeaveRequestSuccess);
    return () => window.removeEventListener('leaveRequestSuccess', handleLeaveRequestSuccess);
  }, []);

  // 다음 연재 프로젝트 (다가오는 일정) - calendarService.getUpcomingEvents API 연동
  useEffect(() => {
    const fetchDeadlineProjects = async () => {
      const memberNo = useAuthStore.getState().user?.memberNo;
      if (!memberNo) return;

      setIsLoadingDeadlineProjects(true);
      try {
        const response = await calendarService.getUpcomingEvents(10);
        const list = Array.isArray(response) ? response : [];
        const today = new Date();
        const mapped = list.map((item) => {
          const endDate = item.calendarEventEndedAt ? new Date(item.calendarEventEndedAt) : null;
          const isToday = endDate && endDate.getFullYear() === today.getFullYear() &&
            endDate.getMonth() === today.getMonth() && endDate.getDate() === today.getDate();
          return {
            id: item.calendarEventNo,
            name: item.calendarEventName || item.calendarEventContent || '일정',
            deadline: formatDeadlineDisplay(item.calendarEventEndedAt),
            urgent: !!isToday,
          };
        });
        setDeadlineProjects(mapped);
      } catch (error) {
        console.error('다음 연재 프로젝트 조회 실패:', error);
        setDeadlineProjects([]);
      } finally {
        setIsLoadingDeadlineProjects(false);
      }
    };

    fetchDeadlineProjects();
  }, []);

  // localStorage에서 피드백 불러오기
  useEffect(() => {
    const loadFeedbacks = () => {
      const stored = localStorage.getItem('artistFeedbacks');
      if (stored) {
        const allFeedbacks = JSON.parse(stored);
        setFeedbacks(allFeedbacks);
      } else {
        setFeedbacks([
          {
            id: '1',
            project: '내 웹툰',
            content: '에피소드 41 수정 요청: 3페이지 배경 디테일 보완',
            from: '이편집자',
            date: '오늘',
            isRead: false,
          },
          {
            id: '2',
            project: '신작',
            content: '캐릭터 디자인 방향성 좋습니다. 그대로 진행해주세요!',
            from: '김담당자',
            date: '어제',
            isRead: true,
          },
        ]);
      }
    };

    loadFeedbacks();
    const interval = setInterval(loadFeedbacks, 1000);
    return () => clearInterval(interval);
  }, []);

  // 작업 시작 핸들러
  const handleStartWork = () => {
    setShowHealthSurvey(true);
  };

  // 작업 종료 핸들러
  const handleStopWork = () => {
    // 항상 확인 창 표시
    setShowStopConfirm(true);
  };

  const confirmStopWork = async () => {
    try {
      await attendanceService.endAttendance();
      setIsWorking(false);
      setHealthCheckCompleted(false);
      setShowStopConfirm(false);
      toast.success('출근이 종료되었습니다.');
    } catch (error) {
      console.error('출근 종료 실패:', error);
      toast.error(error?.message || '출근 종료에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 건강 체크 유효성 검사
  const isHealthSurveyValid = () => {
    return healthSurvey.sleepHours.trim() !== '';
  };

  const handleHealthSurveySubmit = async () => {
    if (!isHealthSurveyValid()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      const sleepHoursMatch = healthSurvey.sleepHours.match(/\d+/);
      const sleepHoursValue = sleepHoursMatch ? parseInt(sleepHoursMatch[0]) : null;
      const healthCheckData = {
        healthCondition: healthSurvey.condition,
        sleepHours: sleepHoursValue,
        discomfortLevel: healthSurvey.discomfortLevel,
        healthCheckNotes: healthSurvey.notes || '',
      };
      await attendanceService.startAttendance(healthCheckData);
      setIsWorking(true);
      setHealthCheckCompleted(true);
      setShowHealthSurvey(false);
      toast.success('출근이 시작되었습니다. 좋은 하루 되세요!');
    } catch (error) {
      console.error('출근 시작 실패:', error);
      toast.error('출근 시작에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 건강 체크 취소 핸들러
  const handleCancelHealthCheck = () => {
    setShowHealthSurvey(false);
    toast.info('건강 체크를 취소했습니다. 작업이 시작되지 않았습니다.');
  };

  // 할 일 상태 토글 (로컬 완료 표시, localStorage 저장)
  const toggleTaskStatus = (taskId) => {
    const currentStatus = taskStatuses[taskId] || TASK_STATUS.IN_PROGRESS;
    if (currentStatus === TASK_STATUS.IN_PROGRESS) {
      setTaskStatuses((prev) => ({
        ...prev,
        [taskId]: TASK_STATUS.COMPLETED,
      }));
      toast.success('작업이 완료되었습니다.');
    } else {
      setTaskStatuses((prev) => ({
        ...prev,
        [taskId]: TASK_STATUS.IN_PROGRESS,
      }));
      toast.info('작업을 다시 진행 중으로 변경했습니다.');
    }
  };

  // 메모 저장 핸들러
  const handleSaveMemo = () => {
    if (currentMemoText.trim()) {
      if (editingMemoId) {
        const updatedMemos = memos.map((memo) =>
          memo.id === editingMemoId ? { ...memo, title: currentMemoTitle || '새 메모', content: currentMemoText } : memo
        );
        setMemos(updatedMemos);
        localStorage.setItem('artistMemos', JSON.stringify(updatedMemos));
        toast.success('메모가 수정되었습니다.');
      } else {
        const newMemo = {
          id: Date.now().toString(),
          title: currentMemoTitle || '새 메모',
          content: currentMemoText,
          color: MEMO_COLORS[getRandomColor()].bg,
          createdAt: new Date().toISOString(),
        };
        setMemos([...memos, newMemo]);
        toast.success('메모가 저장되었습니다.');
      }
      setShowMemoModal(false);
      setCurrentMemoText('');
      setCurrentMemoTitle('');
      setEditingMemoId(null);
    } else {
      toast.error('메모 내용을 입력해주세요.');
    }
  };

  // 메모 취소 핸들러
  const handleCancelMemo = () => {
    setShowMemoModal(false);
    setCurrentMemoText('');
    setCurrentMemoTitle('');
    setEditingMemoId(null);
  };

  // 메모 수정 핸들러
  const handleEditMemo = (memoId) => {
    const memoToEdit = memos.find((memo) => memo.id === memoId);
    if (memoToEdit) {
      setCurrentMemoTitle(memoToEdit.title);
      setCurrentMemoText(memoToEdit.content);
      setEditingMemoId(memoId);
      setShowMemoModal(true);
    }
  };

  // 메모 삭제 확인 핸들러
  const handleDeleteMemoClick = (memoId) => {
    setMemoToDelete(memoId);
    setShowDeleteMemoConfirm(true);
  };

  // 근태 신청 수정 핸들러 (대기 중일 때만)
  const handleEditAttendanceRequest = (request) => {
    if (!request?.raw || request.rawStatus !== 'PENDING') return;
    setEditingAttendanceRequest(request.raw);
    setShowEditAttendanceModal(true);
  };

  // 근태 신청 삭제(취소) 핸들러
  const handleCancelAttendanceRequest = async (request) => {
    if (!request?.id) return;
    try {
      await leaveService.cancelAttendanceRequest(Number(request.id));
      toast.success('근태 신청이 취소되었습니다.');
      setAttendanceRequestsRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('근태 신청 취소 실패:', error);
      toast.error(error?.message || '취소에 실패했습니다.');
    }
  };

  // 메모 삭제 실행 핸들러
  const handleDeleteMemoConfirm = () => {
    if (memoToDelete) {
      const updatedMemos = memos.filter((memo) => memo.id !== memoToDelete);
      setMemos(updatedMemos);
      localStorage.setItem('artistMemos', JSON.stringify(updatedMemos));
      toast.success('메모가 삭제되었습니다.');
      setShowDeleteMemoConfirm(false);
      setMemoToDelete(null);
    }
  };

  const formatPeriodDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getAttendancePeriod = () => {
    if (!currentAttendanceData) return '기간 정보 없음';
    const startDate = formatPeriodDate(currentAttendanceData.attendanceRequestStartDate);
    const endDate = formatPeriodDate(currentAttendanceData.attendanceRequestEndDate);
    return `${startDate} ~ ${endDate}`;
  };

  const getWorkcationLocation = () => {
    return currentAttendanceData?.workcationLocation || null;
  };

  return (
    <ArtistDashboardRoot>
      <ArtistDashboardBody>
        <MainLayoutGrid>
          {/* 왼쪽 메인 컬럼 */}
          <MainColumn>
            {/* 오늘의 상태 */}
            <TodayStatusCard>
              <TodayStatusHeader>
                <TodayStatusHeaderLeft>
                  <TodayStatusTitleRow>
                    <TodayStatusTitle>{getCurrentStatusText()}</TodayStatusTitle>
                  </TodayStatusTitleRow>
                  <TodayStatusDate>{todayFullDate}</TodayStatusDate>
                </TodayStatusHeaderLeft>
                <TodayStatusHeaderRight>
                  {isWorking && !healthCheckCompleted && (
                    <HealthCheckWarning>
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-yellow-700 font-medium">건강 체크 미완료</span>
                    </HealthCheckWarning>
                  )}
                  <Button
                    onClick={isWorking ? handleStopWork : handleStartWork}
                    className={isWorking ? 'bg-red-500 hover:bg-red-600' : ''}
                    size="lg"
                    disabled={!isWorking && currentAttendanceType === ATTENDANCE_TYPE.LEAVE}
                  >
                    {isWorking ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        출근 종료
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        출근 시작
                      </>
                    )}
                  </Button>
                </TodayStatusHeaderRight>
              </TodayStatusHeader>


              {/* 근태 상태 표시 - API(leaveService.getCurrentStatus, attendanceService.getTodayStatus) 연동 */}
              {(() => {
                const displayType = currentAttendanceType || ATTENDANCE_TYPE.OFFICE;
                const displayConfig = ATTENDANCE_STATUS_CONFIG[displayType];
                const DisplayIcon = displayConfig.icon;
                return (
                  <AttendanceStatusCard $bgColor={displayConfig.bgColor} $borderColor={displayConfig.borderColor}>
                    <AttendanceStatusContent>
                      <AttendanceStatusLeft>
                        <AttendanceStatusIconContainer $iconBgColor={displayConfig.iconBgColor}>
                          <DisplayIcon className="w-6 h-6" style={{ color: displayConfig.iconColor }} />
                        </AttendanceStatusIconContainer>
                        <AttendanceStatusText>
                          <AttendanceStatusTitle>{displayType} 중</AttendanceStatusTitle>
                          <AttendanceStatusDescription>
                            {displayType === ATTENDANCE_TYPE.OFFICE
                              ? '사무실에서 작업 중입니다'
                              : displayType === ATTENDANCE_TYPE.REMOTE
                              ? '자택에서 작업 중입니다'
                              : displayType === ATTENDANCE_TYPE.LEAVE
                              ? '휴식 중입니다'
                              : getWorkcationLocation()
                              ? `${getWorkcationLocation()}에서 작업 중입니다`
                              : '외부 환경에서 작업 중입니다'}
                          </AttendanceStatusDescription>
                        </AttendanceStatusText>
                      </AttendanceStatusLeft>
                    </AttendanceStatusContent>
                    {(displayType === ATTENDANCE_TYPE.LEAVE || displayType === ATTENDANCE_TYPE.WORKATION) && currentAttendanceData && (
                      <AttendancePeriodBox $borderColor={displayConfig.borderColor}>
                        <AttendancePeriodLabel>
                          {displayType === ATTENDANCE_TYPE.LEAVE ? '휴가 기간' : '워케이션 기간'}
                        </AttendancePeriodLabel>
                        <AttendancePeriodValue>{getAttendancePeriod()}</AttendancePeriodValue>
                      </AttendancePeriodBox>
                    )}
                  </AttendanceStatusCard>
                );
              })()}
            </TodayStatusCard>

            {/* 피드백/마감일/신청현황 그리드 */}
            <QuickInfoGrid>
              {/* 피드백 */}
              <QuickInfoCard>
                <QuickInfoHeader>
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <QuickInfoTitle>피드백</QuickInfoTitle>
                </QuickInfoHeader>
                <QuickInfoList>
                  {feedbacks.slice(0, 2).map((feedback) => (
                    <FeedbackItem key={feedback.id} $borderColor={feedback.projectColor || '#6E8FB3'} $isUnread={!feedback.isRead}>
                      <FeedbackItemHeader>
                        <FeedbackProject>{feedback.project}</FeedbackProject>
                        {!feedback.isRead && <FeedbackUnreadDot />}
                      </FeedbackItemHeader>
                      <FeedbackContent>{feedback.content}</FeedbackContent>
                      <FeedbackMeta>
                        {feedback.from} · {feedback.date}
                      </FeedbackMeta>
                    </FeedbackItem>
                  ))}
                </QuickInfoList>
                {feedbacks.length > 2 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setShowFeedbackModal(true)}>
                    전체보기 ({feedbacks.length})
                  </Button>
                )}
              </QuickInfoCard>

              {/* 다음 연재 프로젝트 */}
              <QuickInfoCard>
                <QuickInfoHeader>
                  <Clock className="w-4 h-4 text-primary" />
                  <QuickInfoTitle>다음 연재 프로젝트</QuickInfoTitle>
                </QuickInfoHeader>
                <QuickInfoList>
                  {deadlineProjects.map((project) => (
                    <DeadlineItem key={project.id} $isUrgent={project.urgent}>
                      <DeadlineName>{project.name}</DeadlineName>
                      <DeadlineMeta>
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <DeadlineDate>{project.deadline}</DeadlineDate>
                      </DeadlineMeta>
                    </DeadlineItem>
                  ))}
                </QuickInfoList>
                {deadlineProjects.length > 2 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setShowDeadlineModal(true)}>
                    전체보기 ({deadlineProjects.length})
                  </Button>
                )}
              </QuickInfoCard>

              {/* 신청 현황 */}
              <QuickInfoCard>
                <AttendanceRequestCardHeader onClick={() => setShowAttendanceModal(true)}>
                  <div>
                    <FileText className="w-4 h-4" />
                    <QuickInfoTitle>신청 현황</QuickInfoTitle>
                  </div>
                  {attendanceRequests.length >= 1 && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </AttendanceRequestCardHeader>
                {attendanceRequests.length >= 1 && (
                  <AttendanceRequestCardList>
                    {attendanceRequests.slice(0, 2).map((request) => {
                      const statusColor = 
                        request.status === REQUEST_STATUS.PENDING ? '#F59E0B' :
                        request.status === REQUEST_STATUS.APPROVED ? '#10B981' :
                        '#EF4444';
                      
                      return (
                        <AttendanceRequestCardItem key={request.id}>
                          <AttendanceRequestCardItemContent>
                            <AttendanceRequestCardItemTitle>{request.typeName || request.type}</AttendanceRequestCardItemTitle>
                            <AttendanceRequestCardItemDate>{request.startDate} ~ {request.endDate}</AttendanceRequestCardItemDate>
                          </AttendanceRequestCardItemContent>
                          <AttendanceRequestCardItemBadge $statusColor={statusColor}>
                            {request.status}
                          </AttendanceRequestCardItemBadge>
                        </AttendanceRequestCardItem>
                      );
                    })}
                  </AttendanceRequestCardList>
                )}
              </QuickInfoCard>
            </QuickInfoGrid>

            {/* 오늘 할 일 - 캘린더 DB 연동 */}
            <TasksCard>
              <TasksTitle>오늘 할 일</TasksTitle>
              <TasksList>
                {isLoadingTasks ? (
                  <EmptyState>
                    <EmptyStateText>로딩 중...</EmptyStateText>
                  </EmptyState>
                ) : tasks.length === 0 ? (
                  <EmptyState>
                    <EmptyStateIcon>
                      <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    </EmptyStateIcon>
                    <EmptyStateText>아직 할 일이 없습니다. 캘린더에 일정을 추가해보세요.</EmptyStateText>
                  </EmptyState>
                ) : (
                  [...tasks]
                    .sort((a, b) => {
                      const aCompleted = taskStatuses[a.id] === TASK_STATUS.COMPLETED;
                      const bCompleted = taskStatuses[b.id] === TASK_STATUS.COMPLETED;
                      if (aCompleted && !bCompleted) return 1;
                      if (!aCompleted && bCompleted) return -1;
                      return (a.urgent ? 0 : 1) - (b.urgent ? 0 : 1) || (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
                    })
                    .map((task) => {
                      const isCompleted = taskStatuses[task.id] === TASK_STATUS.COMPLETED;
                    return (
                      <TaskItem key={task.id} $isUrgent={task.urgent} $isCompleted={isCompleted}>
                        <TaskItemHeader>
                          <TaskProject>{task.project}</TaskProject>
                          <TaskCompleteButton
                            $isCompleted={isCompleted}
                            onClick={() => toggleTaskStatus(task.id)}
                          >
                            {isCompleted ? '완료' : '진행 중'}
                          </TaskCompleteButton>
                        </TaskItemHeader>
                        <TaskContent>
                          <TaskTitle $isCompleted={isCompleted} $isUrgent={task.urgent}>
                            {task.title}
                          </TaskTitle>
                        </TaskContent>
                        <TaskBadgeContainer>
                          <TaskBadge 
                            $badgeColor={task.badgeColor}
                            className="text-xs"
                          >
                            {task.badge}
                          </TaskBadge>
                        </TaskBadgeContainer>
                        <TaskDescription $isCompleted={isCompleted}>{task.description || '마감일까지 완료하기'}</TaskDescription>
                      </TaskItem>
                    );
                  })
                )}
              </TasksList>
            </TasksCard>
          </MainColumn>

          {/* 오른쪽 사이드바 - 메모 */}
          <SidebarColumn>
            <MemoButton onClick={() => setShowMemoModal(true)}>
              <Edit2 className="w-4 h-4" />
              메모 추가
            </MemoButton>

            {memos.map((memo) => {
              const memoColorConfig = MEMO_COLORS.find((c) => c.bg === memo.color);
              return (
                <MemoCard key={memo.id}>
                  <MemoHeader>
                    <MemoTitle>{memo.title}</MemoTitle>
                    <MemoActions>
                      <Button variant="ghost" size="sm" onClick={() => handleEditMemo(memo.id)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMemoClick(memo.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </MemoActions>
                  </MemoHeader>
                  <MemoContent>{memo.content}</MemoContent>
                </MemoCard>
              );
            })}
          </SidebarColumn>
        </MainLayoutGrid>
      </ArtistDashboardBody>

      {/* 건강 체크 모달 */}
      <Modal isOpen={showHealthSurvey} onClose={() => setShowHealthSurvey(false)} title="건강 체크" maxWidth="lg">
        <ModalForm>
          <p className="text-sm text-muted-foreground">작업을 시작하기 전에 간단한 건강 체크를 진행합니다.</p>

          <FormRow>
            <FormLabel>
              오늘 컨디션 <span className="text-red-500">*</span>
            </FormLabel>
            <ConditionButtonGrid>
              {HEALTH_CONDITION_OPTIONS.map((option) => (
                <ConditionButton
                  key={option.value}
                  type="button"
                  onClick={() => setHealthSurvey({ ...healthSurvey, condition: option.value })}
                  $isSelected={healthSurvey.condition === option.value}
                >
                  {option.label}
                </ConditionButton>
              ))}
            </ConditionButtonGrid>
          </FormRow>

          <FormRow>
            <FormLabel>
              수면 시간 <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              type="text"
              placeholder="예: 7시간"
              value={healthSurvey.sleepHours}
              onChange={(e) => setHealthSurvey({ ...healthSurvey, sleepHours: e.target.value })}
            />
          </FormRow>

          <FormRow>
            <FormLabel>
              신체 불편함 (0-10) <span className="text-red-500">*</span>
            </FormLabel>
            <RangeContainer>
              <input
                type="range"
                min="0"
                max="10"
                value={healthSurvey.discomfortLevel}
                onChange={(e) => setHealthSurvey({ ...healthSurvey, discomfortLevel: parseInt(e.target.value) })}
                className="w-full"
              />
              <RangeLabels>
                <span>없음</span>
                <RangeValue>{healthSurvey.discomfortLevel}</RangeValue>
                <span>매우 불편함</span>
              </RangeLabels>
            </RangeContainer>
          </FormRow>

          <FormRow>
            <FormLabel>메모 (선택사항)</FormLabel>
            <FormTextarea
              placeholder="특이사항을 입력하세요"
              value={healthSurvey.notes}
              onChange={(e) => setHealthSurvey({ ...healthSurvey, notes: e.target.value })}
              rows={3}
            />
          </FormRow>

          <ModalActions>
            <Button variant="outline" className="flex-1" onClick={handleCancelHealthCheck}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleHealthSurveySubmit} disabled={!isHealthSurveyValid()}>
              완료
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      {/* 출근 종료 확인 모달 */}
      <Modal isOpen={showStopConfirm} onClose={() => setShowStopConfirm(false)} title="출근 종료 확인" maxWidth="sm">
        <WarningBox>
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <WarningContent>
            <WarningDescription>출근을 종료하시겠습니까?</WarningDescription>
          </WarningContent>
        </WarningBox>
        <ModalActions>
          <Button variant="outline" className="flex-1" onClick={() => setShowStopConfirm(false)}>
            취소
          </Button>
          <Button variant="destructive" className="flex-1" onClick={confirmStopWork}>
            종료
          </Button>
        </ModalActions>
      </Modal>

      {/* 메모 추가 모달 */}
      <Modal isOpen={showMemoModal && !editingMemoId} onClose={() => setShowMemoModal(false)} title="새 메모" maxWidth="md">
        <ModalForm>
          <FormRow>
            <FormLabel>메모 제목</FormLabel>
            <FormInput
              placeholder="제목을 입력하세요..."
              value={currentMemoTitle}
              onChange={(e) => setCurrentMemoTitle(e.target.value)}
            />
          </FormRow>

          <FormRow>
            <FormLabel>메모 내용</FormLabel>
            <FormTextarea
              placeholder="메모를 입력하세요..."
              value={currentMemoText}
              onChange={(e) => setCurrentMemoText(e.target.value)}
              rows={6}
            />
          </FormRow>

          <ModalActions>
            <Button variant="outline" className="flex-1" onClick={handleCancelMemo}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleSaveMemo}>
              저장
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      {/* 메모 수정 모달 */}
      <Modal isOpen={showMemoModal && !!editingMemoId} onClose={() => setShowMemoModal(false)} title="메모 수정" maxWidth="md">
        <ModalForm>
          <FormRow>
            <FormLabel>메모 제목</FormLabel>
            <FormInput
              placeholder="제목을 입력하세요..."
              value={currentMemoTitle}
              onChange={(e) => setCurrentMemoTitle(e.target.value)}
            />
          </FormRow>

          <FormRow>
            <FormLabel>메모 내용</FormLabel>
            <FormTextarea
              placeholder="메모를 입력하세요..."
              value={currentMemoText}
              onChange={(e) => setCurrentMemoText(e.target.value)}
              rows={6}
            />
          </FormRow>

          <ModalActions>
            <Button variant="outline" className="flex-1" onClick={handleCancelMemo}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleSaveMemo}>
              저장
            </Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      {/* 메모 삭제 확인 모달 */}
      <Modal isOpen={showDeleteMemoConfirm} onClose={() => { setShowDeleteMemoConfirm(false); setMemoToDelete(null); }} title="메모 삭제 확인" maxWidth="sm">
        <WarningBox>
          <WarningContent>
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div>
              <WarningTitle>정말 메모를 삭제하시겠습니까?</WarningTitle>
              <WarningDescription>삭제한 메모는 복구할 수 없습니다.</WarningDescription>
            </div>
          </WarningContent>
        </WarningBox>
        <ModalActions>
          <Button
            variant="outline"
            onClick={() => { setShowDeleteMemoConfirm(false); setMemoToDelete(null); }}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteMemoConfirm}
          >
            삭제
          </Button>
        </ModalActions>
      </Modal>

      {/* 피드백 모달 */}
      <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="피드백" maxWidth="lg">
        <ModalList>
          {feedbacks.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              </EmptyStateIcon>
              <EmptyStateText>아직 피드백이 없습니다.</EmptyStateText>
            </EmptyState>
          ) : (
            feedbacks.map((feedback) => (
              <ModalListItem
                key={feedback.id}
                $borderColor={feedback.projectColor || '#6E8FB3'}
                $bgColor={!feedback.isRead ? 'color-mix(in srgb, #3b82f6 10%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)'}
                $hasShadow={!feedback.isRead}
              >
                <ModalListItemHeader>
                  <ModalListItemContent>
                    <ModalListItemBadges>
                      <Badge variant="outline" className="text-xs">
                        {feedback.project}
                      </Badge>
                      {!feedback.isRead && <Badge className="bg-blue-500 text-xs">새 피드백</Badge>}
                    </ModalListItemBadges>
                    {feedback.cardTitle && <ModalListItemTitle>{feedback.cardTitle}</ModalListItemTitle>}
                    <ModalListItemText>{feedback.content}</ModalListItemText>
                    <ModalListItemMeta>
                      <ModalListItemMetaLeft>
                        <span className="font-medium">{feedback.from}</span>
                        <span>•</span>
                        <span>{feedback.date}</span>
                      </ModalListItemMetaLeft>
                    </ModalListItemMeta>
                  </ModalListItemContent>
                </ModalListItemHeader>
              </ModalListItem>
            ))
          )}
        </ModalList>
      </Modal>

      {/* 할 일 모달 */}
      <Modal isOpen={showTasksModal} onClose={() => setShowTasksModal(false)} title="오늘 할 일" maxWidth="lg">
        <TaskModalList>
          {tasks.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              </EmptyStateIcon>
              <EmptyStateText>아직 할 일이 없습니다. 캘린더에 일정을 추가해보세요.</EmptyStateText>
            </EmptyState>
          ) : (
            tasks.map((task) => {
              const isCompleted = taskStatuses[task.id] === TASK_STATUS.COMPLETED;
              return (
                <TaskModalItem key={task.id}>
                  <TaskModalItemHeader>
                    <TaskModalBadge>{task.project}</TaskModalBadge>
                    <TaskCompleteButton
                      $isCompleted={isCompleted}
                      onClick={() => toggleTaskStatus(task.id)}
                    >
                      {isCompleted ? '완료' : '진행 중'}
                    </TaskCompleteButton>
                  </TaskModalItemHeader>
                  <TaskModalTitleLabel>제목</TaskModalTitleLabel>
                  <TaskModalTitle $isCompleted={isCompleted}>{task.title}</TaskModalTitle>
                  <TaskModalDescriptionLabel>설명</TaskModalDescriptionLabel>
                  <TaskModalDescription $isCompleted={isCompleted}>{task.description || '마감일까지 완료하기'}</TaskModalDescription>
                  <TaskModalMeta>
                    {task.daysLeft !== null ? `남은 일수 • ${task.badge}` : task.badge}
                  </TaskModalMeta>
                </TaskModalItem>
              );
            })
          )}
        </TaskModalList>
      </Modal>

      {/* 마감일 모달 */}
      <Modal isOpen={showDeadlineModal} onClose={() => setShowDeadlineModal(false)} title="다음 연재 프로젝트" maxWidth="lg">
        <ModalList>
          {deadlineProjects.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              </EmptyStateIcon>
              <EmptyStateText>아직 다음 연재 프로젝트가 없습니다.</EmptyStateText>
            </EmptyState>
          ) : (
            deadlineProjects.map((project) => (
              <ModalListItem
                key={project.id}
                $borderColor={project.urgent ? '#ef4444' : 'var(--border)'}
                $bgColor={project.urgent ? 'color-mix(in srgb, #ef4444 10%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)'}
                $hasShadow={project.urgent}
              >
                <ModalListItemHeader>
                  <ModalListItemContent>
                    <ModalListItemBadges>
                      <Badge variant="outline" className="text-xs">
                        프로젝트
                      </Badge>
                      {project.urgent && <Badge className="bg-red-500 text-xs">긴급</Badge>}
                    </ModalListItemBadges>
                    <ModalListItemTitle>{project.name}</ModalListItemTitle>
                    <ModalListItemText>마감일: {project.deadline}</ModalListItemText>
                  </ModalListItemContent>
                </ModalListItemHeader>
              </ModalListItem>
            ))
          )}
        </ModalList>
      </Modal>

      {/* 근태 신청 모달 */}
      <Modal 
        isOpen={showAttendanceModal} 
        onClose={() => setShowAttendanceModal(false)} 
        title={
          <ModalTitleWrapper>
            <FileText className="w-5 h-5" />
            <span>신청 현황 목록</span>
          </ModalTitleWrapper>
        }
        maxWidth="lg"
      >
        <AttendanceRequestModalContent>
          <AttendanceRequestList>
            {attendanceRequests.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>
                  <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                </EmptyStateIcon>
                <EmptyStateText>아직 신청 현황이 없습니다.</EmptyStateText>
              </EmptyState>
            ) : (
              attendanceRequests.map((request) => {
                const statusColor = 
                  request.status === REQUEST_STATUS.PENDING ? '#F59E0B' :
                  request.status === REQUEST_STATUS.APPROVED ? '#10B981' :
                  '#EF4444';
                
                return (
                  <AttendanceRequestCard key={request.id}>
                    <AttendanceRequestCardContent>
                      <AttendanceRequestStatusBadge $statusColor={statusColor}>
                        {request.status}
                      </AttendanceRequestStatusBadge>
                      <AttendanceRequestInfo>
                        <AttendanceRequestTypeText>{request.typeName || request.type}</AttendanceRequestTypeText>
                        <AttendanceRequestDateText>{request.startDate} ~ {request.endDate}</AttendanceRequestDateText>
                      </AttendanceRequestInfo>
                      {request.status === REQUEST_STATUS.PENDING && (
                        <AttendanceRequestActions>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAttendanceRequest(request)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAttendanceRequest(request)}
                          >
                            삭제
                          </Button>
                        </AttendanceRequestActions>
                      )}
                      {request.status === REQUEST_STATUS.REJECTED && (
                        <AttendanceRequestActions>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAttendanceRequest(request)}
                          >
                            삭제
                          </Button>
                        </AttendanceRequestActions>
                      )}
                    </AttendanceRequestCardContent>
                  </AttendanceRequestCard>
                );
              })
            )}
          </AttendanceRequestList>
          
          {/* 하단 통계 */}
          {attendanceRequests.length > 0 && (
            <AttendanceRequestSummary>
              <AttendanceRequestSummaryItem>
                <AttendanceRequestSummaryNumber>{attendanceRequests.length}</AttendanceRequestSummaryNumber>
                <AttendanceRequestSummaryLabel>전체</AttendanceRequestSummaryLabel>
              </AttendanceRequestSummaryItem>
              <AttendanceRequestSummaryItem>
                <AttendanceRequestSummaryNumber $color="#10B981">
                  {attendanceRequests.filter(r => r.status === REQUEST_STATUS.APPROVED).length}
                </AttendanceRequestSummaryNumber>
                <AttendanceRequestSummaryLabel>승인</AttendanceRequestSummaryLabel>
              </AttendanceRequestSummaryItem>
              <AttendanceRequestSummaryItem>
                <AttendanceRequestSummaryNumber $color="#F59E0B">
                  {attendanceRequests.filter(r => r.status === REQUEST_STATUS.PENDING).length}
                </AttendanceRequestSummaryNumber>
                <AttendanceRequestSummaryLabel>대기</AttendanceRequestSummaryLabel>
              </AttendanceRequestSummaryItem>
              <AttendanceRequestSummaryItem>
                <AttendanceRequestSummaryNumber $color="#EF4444">
                  {attendanceRequests.filter(r => r.status === REQUEST_STATUS.REJECTED).length}
                </AttendanceRequestSummaryNumber>
                <AttendanceRequestSummaryLabel>반려</AttendanceRequestSummaryLabel>
              </AttendanceRequestSummaryItem>
            </AttendanceRequestSummary>
          )}
        </AttendanceRequestModalContent>
      </Modal>

      {/* 근태 신청 수정 모달 */}
      <LeaveRequestEditModal
        open={showEditAttendanceModal}
        onOpenChange={setShowEditAttendanceModal}
        request={editingAttendanceRequest}
        onSuccess={() => {
          setAttendanceRequestsRefreshTrigger((prev) => prev + 1);
          setEditingAttendanceRequest(null);
        }}
      />
    </ArtistDashboardRoot>
  );
}
