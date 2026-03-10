import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AgencyProjectsRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AgencyProjectsBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 페이지 헤더
export const AgencyProjectsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const AgencyProjectsTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const AgencyProjectsDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 통계 카드 그리드 (데스크탑: 3열)
export const AgencyProjectsStatsGrid = styled.div`
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

export const AgencyProjectsStatCard = styled.div`
  padding: 16px;
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const AgencyProjectsStatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const AgencyProjectsStatLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
`;

export const AgencyProjectsStatValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

// 검색 바
export const AgencyProjectsSearchBar = styled.div`
  position: relative;
  width: 100%;
`;

export const AgencyProjectsSearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
`;

// 필터 카드
export const AgencyProjectsFilterCard = styled.div`
  padding: 16px;
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const AgencyProjectsFilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AgencyProjectsFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AgencyProjectsFilterLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
`;

export const AgencyProjectsFilterButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const AgencyProjectsFilterDivider = styled.div`
  width: 100%;
  border-top: 1px solid var(--border);
`;

export const AgencyProjectsFilterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const AgencyProjectsFilterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AgencyProjectsSortButtons = styled.div`
  display: flex;
  gap: 8px;
`;

// 프로젝트 리스트
export const AgencyProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 프로젝트 카드
export const AgencyProjectCard = styled.div`
  padding: 20px;
  background-color: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: var(--accent);
    transform: translateY(-2px);
  }
`;

export const AgencyProjectCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const AgencyProjectThumbnail = styled.div`
  flex-shrink: 0;
`;

export const AgencyProjectInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AgencyProjectInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const AgencyProjectTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

export const AgencyProjectGenre = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
`;

export const AgencyProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  flex-wrap: wrap;
`;

export const AgencyProjectMetaGroup = styled.span`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const AgencyProjectMetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--foreground);
`;

export const AgencyProjectMetaDivider = styled.span`
  color: var(--muted-foreground);
`;

export const AgencyProjectStatus = styled.div`
  flex-shrink: 0;
  width: 78px;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;

  @media (max-width: 768px) {
    text-align: left;
    align-items: flex-start;
    width: 100%;
  }
`;

export const AgencyProjectStatusText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const AgencyProjectEpisodeText = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  text-align: left;
  margin: 0;
`;

// 빈 상태
export const AgencyProjectsEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px;
`;

export const AgencyProjectsEmptyText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 모달 스타일
export const AgencyProjectModal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const AgencyProjectModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AgencyProjectModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AgencyProjectModalLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const AgencyProjectModalInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(110, 143, 179, 0.2);
  }
`;

export const AgencyProjectModalHelperText = styled.p`
  font-size: 12px;
  color: var(--accent);
  margin: 0;
`;

export const AgencyProjectNextSchedulePreview = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
  margin-top: 4px;
  padding: 6px 10px;
  background-color: rgba(110, 143, 179, 0.1);
  border-radius: 4px;
`;

export const AgencyProjectModalSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--card);
  color: var(--foreground);
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(110, 143, 179, 0.2);
  }
`;

export const AgencyProjectModalThumbnailPreview = styled.div`
  margin-top: 12px;
`;

export const AgencyProjectModalThumbnailPreviewLabel = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 8px 0;
`;

export const AgencyProjectModalActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
`;
