import { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Briefcase,
  Activity,
  Search,
  ChevronRight,
  ChevronDown,
  Heart,
  CalendarClock
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { memberService, leaveService, attendanceService } from '@/api';
import { API_BASE_URL } from '@/api/config';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import {
  AdminTeamRoot,
  AdminTeamBody,
  AdminTeamHeader,
  AdminTeamTitle,
  AdminTeamSubtitle,
  StatsGrid,
  StatCard,
  StatCardIcon,
  StatCardContent,
  StatCardLabel,
  StatCardValue,
  SearchContainer,
  SearchInput,
  SearchIcon,
  EmployeeList,
  EmployeeCard,
  EmployeeLeft,
  EmployeeAvatar,
  EmployeeInfo,
  EmployeeName,
  EmployeeBadges,
  EmployeeBadge,
  ContactInfo,
  ContactItem,
  ContactIcon,
  ContactText,
  EmployeeRight,
  ProjectsInfo,
  ProjectsLabel,
  ProjectsCount,
  ChevronIcon,
  EmployeeDetailView,
  EmployeeDetailCard,
  EmployeeDetailHeader,
  EmployeeDetailAvatar,
  EmployeeDetailInfo,
  EmployeeDetailName,
  EmployeeDetailBadges,
  EmployeeDetailContact,
  HealthCheckCard,
  HealthCheckTitle,
  HealthCheckContent,
  HealthMetrics,
  HealthMetric,
  HealthMetricLabel,
  HealthMetricValue,
  HealthMetricDivider,
  MemoSection,
  MemoLabel,
  MemoInput,
  ChartContainer,
  LineChartWrapper,
  PieChartWrapper,
  PieChartCenterText,
  PieChartDays,
  PieChartLabel,
  EmptyStateContainer,
  EmptyStateMessage,
} from './AdminTeamPage.styled';

export function AdminTeamPage() {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null); // 목록에서 펼친 작가 (데일리 설문 등)
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({}); // 직원별 상세 정보 캐시
  const [loadingDetails, setLoadingDetails] = useState(new Set()); // 상세 로딩 중인 id
  const [agencyLeaveRequests, setAgencyLeaveRequests] = useState([]); // 에이전시 소속 근태 신청 목록

  const REQUEST_STATUS_MAP = {
    PENDING: { label: '대기', color: '#F59E0B' },
    APPROVED: { label: '승인', color: '#10B981' },
    REJECTED: { label: '반려', color: '#EF4444' },
    CANCELLED: { label: '취소', color: '#6B7280' },
  };
  const formatReqDate = (str) => {
    if (!str) return '-';
    try {
      const d = new Date(str);
      return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } catch {
      return str;
    }
  };

  // 현재 로그인한 담당자의 managerNo 조회 및 배정된 작가 목록 가져오기
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user?.memberNo || !user?.agencyNo) {
        return;
      }

      setIsLoading(true);
      try {
        // 1. 현재 사용자의 managerNo 조회 (담당자 목록에서 찾기)
        const managersResponse = await memberService.getManagersByAgency(user.agencyNo);
        const managersList = Array.isArray(managersResponse) 
          ? managersResponse 
          : managersResponse?.data || [];
        
        const currentManager = managersList.find(m => m.memberNo === user.memberNo);
        if (!currentManager || !currentManager.managerNo) {
          toast.error('담당자 정보를 찾을 수 없습니다.');
          setIsLoading(false);
          return;
        }

        const managerNo = currentManager.managerNo;

        // 2. ARTIST_ASSIGNMENT 테이블에서 해당 managerNo로 배정된 작가 목록 조회
        const artistsResponse = await memberService.getArtistsByManager(managerNo);
        const artistsList = Array.isArray(artistsResponse)
          ? artistsResponse
          : artistsResponse?.data || [];

        // 3. 작가 데이터를 컴포넌트 형식으로 변환
        const imageBaseUrl = API_BASE_URL || 'http://localhost:8888';
        const mappedEmployees = artistsList.map((artist) => {
          // 프로필 이미지 URL 구성
          let profileImageUrl = null;
          if (artist.memberProfileImage) {
            if (artist.memberProfileImage.startsWith('http://') || artist.memberProfileImage.startsWith('https://')) {
              profileImageUrl = artist.memberProfileImage;
            } else if (artist.memberProfileImage.startsWith('/uploads/')) {
              profileImageUrl = `${imageBaseUrl}${artist.memberProfileImage}`;
            } else {
              profileImageUrl = `${imageBaseUrl}/uploads/${artist.memberProfileImage}`;
            }
          }
          
          return {
            id: artist.memberNo,
            name: artist.memberName,
            email: artist.memberEmail,
            phone: artist.memberPhone || '',
            role: artist.memberRole, // 원본 역할 그대로 표시
            originalRole: artist.memberRole, // 원본 역할 저장
            status: artist.memberStatus === 'ACTIVE' ? '근무중' 
              : artist.memberStatus === 'ON_LEAVE' ? '휴가' 
              : artist.memberStatus === 'SICK_LEAVE' ? '병가' 
              : '근무중',
            projectCount: 0, // 프로젝트 수는 상세 정보에서 가져옴
            healthCheck: null, // 건강 체크는 상세 정보에서 가져옴
            profileImage: profileImageUrl, // 프로필 이미지 URL
          };
        });

        setEmployees(mappedEmployees);
      } catch (error) {
        console.error('작가 목록 조회 실패:', error);
        toast.error('작가 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [user?.memberNo, user?.agencyNo]);

  // 에이전시 소속 근태 신청 목록 조회 (직원별 필터링용)
  useEffect(() => {
    const fetchAgencyLeaveRequests = async () => {
      if (!user?.agencyNo) return;
      try {
        const list = await leaveService.getAgencyRequests(user.agencyNo);
        setAgencyLeaveRequests(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('에이전시 근태 신청 목록 조회 실패:', err);
        setAgencyLeaveRequests([]);
      }
    };
    fetchAgencyLeaveRequests();
  }, [user?.agencyNo]);

  // 직원 목록 로드 시 참여 중인 프로젝트 수 등 상세 정보 미리 조회
  useEffect(() => {
    if (!employees.length || !user?.agencyNo) return;
    employees.forEach((emp) => {
      if (!employeeDetails[emp.id] && !loadingDetails.has(emp.id)) {
        fetchEmployeeDetails(emp.id);
      }
    });
  }, [employees, user?.agencyNo]);

  // 직원 상세 정보 가져오기 (건강 체크, 근태 통계 포함)
  const fetchEmployeeDetails = async (employeeId) => {
    if (employeeDetails[employeeId] || loadingDetails.has(employeeId)) {
      return; // 이미 캐시됐거나 로딩 중인 경우
    }
    setLoadingDetails(prev => new Set(prev).add(employeeId));
    try {
      const [memberResponse, statsResponse] = await Promise.all([
        memberService.getMemberDetails(employeeId),
        (async () => {
          try {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            return await attendanceService.getStatistics(employeeId, year, month);
          } catch {
            return null;
          }
        })(),
      ]);
      const data = Array.isArray(memberResponse) ? memberResponse[0] : memberResponse;

      // 건강 체크 데이터 변환
      let healthCheck = null;
      if (data?.healthCheck) {
        const hc = data.healthCheck;
        healthCheck = {
          date: hc.date ? new Date(hc.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '',
          condition: hc.condition || '보통',
          sleepHours: hc.sleepHours || 0,
          physicalDiscomfort: hc.discomfortLevel || 0,
          memo: hc.memo || '',
          healthScoreData: [],
          healthStatusDistribution: [],
          totalCheckDays: 0,
        };
      }

      // 근태 통계 데이터 변환 (파이 차트용)
      const ATTENDANCE_TYPE_COLORS = { '출근': '#00ACC1', '휴가': '#757575', '재택근무': '#FF9800', '워케이션': '#9C27B0' };
      let attendanceStats = null;
      if (statsResponse?.typeCounts?.length) {
        attendanceStats = {
          data: statsResponse.typeCounts.map((item) => ({
            name: item.type,
            value: Number(item.count),
            color: ATTENDANCE_TYPE_COLORS[item.type] || '#6E8FB3',
          })),
          totalDays: statsResponse.totalCount || 0,
        };
      }

      // 프로젝트 수 계산
      const projectCount = data?.currentProjects?.length || 0;

      setEmployeeDetails(prev => ({
        ...prev,
        [employeeId]: {
          ...data,
          healthCheck,
          projectCount,
          attendanceStats,
        },
      }));

      // 프로필 이미지 URL 구성
      let profileImageUrl = null;
      if (data?.memberProfileImage) {
        const imageBaseUrl = API_BASE_URL || 'http://localhost:8888';
        if (data.memberProfileImage.startsWith('http://') || data.memberProfileImage.startsWith('https://')) {
          profileImageUrl = data.memberProfileImage;
        } else if (data.memberProfileImage.startsWith('/uploads/')) {
          profileImageUrl = `${imageBaseUrl}${data.memberProfileImage}`;
        } else {
          profileImageUrl = `${imageBaseUrl}/uploads/${data.memberProfileImage}`;
        }
      }

      // employees 상태도 업데이트
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId 
          ? { ...emp, projectCount, healthCheck, profileImage: profileImageUrl || emp.profileImage }
          : emp
      ));
    } catch (error) {
      console.error('직원 상세 정보 조회 실패:', error);
      toast.error('직원 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoadingDetails(prev => {
        const next = new Set(prev);
        next.delete(employeeId);
        return next;
      });
    }
  };

  const totalArtists = employees.length;
  const worksInProgress = employees.reduce((sum, emp) => sum + emp.projectCount, 0);
  const activeArtists = employees.filter(emp => emp.status === '근무중').length;

  const filteredEmployees = employees.filter(emp => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
  });

  const handleEmployeeClick = async (employee) => {
    const isExpanding = expandedEmployeeId !== employee.id;
    setExpandedEmployeeId(isExpanding ? employee.id : null);
    if (isExpanding && !employeeDetails[employee.id]) {
      await fetchEmployeeDetails(employee.id);
    }
  };

  // 해당 직원의 근태 신청 목록 (에이전시 목록에서 필터링)
  const getEmployeeLeaveRequests = (employeeId) => {
    return agencyLeaveRequests.filter((r) => Number(r.memberNo) === Number(employeeId));
  };

  const handleOpenDetail = (employee) => {
    const updatedEmployee = employees.find(emp => emp.id === employee.id) || employee;
    setSelectedEmployee(updatedEmployee);
  };

  const handleBackToList = () => {
    setSelectedEmployee(null);
  };

  // 상세 뷰가 선택된 경우
  if (selectedEmployee) {
    return (
      <AdminTeamRoot>
        <AdminTeamBody>
          {/* Header */}
          <AdminTeamHeader>
            <AdminTeamTitle>직원 관리</AdminTeamTitle>
            <AdminTeamSubtitle>담당 작가를 관리하세요</AdminTeamSubtitle>
          </AdminTeamHeader>

          {/* 통계 정보 카드 */}
          <StatsGrid>
            <StatCard>
              <StatCardIcon $bgColor="rgba(110, 143, 179, 0.1)" $iconColor="#6E8FB3">
                <Users className="w-6 h-6" />
              </StatCardIcon>
              <StatCardContent>
                <StatCardLabel>총 작가</StatCardLabel>
                <StatCardValue>{totalArtists}명</StatCardValue>
              </StatCardContent>
            </StatCard>
            
            <StatCard>
              <StatCardIcon $bgColor="rgba(59, 130, 246, 0.1)" $iconColor="#3B82F6">
                <Briefcase className="w-6 h-6" />
              </StatCardIcon>
              <StatCardContent>
                <StatCardLabel>진행 중인 작품</StatCardLabel>
                <StatCardValue>{worksInProgress}개</StatCardValue>
              </StatCardContent>
            </StatCard>
            
            <StatCard>
              <StatCardIcon $bgColor="rgba(34, 197, 94, 0.1)" $iconColor="#22C55E">
                <Activity className="w-6 h-6" />
              </StatCardIcon>
              <StatCardContent>
                <StatCardLabel>활동 작가</StatCardLabel>
                <StatCardValue>{activeArtists}명</StatCardValue>
              </StatCardContent>
            </StatCard>
          </StatsGrid>

          {/* 검색 바 */}
          <SearchContainer>
            <SearchIcon>
              <Search className="w-5 h-5" />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="이름 또는 이메일로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          {/* 직원 상세 뷰 */}
          <EmployeeDetailView>
            {/* 직원 프로필 카드 */}
            <EmployeeDetailCard>
              <EmployeeDetailHeader>
                <EmployeeDetailAvatar>
                  {selectedEmployee.profileImage ? (
                    <img 
                      src={selectedEmployee.profileImage} 
                      alt={selectedEmployee.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <Users className="w-8 h-8" style={{ display: selectedEmployee.profileImage ? 'none' : 'block' }} />
                </EmployeeDetailAvatar>
                <EmployeeDetailInfo>
                  <EmployeeDetailName>{selectedEmployee.name}</EmployeeDetailName>
                  <EmployeeDetailBadges>
                    <EmployeeBadge $variant="role">{selectedEmployee.originalRole || selectedEmployee.role}</EmployeeBadge>
                    <EmployeeBadge $variant={selectedEmployee.status === '근무중' ? 'working' : 'leave'}>
                      {selectedEmployee.status}
                    </EmployeeBadge>
                  </EmployeeDetailBadges>
                  <EmployeeDetailContact>
                    <ContactItem>
                      <ContactIcon>
                        <Mail className="w-4 h-4" />
                      </ContactIcon>
                      <ContactText>{selectedEmployee.email}</ContactText>
                    </ContactItem>
                    <ContactItem>
                      <ContactIcon>
                        <Phone className="w-4 h-4" />
                      </ContactIcon>
                      <ContactText>{selectedEmployee.phone}</ContactText>
                    </ContactItem>
                  </EmployeeDetailContact>
                </EmployeeDetailInfo>
                <EmployeeRight>
                  <ProjectsInfo>
                    <ProjectsLabel>참여 중인 프로젝트</ProjectsLabel>
                    <ProjectsCount>{selectedEmployee.projectCount}개</ProjectsCount>
                  </ProjectsInfo>
                  <ChevronIcon onClick={handleBackToList} $rotated>
                    <ChevronRight className="w-5 h-5" />
                  </ChevronIcon>
                </EmployeeRight>
              </EmployeeDetailHeader>
            </EmployeeDetailCard>

            {/* 건강 체크 결과 카드 */}
            {selectedEmployee.healthCheck ? (
              <HealthCheckCard>
                <HealthCheckTitle>
                  {selectedEmployee.healthCheck.date ? `${selectedEmployee.healthCheck.date} 건강 체크 결과` : '건강 체크 결과'}
                </HealthCheckTitle>
                <HealthCheckContent>
                  {/* 왼쪽: 건강 메트릭 */}
                  <div>
                    <HealthMetrics>
                      <HealthMetric>
                        <HealthMetricLabel>오늘 컨디션</HealthMetricLabel>
                        <HealthMetricValue>{selectedEmployee.healthCheck.condition}</HealthMetricValue>
                      </HealthMetric>
                      <HealthMetricDivider />
                      <HealthMetric>
                        <HealthMetricLabel>수면 시간</HealthMetricLabel>
                        <HealthMetricValue>{selectedEmployee.healthCheck.sleepHours}(시간)</HealthMetricValue>
                      </HealthMetric>
                      <HealthMetricDivider />
                      <HealthMetric>
                        <HealthMetricLabel>신체 불편함</HealthMetricLabel>
                        <HealthMetricValue>{selectedEmployee.healthCheck.physicalDiscomfort}</HealthMetricValue>
                      </HealthMetric>
                    </HealthMetrics>
                    <MemoSection>
                      <MemoLabel>메모 내용</MemoLabel>
                      <MemoInput
                        type="text"
                        placeholder="오늘은 키위가 먹고싶네여...."
                        value={selectedEmployee.healthCheck.memo}
                        readOnly
                      />
                    </MemoSection>
                  </div>

                  {/* 중앙: 라인 차트 - 최근 7일간 건강 점수 추이 */}
                  {selectedEmployee.healthCheck?.healthScoreData && selectedEmployee.healthCheck.healthScoreData.length > 0 ? (
                    <ChartContainer>
                      <LineChartWrapper>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedEmployee.healthCheck.healthScoreData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#5a6067"
                              tick={{ fontSize: 12 }}
                              label={{ value: '날짜', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#5a6067' } }}
                            />
                            <YAxis 
                              stroke="#5a6067"
                              tick={{ fontSize: 12 }}
                              domain={[0, 100]}
                              ticks={[0, 25, 50, 75, 100]}
                              label={{ value: '건강 점수', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#5a6067' } }}
                            />
                            <Tooltip 
                              formatter={(value) => [`${value}점`, '건강 점수']}
                              labelFormatter={(label) => `${label}`}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="#3B82F6" 
                              strokeWidth={2}
                              dot={{ fill: '#3B82F6', r: 4 }}
                              activeDot={{ r: 6 }}
                              name="건강 점수"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </LineChartWrapper>
                    </ChartContainer>
                  ) : (
                    <ChartContainer>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF' }}>
                        건강 점수 데이터가 없습니다
                      </div>
                    </ChartContainer>
                  )}

                  {/* 오른쪽: 원형 차트 - 최근 30일간 건강 상태 분포도 */}
                  {selectedEmployee.healthCheck?.healthStatusDistribution && selectedEmployee.healthCheck.healthStatusDistribution.length > 0 ? (
                    <PieChartWrapper>
                      <ResponsiveContainer width={140} height={140}>
                        <PieChart>
                          <Pie
                            data={selectedEmployee.healthCheck.healthStatusDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {selectedEmployee.healthCheck.healthStatusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name) => [`${value}일`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <PieChartCenterText>
                        <PieChartDays>{selectedEmployee.healthCheck.totalCheckDays || 0} 일</PieChartDays>
                        <PieChartLabel>총 체크일</PieChartLabel>
                      </PieChartCenterText>
                    </PieChartWrapper>
                  ) : (
                    <PieChartWrapper>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF' }}>
                        건강 상태 분포 데이터가 없습니다
                      </div>
                    </PieChartWrapper>
                  )}
                </HealthCheckContent>
              </HealthCheckCard>
            ) : (
              <HealthCheckCard>
                <HealthCheckTitle>건강 체크 결과</HealthCheckTitle>
                <HealthCheckContent>
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                    건강 체크 정보가 없습니다
                  </div>
                </HealthCheckContent>
              </HealthCheckCard>
            )}
          </EmployeeDetailView>
        </AdminTeamBody>
      </AdminTeamRoot>
    );
  }

  // 목록 뷰
  return (
    <AdminTeamRoot>
      <AdminTeamBody>
        {/* Header */}
        <AdminTeamHeader>
          <AdminTeamTitle>직원 관리</AdminTeamTitle>
          <AdminTeamSubtitle>담당 작가를 관리하세요</AdminTeamSubtitle>
        </AdminTeamHeader>

        {/* 통계 정보 카드 */}
        <StatsGrid>
          <StatCard>
            <StatCardIcon $bgColor="rgba(110, 143, 179, 0.1)" $iconColor="#6E8FB3">
              <Users className="w-6 h-6" />
            </StatCardIcon>
            <StatCardContent>
              <StatCardLabel>총 작가</StatCardLabel>
              <StatCardValue>{totalArtists}명</StatCardValue>
            </StatCardContent>
          </StatCard>
          
          <StatCard>
            <StatCardIcon $bgColor="rgba(59, 130, 246, 0.1)" $iconColor="#3B82F6">
              <Briefcase className="w-6 h-6" />
            </StatCardIcon>
            <StatCardContent>
              <StatCardLabel>진행 중인 작품</StatCardLabel>
              <StatCardValue>{worksInProgress}개</StatCardValue>
            </StatCardContent>
          </StatCard>
          
          <StatCard>
            <StatCardIcon $bgColor="rgba(34, 197, 94, 0.1)" $iconColor="#22C55E">
              <Activity className="w-6 h-6" />
            </StatCardIcon>
            <StatCardContent>
              <StatCardLabel>활동 작가</StatCardLabel>
              <StatCardValue>{activeArtists}명</StatCardValue>
            </StatCardContent>
          </StatCard>
        </StatsGrid>

        {/* 검색 바 */}
        <SearchContainer>
          <SearchIcon>
            <Search className="w-5 h-5" />
          </SearchIcon>
            <SearchInput
              type="text"
              placeholder="이름 또는 이메일로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </SearchContainer>

          {/* 직원 목록 */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>작가 목록을 불러오는 중...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateMessage>담당하는 작가가 없습니다</EmptyStateMessage>
          </EmptyStateContainer>
        ) : (
          <EmployeeList>
            {filteredEmployees.map((employee) => {
              const isExpanded = expandedEmployeeId === employee.id;
              const details = employeeDetails[employee.id];
              const hc = details?.healthCheck;
              return (
                <div key={employee.id}>
                  <EmployeeCard onClick={() => handleEmployeeClick(employee)}>
                    <EmployeeLeft>
                      <EmployeeAvatar>
                        {employee.profileImage ? (
                          <img 
                            src={employee.profileImage} 
                            alt={employee.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <Users className="w-6 h-6" style={{ display: employee.profileImage ? 'none' : 'block' }} />
                      </EmployeeAvatar>
                      <EmployeeInfo>
                        <EmployeeName>{employee.name}</EmployeeName>
                        <EmployeeBadges>
                          <EmployeeBadge $variant="role">{employee.originalRole || employee.role}</EmployeeBadge>
                          <EmployeeBadge $variant={employee.status === '근무중' ? 'working' : 'leave'}>
                            {employee.status}
                          </EmployeeBadge>
                        </EmployeeBadges>
                        <ContactInfo>
                          <ContactItem>
                            <ContactIcon>
                              <Mail className="w-4 h-4" />
                            </ContactIcon>
                            <ContactText>{employee.email}</ContactText>
                          </ContactItem>
                          <ContactItem>
                            <ContactIcon>
                              <Phone className="w-4 h-4" />
                            </ContactIcon>
                            <ContactText>{employee.phone}</ContactText>
                          </ContactItem>
                        </ContactInfo>
                      </EmployeeInfo>
                    </EmployeeLeft>
                    <EmployeeRight>
                      <ProjectsInfo>
                        <ProjectsLabel>참여 중인 프로젝트</ProjectsLabel>
                        <ProjectsCount>{loadingDetails.has(employee.id) ? '...' : (details?.projectCount ?? employee.projectCount)}개</ProjectsCount>
                      </ProjectsInfo>
                      <ChevronIcon $rotated={isExpanded}>
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </ChevronIcon>
                    </EmployeeRight>
                  </EmployeeCard>

                  {/* 펼침: 데일리 설문, 근태 신청 리스트, 근태 통계 그래프 - 에이전시 직원관리와 동일 */}
                  {isExpanded && (
                    <Card className="mt-0 p-6 bg-white border-t-0 rounded-t-none" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: '-1px', border: '1px solid #e2e8f0' }}>
                      {loadingDetails.has(employee.id) ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">상세 정보를 불러오는 중...</div>
                      ) : (
                        <>
                          {/* 공통: 데일리 설문, 근태 신청 리스트, 근태 통계 그래프 */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 pb-6 border-b border-border">
                            {/* 1. 데일리 설문 내용 */}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-3">
                                <Heart className="w-4 h-4 text-primary" />
                                <h3 className="text-base font-semibold text-foreground">데일리 설문 (건강 체크)</h3>
                              </div>
                              {hc ? (
                                <div className="space-y-0 p-4 bg-white border border-border rounded-lg flex-1 flex flex-col min-h-[220px]">
                                  <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                    <span className="text-sm font-medium">{hc.condition ?? '-'}</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">수면 시간</span>
                                    <span className="text-sm font-medium">{hc.sleepHours ?? 0}시간</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b border-border">
                                    <span className="text-sm text-muted-foreground">신체 불편함</span>
                                    <span className="text-sm font-medium">{hc.physicalDiscomfort ?? hc.discomfortLevel ?? 0}</span>
                                  </div>
                                  {hc.memo && (
                                    <div className="pt-3 mt-3 border-t border-border">
                                      <p className="text-xs text-muted-foreground mb-2">메모</p>
                                      <div className="p-3 bg-muted/30 rounded-lg">
                                        <p className="text-sm">{hc.memo}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-4 border border-border rounded-lg flex-1 flex items-center justify-center min-h-[220px] text-sm text-muted-foreground">검진을 하지 않았습니다</div>
                              )}
                            </div>

                            {/* 2. 근태 신청 리스트 */}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-3">
                                <CalendarClock className="w-4 h-4 text-primary" />
                                <h3 className="text-base font-semibold text-foreground">근태 신청 리스트</h3>
                              </div>
                              <div className="p-4 border border-border rounded-lg flex-1 flex flex-col min-h-[220px]">
                                {getEmployeeLeaveRequests(employee.id).length > 0 ? (
                                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                    {getEmployeeLeaveRequests(employee.id)
                                      .filter((r) => r.attendanceRequestStatus !== 'CANCELLED')
                                      .map((req) => {
                                        const statusMap = REQUEST_STATUS_MAP[req.attendanceRequestStatus] || { label: req.attendanceRequestStatus, color: '#6B7280' };
                                        return (
                                          <div key={req.attendanceRequestNo} className="p-2 bg-muted/30 rounded-lg border border-border">
                                            <div className="flex justify-between items-center">
                                              <span className="text-sm font-medium">{req.attendanceRequestType || '-'}</span>
                                              <Badge style={{ backgroundColor: statusMap.color, color: '#fff', fontSize: '10px' }}>{statusMap.label}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{formatReqDate(req.attendanceRequestStartDate)} ~ {formatReqDate(req.attendanceRequestEndDate)}</p>
                                          </div>
                                        );
                                      })}
                                  </div>
                                ) : (
                                  <div className="text-center py-6 text-sm text-muted-foreground flex-1 flex items-center justify-center">근태 신청 내역이 없습니다</div>
                                )}
                              </div>
                            </div>

                            {/* 3. 근태 통계 그래프 */}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-3">
                                <Briefcase className="w-4 h-4 text-primary" />
                                <h3 className="text-base font-semibold text-foreground">근태 통계</h3>
                              </div>
                              <div className="p-4 border border-border rounded-lg flex-1 flex flex-col min-h-[220px]">
                                {details?.attendanceStats?.data?.length > 0 ? (
                                  <div className="flex items-center gap-4 flex-1 min-h-[180px]">
<div className="w-[140px] h-[140px] flex-shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                          <Pie
                                            data={details.attendanceStats.data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={50}
                                            paddingAngle={2}
                                            dataKey="value"
                                          >
                                            {details.attendanceStats.data.map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                          </Pie>
                                          <Tooltip formatter={(value) => [`${value}일`, '']} />
                                        </PieChart>
                                      </ResponsiveContainer>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-2xl font-bold text-foreground">{details.attendanceStats.totalDays}<span className="text-sm font-normal text-muted-foreground ml-1">일</span></p>
                                      <p className="text-xs text-muted-foreground">이번 달 출근</p>
                                      <div className="mt-2 space-y-1">
                                        {details.attendanceStats.data.map((item, i) => (
                                          <div key={i} className="flex items-center gap-2 text-xs">
                                            <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
                                            <span>{item.name} {item.value}일</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-6 text-sm text-muted-foreground flex-1 flex items-center justify-center">근태 통계 데이터가 없습니다</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </Card>
                  )}
                </div>
              );
            })}
          </EmployeeList>
        )}
      </AdminTeamBody>
    </AdminTeamRoot>
  );
}
