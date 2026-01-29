import { useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  Briefcase,
  Activity,
  Search,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
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
} from './AdminTeamPage.styled';

export function AdminTeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // TODO: Zustand store mapping - 직원 목록
  const [employees] = useState([
    {
      id: 1,
      name: '김작가',
      email: 'kim.artist@agency.com',
      phone: '010-4567-8901',
      role: '작가',
      position: '메인 작가',
      status: '근무중',
      projectCount: 2,
      healthCheck: {
        date: '1월 23일',
        condition: '보통',
        sleepHours: 7,
        physicalDiscomfort: 4,
        memo: '오늘은 키위가 먹고싶네여....',
        // 최근 7일간 건강 점수 추이 (0-100점)
        // 건강 점수 = (수면시간 점수 + 컨디션 점수 + 신체불편함 역점수) / 3
        healthScoreData: [
          { date: '1/17', score: 75 },
          { date: '1/18', score: 78 },
          { date: '1/19', score: 80 },
          { date: '1/20', score: 82 },
          { date: '1/21', score: 85 },
          { date: '1/22', score: 85 },
          { date: '1/23', score: 82 },
        ],
        // 최근 30일간 건강 상태 분포도
        // 정상: 70점 이상, 주의: 50-69점, 경고: 50점 미만
        healthStatusDistribution: [
          { name: '정상', value: 18, color: '#4CAF50' },    // 18일
          { name: '주의', value: 5, color: '#FF9800' },       // 5일
          { name: '경고', value: 2, color: '#F44336' },      // 2일
        ],
        totalCheckDays: 25,  // 총 건강 체크 일수
      },
    },
    {
      id: 2,
      name: '이작가',
      email: 'lee.artist@agency.com',
      phone: '010-5678-9012',
      role: '작가',
      position: '시니어 작가',
      status: '휴가',
      projectCount: 2,
      healthCheck: {
        date: '1월 23일',
        condition: '좋음',
        sleepHours: 8,
        physicalDiscomfort: 2,
        memo: '',
        // 최근 7일간 건강 점수 추이 (0-100점)
        healthScoreData: [
          { date: '1/17', score: 80 },
          { date: '1/18', score: 82 },
          { date: '1/19', score: 85 },
          { date: '1/20', score: 88 },
          { date: '1/21', score: 90 },
          { date: '1/22', score: 92 },
          { date: '1/23', score: 90 },
        ],
        // 최근 30일간 건강 상태 분포도
        healthStatusDistribution: [
          { name: '정상', value: 21, color: '#4CAF50' },    // 21일
          { name: '주의', value: 7, color: '#FF9800' },       // 7일
          { name: '경고', value: 2, color: '#F44336' },      // 2일
        ],
        totalCheckDays: 30,
      },
    },
    {
      id: 3,
      name: '박작가',
      email: 'park.artist@agency.com',
      phone: '010-6789-0123',
      role: '작가',
      position: '메인 작가',
      status: '근무중',
      projectCount: 1,
      healthCheck: {
        date: '1월 23일',
        condition: '보통',
        sleepHours: 6,
        physicalDiscomfort: 5,
        memo: '',
        // 최근 7일간 건강 점수 추이 (0-100점)
        healthScoreData: [
          { date: '1/17', score: 70 },
          { date: '1/18', score: 72 },
          { date: '1/19', score: 75 },
          { date: '1/20', score: 78 },
          { date: '1/21', score: 80 },
          { date: '1/22', score: 82 },
          { date: '1/23', score: 78 },
        ],
        // 최근 30일간 건강 상태 분포도
        healthStatusDistribution: [
          { name: '정상', value: 11, color: '#4CAF50' },    // 11일
          { name: '주의', value: 7, color: '#FF9800' },       // 7일
          { name: '경고', value: 2, color: '#F44336' },      // 2일
        ],
        totalCheckDays: 20,
      },
    },
  ]);

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

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
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
                  <Users className="w-8 h-8" />
                </EmployeeDetailAvatar>
                <EmployeeDetailInfo>
                  <EmployeeDetailName>{selectedEmployee.name}</EmployeeDetailName>
                  <EmployeeDetailBadges>
                    <EmployeeBadge $variant="role">{selectedEmployee.role}</EmployeeBadge>
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
            {selectedEmployee.healthCheck && (
              <HealthCheckCard>
                <HealthCheckTitle>{selectedEmployee.healthCheck.date} 건강 체크 결과</HealthCheckTitle>
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

                  {/* 오른쪽: 원형 차트 - 최근 30일간 건강 상태 분포도 */}
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
                      <PieChartDays>{selectedEmployee.healthCheck.totalCheckDays} 일</PieChartDays>
                      <PieChartLabel>총 체크일</PieChartLabel>
                    </PieChartCenterText>
                  </PieChartWrapper>
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
        <EmployeeList>
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} onClick={() => handleEmployeeClick(employee)}>
              <EmployeeLeft>
                <EmployeeAvatar>
                  <Users className="w-6 h-6" />
                </EmployeeAvatar>
                <EmployeeInfo>
                  <EmployeeName>{employee.name}</EmployeeName>
                  <EmployeeBadges>
                    <EmployeeBadge $variant="role">{employee.role}</EmployeeBadge>
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
                  <ProjectsCount>{employee.projectCount}개</ProjectsCount>
                </ProjectsInfo>
                <ChevronIcon>
                  <ChevronRight className="w-5 h-5" />
                </ChevronIcon>
              </EmployeeRight>
            </EmployeeCard>
          ))}
        </EmployeeList>
      </AdminTeamBody>
    </AdminTeamRoot>
  );
}
