import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { 
  Play, 
  Square,
  Plus,
  X,
  AlertCircle,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  Building2,
  Home,
  Calendar,
  Palmtree,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

type TaskStatus = 'in-progress' | 'completed';

interface HealthSurvey {
  condition: 'tired' | 'normal' | 'good' | 'excellent';
  sleepHours: string;
  discomfortLevel: number;
  notes: string;
}

interface Feedback {
  id: string;
  project: string;
  projectColor?: string; // 프로젝트 색상 추가
  cardTitle?: string;
  content: string;
  from: string;
  date: string;
  isRead: boolean;
}

interface AttendanceRequest {
  id: string;
  type: '출근' | '재택근무' | '휴가' | '워케이션';
  startDate: string;
  endDate: string;
  status: '대기' | '승인' | '반려';
}

interface Memo {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

interface Task {
  id: number;
  project: string;
  title: string;
  description: string;
  daysLeft: number;
  badge: string;
  badgeColor: string;
  urgent?: boolean;
}

interface DeadlineProject {
  id: number;
  name: string;
  deadline: string;
  urgent: boolean;
}

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
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<Record<number, TaskStatus>>({
    1: 'in-progress',
    2: 'in-progress',
    3: 'in-progress',
    4: 'in-progress',
    5: 'in-progress',
  });
  const [currentAttendanceType, setCurrentAttendanceType] = useState<'출근' | '재택근무' | '워케이션' | '휴가' | null>('워케이션');
  
  // 근태 상태별 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case '워케이션':
        return 'bg-[#9C27B0]'; // 보라색
      case '휴가':
        return 'bg-[#757575]'; // 회색
      case '재택근무':
        return 'bg-[#FF9800]'; // 오렌지색
      case '출근':
        return 'bg-[#00ACC1]'; // 청록색
      default:
        return 'bg-gray-500';
    }
  };

  // 근태 상태별 텍스트 색상 반환
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case '워케이션':
        return 'text-[#9C27B0]'; // 보라색
      case '휴가':
        return 'text-[#757575]'; // 회색
      case '재택근무':
        return 'text-[#FF9800]'; // 오렌지색
      case '출근':
        return 'text-[#00ACC1]'; // 청록색
      default:
        return 'text-gray-500';
    }
  };
  
  const [healthSurvey, setHealthSurvey] = useState<HealthSurvey>({
    condition: 'normal',
    sleepHours: '',
    discomfortLevel: 0,
    notes: '',
  });

  // localStorage에서 피드백 로드
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // 메모 색상 배열
  const memoColors = [
    { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900' },
    { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900' },
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900' },
    { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900' },
    { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900' },
    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900' },
  ];

  // 랜덤 색상 선택 함수
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * memoColors.length);
    return randomIndex;
  };

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
        
        // 오늘 날짜에 해당하는 승인된 근태 요청 찾기
        const currentRequest = requests.find((req: any) => {
          if (req.status !== '승인') return false;
          const startDate = new Date(req.startDate).toISOString().split('T')[0];
          const endDate = new Date(req.endDate).toISOString().split('T')[0];
          return todayString >= startDate && todayString <= endDate;
        });
        
        if (currentRequest && (currentRequest.type === '워케이션' || currentRequest.type === '휴가')) {
          setCurrentAttendanceType(currentRequest.type);
        } else {
          setCurrentAttendanceType(null);
        }
      }
    };

    checkCurrentAttendance();
    // 주기적으로 체크 (1초마다)
    const interval = setInterval(checkCurrentAttendance, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // localStorage에서 피드백 불러오기
    const loadFeedbacks = () => {
      const stored = localStorage.getItem('artistFeedbacks');
      if (stored) {
        const allFeedbacks = JSON.parse(stored);
        setFeedbacks(allFeedbacks);
      } else {
        // 기본 샘플 데이터
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

    // 1초마다 피드백 새로고침 (새 코멘트 실시간 반영)
    const interval = setInterval(loadFeedbacks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock data for deadlines
  const deadlineProjects: DeadlineProject[] = [
    { id: 1, name: '에피소드 42 연재', deadline: '오늘 자정', urgent: true },
    { id: 2, name: '에피소드 43 스케치', deadline: '1월 17일', urgent: false },
  ];

  // Mock data for attendance requests
  const [attendanceRequests] = useState<AttendanceRequest[]>([
    {
      id: '1',
      type: '휴가',
      startDate: '1월 20일',
      endDate: '1월 22일',
      status: '대기',
    },
    {
      id: '2',
      type: '재택근무',
      startDate: '1월 16일',
      endDate: '1월 16일',
      status: '승인',
    },
  ]);

  const today = new Date();
  const todayString = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  const handleStartWork = () => {
    setShowHealthSurvey(true);
  };

  const handleStopWork = () => {
    if (!healthCheckCompleted) {
      setShowStopConfirm(true);
    } else {
      setIsWorking(false);
      setHealthCheckCompleted(false);
      toast.success('작업을 종료했습니다.');
    }
  };

  const confirmStopWork = () => {
    setIsWorking(false);
    setHealthCheckCompleted(false);
    setShowStopConfirm(false);
    toast.success('작업을 종료했습니다.');
  };

  const isHealthSurveyValid = () => {
    return healthSurvey.sleepHours.trim() !== '';
  };

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

  const handleCancelHealthCheck = () => {
    setShowHealthSurvey(false);
    toast.info('건강 체크를 취소했습니다. 작업이 시작되지 않았습니다.');
  };

  const toggleTaskStatus = (taskId: number) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: prev[taskId] === 'in-progress' ? 'completed' : 'in-progress'
    }));
  };

  const handleSaveMemo = () => {
    if (currentMemoText.trim()) {
      if (editingMemoId) {
        // 기존 메모 수정
        const updatedMemos = memos.map(memo => 
          memo.id === editingMemoId 
            ? { ...memo, title: currentMemoTitle || '새 메모', content: currentMemoText }
            : memo
        );
        setMemos(updatedMemos);
        localStorage.setItem('artistMemos', JSON.stringify(updatedMemos));
        toast.success('메모가 수정되었습니다.');
      } else {
        // 새 메모 추가
        const newMemo: Memo = {
          id: Date.now().toString(),
          title: currentMemoTitle || '새 메모',
          content: currentMemoText,
          color: memoColors[getRandomColor()].bg,
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

  const handleCancelMemo = () => {
    setShowMemoModal(false);
    setCurrentMemoText('');
    setCurrentMemoTitle('');
    setEditingMemoId(null);
  };

  const handleEditMemo = (memoId: string) => {
    const memoToEdit = memos.find(memo => memo.id === memoId);
    if (memoToEdit) {
      setCurrentMemoTitle(memoToEdit.title);
      setCurrentMemoText(memoToEdit.content);
      setEditingMemoId(memoId);
      setShowMemoModal(true);
    }
  };

  const handleDeleteMemo = (memoId: string) => {
    setMemos(memos.filter(memo => memo.id !== memoId));
    localStorage.setItem('artistMemos', JSON.stringify(memos.filter(memo => memo.id !== memoId)));
    toast.success('메모가 삭제되었습니다.');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '대기':
        return 'bg-yellow-500';
      case '승인':
        return 'bg-green-500';
      case '반려':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Status */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">{todayString}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">2026년 1월 15일 수요일</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isWorking && !healthCheckCompleted && (
                      <div className="flex items-center gap-1 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-yellow-700 font-medium">건강 체크 미완료</span>
                      </div>
                    )}
                    <Button 
                      onClick={isWorking ? handleStopWork : handleStartWork}
                      className={isWorking ? "bg-red-500 hover:bg-red-600" : ""}
                      size="lg"
                    >
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
                  </div>
                </div>

                {/* Current Status Display */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">현재 상태 선택</label>
                  <select
                    value={currentAttendanceType || ''}
                    onChange={(e) => setCurrentAttendanceType(e.target.value as any || null)}
                    className="w-full px-4 py-2.5 border-2 border-border rounded-lg bg-background text-foreground font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">선택하세요</option>
                    <option value="출근">🏢 출근</option>
                    <option value="재택근무">🏠 재택근무</option>
                    <option value="휴가">🌴 휴가</option>
                    <option value="워케이션">✈️ 워케이션</option>
                  </select>
                </div>

                {/* 출근 상태 디자인 */}
                {currentAttendanceType === '출근' && (
                  <div className="p-6 bg-[#E8F6F8] rounded-xl shadow-sm border border-[#00ACC1]/20">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#00ACC1]/10 rounded-lg">
                          <Building2 className="w-6 h-6 text-[#00ACC1]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#1F2328] mb-1">출근 중</h3>
                          <p className="text-sm text-[#1F2328]/60">사무실에서 작업 중입니다</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 재택근무 상태 디자인 */}
                {currentAttendanceType === '재택근무' && (
                  <div className="p-6 bg-[#FFF4E6] rounded-xl shadow-sm border border-[#FF9800]/20">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#FF9800]/10 rounded-lg">
                          <Home className="w-6 h-6 text-[#FF9800]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#1F2328] mb-1">재택근무 중</h3>
                          <p className="text-sm text-[#1F2328]/60">자택에서 작업 중입니다</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 휴가 상태 디자인 */}
                {currentAttendanceType === '휴가' && (
                  <div className="p-6 bg-[#F5F5F5] rounded-xl shadow-sm border border-[#757575]/20">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#757575]/10 rounded-lg">
                          <Calendar className="w-6 h-6 text-[#757575]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#1F2328] mb-1">휴가 중</h3>
                          <p className="text-sm text-[#1F2328]/60">휴식 중입니다</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-[#757575]/10">
                      <p className="text-xs text-[#1F2328]/50 mb-1">휴가 기간</p>
                      <p className="text-base font-medium text-[#1F2328]">1월 15일 ~ 1월 22일</p>
                    </div>
                  </div>
                )}

                {/* 워케이션 상태 디자인 */}
                {currentAttendanceType === '워케이션' && (
                  <div className="p-6 bg-[#F6F3FA] rounded-xl shadow-sm border border-[#9C27B0]/20">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#9C27B0]/10 rounded-lg">
                          <Palmtree className="w-6 h-6 text-[#9C27B0]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#1F2328] mb-1">워케이션 중</h3>
                          <p className="text-sm text-[#1F2328]/60">외부 환경에서 작업 중입니다</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-[#9C27B0]/10">
                      <p className="text-xs text-[#1F2328]/50 mb-1">워케이션 기간</p>
                      <p className="text-base font-medium text-[#1F2328]">1월 15일 ~ 1월 22일</p>
                    </div>
                  </div>
                )}

                {/* 상태 미선택 */}
                {!currentAttendanceType && (
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">현재 상태를 선택해주세요</h3>
                      <p className="text-sm text-gray-500">위의 드롭다운에서 오늘의 근무 상태를 선택하세요</p>
                    </div>
                  </div>
                )}
              </Card>

              {/* New Container: Feedback, Deadline, Attendance Request */}
              <div className="grid grid-cols-3 gap-4">
                {/* Feedback */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-foreground">피드백</h4>
                  </div>
                  <div className="space-y-2">
                    {feedbacks.slice(0, 2).map((feedback) => (
                      <div 
                        key={feedback.id} 
                        className={`p-2 rounded-md border-l-4 ${!feedback.isRead ? 'bg-blue-50 border-blue-200' : 'bg-muted/30 border-border'}`}
                        style={{ borderLeftColor: feedback.projectColor || '#6E8FB3' }}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-xs font-medium text-foreground">{feedback.project}</p>
                          {!feedback.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{feedback.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{feedback.from} · {feedback.date}</p>
                      </div>
                    ))}
                  </div>
                  {feedbacks.length > 2 && (
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setShowFeedbackModal(true)}>
                      전체보기 ({feedbacks.length})
                    </Button>
                  )}
                </Card>

                {/* Today's Deadline */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-foreground">오늘 마감 작품</h4>
                  </div>
                  <div className="space-y-2">
                    {deadlineProjects.map((project) => (
                      <div key={project.id} className={`p-2 rounded-md border ${project.urgent ? 'bg-red-50 border-red-200' : 'bg-muted/30 border-border'}`}>
                        <p className="text-xs font-medium text-foreground">{project.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{project.deadline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {deadlineProjects.length > 2 && (
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setShowDeadlineModal(true)}>
                      전체보기 ({deadlineProjects.length})
                    </Button>
                  )}
                </Card>

                {/* Attendance Request Status */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-foreground">신청 현황</h4>
                  </div>
                  <div className="space-y-2">
                    {attendanceRequests.map((request) => (
                      <div key={request.id} className="p-2 rounded-md border bg-muted/30 border-border">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-foreground">{request.type}</p>
                          <Badge className={`${getStatusBadgeColor(request.status)} text-xs`}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {request.startDate} ~ {request.endDate}
                        </p>
                      </div>
                    ))}
                  </div>
                  {attendanceRequests.length > 2 && (
                    <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setShowAttendanceModal(true)}>
                      전체보기 ({attendanceRequests.length})
                    </Button>
                  )}
                </Card>
              </div>

              {/* Today's Tasks */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">오늘 할 일</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">내 웹툰</p>
                      <Button
                        size="sm"
                        variant={taskStatuses[1] === 'completed' ? 'default' : 'outline'}
                        onClick={() => toggleTaskStatus(1)}
                        className={taskStatuses[1] === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {taskStatuses[1] === 'completed' ? '완료' : '진행 중'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold text-foreground transition-all ${taskStatuses[1] === 'completed' ? 'line-through opacity-50' : ''}`}>
                        에피소드 42 연재
                      </h4>
                      <Badge variant="destructive" className="text-xs">D-0 마감</Badge>
                    </div>
                    <p className={`text-sm text-muted-foreground transition-all ${taskStatuses[1] === 'completed' ? 'opacity-50' : ''}`}>
                      오늘 자정까지 업로드 필수
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">내 웹툰</p>
                      <Button
                        size="sm"
                        variant={taskStatuses[2] === 'completed' ? 'default' : 'outline'}
                        onClick={() => toggleTaskStatus(2)}
                        className={taskStatuses[2] === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {taskStatuses[2] === 'completed' ? '완료' : '진행 중'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium text-foreground transition-all ${taskStatuses[2] === 'completed' ? 'line-through opacity-50' : ''}`}>
                        에피소드 43 스케치
                      </h4>
                      <Badge className="bg-blue-500 text-xs">D-2</Badge>
                    </div>
                    <p className={`text-sm text-muted-foreground transition-all ${taskStatuses[2] === 'completed' ? 'opacity-50' : ''}`}>
                      초안 완성도 50% 목표
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">신작</p>
                      <Button
                        size="sm"
                        variant={taskStatuses[3] === 'completed' ? 'default' : 'outline'}
                        onClick={() => toggleTaskStatus(3)}
                        className={taskStatuses[3] === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {taskStatuses[3] === 'completed' ? '완료' : '진행 중'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium text-foreground transition-all ${taskStatuses[3] === 'completed' ? 'line-through opacity-50' : ''}`}>
                        신작 캐릭터 디자인
                      </h4>
                      <Badge className="bg-purple-500 text-xs">기획</Badge>
                    </div>
                    <p className={`text-sm text-muted-foreground transition-all ${taskStatuses[3] === 'completed' ? 'opacity-50' : ''}`}>
                      주인공 및 조연 디자인 초안
                    </p>
                  </div>
                </div>
                {Object.keys(taskStatuses).length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => setShowTasksModal(true)}>
                    전체보기 ({Object.keys(taskStatuses).length})
                  </Button>
                )}
              </Card>
            </div>

            {/* Right Column - Memo */}
            <div className="space-y-6">
              {/* Memo Button */}
              <Button 
                variant="outline" 
                className="w-full border-dashed border-2"
                onClick={() => setShowMemoModal(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                메모 추가
              </Button>

              {/* Memo Display (if exists) */}
              {memos.map((memo) => (
                <Card key={memo.id} className={`p-5 ${memo.color} border-2 ${memoColors.find(c => c.bg === memo.color)?.border}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{memo.title}</h3>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditMemo(memo.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteMemo(memo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{memo.content}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Health Survey Modal */}
      <Modal
        isOpen={showHealthSurvey}
        onClose={() => setShowHealthSurvey(false)}
        title="건강 체크"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            작업을 시작하기 전에 간단한 건강 체크를 진행합니다.
          </p>

          {/* 컨디션 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              오늘 컨디션 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'tired', label: '피곤함' },
                { value: 'normal', label: '보통' },
                { value: 'good', label: '좋음' },
                { value: 'excellent', label: '최상' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setHealthSurvey({ ...healthSurvey, condition: option.value as any })}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                    healthSurvey.condition === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 수면 시간 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              수면 시간 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 7시간"
              value={healthSurvey.sleepHours}
              onChange={(e) => setHealthSurvey({ ...healthSurvey, sleepHours: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            />
          </div>

          {/* 불편함 정도 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              신체 불편함 (0-10) <span className="text-red-500">*</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={healthSurvey.discomfortLevel}
              onChange={(e) => setHealthSurvey({ ...healthSurvey, discomfortLevel: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>없음</span>
              <span className="font-medium text-foreground">{healthSurvey.discomfortLevel}</span>
              <span>매우 불편함</span>
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              메모 (선택사항)
            </label>
            <textarea
              placeholder="특이사항을 입력하세요"
              value={healthSurvey.notes}
              onChange={(e) => setHealthSurvey({ ...healthSurvey, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleCancelHealthCheck}>
              취소
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleHealthSurveySubmit}
              disabled={!isHealthSurveyValid()}
            >
              완료
            </Button>
          </div>
        </div>
      </Modal>

      {/* Stop Work Confirmation Modal */}
      <Modal
        isOpen={showStopConfirm}
        onClose={() => setShowStopConfirm(false)}
        title="작업 종료 확인"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">건강 체크를 완료하지 않았습니다</p>
              <p className="text-sm text-muted-foreground">
                건강 체크 없이 작업을 종료하시겠습니까?
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowStopConfirm(false)}>
              취소
            </Button>
            <Button variant="destructive" className="flex-1" onClick={confirmStopWork}>
              종료
            </Button>
          </div>
        </div>
      </Modal>

      {/* Memo Modal */}
      <Modal
        isOpen={showMemoModal}
        onClose={() => setShowMemoModal(false)}
        title={editingMemoId ? "메모 수정" : "새 메모"}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              메모 제목
            </label>
            <input
              placeholder="제목을 입력하세요..."
              value={currentMemoTitle}
              onChange={(e) => setCurrentMemoTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              메모 내용
            </label>
            <textarea
              placeholder="메모를 입력하세요..."
              value={currentMemoText}
              onChange={(e) => setCurrentMemoText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCancelMemo}>
              취소
            </Button>
            <Button className="flex-1" onClick={handleSaveMemo}>
              저장
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="피드백"
        maxWidth="lg"
      >
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">아직 피드백이 없습니다.</p>
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div 
                key={feedback.id} 
                className={`p-4 rounded-lg border-l-4 transition-all ${
                  !feedback.isRead 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-muted/30 border-border'
                }`}
                style={{ borderLeftColor: feedback.projectColor || '#6E8FB3' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {feedback.project}
                      </Badge>
                      {!feedback.isRead && (
                        <Badge className="bg-blue-500 text-xs">새 피드백</Badge>
                      )}
                    </div>
                    {feedback.cardTitle && (
                      <h4 className="font-medium text-foreground mb-1">{feedback.cardTitle}</h4>
                    )}
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap mb-3">
                  {feedback.content}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{feedback.from}</span>
                    <span>•</span>
                    <span>{feedback.date}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Tasks Modal */}
      <Modal
        isOpen={showTasksModal}
        onClose={() => setShowTasksModal(false)}
        title="오늘 할 일"
        maxWidth="lg"
      >
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {Object.keys(taskStatuses).length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">아직 할 일이 없습니다.</p>
            </div>
          ) : (
            Object.keys(taskStatuses).map((taskId) => (
              <div 
                key={taskId} 
                className={`p-4 rounded-lg border-l-4 transition-all ${
                  taskStatuses[parseInt(taskId)] === 'completed' 
                    ? 'bg-green-50 border-green-200 shadow-sm' 
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        프로젝트
                      </Badge>
                      {taskStatuses[parseInt(taskId)] === 'completed' && (
                        <Badge className="bg-green-500 text-xs">완료</Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-foreground mb-1">제목</h4>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap mb-3">
                  설명
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">남은 일수</span>
                    <span>•</span>
                    <span>배지</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Deadline Modal */}
      <Modal
        isOpen={showDeadlineModal}
        onClose={() => setShowDeadlineModal(false)}
        title="오늘 마감 작품"
        maxWidth="lg"
      >
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {deadlineProjects.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">아직 마감 작품이 없습니다.</p>
            </div>
          ) : (
            deadlineProjects.map((project) => (
              <div 
                key={project.id} 
                className={`p-4 rounded-lg border-l-4 transition-all ${
                  project.urgent 
                    ? 'bg-red-50 border-red-200 shadow-sm' 
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        프로젝트
                      </Badge>
                      {project.urgent && (
                        <Badge className="bg-red-500 text-xs">긴급</Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{project.name}</h4>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap mb-3">
                  마감일: {project.deadline}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">남은 일수</span>
                    <span>•</span>
                    <span>배지</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title="신청 현황"
        maxWidth="lg"
      >
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {attendanceRequests.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">아직 신청 현황이 없습니다.</p>
            </div>
          ) : (
            attendanceRequests.map((request) => (
              <div 
                key={request.id} 
                className={`p-4 rounded-lg border-l-4 transition-all ${
                  request.status === '승인' 
                    ? 'bg-green-50 border-green-200 shadow-sm' 
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        프로젝트
                      </Badge>
                      {request.status === '승인' && (
                        <Badge className="bg-green-500 text-xs">승인</Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{request.type}</h4>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap mb-3">
                  기간: {request.startDate} ~ {request.endDate}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">상태</span>
                    <span>•</span>
                    <span>배지</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}