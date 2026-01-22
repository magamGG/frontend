import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AdminProjectsRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AdminProjectsBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 페이지 헤더
export const AdminProjectsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const AdminProjectsHeaderLeft = styled.div`
  flex: 1;
`;

export const AdminProjectsTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const AdminProjectsDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 통계 카드 그리드 (데스크탑: 3열)
export const AdminProjectsStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const AdminProjectsStatCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const AdminProjectsStatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const AdminProjectsStatLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
`;

export const AdminProjectsStatValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

// 필터 카드
export const AdminProjectsFilterCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const AdminProjectsFilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AdminProjectsFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AdminProjectsFilterLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
`;

export const AdminProjectsFilterButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const AdminProjectsFilterDivider = styled.div`
  width: 100%;
  border-top: 1px solid var(--border);
`;

export const AdminProjectsFilterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AdminProjectsFilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AdminProjectsSortButtons = styled.div`
  display: flex;
  gap: 8px;
`;

// 프로젝트 리스트
export const AdminProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: calc(100vh - 420px);
  overflow-y: auto;
  padding-right: 8px;
`;

// 프로젝트 카드
export const AdminProjectCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: rgba(var(--primary-rgb), 0.5);
  }
`;

export const AdminProjectCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const AdminProjectThumbnail = styled.div`
  flex-shrink: 0;
`;

export const AdminProjectInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AdminProjectInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const AdminProjectTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

export const AdminProjectGenre = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
`;

export const AdminProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
`;

export const AdminProjectMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--foreground);
`;

export const AdminProjectMetaDivider = styled.span`
  color: var(--muted-foreground);
`;

export const AdminProjectStatus = styled.div`
  flex-shrink: 0;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AdminProjectStatusText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const AdminProjectEpisodeText = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 빈 상태
export const AdminProjectsEmpty = styled.div`
  padding: 48px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  text-align: center;
`;

export const AdminProjectsEmptyText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 모달 스타일
export const AdminProjectModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AdminProjectModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AdminProjectModalLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const AdminProjectModalInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
  }
`;

export const AdminProjectModalSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
  }
`;

export const AdminProjectModalThumbnailPreview = styled.div`
  margin-top: 12px;
`;

export const AdminProjectModalThumbnailPreviewLabel = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 8px 0;
`;

export const AdminProjectModalActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
`;
