import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const HealthRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const HealthBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 건강 개요 통계 카드 그리드 (데스크탑: 4열)
export const HealthOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 주간 건강 추이 카드
export const WeeklyHealthCard = styled.div`
  padding: 16px;
  flex: 1;
  overflow: hidden;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const WeeklyHealthHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const WeeklyHealthTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

// 주간 건강 추이 리스트
export const WeeklyHealthList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WeeklyHealthItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WeeklyHealthDayLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  width: 24px;
`;

export const WeeklyHealthProgressContainer = styled.div`
  flex: 1;
  margin: 0 12px;
`;

export const WeeklyHealthPercent = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
  width: 40px;
  text-align: right;
`;

// 건강 권장사항 및 기록 그리드 (데스크탑: 2열)
export const HealthRecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 건강 권장사항 카드
export const RecommendationsCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const RecommendationsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

export const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 권장사항 아이템
export const RecommendationItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => `color-mix(in srgb, ${props.$bgColor} 10%, transparent)`};
`;

export const RecommendationContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const RecommendationIcon = styled.div`
  margin-top: 2px;
  color: ${props => props.iconColor};
`;

export const RecommendationText = styled.div`
  flex: 1;
`;

export const RecommendationTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const RecommendationDescription = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 최근 건강 기록 카드
export const RecentRecordsCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const RecentRecordsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

export const RecentRecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 건강 기록 아이템
export const HealthRecordItem = styled.div`
  padding: 8px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const HealthRecordHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const HealthRecordDate = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const HealthRecordDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  font-size: 12px;
`;

export const HealthRecordDetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HealthRecordLabel = styled.span`
  color: var(--muted-foreground);
`;

export const HealthRecordValue = styled.span`
  font-weight: 500;
  color: var(--foreground);
`;
