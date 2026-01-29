import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyWorkcationRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AgencyWorkcationBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 32px 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

// 통계 그리드 (데스크탑: 3열)
export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 8px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatisticsCard = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const StatisticsCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StatisticsIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => {
    switch (props.$color) {
      case 'purple':
        return 'background-color: #f3e8ff;';
      case 'green':
        return 'background-color: #dcfce7;';
      case 'teal':
        return 'background-color: #ccfbf1;';
      default:
        return 'background-color: #f3f4f6;';
    }
  }}
`;

export const StatisticsLabel = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0 0 4px 0;
`;

export const StatisticsValue = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

// 멤버 그리드 (데스크탑: 3열)
export const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 멤버 카드
export const MemberCard = styled.div`
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const MemberCardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  padding-bottom: 32px;
`;

export const MemberCardHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MemberCardBadges = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const MemberCardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const MemberCardAvatar = styled.div`
  flex-shrink: 0;
`;

export const MemberCardName = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  margin: 0 0 4px 0;
`;

export const MemberCardRole = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

export const MemberCardContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MemberCardLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--foreground);
`;

export const MemberCardDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
`;

export const MemberCardProjects = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const MemberCardProgress = styled.div`
  margin-top: 8px;
`;

export const MemberCardTasks = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--border);
`;

export const MemberCardActions = styled.div`
  display: flex;
  gap: 8px;
`;

// 빈 상태
export const EmptyStateCard = styled.div`
  padding: 48px;
  text-align: center;
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
`;

export const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #f3e8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const EmptyStateText = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;

// 상세 모달 콘텐츠
export const DetailModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
`;

export const DetailMemberHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const DetailMemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const DetailMemberAvatar = styled.div`
  flex-shrink: 0;
`;

export const DetailMemberName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin: 0 0 4px 0;
`;

export const DetailMemberRole = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

export const DetailMemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const DetailMemberItem = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
`;

export const DetailMemberLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const DetailMemberValue = styled.p`
  font-weight: 600;
  color: white;
  margin: 0;
`;

// 일일 리포트 카드
export const DailyReportCard = styled.div`
  padding: 24px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
`;

export const DailyReportHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const DailyReportTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DailyReportProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const DailyReportTasks = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// 작업 목록
export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskCard = styled.div`
  padding: 16px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
  border-radius: 8px;
`;

export const TaskCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const TaskCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const TaskCardInfo = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0;
`;

export const TaskCardProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 프로젝트 섹션
export const ProjectsSection = styled.div`
  margin-top: 8px;
`;

