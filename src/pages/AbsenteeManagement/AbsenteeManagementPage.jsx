import { useState } from 'react';
import { 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  Calendar, 
  Clock,
  X,
  ArrowUpDown,
  List,
  Mail,
  Phone
} from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import {
  RemoteManagementRoot,
  RemoteManagementBody,
  RemoteManagementHeader,
  HeaderLeft,
  PageTitle,
  PageSubtitle,
  HeaderRight,
  FilterButton,
  StatsGrid,
  StatCard,
  StatCardContent,
  StatCardLabel,
  StatCardValue,
  StatCardIcon,
  EmployeeGrid,
  EmployeeCard,
  EmployeeCardHeader,
  StatusBadge,
  EmployeeProfile,
  EmployeeAvatar,
  EmployeeInfo,
  EmployeeName,
  EmployeeRole,
  DaysBadge,
  ProjectInfo,
  ProjectLocation,
  ProjectDate,
  ProjectWorks,
  ProgressSection,
  ProgressLabel,
  ProgressBar,
  ProgressValue,
  TaskCount,
  DetailButton,
  WorkationModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ProfileSection,
  ProfileHeader,
  ProfileAvatar,
  ProfileInfo,
  ProfileName,
  ProfileRole,
  ProfileStatusBadge,
  InfoCardsGrid,
  InfoCard,
  InfoCardIcon,
  InfoCardContent,
  InfoCardLabel,
  InfoCardValue,
  InfoCardSubtext,
  CurrentTasksSection,
  SectionTitle,
  SectionDate,
  OverallProgress,
  ProgressBarContainer,
  CompletedTasksList,
  CompletedTaskItem,
  TaskListSection,
  TaskCard,
  TaskHeader,
  TaskTitle,
  PriorityBadge,
  TaskDueDate,
  TaskProject,
  TaskProgress,
  ParticipatingWorksSection,
  WorksList,
  WorkItem,
} from './AbsenteeManagementPage.styled';

// 정렬 타입
const SORT_TYPE = {
  ALPHABETICAL: 'alphabetical',
  URGENT: 'urgent',
};

// 정렬 방향
const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
};

// TODO: Zustand store mapping - 원격 근무 직원 목록
const initialEmployees = [
  {
    id: 1,
    name: '최작가',
    role: '스토리',
    status: '워케이션 진행 중',
    daysRemaining: 8,
    location: '제주도 서귀포',
    dateRange: '01-10 ~ 01-24',
    works: ['도시의 수호자'],
    progress: 58,
    taskCount: 3,
    email: 'choi.writer@example.com',
    phone: '010-1234-5678',
    period: '2026-01-10 ~ 2026-01-24',
    currentTasks: {
      overallProgress: 75,
      completedTasks: [
        'Episode 33 초고 완료',
        '캐릭터 대사 수정',
      ],
      tasks: [
        {
          id: 1,
          title: 'Episode 33 스토리보드',
          priority: '높음',
          priorityColor: '#EF4444',
          dueDate: '2026-01-18',
          project: '도시의 수호자',
          progress: 85,
        },
        {
          id: 2,
          title: 'Episode 34 스크립트 작성',
          priority: '보통',
          priorityColor: '#F59E0B',
          dueDate: '2026-01-20',
          project: '도시의 수호자',
          progress: 60,
        },
        {
          id: 3,
          title: 'Episode 35 콘티 구성',
          priority: '보통',
          priorityColor: '#F59E0B',
          dueDate: '2026-01-23',
          project: '도시의 수호자',
          progress: 30,
        },
      ],
    },
    participatingWorks: ['도시의 수호자'],
  },
  {
    id: 2,
    name: '한유진',
    role: '컬러링',
    status: '워케이션 작업 시작 전',
    daysRemaining: 3,
    location: '강릉 커피거리',
    dateRange: '01-15 ~ 01-25',
    works: ['별빛의 전설'],
    progress: 80,
    taskCount: 2,
  },
  {
    id: 3,
    name: '박민수',
    role: '라인',
    status: '재택근무 진행 중',
    daysRemaining: 5,
    location: '부산 해운대',
    dateRange: '01-12 ~ 01-22',
    works: ['별빛의 전설'],
    progress: 33,
    taskCount: 1,
  },
  {
    id: 4,
    name: '이서연',
    role: '효과 작업',
    status: '워케이션 진행 중',
    daysRemaining: 6,
    location: '경주 한옥마을',
    dateRange: '01-14 ~ 01-26',
    works: ['도시의 수호자', '별빛의 전설'],
    progress: 25,
    taskCount: 2,
  },
  {
    id: 5,
    name: '정다은',
    role: '배경',
    status: '워케이션 진행 중',
    daysRemaining: 2,
    location: '속초 바다뷰 카페',
    dateRange: '01-16 ~ 01-28',
    works: ['별빛의 전설'],
    progress: 95,
    taskCount: 1,
  },
];

export function AbsenteeManagementPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [sortType, setSortType] = useState(null);
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTION.ASC);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 통계 계산
  const remotePersonnel = employees.length;
  const ongoingTasks = employees.reduce((sum, emp) => sum + emp.taskCount, 0);
  const completedTasks = 0; // TODO: 실제 데이터에서 가져오기

  // 정렬 처리
  const handleSort = (type) => {
    if (sortType === type) {
      // 같은 필터를 클릭하면 방향 전환
      setSortDirection(sortDirection === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC);
    } else {
      setSortType(type);
      setSortDirection(SORT_DIRECTION.ASC);
    }
  };

  // 정렬된 직원 목록
  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortType === SORT_TYPE.ALPHABETICAL) {
      const comparison = a.name.localeCompare(b.name, 'ko');
      return sortDirection === SORT_DIRECTION.ASC ? comparison : -comparison;
    } else if (sortType === SORT_TYPE.URGENT) {
      const comparison = a.daysRemaining - b.daysRemaining;
      return sortDirection === SORT_DIRECTION.ASC ? comparison : -comparison;
    }
    return 0;
  });

  // 직원 카드 클릭 핸들러
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <RemoteManagementRoot>
      <RemoteManagementBody>
        {/* 헤더 */}
        <RemoteManagementHeader>
          <HeaderLeft>
            <PageTitle>원격 관리</PageTitle>
            <PageSubtitle>원격 근무 중인 팀원들의 작업 현황을 관리합니다</PageSubtitle>
          </HeaderLeft>
          <HeaderRight>
            <FilterButton
              $active={sortType === SORT_TYPE.ALPHABETICAL}
              onClick={() => handleSort(SORT_TYPE.ALPHABETICAL)}
            >
              가나다순 <ArrowUpDown className="w-4 h-4" />
            </FilterButton>
            <FilterButton
              $active={sortType === SORT_TYPE.URGENT}
              onClick={() => handleSort(SORT_TYPE.URGENT)}
            >
              현재 임박 <ArrowUpDown className="w-4 h-4" />
            </FilterButton>
          </HeaderRight>
        </RemoteManagementHeader>

        {/* 통계 카드 */}
        <StatsGrid>
          <StatCard>
            <StatCardContent>
              <StatCardLabel>원격 인원</StatCardLabel>
              <StatCardValue>{remotePersonnel}명</StatCardValue>
            </StatCardContent>
            <StatCardIcon $color="#9B8FAA">
              <MapPin className="w-6 h-6" />
            </StatCardIcon>
          </StatCard>

          <StatCard>
            <StatCardContent>
              <StatCardLabel>진행 중인 작업</StatCardLabel>
              <StatCardValue>{ongoingTasks}개</StatCardValue>
            </StatCardContent>
            <StatCardIcon $color="#4CAF50">
              <Briefcase className="w-6 h-6" />
            </StatCardIcon>
          </StatCard>

          <StatCard>
            <StatCardContent>
              <StatCardLabel>완료된 작업</StatCardLabel>
              <StatCardValue>{completedTasks}개</StatCardValue>
            </StatCardContent>
            <StatCardIcon $color="#81C784">
              <CheckCircle2 className="w-6 h-6" />
            </StatCardIcon>
          </StatCard>
        </StatsGrid>

        {/* 직원 카드 그리드 */}
        <EmployeeGrid>
          {sortedEmployees.map((employee) => (
            <EmployeeCard key={employee.id} onClick={() => handleEmployeeClick(employee)}>
              <EmployeeCardHeader>
                <StatusBadge>{employee.status}</StatusBadge>
                <DaysBadge>D-{employee.daysRemaining}</DaysBadge>
              </EmployeeCardHeader>

              <EmployeeProfile>
                <EmployeeAvatar>
                  {employee.name[0]}
                </EmployeeAvatar>
                <EmployeeInfo>
                  <EmployeeName>{employee.name}</EmployeeName>
                  <EmployeeRole>{employee.role}</EmployeeRole>
                </EmployeeInfo>
              </EmployeeProfile>

              <ProjectInfo>
                <ProjectLocation>
                  <MapPin className="w-4 h-4" />
                  {employee.location}
                </ProjectLocation>
                <ProjectDate>
                  <Calendar className="w-4 h-4" />
                  {employee.dateRange}
                </ProjectDate>
                <ProjectWorks>
                  <span>담당 작품</span>
                  <div>{employee.works.join(', ')}</div>
                </ProjectWorks>
              </ProjectInfo>

              <ProgressSection>
                <ProgressLabel>전체 작업 진행률</ProgressLabel>
                <ProgressBarContainer>
                  <ProgressBar $progress={employee.progress} $isDark={true} />
                  <ProgressValue>{employee.progress}%</ProgressValue>
                </ProgressBarContainer>
                <TaskCount>작업 {employee.taskCount}개</TaskCount>
              </ProgressSection>

              <DetailButton>상세보기 &gt;</DetailButton>
            </EmployeeCard>
          ))}
        </EmployeeGrid>
      </RemoteManagementBody>

      {/* 워케이션 상세 정보 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="lg"
        showCloseButton={false}
      >
        {selectedEmployee && (
          <WorkationModalContent>
            <ModalHeader>
              <ModalTitle>워케이션 상세 정보</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X className="w-5 h-5" />
              </CloseButton>
            </ModalHeader>

            {/* 프로필 섹션 */}
            <ProfileSection>
              <ProfileHeader>
                <ProfileAvatar>
                  {selectedEmployee.name[0]}
                </ProfileAvatar>
                <ProfileInfo>
                  <ProfileName>{selectedEmployee.name}</ProfileName>
                  <ProfileRole>{selectedEmployee.role}</ProfileRole>
                </ProfileInfo>
                <ProfileStatusBadge>{selectedEmployee.status}</ProfileStatusBadge>
              </ProfileHeader>

              <InfoCardsGrid>
                <InfoCard>
                  <InfoCardIcon>
                    <MapPin className="w-5 h-5" />
                  </InfoCardIcon>
                  <InfoCardContent>
                    <InfoCardLabel>위치</InfoCardLabel>
                    <InfoCardValue>{selectedEmployee.location}</InfoCardValue>
                  </InfoCardContent>
                </InfoCard>

                <InfoCard>
                  <InfoCardIcon>
                    <Calendar className="w-5 h-5" />
                  </InfoCardIcon>
                  <InfoCardContent>
                    <InfoCardLabel>기간</InfoCardLabel>
                    <InfoCardValue>{selectedEmployee.period || selectedEmployee.dateRange}</InfoCardValue>
                    <InfoCardSubtext>(D-{selectedEmployee.daysRemaining}일 남음)</InfoCardSubtext>
                  </InfoCardContent>
                </InfoCard>

                <InfoCard>
                  <InfoCardIcon>
                    <Mail className="w-5 h-5" />
                  </InfoCardIcon>
                  <InfoCardContent>
                    <InfoCardLabel>이메일</InfoCardLabel>
                    <InfoCardValue>{selectedEmployee.email || 'N/A'}</InfoCardValue>
                  </InfoCardContent>
                </InfoCard>

                <InfoCard>
                  <InfoCardIcon>
                    <Phone className="w-5 h-5" />
                  </InfoCardIcon>
                  <InfoCardContent>
                    <InfoCardLabel>연락처</InfoCardLabel>
                    <InfoCardValue>{selectedEmployee.phone || 'N/A'}</InfoCardValue>
                  </InfoCardContent>
                </InfoCard>
              </InfoCardsGrid>
            </ProfileSection>

            {/* 현재 작업 중인 업무 */}
            {selectedEmployee.currentTasks && (
              <CurrentTasksSection>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <SectionTitle>
                    <Calendar className="w-4 h-4" />
                    현재 작업 중인 업무
                  </SectionTitle>
                  <SectionDate>2026-01-16 18:30</SectionDate>
                </div>

                <OverallProgress>
                  <span>전체 진행률</span>
                  <ProgressBarContainer>
                    <ProgressBar $progress={selectedEmployee.currentTasks.overallProgress} $isDark={false} />
                    <ProgressValue style={{ color: '#1f2328' }}>{selectedEmployee.currentTasks.overallProgress}%</ProgressValue>
                  </ProgressBarContainer>
                </OverallProgress>

                <CompletedTasksList>
                  <span>완료한 작업</span>
                  {selectedEmployee.currentTasks.completedTasks.map((task, idx) => (
                    <CompletedTaskItem key={idx}>
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#4CAF50' }} />
                      {task}
                    </CompletedTaskItem>
                  ))}
                </CompletedTasksList>
              </CurrentTasksSection>
            )}

            {/* 담당 작업 목록 */}
            {selectedEmployee.currentTasks && (
              <TaskListSection>
                <SectionTitle>
                  <List className="w-4 h-4" />
                  담당 작업 목록
                </SectionTitle>
                {selectedEmployee.currentTasks.tasks.map((task) => (
                  <TaskCard key={task.id}>
                    <TaskHeader>
                      <TaskTitle>{task.title}</TaskTitle>
                      <PriorityBadge $color={task.priorityColor}>{task.priority}</PriorityBadge>
                    </TaskHeader>
                    <TaskDueDate>
                      <Clock className="w-4 h-4" />
                      {task.dueDate}
                    </TaskDueDate>
                    <TaskProject>{task.project}</TaskProject>
                    <TaskProgress>
                      <span>진행률</span>
                      <ProgressBarContainer>
                        <ProgressBar $progress={task.progress} $isDark={false} />
                        <ProgressValue style={{ color: '#1f2328' }}>{task.progress}%</ProgressValue>
                      </ProgressBarContainer>
                    </TaskProgress>
                  </TaskCard>
                ))}
              </TaskListSection>
            )}

            {/* 참여 작품 */}
            <ParticipatingWorksSection>
              <SectionTitle>참여 작품</SectionTitle>
              <WorksList>
                {selectedEmployee.participatingWorks?.map((work, idx) => (
                  <WorkItem key={idx}>{work}</WorkItem>
                ))}
              </WorksList>
            </ParticipatingWorksSection>
          </WorkationModalContent>
        )}
      </Modal>
    </RemoteManagementRoot>
  );
}
