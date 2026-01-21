import styled from 'styled-components';

// 전체 대시보드 루트 래퍼 (1920px 데스크탑 기준)
export const DashboardRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const DashboardBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

// 메인/사이드 2열 그리드 (데스크탑: 2fr 1fr, 모바일: 1fr)
export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 메인 컬럼 (현재 근태/오늘의 현황/할 일/마감일)
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: hidden;
`;

// 오른쪽 사이드바 컬럼 (빠른 작업/건강 요약/작품 진행 상황)
export const SidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 근태 상태 카드 헤더
export const AttendanceStatusCard = styled.div`
  padding: 32px;
  background: ${props => props.$gradient};
  border-bottom: 4px solid ${props => props.$borderColor};
  border-radius: 12px 12px 0 0;
`;

// 근태 상태 헤더 영역
export const AttendanceStatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

// 근태 상태 아이콘 래퍼
export const AttendanceStatusIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 근태 상태 아이콘 컨테이너
export const AttendanceStatusIconContainer = styled.div`
  padding: 16px;
  border-radius: 50%;
  background-color: ${props => props.$bgColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 근태 상태 텍스트 영역
export const AttendanceStatusText = styled.div`
  display: flex;
  flex-direction: column;
`;

// 근태 상태 제목
export const AttendanceStatusTitle = styled.h2`
  font-size: 30px;
  font-weight: bold;
  color: ${props => props.$textColor};
  margin: 0;
`;

// 근태 상태 설명
export const AttendanceStatusDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
`;

// 근태 상태 전환 버튼 그리드
export const AttendanceStatusButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 24px;
`;

// 근태 상태 전환 버튼
export const AttendanceStatusButton = styled.button`
  padding: 16px;
  border-radius: 8px;
  border: 2px solid ${props => props.$isActive ? props.$borderColor : '#e5e7eb'};
  background-color: ${props => props.$isActive ? props.$bgColor : 'white'};
  color: ${props => props.$isActive ? 'white' : props.$textColor};
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: ${props => props.$borderColor};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  ${props => props.$isActive && `
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `}
`;

// 오늘의 현황 요약 카드 그리드 (데스크탑: 3열, 태블릿: 2열, 모바일: 1열)
export const TodaySummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 오늘의 할 일 리스트 래퍼
export const TodayTodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 개별 할 일 아이템 카드 컨테이너
export const TodoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
`;

// 다가오는 마감일 리스트 래퍼
export const DeadlineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 마감일 카드 (긴급)
export const DeadlineCardUrgent = styled.div`
  padding: 16px;
  background-color: color-mix(in srgb, var(--destructive) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--destructive) 20%, transparent);
  border-radius: 12px;
`;

// 마감일 카드 (일반)
export const DeadlineCardNormal = styled.div`
  padding: 16px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border: 1px solid var(--border);
  border-radius: 12px;
`;

// 작품 진행 상황 리스트
export const WorkProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 작품 진행 상황 아이템
export const WorkProgressItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 작품 진행 상황 헤더
export const WorkProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 작품 진행 상황 제목
export const WorkProgressTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

// 작품 진행 상황 퍼센트
export const WorkProgressPercent = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;
