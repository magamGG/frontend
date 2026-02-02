import styled from 'styled-components';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

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

// 필터 섹션 (작가 계정과 동일한 디자인)
export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 24px;
`;

// 필터 행 (작가 필터, 상태 필터 각각)
export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

// 필터 카드 (기존 호환성 유지)
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

export const AdminProjectMetaGroup = styled.span`
  display: flex;
  align-items: center;
  gap: 15px;
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
export const AdminProjectsEmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  opacity: 0.5;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

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

export const AdminProjectModalHelperText = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const AdminProjectNextSchedulePreview = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  margin-top: 4px;
  padding: 6px 10px;
  background-color: rgba(var(--primary-rgb), 0.1);
  border-radius: 4px;
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

// 상태별 Badge 스타일 컴포넌트 (작가 계정과 동일한 색상)
export const StatusBadge = styled(Badge)`
  background-color: ${props => {
    switch (props.status) {
      case '연재중':
        return '#22C55E'; // green-500
      case '휴재':
        return '#FF9800'; // orange-500
      case '완결':
        return '#6A7079'; // gray-500
      default:
        return '#6E8FB3'; // primary
    }
  }};
  color: white;
  border: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

// 필수 표시 스타일
export const RequiredMark = styled.span`
  color: var(--destructive);
`;

// 아이콘 스타일
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.gap || '4px'};
`;

// 이미지 스타일
export const ThumbnailImage = styled(ImageWithFallback)`
  width: 96px;
  height: 128px;
  object-fit: cover;
  border-radius: var(--radius);
  border: 2px solid var(--border);
`;

// Primary Button 스타일
export const PrimaryButton = styled(Button)`
  background-color: var(--primary);
  color: var(--primary-foreground);
  
  &:hover {
    background-color: var(--accent);
  }
`;

// Filter Button 스타일
export const FilterButton = styled(Button)`
  &.active {
    background-color: ${props => {
      switch (props.$status) {
        case '전체':
          return '#D0D0D0'; /* Light gray */
        case '연재중':
          return '#3ECF59'; /* Bright green */
        case '휴재':
          return '#FF7F27'; /* Vibrant orange */
        case '완결':
          return '#6A7079'; /* Dark muted gray/blue-gray */
        default:
          return '#D0D0D0';
      }
    }};
    color: ${props => {
      switch (props.$status) {
        case '전체':
          return '#333333'; /* Dark gray text */
        case '연재중':
        case '휴재':
        case '완결':
          return '#FFFFFF'; /* White text */
        default:
          return '#333333';
      }
    }};
    border-color: ${props => {
      switch (props.$status) {
        case '전체':
          return '#D0D0D0';
        case '연재중':
          return '#3ECF59';
        case '휴재':
          return '#FF7F27';
        case '완결':
          return '#6A7079';
        default:
          return '#D0D0D0';
      }
    }};
    
    &:hover {
      background-color: ${props => {
        switch (props.$status) {
          case '전체':
            return '#C0C0C0'; /* Slightly darker gray */
          case '연재중':
            return '#35B84D'; /* Slightly darker green */
          case '휴재':
            return '#E6701F'; /* Slightly darker orange */
          case '완결':
            return '#5A6069'; /* Slightly darker gray */
          default:
            return '#C0C0C0';
        }
      }};
      border-color: ${props => {
        switch (props.$status) {
          case '전체':
            return '#C0C0C0';
          case '연재중':
            return '#35B84D';
          case '휴재':
            return '#E6701F';
          case '완결':
            return '#5A6069';
          default:
            return '#C0C0C0';
        }
      }};
    }
  }
  
  &:not(.active) {
    background-color: transparent;
    color: var(--foreground);
    border-color: var(--border);
  }
`;

// Sort Button 스타일
export const SortButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
  
  .sort-icon {
    width: 12px;
    height: 12px;
  }
  
  .sort-indicator {
    font-size: 12px;
    margin-left: 4px;
  }
`;

// Full Width Button
export const FullWidthButton = styled(Button)`
  flex: 1;
`;

// 아이콘 스타일 컴포넌트
export const StatIcon = styled.div`
  width: 16px;
  height: 16px;
  color: var(--muted-foreground);
`;

export const MetaIcon = styled.div`
  width: 12px;
  height: 12px;
`;

export const SortIcon = styled.div`
  width: 12px;
  height: 12px;
`;

export const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  opacity: 0.5;
`;

// Badge 스타일
export const ArtistBadge = styled(Badge)`
  font-size: 12px;
`;
