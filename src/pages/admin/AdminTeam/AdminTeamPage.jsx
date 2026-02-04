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
  Heart
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { memberService, projectService } from '@/api';
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
  /** 현재 로그인 계정이 PROJECT_MEMBER에 등록된 프로젝트 수 */
  const [myProjectCount, setMyProjectCount] = useState(null);

  // 현재 로그인 계정 소속 프로젝트 수 (PROJECT_MEMBER 기준)
  useEffect(() => {
    if (!user?.memberNo) return;
    const fetchCount = async () => {
      try {
        const res = await projectService.getMyProjectCount();
        setMyProjectCount(Number(res?.count ?? res?.data?.count ?? 0));
      } catch {
        setMyProjectCount(0);
      }
    };
    fetchCount();
  }, [user?.memberNo]);

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

  // 직원 상세 정보 가져오기 (건강 체크 포함)
  const fetchEmployeeDetails = async (employeeId) => {
    if (employeeDetails[employeeId]) {
      return; // 이미 캐시된 경우
    }
    setLoadingDetails(prev => new Set(prev).add(employeeId));
    try {
      const response = await memberService.getMemberDetails(employeeId);
      const data = Array.isArray(response) ? response[0] : response;

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
          // TODO: 백엔드에서 제공되면 사용, 아니면 빈 배열
          healthScoreData: [],
          healthStatusDistribution: [],
          totalCheckDays: 0,
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
                <StatCardLabel>진행 중인 프로젝트</StatCardLabel>
                <StatCardValue>{myProjectCount ?? 0}개</StatCardValue>
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
              <StatCardLabel>진행 중인 프로젝트</StatCardLabel>
              <StatCardValue>{myProjectCount ?? 0}개</StatCardValue>
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

                  {/* 펼침: 데일리 설문(건강 체크) 결과 - agency 직원관리와 동일 */}
                  {isExpanded && (
                    <Card className="mt-0 p-6 bg-white border-t-0 rounded-t-none" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: '-1px', border: '1px solid #e2e8f0' }}>
                      {loadingDetails.has(employee.id) ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">상세 정보를 불러오는 중...</div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-4 h-4 text-primary" />
                            <h3 className="text-base font-semibold text-foreground">건강 체크 결과</h3>
                          </div>
                          {hc ? (
                            <div className="space-y-0">
                              <div className="flex items-center justify-between py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">오늘 컨디션</span>
                                <span className="text-sm font-medium text-foreground">{hc.condition ?? '-'}</span>
                              </div>
                              <div className="flex items-center justify-between py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">수면 시간</span>
                                <span className="text-sm font-medium text-foreground">{hc.sleepHours ?? 0}시간</span>
                              </div>
                              <div className="flex items-center justify-between py-2 border-b border-border">
                                <span className="text-sm text-muted-foreground">신체 불편함</span>
                                <span className="text-sm font-medium text-foreground">{hc.physicalDiscomfort ?? hc.discomfortLevel ?? 0}</span>
                              </div>
                              {hc.memo && (
                                <div className="pt-3 mt-3 border-t border-border">
                                  <p className="text-xs text-muted-foreground mb-2">메모</p>
                                  <div className="p-3 bg-muted/30 rounded-lg">
                                    <p className="text-sm text-foreground">{hc.memo}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-sm text-muted-foreground">검진을 하지 않았습니다</div>
                          )}
                          <div className="mt-4 pt-3 border-t border-border">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleOpenDetail(employee); }}
                              className="text-sm text-primary hover:underline"
                            >
                              상세 보기 →
                            </button>
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
