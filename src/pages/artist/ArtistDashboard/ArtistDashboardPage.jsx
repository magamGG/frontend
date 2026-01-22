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
} from 'lucide-react';
import { toast } from 'sonner';
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
  TaskContent,
  TaskTitle,
  TaskDescription,
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
} from './ArtistDashboardPage.styled';

// 근태 상태 타입 정의
const ATTENDANCE_TYPE = {
  OFFICE: '출근',
  REMOTE: '재택근무',
  LEAVE: '휴가',
  WORKATION: '워케이션',
};

// 근태 상태별 색상 설정
const ATTENDANCE_STATUS_CONFIG = {
  [ATTENDANCE_TYPE.OFFICE]: {
    bgColor: '#E8F6F8',
    borderColor: 'rgba(0, 172, 193, 0.2)',
    iconBgColor: 'rgba(0, 172, 193, 0.1)',
    iconColor: '#00ACC1',
    icon: Building2,
  },
  [ATTENDANCE_TYPE.REMOTE]: {
    bgColor: '#FFF4E6',
    borderColor: 'rgba(255, 152, 0, 0.2)',
    iconBgColor: 'rgba(255, 152, 0, 0.1)',
    iconColor: '#FF9800',
    icon: Home,
  },
  [ATTENDANCE_TYPE.LEAVE]: {
    bgColor: '#F5F5F5',
    borderColor: 'rgba(117, 117, 117, 0.2)',
    iconBgColor: 'rgba(117, 117, 117, 0.1)',
    iconColor: '#757575',
    icon: Calendar,
  },
  [ATTENDANCE_TYPE.WORKATION]: {
    bgColor: '#F6F3FA',
    borderColor: 'rgba(156, 39, 176, 0.2)',
    iconBgColor: 'rgba(156, 39, 176, 0.1)',
    iconColor: '#9C27B0',
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

// TODO: Zustand store mapping - 마감일 프로젝트 목록
const initialDeadlineProjects = [
  { id: 1, name: '에피소드 42 연재', deadline: '오늘 자정', urgent: true },
  { id: 2, name: '에피소드 43 스케치', deadline: '1월 17일', urgent: false },
];

// TODO: Zustand store mapping - 근태 신청 목록
const initialAttendanceRequests = [
  {
    id: '1',
    type: ATTENDANCE_TYPE.LEAVE,
    startDate: '1월 20일',
    endDate: '1월 22일',
    status: REQUEST_STATUS.PENDING,
  },
  {
    id: '2',
    type: ATTENDANCE_TYPE.REMOTE,
    startDate: '1월 16일',
    endDate: '1월 16일',
    status: REQUEST_STATUS.APPROVED,
  },
];

// TODO: Zustand store mapping - 오늘 할 일 목록
const initialTasks = [
  {
    id: 1,
    project: '내 웹툰',
    title: '에피소드 42 연재',
    description: '오늘 자정까지 업로드 필수',
    daysLeft: 0,
    badge: 'D-0 마감',
    badgeColor: 'destructive',
    urgent: true,
  },
  {
    id: 2,
    project: '내 웹툰',
    title: '에피소드 43 스케치',
    description: '초안 완성도 50% 목표',
    daysLeft: 2,
    badge: 'D-2',
    badgeColor: 'blue',
    urgent: false,
  },
  {
    id: 3,
    project: '신작',
    title: '신작 캐릭터 디자인',
    description: '주인공 및 조연 디자인 초안',
    daysLeft: null,
    badge: '기획',
    badgeColor: 'purple',
    urgent: false,
  },
];

export function ArtistDashboardPage() {
  const [isWorking, setIsWorking] = useState(false);
  const [healthCheckCompleted, setHealthCheckCompleted] = useState(false);
  const [showHealthSurvey, setShowHealthSurvey] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [currentMemoTitle, setCurrentMemoTitle] = useState('');
  const [currentMemoText, setCurrentMemoText] = useState('');
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [memos, setMemos] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState({
    1: TASK_STATUS.IN_PROGRESS,
    2: TASK_STATUS.IN_PROGRESS,
    3: TASK_STATUS.IN_PROGRESS,
  });
  const [currentAttendanceType, setCurrentAttendanceType] = useState(ATTENDANCE_TYPE.WORKATION);
  const [healthSurvey, setHealthSurvey] = useState({
    condition: HEALTH_CONDITION.NORMAL,
    sleepHours: '',
    discomfortLevel: 0,
    notes: '',
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [deadlineProjects] = useState(initialDeadlineProjects);
  const [attendanceRequests] = useState(initialAttendanceRequests);

  const today = new Date();
  const todayString = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  const todayFullDate = '2026년 1월 15일 수요일';

  // localStorage에서 메모 로드
  useEffect(() => {
    const storedMemos = localStorage.getItem('artistMemos');
    if (storedMemos) {
      setMemos(JSON.parse(storedMemos));
    }
  }, []);

  // 메모 저장 시 localStorage에도 저장
  useEffect(() => {
    if (memos.length > 0) {
      localStorage.setItem('artistMemos', JSON.stringify(memos));
    }
  }, [memos]);

  // localStorage에서 현재 근태 상태 확인
  useEffect(() => {
    const checkCurrentAttendance = () => {
      const storedAttendance = localStorage.getItem('artistAttendanceRequests');
      if (storedAttendance) {
        const requests = JSON.parse(storedAttendance);
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        const currentRequest = requests.find((req) => {
          if (req.status !== REQUEST_STATUS.APPROVED) return false;
          const startDate = new Date(req.startDate).toISOString().split('T')[0];
          const endDate = new Date(req.endDate).toISOString().split('T')[0];
          return todayString >= startDate && todayString <= endDate;
        });

        if (currentRequest && (currentRequest.type === ATTENDANCE_TYPE.WORKATION || currentRequest.type === ATTENDANCE_TYPE.LEAVE)) {
          setCurrentAttendanceType(currentRequest.type);
        } else {
          setCurrentAttendanceType(null);
        }
      }
    };

    checkCurrentAttendance();
    const interval = setInterval(checkCurrentAttendance, 1000);
    return () => clearInterval(interval);
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
    if (!healthCheckCompleted) {
      setShowStopConfirm(true);
    } else {
      setIsWorking(false);
      setHealthCheckCompleted(false);
      toast.success('작업을 종료했습니다.');
    }
  };

  // 작업 종료 확인 핸들러
  const confirmStopWork = () => {
    setIsWorking(false);
    setHealthCheckCompleted(false);
    setShowStopConfirm(false);
    toast.success('작업을 종료했습니다.');
  };

  // 건강 체크 유효성 검사
  const isHealthSurveyValid = () => {
    return healthSurvey.sleepHours.trim() !== '';
  };

  // 건강 체크 제출 핸들러
  const handleHealthSurveySubmit = () => {
    if (!isHealthSurveyValid()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }
    setIsWorking(true);
    setHealthCheckCompleted(true);
    setShowHealthSurvey(false);
    toast.success('건강 체크가 완료되었습니다. 좋은 하루 되세요!');
  };

  // 건강 체크 취소 핸들러
  const handleCancelHealthCheck = () => {
    setShowHealthSurvey(false);
    toast.info('건강 체크를 취소했습니다. 작업이 시작되지 않았습니다.');
  };

  // 할 일 상태 토글
  const toggleTaskStatus = (taskId) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [taskId]: prev[taskId] === TASK_STATUS.IN_PROGRESS ? TASK_STATUS.COMPLETED : TASK_STATUS.IN_PROGRESS,
    }));
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

  // 메모 삭제 핸들러
  const handleDeleteMemo = (memoId) => {
    const updatedMemos = memos.filter((memo) => memo.id !== memoId);
    setMemos(updatedMemos);
    localStorage.setItem('artistMemos', JSON.stringify(updatedMemos));
    toast.success('메모가 삭제되었습니다.');
  };

  // 현재 근태 상태 설정
  const currentStatusConfig = currentAttendanceType ? ATTENDANCE_STATUS_CONFIG[currentAttendanceType] : null;
  const StatusIcon = currentStatusConfig?.icon;

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
                    <TodayStatusTitle>{todayString}</TodayStatusTitle>
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
                  <Button onClick={isWorking ? handleStopWork : handleStartWork} className={isWorking ? 'bg-red-500 hover:bg-red-600' : ''} size="lg">
                    {isWorking ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        작업 종료
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        작업 시작
                      </>
                    )}
                  </Button>
                </TodayStatusHeaderRight>
              </TodayStatusHeader>

              {/* 현재 상태 선택 */}
              <StatusSelectContainer>
                <StatusSelectLabel>현재 상태 선택</StatusSelectLabel>
                <StatusSelect
                  value={currentAttendanceType || ''}
                  onChange={(e) => setCurrentAttendanceType(e.target.value || null)}
                >
                  <option value="">선택하세요</option>
                  <option value={ATTENDANCE_TYPE.OFFICE}>🏢 출근</option>
                  <option value={ATTENDANCE_TYPE.REMOTE}>🏠 재택근무</option>
                  <option value={ATTENDANCE_TYPE.LEAVE}>🌴 휴가</option>
                  <option value={ATTENDANCE_TYPE.WORKATION}>✈️ 워케이션</option>
                </StatusSelect>
              </StatusSelectContainer>

              {/* 근태 상태 표시 */}
              {currentAttendanceType && currentStatusConfig ? (
                <AttendanceStatusCard $bgColor={currentStatusConfig.bgColor} $borderColor={currentStatusConfig.borderColor}>
                  <AttendanceStatusContent>
                    <AttendanceStatusLeft>
                      <AttendanceStatusIconContainer $iconBgColor={currentStatusConfig.iconBgColor}>
                        <StatusIcon className="w-6 h-6" style={{ color: currentStatusConfig.iconColor }} />
                      </AttendanceStatusIconContainer>
                      <AttendanceStatusText>
                        <AttendanceStatusTitle>{currentAttendanceType} 중</AttendanceStatusTitle>
                        <AttendanceStatusDescription>
                          {currentAttendanceType === ATTENDANCE_TYPE.OFFICE
                            ? '사무실에서 작업 중입니다'
                            : currentAttendanceType === ATTENDANCE_TYPE.REMOTE
                            ? '자택에서 작업 중입니다'
                            : currentAttendanceType === ATTENDANCE_TYPE.LEAVE
                            ? '휴식 중입니다'
                            : '외부 환경에서 작업 중입니다'}
                        </AttendanceStatusDescription>
                      </AttendanceStatusText>
                    </AttendanceStatusLeft>
                  </AttendanceStatusContent>
                  {(currentAttendanceType === ATTENDANCE_TYPE.LEAVE || currentAttendanceType === ATTENDANCE_TYPE.WORKATION) && (
                    <AttendancePeriodBox $borderColor={currentStatusConfig.borderColor}>
                      <AttendancePeriodLabel>
                        {currentAttendanceType === ATTENDANCE_TYPE.LEAVE ? '휴가 기간' : '워케이션 기간'}
                      </AttendancePeriodLabel>
                      <AttendancePeriodValue>1월 15일 ~ 1월 22일</AttendancePeriodValue>
                    </AttendancePeriodBox>
                  )}
                </AttendanceStatusCard>
              ) : (
                <EmptyStatusCard>
                  <EmptyStatusIcon>
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </EmptyStatusIcon>
                  <EmptyStatusTitle>현재 상태를 선택해주세요</EmptyStatusTitle>
                  <EmptyStatusDescription>위의 드롭다운에서 오늘의 근무 상태를 선택하세요</EmptyStatusDescription>
                </EmptyStatusCard>
              )}
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

              {/* 오늘 마감 작품 */}
              <QuickInfoCard>
                <QuickInfoHeader>
                  <Clock className="w-4 h-4 text-primary" />
                  <QuickInfoTitle>오늘 마감 작품</QuickInfoTitle>
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
                <QuickInfoHeader>
                  <FileText className="w-4 h-4 text-primary" />
                  <QuickInfoTitle>신청 현황</QuickInfoTitle>
                </QuickInfoHeader>
                <QuickInfoList>
                  {attendanceRequests.map((request) => (
                    <AttendanceRequestItem key={request.id}>
                      <AttendanceRequestHeader>
                        <AttendanceRequestType>{request.type}</AttendanceRequestType>
                        <Badge className={`${getStatusBadgeColor(request.status)} text-xs`}>{request.status}</Badge>
                      </AttendanceRequestHeader>
                      <AttendanceRequestDate>
                        {request.startDate} ~ {request.endDate}
                      </AttendanceRequestDate>
                    </AttendanceRequestItem>
                  ))}
                </QuickInfoList>
                {attendanceRequests.length > 2 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setShowAttendanceModal(true)}>
                    전체보기 ({attendanceRequests.length})
                  </Button>
                )}
              </QuickInfoCard>
            </QuickInfoGrid>

            {/* 오늘 할 일 */}
            <TasksCard>
              <TasksTitle>오늘 할 일</TasksTitle>
              <TasksList>
                {initialTasks.map((task) => {
                  const isCompleted = taskStatuses[task.id] === TASK_STATUS.COMPLETED;
                  return (
                    <TaskItem key={task.id} $isUrgent={task.urgent}>
                      <TaskItemHeader>
                        <TaskProject>{task.project}</TaskProject>
                        <Button
                          size="sm"
                          variant={isCompleted ? 'default' : 'outline'}
                          onClick={() => toggleTaskStatus(task.id)}
                          className={isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          {isCompleted ? '완료' : '진행 중'}
                        </Button>
                      </TaskItemHeader>
                      <TaskContent>
                        <TaskTitle $isCompleted={isCompleted} $isUrgent={task.urgent}>
                          {task.title}
                        </TaskTitle>
                        <Badge variant={task.badgeColor === 'destructive' ? 'destructive' : 'default'} className="text-xs">
                          {task.badge}
                        </Badge>
                      </TaskContent>
                      <TaskDescription $isCompleted={isCompleted}>{task.description}</TaskDescription>
                    </TaskItem>
                  );
                })}
              </TasksList>
              {Object.keys(taskStatuses).length > 3 && (
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setShowTasksModal(true)}>
                  전체보기 ({Object.keys(taskStatuses).length})
                </Button>
              )}
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
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMemo(memo.id)}>
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

      {/* 작업 종료 확인 모달 */}
      <Modal isOpen={showStopConfirm} onClose={() => setShowStopConfirm(false)} title="작업 종료 확인" maxWidth="sm">
        <WarningBox>
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <WarningContent>
            <WarningTitle>건강 체크를 완료하지 않았습니다</WarningTitle>
            <WarningDescription>건강 체크 없이 작업을 종료하시겠습니까?</WarningDescription>
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

      {/* 메모 모달 */}
      <Modal isOpen={showMemoModal} onClose={() => setShowMemoModal(false)} title={editingMemoId ? '메모 수정' : '새 메모'} maxWidth="md">
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
        <ModalList>
          {Object.keys(taskStatuses).length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              </EmptyStateIcon>
              <EmptyStateText>아직 할 일이 없습니다.</EmptyStateText>
            </EmptyState>
          ) : (
            initialTasks.map((task) => {
              const isCompleted = taskStatuses[task.id] === TASK_STATUS.COMPLETED;
              return (
                <ModalListItem
                  key={task.id}
                  $borderColor={isCompleted ? '#10b981' : 'var(--border)'}
                  $bgColor={isCompleted ? 'color-mix(in srgb, #10b981 10%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)'}
                  $hasShadow={isCompleted}
                >
                  <ModalListItemHeader>
                    <ModalListItemContent>
                      <ModalListItemBadges>
                        <Badge variant="outline" className="text-xs">
                          {task.project}
                        </Badge>
                        {isCompleted && <Badge className="bg-green-500 text-xs">완료</Badge>}
                      </ModalListItemBadges>
                      <ModalListItemTitle>{task.title}</ModalListItemTitle>
                      <ModalListItemText>{task.description}</ModalListItemText>
                    </ModalListItemContent>
                  </ModalListItemHeader>
                </ModalListItem>
              );
            })
          )}
        </ModalList>
      </Modal>

      {/* 마감일 모달 */}
      <Modal isOpen={showDeadlineModal} onClose={() => setShowDeadlineModal(false)} title="오늘 마감 작품" maxWidth="lg">
        <ModalList>
          {deadlineProjects.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              </EmptyStateIcon>
              <EmptyStateText>아직 마감 작품이 없습니다.</EmptyStateText>
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
      <Modal isOpen={showAttendanceModal} onClose={() => setShowAttendanceModal(false)} title="신청 현황" maxWidth="lg">
        <ModalList>
          {attendanceRequests.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              </EmptyStateIcon>
              <EmptyStateText>아직 신청 현황이 없습니다.</EmptyStateText>
            </EmptyState>
          ) : (
            attendanceRequests.map((request) => (
              <ModalListItem
                key={request.id}
                $borderColor={request.status === REQUEST_STATUS.APPROVED ? '#10b981' : 'var(--border)'}
                $bgColor={request.status === REQUEST_STATUS.APPROVED ? 'color-mix(in srgb, #10b981 10%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)'}
                $hasShadow={request.status === REQUEST_STATUS.APPROVED}
              >
                <ModalListItemHeader>
                  <ModalListItemContent>
                    <ModalListItemBadges>
                      <Badge variant="outline" className="text-xs">
                        프로젝트
                      </Badge>
                      {request.status === REQUEST_STATUS.APPROVED && <Badge className="bg-green-500 text-xs">승인</Badge>}
                    </ModalListItemBadges>
                    <ModalListItemTitle>{request.type}</ModalListItemTitle>
                    <ModalListItemText>
                      기간: {request.startDate} ~ {request.endDate}
                    </ModalListItemText>
                  </ModalListItemContent>
                </ModalListItemHeader>
              </ModalListItem>
            ))
          )}
        </ModalList>
      </Modal>
    </ArtistDashboardRoot>
  );
}
