import styled from 'styled-components';

// 전체 페이지 루트
export const RemoteManagementRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: #f0f2f5;
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정
export const RemoteManagementBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 헤더
export const RemoteManagementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const HeaderLeft = styled.div`
  flex: 1;
`;

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 8px 0;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: #5a6067;
  margin: 0;
`;

export const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background-color: ${props => props.$active ? '#3F4A5A' : '#5a6067'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$active ? '#3F4A5A' : '#4a5568'};
  }
`;

// 통계 카드 그리드
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: 24px;
  background-color: #e8eaed;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatCardContent = styled.div`
  flex: 1;
`;

export const StatCardLabel = styled.span`
  font-size: 14px;
  color: #5a6067;
  display: block;
  margin-bottom: 8px;
`;

export const StatCardValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const StatCardIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || '#5a6067'};
  flex-shrink: 0;
`;

// 직원 카드 그리드
export const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const EmployeeCard = styled.div`
  padding: 20px;
  background-color: #3F4A5A;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const EmployeeCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const StatusBadge = styled.span`
  padding: 6px 12px;
  background-color: #5a6067;
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const DaysBadge = styled.span`
  padding: 6px 12px;
  background-color: #5a6067;
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const EmployeeProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const EmployeeAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #5a6067;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const EmployeeInfo = styled.div`
  flex: 1;
`;

export const EmployeeName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px 0;
`;

export const EmployeeRole = styled.p`
  font-size: 14px;
  color: #b0b5ba;
  margin: 0;
`;

export const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

export const ProjectLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: white;
`;

export const ProjectDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: white;
`;

export const ProjectWorks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: white;

  span {
    color: #b0b5ba;
    font-size: 12px;
  }

  div {
    font-weight: 500;
  }
`;

export const ProgressSection = styled.div`
  margin-bottom: 16px;
`;

export const ProgressLabel = styled.span`
  display: block;
  font-size: 12px;
  color: #b0b5ba;
  margin-bottom: 8px;
`;

export const ProgressBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0'};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress || 0}%;
    background-color: ${props => props.$isDark ? 'white' : '#3F4A5A'};
    transition: width 0.3s ease;
  }
`;

export const ProgressValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: white;
  min-width: 40px;
  text-align: right;
`;

export const TaskCount = styled.span`
  display: block;
  font-size: 12px;
  color: #b0b5ba;
`;

export const DetailButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

// 모달 스타일
export const WorkationModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 8px;
  border-top: 2px dashed #6E8FB3;
  border-bottom: 2px dashed #6E8FB3;
  padding-bottom: 8px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 2px dashed #6E8FB3;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  color: #5a6067;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f2f5;
    color: #1f2328;
  }
`;

// 프로필 섹션
export const ProfileSection = styled.div`
  padding: 24px;
  background-color: #3F4A5A;
  border-radius: 12px;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

export const ProfileAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #5a6067;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const ProfileName = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px 0;
`;

export const ProfileRole = styled.p`
  font-size: 16px;
  color: #b0b5ba;
  margin: 0;
`;

export const ProfileStatusBadge = styled.span`
  padding: 8px 16px;
  background-color: #5a6067;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
`;

export const InfoCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

export const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #5a6067;
  border-radius: 8px;
`;

export const InfoCardIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

export const InfoCardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoCardLabel = styled.span`
  font-size: 12px;
  color: #b0b5ba;
`;

export const InfoCardValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

export const InfoCardSubtext = styled.span`
  font-size: 12px;
  color: #b0b5ba;
`;

// 현재 작업 섹션
export const CurrentTasksSection = styled.div`
  padding: 20px;
  background-color: #e8eaed;
  border-radius: 12px;
`;

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 16px 0;
`;

export const SectionDate = styled.span`
  font-size: 12px;
  color: #5a6067;
`;

export const OverallProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  span {
    font-size: 14px;
    font-weight: 600;
    color: #1f2328;
  }
`;

export const CompletedTasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  > span {
    font-size: 14px;
    font-weight: 600;
    color: #1f2328;
    margin-bottom: 4px;
  }
`;

export const CompletedTaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1f2328;
`;

// 작업 목록 섹션
export const TaskListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TaskCard = styled.div`
  padding: 16px;
  background-color: #e8eaed;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TaskTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
  margin: 0;
`;

export const PriorityBadge = styled.span`
  padding: 4px 10px;
  background-color: ${props => props.$color || '#F59E0B'};
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
`;

export const TaskDueDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #5a6067;
`;

export const TaskProject = styled.div`
  font-size: 14px;
  color: #1f2328;
  font-weight: 500;
`;

export const TaskProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    font-size: 12px;
    color: #5a6067;
  }
`;

// 참여 작품 섹션
export const ParticipatingWorksSection = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
`;

export const WorksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

export const WorkItem = styled.div`
  font-size: 14px;
  color: #1f2328;
  padding: 8px 0;
`;
