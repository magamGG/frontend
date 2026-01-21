import styled from 'styled-components';

export const AgencyTeamRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
`;

export const AgencyTeamBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 8px;
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const SearchBarContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const EmployeeListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

export const EmployeeCard = styled.div`
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--primary);
    opacity: 0.9;
  }
`;

export const EmployeeCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
`;

export const EmployeeAvatar = styled.div`
  width: 56px;
  height: 56px;
  background-color: var(--primary);
  opacity: 0.2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const EmployeeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EmployeeNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const EmployeeName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const EmployeeContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.875rem;
  color: var(--muted-foreground);
`;

export const EmployeeStats = styled.div`
  text-align: center;
  margin-right: 16px;
`;

export const BackButtonContainer = styled.div`
  margin-bottom: 24px;
`;

export const EmployeeDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const EmployeeDetailHeader = styled.div`
  margin-bottom: 24px;
`;

export const EmployeeDetailHeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

export const EmployeeDetailBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EmployeeDetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const EmployeeDetailItem = styled.div`
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
`;

export const EmployeeDetailLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-bottom: 8px;
`;

export const EmployeeDetailValue = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectCard = styled.div`
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ProjectCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProjectIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--primary);
  opacity: 0.1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const StatisticsCard = styled.div`
  padding: 24px;
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: var(--muted);
  opacity: 0.3;
  border-radius: 8px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
`;

export const EmptyStateText = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;
