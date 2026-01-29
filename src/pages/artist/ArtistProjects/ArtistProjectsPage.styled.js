import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const ArtistProjectsRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const ArtistProjectsBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

// 페이지 헤더
export const PageHeader = styled.div`
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const PageDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 통계 카드 그리드 (3열)
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StatCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatCardIcon = styled.div`
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
`;

export const StatCardLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
`;

export const StatCardValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

// 필터 섹션
export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 24px;
`;

export const FilterLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

// 작품 리스트 (데스크탑: 가로형 카드 레이아웃)
export const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProjectCard = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--primary);
    transform: translateY(-2px);
  }
`;

// 썸네일 영역
export const ProjectThumbnail = styled.div`
  flex-shrink: 0;
  width: 96px;
  height: 128px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid var(--border);
  }
`;

// 작품 내용 영역
export const ProjectContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ProjectTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const ProjectGenre = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 16px 0;
`;

// 작품 정보 영역
export const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 280px;
`;

export const ProjectInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProjectInfoIcon = styled.div`
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const ProjectInfoText = styled.span`
  font-size: 14px;
  color: var(--foreground);
  font-weight: 500;
`;

// 빈 상태
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 96px 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const EmptyStateIcon = styled.div`
  color: var(--muted-foreground);
  opacity: 0.5;
  margin-bottom: 12px;
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;
