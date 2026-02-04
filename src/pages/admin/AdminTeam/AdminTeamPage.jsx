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
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { memberService, projectService, leaveService, attendanceService } from '@/api';
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
  EmptyStateContainer,
  EmptyStateMessage,
  PieChartWrapper,
  PieChartCenterText,
  PieChartDays,
  LeaveListSection,
  LeaveListScroll,
  AttendanceStatsSection,
} from './AdminTeamPage.styled';

// 근태 타입별 색상 (leave_request 기준, 있는 것만 표시)
const LEAVE_TYPE_COLORS = {
  연차: '#3B82F6',
  병가: '#EF4444',
  워케이션: '#10B981',
  재택근무: '#8B5CF6',
  휴가: '#F59E0B',
  반차: '#EAB308',
  반반차: '#6B7280',
};

// 근태 통계: member_no 기준 attendance 확인 후, 출근일이면 attendance_request 승인 건으로 타입 표시(워케이션 등), 승인 없으면 출근
function AttendanceStatsChart({ stats }) {
  const totalCount = stats?.totalCount ?? 0;
  const typeCounts = stats?.typeCounts ?? [];
  const now = new Date();
  const daysSoFar = now.getDate();
  const 미출근일수 = Math.max(0, daysSoFar - totalCount);
  const 출근Color = '#22c55e';
  const 미출근Color = '#e2e8f0';

  const rows = [
    ...typeCounts.map((tc) => ({
      label: tc.type || '출근',
      value: Number(tc.count) || 0,
      color: tc.type === '출근' ? 출근Color : (LEAVE_TYPE_COLORS[tc.type] || '#6B7280'),
    })),
    { label: '미출근', value: 미출근일수, color: 미출근Color },
  ].filter((r) => r.value > 0);

  const pieData = rows.map((r) => ({ name: r.label, value: r.value, color: r.color }));
  const centerDays = pieData.filter((d) => d.name !== '미출근').reduce((sum, d) => sum + d.value, 0);
  const isEmpty = pieData.length === 0;

  return (
    <div className="flex flex-row items-center gap-4">
      <PieChartWrapper style={{ width: 160, height: 160 }}>
        {isEmpty ? (
          <div className="flex items-center justify-center w-full h-full text-lg font-semibold text-muted-foreground">
            0일
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <PieChartCenterText>
              <PieChartDays>{centerDays}일</PieChartDays>
            </PieChartCenterText>
          </>
        )}
      </PieChartWrapper>
      <div className="flex flex-col gap-2">
        {rows.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-sm text-foreground">{label} {value}일</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
            role: artist.memberRole,
            originalRole: artist.memberRole,
            status: artist.memberStatus === 'ACTIVE' ? '근무중'
              : artist.memberStatus === 'ON_LEAVE' ? '휴가'
              : artist.memberStatus === 'SICK_LEAVE' ? '병가'
              : '근무중',
            projectCount: 0,
            profileImage: profileImageUrl,
          };
        });

        // 4. 참여 중인 프로젝트 수를 먼저 조회한 뒤 한 번에 설정 (클릭 전에도 카드에 올바른 개수 표시)
        const withCounts = await Promise.all(
          mappedEmployees.map(async (emp) => {
            try {
              const res = await memberService.getMemberDetails(emp.id);
              const data = res?.data != null ? res.data : (Array.isArray(res) ? res[0] : res);
              const projectCount = (data?.currentProjects?.length ?? 0);
              return { ...emp, projectCount };
            } catch {
              return { ...emp, projectCount: 0 };
            }
          })
        );
        setEmployees(withCounts);
      } catch (error) {
        console.error('작가 목록 조회 실패:', error);
        toast.error('작가 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [user?.memberNo, user?.agencyNo]);

  // 근태 신청 상태/타입 매핑 (표시용)
  const LEAVE_STATUS_MAP = { PENDING: '대기', APPROVED: '승인', REJECTED: '반려', CANCELLED: '취소' };
  const LEAVE_TYPE_MAP = { '연차': '연차', '병가': '병가', '워케이션': '워케이션', '재택근무': '재택근무', '휴가': '휴가', '반차': '반차', '반반차': '반반차' };

  // 직원 상세 정보 가져오기 (프로젝트 수 + 해당 작가 근태 신청 리스트 + 근태 통계)
  const fetchEmployeeDetails = async (employeeId) => {
    if (employeeDetails[employeeId]) {
      return; // 이미 캐시된 경우
    }
    setLoadingDetails(prev => new Set(prev).add(employeeId));
    try {
      const [memberRes, agencyRequestsRes, statsRes] = await Promise.all([
        memberService.getMemberDetails(employeeId),
        user?.agencyNo ? leaveService.getAgencyRequests(user.agencyNo) : Promise.resolve([]),
        attendanceService.getStatistics(employeeId, new Date().getFullYear(), new Date().getMonth() + 1),
      ]);
      const response = memberRes;
      const data = Array.isArray(response) ? response[0] : response;

      // 해당 작가의 근태 신청만 필터 (좌측 리스트용)
      const rawAgencyList = Array.isArray(agencyRequestsRes) ? agencyRequestsRes : agencyRequestsRes?.data ?? [];
      const leaveRequests = rawAgencyList
        .filter((r) => Number(r.memberNo) === Number(employeeId) && r.attendanceRequestStatus !== 'CANCELLED')
        .map((r) => ({
          id: r.attendanceRequestNo,
          type: LEAVE_TYPE_MAP[r.attendanceRequestType] || r.attendanceRequestType || '-',
          startDate: r.attendanceRequestStartDate,
          endDate: r.attendanceRequestEndDate,
          status: LEAVE_STATUS_MAP[r.attendanceRequestStatus] || r.attendanceRequestStatus,
        }));

      const statsData = statsRes?.data ?? statsRes;
      const attendanceStats = {
        totalCount: statsData?.totalCount ?? 0,
        typeCounts: statsData?.typeCounts ?? [],
      };

      const projectCount = data?.currentProjects?.length || 0;

      setEmployeeDetails(prev => ({
        ...prev,
        [employeeId]: {
          ...data,
          projectCount,
          leaveRequests,
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
          ? { ...emp, projectCount, profileImage: profileImageUrl || emp.profileImage }
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

                  {/* 펼침: 근태 신청 리스트 + 해당 작가 근태 통계 */}
                  {isExpanded && (
                    <Card className="mt-0 p-6 bg-white border-t-0 rounded-t-none" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: '-1px', border: '1px solid #e2e8f0' }}>
                      {loadingDetails.has(employee.id) ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">상세 정보를 불러오는 중...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                          {/* 좌: 근태 신청 리스트 (2개 이상 시 스크롤, 스크롤바 숨김) */}
                          <LeaveListSection>
                            <h3 className="text-base font-semibold text-foreground mb-3">근태 신청 리스트</h3>
                            {details?.leaveRequests?.length ? (
                              <LeaveListScroll>
                                <ul className="space-y-3 pr-1">
                                  {details.leaveRequests.map((req) => {
                                    const startStr = req.startDate ? new Date(req.startDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '-';
                                    const endStr = req.endDate ? new Date(req.endDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }) : '-';
                                    const statusVariant = req.status === '승인' ? 'default' : req.status === '반려' ? 'destructive' : 'secondary';
                                    return (
                                      <li key={req.id} className="rounded-lg border border-border bg-muted/30 px-3 py-3">
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                          <span className="text-sm font-semibold text-foreground">{req.type}</span>
                                          <Badge variant={statusVariant} className="text-xs shrink-0">
                                            {req.status}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          {startStr} ~ {endStr}
                                        </p>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </LeaveListScroll>
                            ) : (
                              <p className="text-sm text-muted-foreground py-2">근태 신청 내역이 없습니다</p>
                            )}
                          </LeaveListSection>
                          {/* 우: 근태 통계 (파이 차트) */}
                          <AttendanceStatsSection>
                            <h3 className="text-base font-semibold text-foreground mb-3">근태 통계</h3>
                            <AttendanceStatsChart stats={details?.attendanceStats} />
                          </AttendanceStatsSection>
                        </div>
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
