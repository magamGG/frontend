import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  AlertTriangle,
  Calendar,
  Heart,
  Home,
  Palmtree,
  Building2,
} from 'lucide-react';
import {
  DashboardRoot,
  DashboardBody,
  DashboardGrid,
  MainColumn,
  SidebarColumn,
  AttendanceStatusCard,
  AttendanceStatusHeader,
  AttendanceStatusIconWrapper,
  AttendanceStatusIconContainer,
  AttendanceStatusText,
  AttendanceStatusTitle,
  AttendanceStatusDescription,
  AttendanceStatusButtonGrid,
  AttendanceStatusButton,
  TodaySummaryGrid,
  TodayTodoList,
  TodoItem,
  DeadlineList,
  DeadlineCardUrgent,
  DeadlineCardNormal,
  WorkProgressList,
  WorkProgressItem,
  WorkProgressHeader,
  WorkProgressTitle,
  WorkProgressPercent,
} from './DashboardPage.styled';

// 근태 상태 타입 정의
const ATTENDANCE_STATUS = {
  OFFICE: '출근',
  REMOTE: '재택근무',
  LEAVE: '휴가',
  WORKATION: '워케이션',
};

// 근태 상태별 스타일 설정
const attendanceStatusConfig = {
  [ATTENDANCE_STATUS.OFFICE]: {
    bgColor: '#00ACC1',
    textColor: '#00ACC1',
    gradient: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
    borderColor: '#00ACC1',
    icon: Building2,
    description: '사무실에서 작업하고 계십니다',
  },
  [ATTENDANCE_STATUS.REMOTE]: {
    bgColor: '#FF9800',
    textColor: '#FF9800',
    gradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    borderColor: '#FF9800',
    icon: Home,
    description: '집에서 편안하게 작업하고 계십니다',
  },
  [ATTENDANCE_STATUS.LEAVE]: {
    bgColor: '#757575',
    textColor: '#757575',
    gradient: 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
    borderColor: '#757575',
    icon: Calendar,
    description: '충분한 휴식으로 에너지를 재충전하고 계십니다',
  },
  [ATTENDANCE_STATUS.WORKATION]: {
    bgColor: '#9C27B0',
    textColor: '#9C27B0',
    gradient: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    borderColor: '#9C27B0',
    icon: Palmtree,
    description: '새로운 환경에서 창의적으로 작업하고 계십니다',
  },
};

// TODO: Zustand store mapping - 작가 할 일 목록
const authorTaskList = [
  {
    id: 1,
    title: '스토리보드 작성',
    workTitle: '로맨스 판타지',
    episode: 42,
    daysLeft: 2,
    priority: '높음',
    urgent: true,
  },
  {
    id: 2,
    title: '러프 스케치 완성',
    workTitle: '학원물',
    episode: 15,
    daysLeft: 5,
    priority: '보통',
    urgent: false,
  },
  {
    id: 3,
    title: '채색 작업',
    workTitle: '액션 판타지',
    episode: 28,
    daysLeft: 7,
    priority: '낮음',
    urgent: false,
  },
];

// TODO: Zustand store mapping - 마감일 목록
const deadlineList = [
  {
    id: 1,
    workTitle: '로맨스 판타지',
    episode: 42,
    deadlineDate: '2026년 1월 15일',
    daysLeft: 2,
    urgent: true,
  },
  {
    id: 2,
    workTitle: '학원물',
    episode: 15,
    deadlineDate: '2026년 1월 18일',
    daysLeft: 5,
    urgent: false,
  },
];

// TODO: Zustand store mapping - 작품 진행 상황
const workProgressList = [
  {
    id: 1,
    workTitle: '로맨스 판타지',
    progress: 75,
  },
  {
    id: 2,
    workTitle: '학원물',
    progress: 60,
  },
  {
    id: 3,
    workTitle: '액션 판타지',
    progress: 45,
  },
];

export function DashboardPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ATTENDANCE_STATUS.WORKATION);

  const currentStatusConfig = attendanceStatusConfig[currentStatus];
  const StatusIcon = currentStatusConfig.icon;

  // TODO: Zustand store에서 오늘의 현황 데이터 가져오기
  const todaySummary = {
    workHours: 8.5,
    completedTasks: 3,
    totalTasks: 6,
    productivity: 85,
  };

  // TODO: Zustand store에서 건강 데이터 가져오기
  const healthSummary = {
    sleepHours: 7,
    wristPain: 3,
    burnoutIndex: 25,
    lastUpdate: '2026년 1월 12일',
  };

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
  };

  const handleCheckIn = async () => {
    try {
      // TODO: 실제 출근 체크 API 호출
      // await attendanceService.checkIn({ status: currentStatus });
      setCheckedIn(!checkedIn);
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  return (
    <DashboardRoot>
      <DashboardBody>
        <DashboardGrid>
          {/* Main Content - Left & Center */}
          <MainColumn>
            {/* 현재 근태 상태 카드 */}
            <Card className="overflow-hidden">
              <AttendanceStatusCard
                $gradient={currentStatusConfig.gradient}
                $borderColor={currentStatusConfig.borderColor}
              >
                <AttendanceStatusHeader>
                  <AttendanceStatusIconWrapper>
                    <AttendanceStatusIconContainer $bgColor={currentStatusConfig.bgColor}>
                      <StatusIcon size={24} />
                    </AttendanceStatusIconContainer>
                    <AttendanceStatusText>
                      <AttendanceStatusTitle $textColor={currentStatusConfig.textColor}>
                        {currentStatus}
                      </AttendanceStatusTitle>
                      <AttendanceStatusDescription>
                        {currentStatusConfig.description}
                      </AttendanceStatusDescription>
                    </AttendanceStatusText>
                  </AttendanceStatusIconWrapper>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: currentStatusConfig.bgColor,
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  />
                </AttendanceStatusHeader>

                {/* 상태 전환 버튼 */}
                <AttendanceStatusButtonGrid>
                  {Object.entries(attendanceStatusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const isActive = currentStatus === key;
                    return (
                      <AttendanceStatusButton
                        key={key}
                        onClick={() => handleStatusChange(key)}
                        $isActive={isActive}
                        $bgColor={config.bgColor}
                        $borderColor={config.borderColor}
                        $textColor={config.textColor}
                      >
                        <Icon size={24} />
                        <p style={{ fontSize: '12px', fontWeight: 600, margin: 0 }}>
                          {key}
                        </p>
                      </AttendanceStatusButton>
                    );
                  })}
                </AttendanceStatusButtonGrid>
              </AttendanceStatusCard>
            </Card>

            {/* 오늘의 현황 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">오늘의 현황</h3>
                  <p className="text-sm text-muted-foreground">2026년 1월 13일 화요일</p>
                </div>
                <Button onClick={handleCheckIn} className={checkedIn ? 'bg-muted' : ''}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {checkedIn ? '출근 완료' : '출근하기'}
                </Button>
              </div>

              <TodaySummaryGrid>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium text-muted-foreground">근무 시간</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{todaySummary.workHours}시간</p>
                  <p className="text-xs text-muted-foreground mt-1">오늘</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium text-muted-foreground">완료 작업</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {todaySummary.completedTasks}/{todaySummary.totalTasks}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((todaySummary.completedTasks / todaySummary.totalTasks) * 100)}% 완료
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-medium text-muted-foreground">생산성</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{todaySummary.productivity}%</p>
                  <p className="text-xs text-muted-foreground mt-1">평균 이상</p>
                </Card>
              </TodaySummaryGrid>
            </Card>

            {/* 오늘의 할 일 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">오늘의 할 일</h3>
                <Button variant="outline" size="sm">
                  작업 추가
                </Button>
              </div>

              <TodayTodoList>
                {authorTaskList.map((task) => (
                  <TodoItem key={task.id}>
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{task.title}</h4>
                        {task.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            긴급
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {task.workTitle} - 에피소드 {task.episode}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>D-{task.daysLeft}</span>
                        <span>•</span>
                        <span>{task.priority} 우선순위</span>
                      </div>
                    </div>
                  </TodoItem>
                ))}
              </TodayTodoList>
            </Card>

            {/* 다가오는 마감일 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">다가오는 마감일</h3>
              <DeadlineList>
                {deadlineList.map((deadline) => {
                  const DeadlineCard = deadline.urgent ? DeadlineCardUrgent : DeadlineCardNormal;
                  return (
                    <DeadlineCard key={deadline.id}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{deadline.workTitle}</h4>
                          <p className="text-sm text-muted-foreground">에피소드 {deadline.episode}</p>
                        </div>
                        <Badge variant={deadline.urgent ? 'destructive' : 'default'}>
                          D-{deadline.daysLeft}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">{deadline.deadlineDate}</span>
                        <Button size="sm" variant="outline">
                          연장 신청
                        </Button>
                      </div>
                    </DeadlineCard>
                  );
                })}
              </DeadlineList>
            </Card>
          </MainColumn>

          {/* Right Sidebar */}
          <SidebarColumn>
            {/* 빠른 작업 */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">빠른 작업</h3>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  휴가 신청
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  휴가 신청
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  건강 체크
                </Button>
              </div>
            </Card>

            {/* 건강 요약 */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold text-foreground">건강 요약</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">수면 시간</span>
                  <span className="font-semibold text-foreground">{healthSummary.sleepHours}시간</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">손목 통증</span>
                  <span className="font-semibold text-foreground">{healthSummary.wristPain}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">번아웃 지수</span>
                  <span className="font-semibold text-foreground">{healthSummary.burnoutIndex}%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  마지막 업데이트: {healthSummary.lastUpdate}
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                건강 상태 입력
              </Button>
            </Card>

            {/* 작품 진행 상황 */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">작품 진행 상황</h3>
              <WorkProgressList>
                {workProgressList.map((work) => (
                  <WorkProgressItem key={work.id}>
                    <WorkProgressHeader>
                      <WorkProgressTitle>{work.workTitle}</WorkProgressTitle>
                      <WorkProgressPercent>{work.progress}%</WorkProgressPercent>
                    </WorkProgressHeader>
                    <Progress value={work.progress} className="h-2" />
                  </WorkProgressItem>
                ))}
              </WorkProgressList>
            </Card>
          </SidebarColumn>
        </DashboardGrid>
      </DashboardBody>
    </DashboardRoot>
  );
}
