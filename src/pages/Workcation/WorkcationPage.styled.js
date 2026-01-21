import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const WorkcationRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const WorkcationBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 헤더 카드
export const HeaderCard = styled.div`
  padding: 24px;
  background: linear-gradient(to right, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--accent) 10%, transparent));
  border-radius: 12px;
  border: 1px solid var(--border);
  flex-shrink: 0;
`;

export const HeaderCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderCardText = styled.div`
  flex: 1;
`;

export const HeaderCardTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const HeaderCardDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 메인 콘텐츠 그리드 (데스크탑: 2fr 1fr)
export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 진행 중인 워케이션 카드
export const CurrentWorkcationCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
`;

export const CurrentWorkcationTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

export const CurrentWorkcationContent = styled.div`
  padding: 16px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const CurrentWorkcationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CurrentWorkcationInfo = styled.div`
  flex: 1;
`;

export const CurrentWorkcationName = styled.h4`
  font-size: 18px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const CurrentWorkcationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const CurrentWorkcationMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// 통계 그리드
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;
`;

export const StatCard = styled.div`
  text-align: center;
  padding: 8px;
  background-color: var(--card);
  border-radius: 8px;
`;

export const StatLabel = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 2px 0;
`;

export const StatValue = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const StatValuePrimary = styled(StatValue)`
  color: var(--primary);
`;

// 액션 버튼 그룹
export const CurrentWorkcationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

// 워케이션 팁 카드
export const TipsCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
`;

export const TipsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

export const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TipItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => `color-mix(in srgb, ${props.$bgColor} 10%, transparent)`};
`;

export const TipTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const TipDescription = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 지난 워케이션 카드
export const PastWorkcationsCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  flex-shrink: 0;
`;

export const PastWorkcationsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

export const PastWorkcationsGrid = styled.div`
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

export const PastWorkcationItem = styled.div`
  padding: 12px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const PastWorkcationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const PastWorkcationName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const PastWorkcationDate = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 4px 0;
`;

export const PastWorkcationStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
`;

export const PastWorkcationStat = styled.span`
  color: var(--muted-foreground);
`;
