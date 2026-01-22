import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const ArtistWorkationRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const ArtistWorkationBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 페이지 헤더
export const ArtistWorkationHeader = styled.div`
  margin-bottom: 8px;
`;

export const ArtistWorkationTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const ArtistWorkationDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 메인 콘텐츠 그리드 (데스크탑: 2fr 1fr)
export const ArtistWorkationMainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 진행 중인 워케이션 카드
export const CurrentWorkationCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const CurrentWorkationTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

export const CurrentWorkationContent = styled.div`
  padding: 20px;
  background: linear-gradient(to bottom right, rgba(168, 85, 247, 0.1), rgba(99, 102, 241, 0.1));
  border-radius: 12px;
  border: 2px solid rgba(168, 85, 247, 0.2);
`;

export const CurrentWorkationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const CurrentWorkationInfo = styled.div`
  flex: 1;
`;

export const CurrentWorkationName = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #581c87;
  margin: 0 0 8px 0;
`;

export const CurrentWorkationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #6b21a8;
`;

export const CurrentWorkationMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// 통계 그리드
export const WorkationStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
`;

export const WorkationStatCard = styled.div`
  text-align: center;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
`;

export const WorkationStatLabel = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 4px 0;
`;

export const WorkationStatValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

export const WorkationStatValuePrimary = styled(WorkationStatValue)`
  color: var(--primary);
`;

// 액션 버튼 그룹
export const CurrentWorkationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

// 숙소 정보 카드
export const AccommodationCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const AccommodationTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

export const AccommodationInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AccommodationInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AccommodationInfoLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
`;

export const AccommodationInfoValue = styled.p`
  font-size: 14px;
  color: var(--foreground);
  margin: 0;
`;

// 할 일 목록 카드
export const TasksCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const TasksTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 할 일 아이템
export const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: ${props => {
    if (props.status === 'completed') return '1px solid #86efac';
    if (props.status === 'inProgress') return '2px solid #60a5fa';
    return '1px solid var(--border)';
  }};
  background-color: ${props => {
    if (props.status === 'completed') return '#f0fdf4';
    if (props.status === 'inProgress') return '#eff6ff';
    return 'color-mix(in srgb, var(--muted) 30%, transparent)';
  }};
`;

export const TaskIcon = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`;

export const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const TaskTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
  text-decoration: ${props => (props.completed ? 'line-through' : 'none')};
`;

export const TaskDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 4px 0;
`;

export const TaskDate = styled.p`
  font-size: 12px;
  color: ${props => {
    if (props.status === 'completed') return '#16a34a';
    if (props.status === 'inProgress') return '#2563eb';
    return 'var(--muted-foreground)';
  }};
  margin: 4px 0 0 0;
`;
