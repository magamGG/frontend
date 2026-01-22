import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Calendar,
  Edit2,
  Save,
  X,
  Search,
  Users,
  AlertCircle,
  Building2,
  Settings,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import {
  LeaveSettingsRoot,
  LeaveSettingsBody,
  PageHeader,
  PageTitle,
  PageDescription,
  HeaderActions,
  TabContainer,
  TabButton,
  TabContent,
  SearchBarContainer,
  SearchIcon,
  SearchInput,
  EmployeeListContainer,
  EmployeeCard,
  EmployeeCardContent,
  EmployeeAvatar,
  EmployeeInfo,
  EmployeeNameRow,
  EmployeeName,
  EmployeeEmail,
  EmployeeRole,
  LeaveStats,
  LeaveStatItem,
  LeaveStatLabel,
  LeaveStatValue,
  LeaveStatValueOrange,
  LeaveStatValueGreen,
  EmptyStateCard,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  EditButton,
  EditButtonIcon,
  ModalContent,
  FormGroup,
  FormLabel,
  FormLabelRequired,
  FormInput,
  FormHelperText,
  RemainingLeaveBox,
  RemainingLeaveHeader,
  RemainingLeaveIcon,
  RemainingLeaveLabel,
  RemainingLeaveValue,
  ErrorBox,
  ErrorIcon,
  ErrorText,
  ModalActions,
  PolicySection,
  PolicyCard,
  PolicyCardHeader,
  PolicyCardTitle,
  PolicyCardDescription,
  PolicyFormGrid,
  RolePolicyItem,
  RolePolicyLabel,
  RolePolicyInput,
  PolicyStatsGrid,
  PolicyStatCard,
  PolicyStatLabel,
  PolicyStatValue,
  ApplyPolicyButton,
} from './AgencyLeaveSettingsPage.styled';

// TODO: Zustand store mapping - 회사 연차 정책
const getInitialCompanyPolicy = () => {
  const stored = localStorage.getItem('agencyLeavePolicy');
  if (stored) {
    return JSON.parse(stored);
  }
  // 기본 회사 정책
  return {
    defaultLeave: 15,
    roleBasedLeave: {
      '담당자': 15,
      '작가': 15,
      '어시스트': 12,
    },
  };
};

// TODO: Zustand store mapping - 직원 목록
const getInitialEmployees = () => {
  const stored = localStorage.getItem('agencyEmployees');
  if (stored) {
    return JSON.parse(stored);
  }
  // 기본 직원 데이터
  return [
    {
      id: 1,
      name: '김담당자',
      role: '담당자',
      email: 'kim@agency.com',
      totalLeave: 15,
      usedLeave: 3,
      remainingLeave: 12,
    },
    {
      id: 2,
      name: '이담당자',
      role: '담당자',
      email: 'lee@agency.com',
      totalLeave: 15,
      usedLeave: 5,
      remainingLeave: 10,
    },
    {
      id: 3,
      name: '박담당자',
      role: '담당자',
      email: 'park@agency.com',
      totalLeave: 15,
      usedLeave: 0,
      remainingLeave: 15,
    },
    {
      id: 4,
      name: '김작가',
      role: '작가',
      email: 'kim.artist@agency.com',
      totalLeave: 15,
      usedLeave: 2,
      remainingLeave: 13,
    },
    {
      id: 5,
      name: '이작가',
      role: '작가',
      email: 'lee.artist@agency.com',
      totalLeave: 15,
      usedLeave: 8,
      remainingLeave: 7,
    },
  ];
};

export function AgencyLeaveSettingsPage() {
  const [activeTab, setActiveTab] = useState('policy'); // 'policy' or 'employees'
  const [companyPolicy, setCompanyPolicy] = useState(getInitialCompanyPolicy);
  const [employees, setEmployees] = useState(getInitialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    totalLeave: 0,
    usedLeave: 0,
  });

  // localStorage에 저장
  useEffect(() => {
    localStorage.setItem('agencyEmployees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('agencyLeavePolicy', JSON.stringify(companyPolicy));
  }, [companyPolicy]);

  // 회사 정책 통계 계산
  const calculatePolicyStats = () => {
    const totalEmployees = employees.length;
    const totalUsedLeave = employees.reduce((sum, emp) => sum + emp.usedLeave, 0);
    const totalRemainingLeave = employees.reduce((sum, emp) => sum + emp.remainingLeave, 0);
    const totalAllocatedLeave = employees.reduce((sum, emp) => sum + emp.totalLeave, 0);
    
    return {
      totalEmployees,
      totalUsedLeave,
      totalRemainingLeave,
      totalAllocatedLeave,
      averageUsedLeave: totalEmployees > 0 ? (totalUsedLeave / totalEmployees).toFixed(1) : 0,
      averageRemainingLeave: totalEmployees > 0 ? (totalRemainingLeave / totalEmployees).toFixed(1) : 0,
    };
  };

  const policyStats = calculatePolicyStats();

  // 회사 정책 저장
  const handleSavePolicy = () => {
    if (companyPolicy.defaultLeave < 0) {
      toast.error('기본 연차 수는 0 이상이어야 합니다.');
      return;
    }

    Object.values(companyPolicy.roleBasedLeave).forEach((leave) => {
      if (leave < 0) {
        toast.error('역할별 연차 수는 0 이상이어야 합니다.');
        return;
      }
    });

    localStorage.setItem('agencyLeavePolicy', JSON.stringify(companyPolicy));
    toast.success('회사 연차 정책이 저장되었습니다.');
  };

  // 회사 정책 초기화
  const handleResetPolicy = () => {
    if (confirm('정책을 초기값으로 되돌리시겠습니까?')) {
      const initialPolicy = getInitialCompanyPolicy();
      setCompanyPolicy(initialPolicy);
      toast.success('정책이 초기값으로 되돌아갔습니다.');
    }
  };

  // 회사 정책을 모든 직원에게 일괄 적용
  const handleApplyPolicyToAll = () => {
    if (!confirm('모든 직원의 연차를 회사 정책에 맞게 업데이트하시겠습니까? 기존 사용한 연차는 유지됩니다.')) {
      return;
    }

    const updatedEmployees = employees.map((emp) => {
      const policyLeave = companyPolicy.roleBasedLeave[emp.role] || companyPolicy.defaultLeave;
      const remainingLeave = policyLeave - emp.usedLeave;
      
      return {
        ...emp,
        totalLeave: policyLeave,
        remainingLeave: remainingLeave >= 0 ? remainingLeave : 0,
      };
    });

    setEmployees(updatedEmployees);
    toast.success('모든 직원의 연차가 회사 정책에 맞게 업데이트되었습니다.');
  };

  // 검색 필터링
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 연차 수정 모달 열기
  const handleOpenEditModal = (employee) => {
    setSelectedEmployee(employee);
    setEditFormData({
      totalLeave: employee.totalLeave,
      usedLeave: employee.usedLeave,
    });
    setIsEditModalOpen(true);
  };

  // 연차 수정 저장
  const handleSaveLeave = () => {
    if (editFormData.totalLeave < 0 || editFormData.usedLeave < 0) {
      toast.error('연차 수는 0 이상이어야 합니다.');
      return;
    }

    if (editFormData.usedLeave > editFormData.totalLeave) {
      toast.error('사용한 연차가 총 연차보다 많을 수 없습니다.');
      return;
    }

    const remainingLeave = editFormData.totalLeave - editFormData.usedLeave;

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              totalLeave: editFormData.totalLeave,
              usedLeave: editFormData.usedLeave,
              remainingLeave: remainingLeave,
            }
          : emp
      )
    );

    toast.success(`${selectedEmployee.name}의 연차가 업데이트되었습니다.`);
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
    setEditFormData({ totalLeave: 0, usedLeave: 0 });
  };

  return (
    <LeaveSettingsRoot>
      <LeaveSettingsBody>
        {/* 페이지 헤더 */}
        <PageHeader>
          <div>
            <PageTitle>연차 설정</PageTitle>
            <PageDescription>회사별 연차 정책을 설정하고 직원별 연차를 관리하세요</PageDescription>
          </div>
        </PageHeader>

        {/* 탭 메뉴 */}
        <TabContainer>
          <TabButton $isActive={activeTab === 'policy'} onClick={() => setActiveTab('policy')}>
            <Settings className="w-4 h-4" />
            회사 정책 설정
          </TabButton>
          <TabButton $isActive={activeTab === 'employees'} onClick={() => setActiveTab('employees')}>
            <Users className="w-4 h-4" />
            직원별 연차 관리
          </TabButton>
        </TabContainer>

        {/* 탭 콘텐츠 */}
        <TabContent>
          {activeTab === 'policy' ? (
            <PolicySection>
              {/* 회사 정책 설정 카드 */}
              <PolicyCard>
                <PolicyCardHeader>
                  <PolicyCardTitle>연차 정책 설정</PolicyCardTitle>
                  <PolicyCardDescription>
                    회사 전체에 적용될 기본 연차 정책을 설정하세요. 역할별로 다른 연차 수를 지정할 수 있습니다.
                  </PolicyCardDescription>
                </PolicyCardHeader>

                <ModalContent>
                  <FormGroup>
                    <FormLabel>
                      기본 연차 수 <FormLabelRequired>*</FormLabelRequired>
                    </FormLabel>
                    <FormInput
                      type="number"
                      min="0"
                      value={companyPolicy.defaultLeave}
                      onChange={(e) =>
                        setCompanyPolicy({
                          ...companyPolicy,
                          defaultLeave: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="기본 연차 일수"
                    />
                    <FormHelperText>역할별 연차가 설정되지 않은 경우 적용되는 기본 연차 수입니다.</FormHelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>역할별 연차 수</FormLabel>
                    <PolicyFormGrid>
                      {Object.keys(companyPolicy.roleBasedLeave).map((role) => (
                        <RolePolicyItem key={role}>
                          <RolePolicyLabel>{role}</RolePolicyLabel>
                          <RolePolicyInput
                            type="number"
                            min="0"
                            value={companyPolicy.roleBasedLeave[role]}
                            onChange={(e) =>
                              setCompanyPolicy({
                                ...companyPolicy,
                                roleBasedLeave: {
                                  ...companyPolicy.roleBasedLeave,
                                  [role]: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            placeholder="연차 일수"
                          />
                        </RolePolicyItem>
                      ))}
                    </PolicyFormGrid>
                    <FormHelperText>각 역할별로 다른 연차 수를 설정할 수 있습니다.</FormHelperText>
                  </FormGroup>

                  <ApplyPolicyButton onClick={handleApplyPolicyToAll}>
                    <UserCheck className="w-4 h-4" />
                    정책을 모든 직원에게 적용
                  </ApplyPolicyButton>
                </ModalContent>

                <ModalActions>
                  <Button variant="outline" onClick={handleResetPolicy}>
                    초기화
                  </Button>
                  <Button onClick={handleSavePolicy}>
                    <Save className="w-4 h-4" />
                    정책 저장
                  </Button>
                </ModalActions>
              </PolicyCard>

              {/* 회사 연차 통계 */}
              <PolicyCard>
                <PolicyCardHeader>
                  <PolicyCardTitle>연차 통계</PolicyCardTitle>
                  <PolicyCardDescription>
                    현재 회사의 연차 사용 현황을 확인하세요
                  </PolicyCardDescription>
                </PolicyCardHeader>

                <PolicyStatsGrid>
                  <PolicyStatCard>
                    <PolicyStatLabel>전체 직원 수</PolicyStatLabel>
                    <PolicyStatValue>{policyStats.totalEmployees}명</PolicyStatValue>
                  </PolicyStatCard>
                  <PolicyStatCard>
                    <PolicyStatLabel>총 할당 연차</PolicyStatLabel>
                    <PolicyStatValue>{policyStats.totalAllocatedLeave}일</PolicyStatValue>
                  </PolicyStatCard>
                  <PolicyStatCard>
                    <PolicyStatLabel>총 사용 연차</PolicyStatLabel>
                    <PolicyStatValue style={{ color: '#ea580c' }}>
                      {policyStats.totalUsedLeave}일
                    </PolicyStatValue>
                  </PolicyStatCard>
                  <PolicyStatCard>
                    <PolicyStatLabel>총 남은 연차</PolicyStatLabel>
                    <PolicyStatValue style={{ color: '#16a34a' }}>
                      {policyStats.totalRemainingLeave}일
                    </PolicyStatValue>
                  </PolicyStatCard>
                  <PolicyStatCard>
                    <PolicyStatLabel>평균 사용 연차</PolicyStatLabel>
                    <PolicyStatValue>{policyStats.averageUsedLeave}일</PolicyStatValue>
                  </PolicyStatCard>
                  <PolicyStatCard>
                    <PolicyStatLabel>평균 남은 연차</PolicyStatLabel>
                    <PolicyStatValue style={{ color: '#16a34a' }}>
                      {policyStats.averageRemainingLeave}일
                    </PolicyStatValue>
                  </PolicyStatCard>
                </PolicyStatsGrid>
              </PolicyCard>
            </PolicySection>
          ) : (
            <>
              {/* 검색 바 */}
              <SearchBarContainer>
                <SearchIcon>
                  <Search className="w-4 h-4" />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="직원 이름 또는 이메일로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchBarContainer>

              {/* 직원 목록 */}
              <EmployeeListContainer>
          {filteredEmployees.length === 0 ? (
            <EmptyStateCard>
              <EmptyState>
                <EmptyStateIcon>
                  <Users className="w-12 h-12" />
                </EmptyStateIcon>
                <EmptyStateText>
                  {searchQuery ? '검색 결과가 없습니다' : '등록된 직원이 없습니다'}
                </EmptyStateText>
              </EmptyState>
            </EmptyStateCard>
          ) : (
            filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id}>
                <EmployeeCardContent>
                  <EmployeeAvatar>
                    <Users className="w-8 h-8" />
                  </EmployeeAvatar>
                  <EmployeeInfo>
                    <EmployeeNameRow>
                      <EmployeeName>{employee.name}</EmployeeName>
                      <EmployeeRole>{employee.role}</EmployeeRole>
                    </EmployeeNameRow>
                    <EmployeeEmail>{employee.email}</EmployeeEmail>
                    <LeaveStats>
                      <LeaveStatItem>
                        <LeaveStatLabel>총 연차</LeaveStatLabel>
                        <LeaveStatValue>{employee.totalLeave}일</LeaveStatValue>
                      </LeaveStatItem>
                      <LeaveStatItem>
                        <LeaveStatLabel>사용한 연차</LeaveStatLabel>
                        <LeaveStatValueOrange>{employee.usedLeave}일</LeaveStatValueOrange>
                      </LeaveStatItem>
                      <LeaveStatItem>
                        <LeaveStatLabel>남은 연차</LeaveStatLabel>
                        <LeaveStatValueGreen>{employee.remainingLeave}일</LeaveStatValueGreen>
                      </LeaveStatItem>
                    </LeaveStats>
                  </EmployeeInfo>
                  <EditButton onClick={() => handleOpenEditModal(employee)}>
                    <EditButtonIcon>
                      <Edit2 className="w-4 h-4" />
                    </EditButtonIcon>
                    수정
                  </EditButton>
                </EmployeeCardContent>
              </EmployeeCard>
            ))
          )}
        </EmployeeListContainer>
            </>
          )}
        </TabContent>
      </LeaveSettingsBody>

      {/* 연차 수정 모달 */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>연차 수정</DialogTitle>
            <DialogDescription>
              {selectedEmployee?.name}님의 연차를 수정하세요.
            </DialogDescription>
          </DialogHeader>

          <ModalContent>
            <FormGroup>
              <FormLabel>
                총 연차 <FormLabelRequired>*</FormLabelRequired>
              </FormLabel>
              <FormInput
                type="number"
                min="0"
                value={editFormData.totalLeave}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, totalLeave: parseInt(e.target.value) || 0 })
                }
                placeholder="총 연차 수를 입력하세요"
              />
              <FormHelperText>해당 직원의 총 연차 일수를 입력하세요.</FormHelperText>
            </FormGroup>

            <FormGroup>
              <FormLabel>
                사용한 연차 <FormLabelRequired>*</FormLabelRequired>
              </FormLabel>
              <FormInput
                type="number"
                min="0"
                value={editFormData.usedLeave}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, usedLeave: parseInt(e.target.value) || 0 })
                }
                placeholder="사용한 연차 수를 입력하세요"
              />
              <FormHelperText>이미 사용한 연차 일수를 입력하세요.</FormHelperText>
            </FormGroup>

            {editFormData.totalLeave > 0 && (
              <RemainingLeaveBox>
                <RemainingLeaveHeader>
                  <RemainingLeaveIcon>
                    <Calendar className="w-4 h-4" />
                  </RemainingLeaveIcon>
                  <RemainingLeaveLabel>남은 연차</RemainingLeaveLabel>
                </RemainingLeaveHeader>
                <RemainingLeaveValue>
                  {editFormData.totalLeave - editFormData.usedLeave}일
                </RemainingLeaveValue>
              </RemainingLeaveBox>
            )}

            {editFormData.usedLeave > editFormData.totalLeave && (
              <ErrorBox>
                <ErrorIcon>
                  <AlertCircle className="w-4 h-4" />
                </ErrorIcon>
                <ErrorText>
                  사용한 연차가 총 연차보다 많을 수 없습니다.
                </ErrorText>
              </ErrorBox>
            )}
          </ModalContent>

          <ModalActions>
            <Button variant="outline" onClick={handleCloseModal}>
              취소
            </Button>
            <Button
              onClick={handleSaveLeave}
              disabled={editFormData.usedLeave > editFormData.totalLeave}
            >
              <Save className="w-4 h-4" />
              저장
            </Button>
          </ModalActions>
        </DialogContent>
      </Dialog>
    </LeaveSettingsRoot>
  );
}
