import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import {
  Briefcase,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Play,
  Square,
  Users,
  Building2,
  Home,
  Palmtree,
  FileText,
  Clock,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ProjectListModal } from '@/components/modals/ProjectListModal';
import { AttendanceListModal } from '@/components/modals/AttendanceListModal';
import { toast } from 'sonner';
import { leaveService, attendanceService } from '@/api/services';
import svgPaths from '@/imports/svg-oq0e8tu4xb';
import {
  AdminDashboardRoot,
  AdminDashboardBody,
  AdminDashboardTopGrid,
  AttendanceStartCard,
  AttendanceStartHeader,
  AttendanceStartDateInfo,
  AttendanceStartDate,
  AttendanceStartDateSub,
  AttendanceStartActions,
  HealthCheckWarning,
  AttendanceStatusBox,
  AttendanceStatusBoxContent,
  AttendanceStatusBoxInfo,
  AttendanceStatusBoxIcon,
  AttendanceStatusBoxText,
  AttendanceStatusBoxTitle,
  AttendanceStatusBoxDescription,
  AttendanceStatusBoxPeriod,
  AttendanceStatusBoxPeriodLabel,
  AttendanceStatusBoxPeriodValue,
  AttendanceStatusEmpty,
  AttendanceStatusEmptyIcon,
  AttendanceStatusEmptyTitle,
  AttendanceStatusEmptyDescription,
  WorkingArtistsCard,
  WorkingArtistsHeader,
  WorkingArtistsTitle,
  WorkingArtistsGrid,
  WorkingArtistCard,
  WorkingArtistHeader,
  WorkingArtistStatusDot,
  WorkingArtistName,
  WorkingArtistProject,
  WorkingArtistMeta,
  WorkingArtistMetaLabel,
  WorkingArtistMetaValue,
  ChartSection,
  ChartCard,
  ChartHeader,
  ChartTitle,
  ChartAlert,
  ChartAlertText,
  ProjectsAttendanceGrid,
  ProjectsCard,
  ProjectsHeader,
  ProjectsHeaderLeft,
  ProjectsList,
  ProjectItem,
  ProjectItemHeader,
  ProjectItemInfo,
  ProjectItemTitleRow,
  ProjectItemTitle,
  ProjectItemArtist,
  ProjectItemMeta,
  ProjectsInfoBox,
  ProjectsInfoText,
  AttendanceScheduleCard,
  AttendanceScheduleHeader,
  AttendanceScheduleHeaderLeft,
  AttendanceScheduleList,
  AttendanceScheduleItem,
  AttendanceScheduleItemHeader,
  AttendanceScheduleItemLeft,
  AttendanceScheduleItemName,
  AttendanceScheduleItemDate,
  AttendanceScheduleWarningBox,
  AttendanceScheduleWarningText,
  WarningBox,
  WarningContent,
  WarningTitle,
  WarningDescription,
  ModalActions,
  QuickInfoCard,
  QuickInfoTitle,
  AttendanceRequestCardHeader,
  AttendanceRequestCardList,
  AttendanceRequestCardItem,
  AttendanceRequestCardItemContent,
  AttendanceRequestCardItemTitle,
  AttendanceRequestCardItemDate,
  AttendanceRequestCardItemBadge,
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
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
} from './AdminDashboardPage.styled';

export function AdminDashboardPage({ onNavigateToSection }) {
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const [isAttendanceListOpen, setIsAttendanceListOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [showHealthSurvey, setShowHealthSurvey] = useState(false);
  const [healthCheckCompleted, setHealthCheckCompleted] = useState(false);
  const [currentAttendanceType, setCurrentAttendanceType] = useState(null);
  const [currentAttendanceData, setCurrentAttendanceData] = useState(null);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const [healthSurvey, setHealthSurvey] = useState({
    condition: 'normal',
    sleepHours: '',
    discomfortLevel: 0,
    notes: '',
  });

  // 현재 적용 중인 근태 상태 조회 (API 호출)
  useEffect(() => {
    const fetchCurrentAttendanceStatus = async () => {
      try {
        const response = await leaveService.getCurrentStatus();
        console.log('현재 근태 상태 API 응답:', response);
        // axios 인터셉터가 이미 response.data를 반환하므로 response 자체가 데이터
        const data = response;
        console.log('현재 근태 상태 데이터:', data);
        
        if (data && data.attendanceRequestType) {
          // DB에서 받아온 타입을 프론트 표시용으로 매핑
          const typeMap = {
            '연차': '휴가',
            '반차': '휴가',
            '병가': '휴가',
            '워케이션': '워케이션',
            '재택근무': '재택근무',
            '재택': '재택근무',
            '휴가': '휴가',
            '휴재': '휴가',
          };
          const displayType = typeMap[data.attendanceRequestType] || data.attendanceRequestType;
          console.log('매핑된 상태 타입:', displayType, '원본 타입:', data.attendanceRequestType);
          setCurrentAttendanceType(displayType);
          setCurrentAttendanceData(data);
        } else {
          console.log('현재 근태 상태 데이터 없음 - 기본값(출근)으로 설정');
          // 승인된 근태요청이 없으면 기본값으로 출근 설정
          setCurrentAttendanceType('출근');
          setCurrentAttendanceData(null);
        }
      } catch (error) {
        console.error('현재 근태 상태 조회 실패:', error);
        console.log('에러 발생 - 기본값(출근)으로 설정');
        // 에러 발생 시에도 기본값으로 출근 설정
        setCurrentAttendanceType('출근');
        setCurrentAttendanceData(null);
      }
    };

    fetchCurrentAttendanceStatus();
    // 5분마다 상태 갱신 (필요시 조절)
    const interval = setInterval(fetchCurrentAttendanceStatus, 300000);
    return () => clearInterval(interval);
  }, []);

  // 오늘 출근 상태 조회 (페이지 로드 시 및 리다이렉션 시) - DB와 동기화
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
    fetchTodayAttendanceStatus();
    const handleFocus = () => fetchTodayAttendanceStatus();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // TODO: Zustand store mapping - 현재 작업 중인 작가 목록
  const workingArtists = [
    { id: 1, name: '김작가', project: '로맨스 판타지', startTime: '09:30', status: '작업중' },
    { id: 2, name: '이작가', project: '액션 웹툰', startTime: '10:00', status: '작업중' },
    { id: 3, name: '박작가', project: '일상 코미디', startTime: '09:15', status: '작업중' },
    { id: 4, name: '최작가', project: 'SF 드라마', startTime: '10:30', status: '작업중' },
    { id: 5, name: '정작가', project: '스릴러 미스터리', startTime: '09:00', status: '작업중' },
    { id: 6, name: '강작가', project: '학원 로맨스', startTime: '10:15', status: '작업중' },
    { id: 7, name: '조작가', project: '판타지 액션', startTime: '09:45', status: '작업중' },
    { id: 8, name: '윤작가', project: '일상 드라마', startTime: '10:45', status: '작업중' },
    { id: 9, name: '장작가', project: '무협 판타지', startTime: '09:20', status: '작업중' },
    { id: 10, name: '임작가', project: '현대 로맨스', startTime: '11:00', status: '작업중' },
    { id: 11, name: '한작가', project: '호러 스릴러', startTime: '09:50', status: '작업중' },
    { id: 12, name: '오작가', project: '역사 드라마', startTime: '10:20', status: '작업중' },
    { id: 13, name: '서작가', project: '스포츠 드라마', startTime: '09:35', status: '작업중' },
    { id: 14, name: '신작가', project: '음악 로맨스', startTime: '11:15', status: '작업중' },
  ];

  // TODO: Zustand store mapping - 담당 프로젝트 목록
  const managedProjects = [
    { id: 1, name: '로맨스 판타지', artist: '김작가', status: '정상', progress: 85, deadline: '1월 25일' },
    { id: 2, name: '액션 웹툰', artist: '이작가', status: '주의', progress: 65, deadline: '1월 20일' },
    { id: 3, name: '일상 코미디', artist: '박작가', status: '정상', progress: 90, deadline: '1월 30일' },
    { id: 4, name: 'SF 드라마', artist: '최작가', status: '정상', progress: 75, deadline: '1월 28일' },
  ];

  // TODO: Zustand store mapping - 신청 현황 데이터
  const REQUEST_STATUS = {
    PENDING: '대기',
    APPROVED: '승인',
    REJECTED: '반려',
  };

  const attendanceRequests = [
    {
      id: '1',
      typeName: '휴가',
      startDate: '1월 20일',
      endDate: '1월 22일',
      status: REQUEST_STATUS.PENDING,
    },
    {
      id: '2',
      typeName: '재택근무',
      startDate: '1월 16일',
      endDate: '1월 16일',
      status: REQUEST_STATUS.APPROVED,
    },
    {
      id: '3',
      typeName: '휴가',
      startDate: '1월 20일',
      endDate: '1월 22일',
      status: REQUEST_STATUS.PENDING,
    },
    {
      id: '4',
      typeName: '재택근무',
      startDate: '1월 16일',
      endDate: '1월 16일',
      status: REQUEST_STATUS.APPROVED,
    },
    {
      id: '5',
      typeName: '휴가',
      startDate: '1월 20일',
      endDate: '1월 22일',
      status: REQUEST_STATUS.PENDING,
    },
  ];

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // TODO: Zustand store mapping - 마감 임박 현황 데이터
  const deadlineData = [
    { name: '오늘', count: 2 },
    { name: '내일', count: 3 },
    { name: '2일 후', count: 1 },
    { name: '3일 후', count: 4 },
    { name: '4일 후', count: 2 },
  ];

  // TODO: Zustand store mapping - 금주 근태 예정
  const weeklyAttendance = [
    { id: 1, name: '김작가', type: '워케이션', date: '1월 16일 ~ 1월 18일', status: '승인' },
    { id: 2, name: '이작가', type: '휴가', date: '1월 17일 ~ 1월 19일', status: '승인' },
    { id: 3, name: '박작가', type: '재택근무', date: '1월 15일', status: '승인' },
    { id: 4, name: '정작가', type: '워케이션', date: '1월 20일 ~ 1월 22일', status: '대기' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case '워케이션':
        return 'bg-[#9C27B0]';
      case '휴가':
        return 'bg-[#757575]';
      case '재택근무':
        return 'bg-[#FF9800]';
      case '출근':
        return 'bg-[#00ACC1]';
      default:
        return 'bg-gray-500';
    }
  };

  const getAttendanceTypeColor = (type) => {
    switch (type) {
      case '워케이션':
        return 'bg-[#9C27B0]';
      case '휴가':
        return 'bg-[#757575]';
      case '재택근무':
        return 'bg-[#FF9800]';
      case '출근':
        return 'bg-[#00ACC1]';
      default:
        return 'bg-gray-500';
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case '승인':
        return 'bg-green-500';
      case '대기':
        return 'bg-yellow-500';
      case '반려':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleStartWork = () => {
    setShowHealthSurvey(true);
  };

  // 출근 종료 핸들러
  const handleStopWork = () => {
    // 항상 확인 창 표시
    setShowStopConfirm(true);
  };

  // 출근 종료 확인 핸들러 (퇴근 API 호출 후 상태 갱신)
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
      toast.error(error?.message || '출근 시작에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancelHealthCheck = () => {
    setShowHealthSurvey(false);
    toast.info('건강 체크를 취소했습니다. 출근이 시작되지 않았습니다.');
  };

  const today = new Date();
  const todayString = `${today.getMonth() + 1}월 ${today.getDate()}일`;
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const todayFullDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${weekdays[today.getDay()]}`;
  
  // 현재 상태 텍스트 가져오기
  const getCurrentStatusText = () => {
    const displayType = currentAttendanceType || '출근';
    return `${displayType} 중`;
  };

  // 날짜 포맷 함수 (2026-01-15T00:00:00 -> 1월 15일)
  const formatPeriodDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 현재 근태 상태에 따른 기간 문자열 생성
  const getAttendancePeriod = () => {
    if (!currentAttendanceData) return null;
    const startDate = formatPeriodDate(currentAttendanceData.attendanceRequestStartDate);
    const endDate = formatPeriodDate(currentAttendanceData.attendanceRequestEndDate);
    return `${startDate} ~ ${endDate}`;
  };

  const getAttendanceStatusBoxProps = (type) => {
    const period = getAttendancePeriod();
    const location = currentAttendanceData?.workcationLocation;
    
    switch (type) {
      case '출근':
        return {
          bgColor: '#E8F6F8',
          borderColor: 'rgba(0, 172, 193, 0.2)',
          iconBgColor: 'rgba(0, 172, 193, 0.1)',
          iconColor: '#00ACC1',
          Icon: Building2,
          title: '출근 중',
          description: '사무실에서 작업 중입니다',
        };
      case '재택근무':
        return {
          bgColor: '#FFF4E6',
          borderColor: 'rgba(255, 152, 0, 0.2)',
          iconBgColor: 'rgba(255, 152, 0, 0.1)',
          iconColor: '#FF9800',
          Icon: Home,
          title: '재택근무 중',
          description: '자택에서 작업 중입니다',
          period: period,
        };
      case '휴가':
        return {
          bgColor: '#F5F5F5',
          borderColor: 'rgba(117, 117, 117, 0.2)',
          iconBgColor: 'rgba(117, 117, 117, 0.1)',
          iconColor: '#757575',
          Icon: Calendar,
          title: '휴가 중',
          description: '휴식 중입니다',
          period: period,
        };
      case '워케이션':
        return {
          bgColor: '#F6F3FA',
          borderColor: 'rgba(156, 39, 176, 0.2)',
          iconBgColor: 'rgba(156, 39, 176, 0.1)',
          iconColor: '#9C27B0',
          Icon: Palmtree,
          title: '워케이션 중',
          description: location ? `${location}에서 작업 중입니다` : '외부 환경에서 작업 중입니다',
          period: period,
        };
      default:
        return null;
    }
  };

  const statusBoxProps = currentAttendanceType ? getAttendanceStatusBoxProps(currentAttendanceType) : null;

  return (
    <AdminDashboardRoot>
      <AdminDashboardBody>
        {/* 출근 시작 & 현재 작업 중인 작가 섹션 */}
        <AdminDashboardTopGrid>
          {/* 왼쪽: 출근 시작 섹션 */}
          <AttendanceStartCard>
            <AttendanceStartHeader>
              <AttendanceStartDateInfo>
                <AttendanceStartDate>{getCurrentStatusText()}</AttendanceStartDate>
                <AttendanceStartDateSub>{todayFullDate}</AttendanceStartDateSub>
              </AttendanceStartDateInfo>
              <AttendanceStartActions>
                {isWorking && !healthCheckCompleted && (
                  <HealthCheckWarning>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs text-yellow-700 font-medium">건강 체크 미완료</span>
                  </HealthCheckWarning>
                )}
                <Button onClick={isWorking ? handleStopWork : handleStartWork} className={`bg-[#3f4a5a] hover:bg-[#6E8FB3] ${isWorking ? 'bg-red-500 hover:bg-red-600' : ''}`} size="lg">
                  {isWorking ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      출근 종료
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 16 16">
                        <path d={svgPaths.p2b703a00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </svg>
                      출근 시작
                    </>
                  )}
                </Button>
            </AttendanceStartActions>
          </AttendanceStartHeader>

            {(() => {
              // 승인된 근태요청이 없으면 기본값으로 출근 설정
              const displayType = currentAttendanceType || '출근';
              const displayProps = getAttendanceStatusBoxProps(displayType);
              
              if (!displayProps) {
                // 출근 기본값 설정
                const defaultProps = {
                  bgColor: '#E8F6F8',
                  borderColor: 'rgba(0, 172, 193, 0.2)',
                  iconBgColor: 'rgba(0, 172, 193, 0.1)',
                  iconColor: '#00ACC1',
                  Icon: Building2,
                  title: '출근 중',
                  description: '사무실에서 작업 중입니다',
                };
                
                return (
                  <AttendanceStatusBox $bgColor={defaultProps.bgColor} $borderColor={defaultProps.borderColor}>
                    <AttendanceStatusBoxContent>
                      <AttendanceStatusBoxInfo>
                        <AttendanceStatusBoxIcon $bgColor={defaultProps.iconBgColor}>
                          <defaultProps.Icon className="w-6 h-6" style={{ color: defaultProps.iconColor }} />
                        </AttendanceStatusBoxIcon>
                        <AttendanceStatusBoxText>
                          <AttendanceStatusBoxTitle>{defaultProps.title}</AttendanceStatusBoxTitle>
                          <AttendanceStatusBoxDescription>{defaultProps.description}</AttendanceStatusBoxDescription>
                        </AttendanceStatusBoxText>
                      </AttendanceStatusBoxInfo>
                    </AttendanceStatusBoxContent>
                  </AttendanceStatusBox>
                );
              }
              
              return (
                <AttendanceStatusBox $bgColor={displayProps.bgColor} $borderColor={displayProps.borderColor}>
                  <AttendanceStatusBoxContent>
                    <AttendanceStatusBoxInfo>
                      <AttendanceStatusBoxIcon $bgColor={displayProps.iconBgColor}>
                        <displayProps.Icon className="w-6 h-6" style={{ color: displayProps.iconColor }} />
                      </AttendanceStatusBoxIcon>
                      <AttendanceStatusBoxText>
                        <AttendanceStatusBoxTitle>{displayProps.title}</AttendanceStatusBoxTitle>
                        <AttendanceStatusBoxDescription>{displayProps.description}</AttendanceStatusBoxDescription>
                      </AttendanceStatusBoxText>
                      </AttendanceStatusBoxInfo>
                    </AttendanceStatusBoxContent>
                    {(displayType === '휴가' || displayType === '워케이션') && currentAttendanceData && displayProps.period && (
                      <AttendanceStatusBoxPeriod $borderColor={displayProps.borderColor}>
                        <AttendanceStatusBoxPeriodLabel>{displayType === '휴가' ? '휴가 기간' : '워케이션 기간'}</AttendanceStatusBoxPeriodLabel>
                        <AttendanceStatusBoxPeriodValue>{displayProps.period}</AttendanceStatusBoxPeriodValue>
                      </AttendanceStatusBoxPeriod>
                    )}
                  </AttendanceStatusBox>
              );
            })()}
          </AttendanceStartCard>

          {/* 오른쪽: 현재 작업 중인 작가 섹션 */}
          <WorkingArtistsCard>
            <WorkingArtistsHeader>
              <Play className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              <WorkingArtistsTitle>현재 작업 중인 작가</WorkingArtistsTitle>
              <Badge className="bg-[#6E8FB3] text-white text-xs px-2 py-1">{workingArtists.length}명</Badge>
            </WorkingArtistsHeader>

            <WorkingArtistsGrid>
              {workingArtists.map((artist) => (
                <WorkingArtistCard key={artist.id}>
                  <WorkingArtistHeader>
                    <WorkingArtistStatusDot />
                    <WorkingArtistName>{artist.name}</WorkingArtistName>
                  </WorkingArtistHeader>
                  <WorkingArtistProject>{artist.project}</WorkingArtistProject>
                  <WorkingArtistMeta>
                    <WorkingArtistMetaLabel>시작</WorkingArtistMetaLabel>
                    <WorkingArtistMetaValue>{artist.startTime}</WorkingArtistMetaValue>
                  </WorkingArtistMeta>
                </WorkingArtistCard>
              ))}
            </WorkingArtistsGrid>
          </WorkingArtistsCard>
        </AdminDashboardTopGrid>

        {/* 마감 임박 현황 & 신청 현황 */}
        <ChartSection style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* 마감 임박 현황 */}
          <ChartCard>
            <ChartHeader>
              <AlertCircle className="w-5 h-5" style={{ color: '#6E8FB3' }} />
              <ChartTitle>마감 임박 현황</ChartTitle>
            </ChartHeader>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deadlineData} barSize={40}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 'dataMax + 1']} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6E8FB3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {deadlineData[0]?.count > 0 && (
              <ChartAlert>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <ChartAlertText>오늘 마감 예정 작품이 {deadlineData[0].count}개 있습니다</ChartAlertText>
              </ChartAlert>
            )}
          </ChartCard>

          {/* 신청 현황 */}
          <QuickInfoCard>
            <AttendanceRequestCardHeader onClick={() => setShowAttendanceModal(true)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText className="w-4 h-4" style={{ color: 'var(--foreground)' }} />
                <QuickInfoTitle style={{ margin: 0 }}>신청 현황</QuickInfoTitle>
              </div>
              {attendanceRequests.length >= 2 && (
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              )}
            </AttendanceRequestCardHeader>
            {attendanceRequests.length >= 2 && (
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
        </ChartSection>

        {/* 프로젝트 및 근태 섹션 */}
        <ProjectsAttendanceGrid>
          {/* 담당 프로젝트 현황 */}
          <ProjectsCard>
            <ProjectsHeader>
              <ProjectsHeaderLeft>
                <Briefcase className="w-5 h-5" style={{ color: '#6E8FB3' }} />
                <ChartTitle>담당 프로젝트 현황</ChartTitle>
              </ProjectsHeaderLeft>
              <Button variant="outline" size="sm" onClick={() => setIsProjectListOpen(true)} className="text-xs h-7">
                전체보기
              </Button>
            </ProjectsHeader>

            <ProjectsList>
              {managedProjects.map((project) => {
                // 프로젝트 클릭 핸들러
                const handleProjectClick = () => {
                  // 프로젝트 ID를 localStorage에 저장하여 AdminProjectsPage에서 사용
                  localStorage.setItem('selectedProjectId', project.id.toString());
                  // 프로젝트 관리 섹션으로 이동 (manager-projects는 인덱스 1)
                  if (onNavigateToSection) {
                    onNavigateToSection(1);
                  }
                };

                return (
                  <ProjectItem 
                    key={project.id}
                    onClick={handleProjectClick}
                  >
                  <ProjectItemHeader>
                    <ProjectItemInfo>
                      <ProjectItemTitleRow>
                        <ProjectItemTitle>{project.name}</ProjectItemTitle>
                        <Badge className={`${getStatusColor(project.status)} text-xs text-white`}>{project.status}</Badge>
                      </ProjectItemTitleRow>
                      <ProjectItemArtist>담당: {project.artist}</ProjectItemArtist>
                    </ProjectItemInfo>
                  </ProjectItemHeader>
                  <ProjectItemMeta>
                    <span>마감: {project.deadline}</span>
                  </ProjectItemMeta>
                </ProjectItem>
                );
              })}
            </ProjectsList>

            <ProjectsInfoBox>
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <ProjectsInfoText>총 {managedProjects.length}개의 프로젝트를 담당하고 있습니다</ProjectsInfoText>
            </ProjectsInfoBox>
          </ProjectsCard>

          {/* 금주 근태 예정 */}
          <AttendanceScheduleCard>
            <AttendanceScheduleHeader>
              <AttendanceScheduleHeaderLeft>
                <Calendar className="w-5 h-5" style={{ color: '#6E8FB3' }} />
                <ChartTitle>금주 근태 예정</ChartTitle>
              </AttendanceScheduleHeaderLeft>
              <Button variant="outline" size="sm" onClick={() => setIsAttendanceListOpen(true)} className="text-xs h-7">
                전체보기
              </Button>
            </AttendanceScheduleHeader>

            <AttendanceScheduleList>
              {weeklyAttendance.map((item) => (
                <AttendanceScheduleItem key={item.id}>
                  <AttendanceScheduleItemHeader>
                    <AttendanceScheduleItemLeft>
                      <AttendanceScheduleItemName>{item.name}</AttendanceScheduleItemName>
                      <Badge className={`${getAttendanceTypeColor(item.type)} text-xs text-white`}>{item.type}</Badge>
                    </AttendanceScheduleItemLeft>
                    <Badge className={`${getAttendanceStatusColor(item.status)} text-xs text-white`}>{item.status}</Badge>
                  </AttendanceScheduleItemHeader>
                  <AttendanceScheduleItemDate>{item.date}</AttendanceScheduleItemDate>
                </AttendanceScheduleItem>
              ))}
            </AttendanceScheduleList>

            {weeklyAttendance.filter((a) => a.status === '대기').length > 0 && (
              <AttendanceScheduleWarningBox>
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <AttendanceScheduleWarningText>승인 대기 중인 신청이 {weeklyAttendance.filter((a) => a.status === '대기').length}건 있습니다</AttendanceScheduleWarningText>
              </AttendanceScheduleWarningBox>
            )}
          </AttendanceScheduleCard>
        </ProjectsAttendanceGrid>
      </AdminDashboardBody>

      {/* Project List Modal */}
      <ProjectListModal 
        open={isProjectListOpen} 
        onOpenChange={setIsProjectListOpen} 
        projects={managedProjects}
        onProjectClick={(project) => {
          // 프로젝트 관리 섹션으로 이동 (manager-projects는 인덱스 1)
          if (onNavigateToSection) {
            // 프로젝트 ID를 localStorage에 저장하여 AdminProjectsPage에서 사용
            localStorage.setItem('selectedProjectId', project.id.toString());
            onNavigateToSection(1); // manager-projects 섹션 인덱스
          }
        }}
      />

      {/* Attendance List Modal */}
      <AttendanceListModal open={isAttendanceListOpen} onOpenChange={setIsAttendanceListOpen} attendances={weeklyAttendance} />

      {/* Health Survey Modal */}
      <Modal isOpen={showHealthSurvey} onClose={() => setShowHealthSurvey(false)} title="건강 체크" maxWidth="lg">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">출근을 시작하기 전에 간단한 건강 체크를 진행합니다.</p>

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
                  onClick={() => setHealthSurvey({ ...healthSurvey, condition: option.value })}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                    healthSurvey.condition === option.value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
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
            <label className="text-sm font-medium text-foreground mb-2 block">메모 (선택사항)</label>
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
            <Button className="flex-1" onClick={handleHealthSurveySubmit} disabled={!isHealthSurveyValid()}>
              완료
            </Button>
          </div>
        </div>
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

      {/* 신청 현황 모달 */}
      <Modal 
        isOpen={showAttendanceModal} 
        onClose={() => setShowAttendanceModal(false)} 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
            <span>신청 현황 목록</span>
          </div>
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
                            onClick={() => {
                              // TODO: 수정 기능 구현
                              toast.info('수정 기능은 준비 중입니다.');
                            }}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            수정
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              // TODO: 취소 기능 구현
                              toast.info('취소 기능은 준비 중입니다.');
                            }}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            취소
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
    </AdminDashboardRoot>
  );
}
