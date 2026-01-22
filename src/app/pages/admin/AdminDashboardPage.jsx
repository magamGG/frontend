import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
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
  Palmtree
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ProjectListModal } from '@/app/components/modals/ProjectListModal';
import { AttendanceListModal } from '@/app/components/modals/AttendanceListModal';
import { toast } from 'sonner';
import svgPaths from '@/imports/svg-oq0e8tu4xb';

export function AdminDashboardPage() {
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const [isAttendanceListOpen, setIsAttendanceListOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [showHealthSurvey, setShowHealthSurvey] = useState(false);
  const [healthCheckCompleted, setHealthCheckCompleted] = useState(false);
  const [currentAttendanceType, setCurrentAttendanceType] = useState('워케이션');
  
  // 근태 상태별 색상 반환
  const getStatusColor = (status) => {
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
  const getStatusTextColor = (status) => {
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
  
  const [healthSurvey, setHealthSurvey] = useState({
    condition,
    sleepHours,
    discomfortLevel,
    notes,
  });

  // localStorage에서 현재 근태 상태 확인
  useEffect(() => {
    const checkCurrentAttendance = () => {
      const storedAttendance = localStorage.getItem('managerAttendanceRequests');
      if (storedAttendance) {
        const requests = JSON.parse(storedAttendance);
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        // 오늘 날짜에 해당하는 승인된 근태 요청 찾기
        const currentRequest = requests.find((req) => {
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

  // Mock data for artists currently working
  const workingArtists = [
    { id, name: '김작가', project: '로맨스 판타지', startTime: '09, status: '작업중' },
    { id, name: '이작가', project: '액션 웹툰', startTime: '10, status: '작업중' },
    { id, name: '박작가', project: '일상 코미디', startTime: '09, status: '작업중' },
    { id, name: '최작가', project: 'SF 드라마', startTime: '10, status: '작업중' },
    { id, name: '정작가', project: '스릴러 미스터리', startTime: '09, status: '작업중' },
    { id, name: '강작가', project: '학원 로맨스', startTime: '10, status: '작업중' },
    { id, name: '조작가', project: '판타지 액션', startTime: '09, status: '작업중' },
    { id, name: '윤작가', project: '일상 드라마', startTime: '10, status: '작업중' },
    { id, name: '장작가', project: '무협 판타지', startTime: '09, status: '작업중' },
    { id, name: '임작가', project: '현대 로맨스', startTime: '11, status: '작업중' },
    { id, name: '한작가', project: '호러 스릴러', startTime: '09, status: '작업중' },
    { id, name: '오작가', project: '역사 드라마', startTime: '10, status: '작업중' },
    { id, name: '서작가', project: '스포츠 드라마', startTime: '09, status: '작업중' },
    { id, name: '신작가', project: '음악 로맨스', startTime: '11, status: '작업중' },
  ];

  // Mock data for managed projects
  const managedProjects = [
    { id, name: '로맨스 판타지', artist: '김작가', status: '정상', progress, deadline: '1월 25일' },
    { id, name: '액션 웹툰', artist: '이작가', status: '주의', progress, deadline: '1월 20일' },
    { id, name: '일상 코미디', artist: '박작가', status: '정상', progress, deadline: '1월 30일' },
    { id, name: 'SF 드라마', artist: '최작가', status: '정상', progress, deadline: '1월 28일' },
  ];

  // Mock data for attendance (pie chart)
  const attendanceData = [
    { name: '출근', value, color: '#00ACC1' }, // 청록색
    { name: '재택근무', value, color: '#FF9800' }, // 오렌지색
    { name: '휴가', value, color: '#757575' }, // 회색
    { name: '워케이션', value, color: '#9C27B0' }, // 보라색
  ];

  // Mock data for deadline urgency (bar chart)
  const deadlineData = [
    { name: '오늘', count,
    { name: '내일', count,
    { name: '2일 후', count,
    { name: '3일 후', count,
    { name: '4일 후', count,
  ];

  // Mock data for weekly attendance schedule
  const weeklyAttendance = [
    { id, name: '김작가', type: '워케이션', date: '1월 16일 ~ 1월 18일', status: '승인' },
    { id, name: '이작가', type: '휴가', date: '1월 17일 ~ 1월 19일', status: '승인' },
    { id, name: '박작가', type: '재택근무', date: '1월 15일', status: '승인' },
    { id, name: '정작가', type: '워케이션', date: '1월 20일 ~ 1월 22일', status: '대기' },
  ];

  const getAttendanceTypeColor = (type) => {
    switch (type) {
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

  const handleStopWork = () => {
    setIsWorking(false);
    setHealthCheckCompleted(false);
    toast.success('출근을 종료했습니다.');
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
    toast.info('건강 체크를 취소했습니다. 출근이 시작되지 않았습니다.');
  };

  const today = new Date();
  const todayString = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="h-full overflow-y-auto bg-[#FAFAFA] p-6">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* 출근 시작 & 현재 작업 중인 작가 섹션 - 최상단 2단 레이아웃 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 왼쪽: 출근 시작 섹션 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-[#1F2328]">{todayString}</h3>
                </div>
                <p className="text-sm text-[#5a6067]">2026년 1월 15일 수요일</p>
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
                  className={`bg-[#3f4a5a] hover:bg-[#6E8FB3] ${isWorking ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  size="lg"
                >
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
              </div>
            </div>

            {/* Current Status Display */}
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">현재 상태 선택</label>
              <select
                value={currentAttendanceType || ''}
                onChange={(e) => setCurrentAttendanceType(e.target.value)}
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

          {/* 오른쪽: 현재 작업 중인 작가 섹션 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-[#6E8FB3]" />
              <h2 className="text-base font-bold text-[#1F2328]">현재 작업 중인 작가</h2>
              <Badge className="bg-[#6E8FB3] text-white text-xs px-2 py-1">
                {workingArtists.length}명
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {workingArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-bold text-[#1F2328] text-sm">{artist.name}</span>
                  </div>
                  <p className="text-xs text-[#6E8FB3] mb-1">{artist.project}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200">
                    <span className="text-xs text-[#6E8FB3]">시작</span>
                    <span className="text-xs font-medium text-[#1F2328]">{artist.startTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 그래프 섹션 */}
        <div className="grid grid-cols-1 gap-4">
          {/* 마감 임박 현황 (막대 그래프) */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-[#6E8FB3]" />
              <h3 className="text-base font-bold text-[#1F2328]">마감 임박 현황</h3>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deadlineData} barSize={40}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius,
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#6E8FB3" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-900">
                  오늘 마감 예정 작품이 {deadlineData[0].count}개 있습니다
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 프로젝트 및 근태 섹션 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 담당 프로젝트 현황 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#6E8FB3]" />
                <h3 className="text-base font-bold text-[#1F2328]">담당 프로젝트 현황</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsProjectListOpen(true)}
                className="text-xs h-7"
              >
                전체보기
              </Button>
            </div>

            <div className="space-y-3">
              {managedProjects.map((project) => (
                <div key={project.id} className="p-3 bg-[#FAFAFA] rounded-lg border border-[#DADDE1] hover:border-[#6E8FB3] transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-[#1F2328] text-sm">{project.name}</h4>
                        <Badge className={`${getStatusColor(project.status)} text-xs text-white`}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#6E8FB3]">담당: {project.artist}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6E8FB3]" />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-[#6E8FB3]">
                    <span>마감: {project.deadline}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-blue-900">
                  총 {managedProjects.length}개의 프로젝트를 담당하고 있습니다
                </p>
              </div>
            </div>
          </Card>

          {/* 금주 근태 예정 */}
          <Card className="p-5 bg-white border-none shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#6E8FB3]" />
                <h3 className="text-base font-bold text-[#1F2328]">금주 근태 예정</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAttendanceListOpen(true)}
                className="text-xs h-7"
              >
                전체보기
              </Button>
            </div>

            <div className="space-y-3">
              {weeklyAttendance.map((item) => (
                <div key={item.id} className="p-3 bg-[#FAFAFA] rounded-lg border border-[#DADDE1]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#1F2328] text-sm">{item.name}</span>
                      <Badge className={`${getAttendanceTypeColor(item.type)} text-xs text-white`}>
                        {item.type}
                      </Badge>
                    </div>
                    <Badge className={`${getAttendanceStatusColor(item.status)} text-xs text-white`}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6E8FB3]">{item.date}</p>
                </div>
              ))}
            </div>

            {weeklyAttendance.filter(a => a.status === '대기').length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-900">
                    승인 대기 중인 신청이 {weeklyAttendance.filter(a => a.status === '대기').length}건 있습니���
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Project List Modal */}
      <ProjectListModal
        open={isProjectListOpen}
        onOpenChange={setIsProjectListOpen}
        projects={managedProjects}
      />

      {/* Attendance List Modal */}
      <AttendanceListModal
        open={isAttendanceListOpen}
        onOpenChange={setIsAttendanceListOpen}
        attendances={weeklyAttendance}
      />

      {/* Health Survey Modal */}
      <Modal
        isOpen={showHealthSurvey}
        onClose={() => setShowHealthSurvey(false)}
        title="건강 체크"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            출근을 시작하기 전에 간단한 건강 체크를 진행합니다.
          </p>

          {/* 컨디션 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              오늘 컨디션 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value, label: '피곤함' },
                { value, label: '보통' },
                { value, label: '좋음' },
                { value, label: '최상' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setHealthSurvey({ ...healthSurvey, condition: option.value)}
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
    </div>
  );
}