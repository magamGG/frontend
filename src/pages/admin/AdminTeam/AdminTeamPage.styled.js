import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AdminTeamRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: transparent;
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AdminTeamBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 헤더 섹션
export const AdminTeamHeader = styled.div`
  margin-bottom: 8px;
`;

export const AdminTeamTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 8px 0;
`;

export const AdminTeamSubtitle = styled.p`
  font-size: 14px;
  color: #5a6067;
  margin: 0;
`;

// 통계 카드 그리드
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const StatCardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.$bgColor || 'rgba(110, 143, 179, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.$iconColor || '#6E8FB3'};
  }
`;

export const StatCardContent = styled.div`
  flex: 1;
`;

export const StatCardLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #5a6067;
  display: block;
  margin-bottom: 4px;
`;

export const StatCardValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

// 검색 바
export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #5a6067;
  pointer-events: none;
  z-index: 1;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  background-color: #e8eaed;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  color: #1f2328;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: #5a6067;
  }

  &:focus {
    background-color: white;
    box-shadow: 0 0 0 2px rgba(110, 143, 179, 0.2);
  }
`;

// 직원 목록 (세로 리스트)
export const EmployeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmployeeCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const EmployeeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

export const EmployeeAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e8eaed;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #5a6067;
`;

export const EmployeeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EmployeeName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 8px 0;
`;

export const EmployeeBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const EmployeeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  
  ${props => {
    if (props.$variant === 'role') {
      return `
        background-color: #E8D5FF;
        color: #1f2328;
      `;
    }
    if (props.$variant === 'working') {
      return `
        background-color: #22C55E;
        color: white;
      `;
    }
    if (props.$variant === 'leave') {
      return `
        background-color: #FF9800;
        color: white;
      `;
    }
    return `
      background-color: #e8eaed;
      color: #1f2328;
    `;
  }}
`;

// 연락처 정보
export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ContactIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #5a6067;
`;

export const ContactText = styled.span`
  font-size: 14px;
  color: #5a6067;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 직원 카드 오른쪽 (프로젝트 정보)
export const EmployeeRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

export const ProjectsInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const ProjectsLabel = styled.span`
  font-size: 12px;
  color: #5a6067;
`;

export const ProjectsCount = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1f2328;
`;

export const ChevronIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a6067;
  cursor: pointer;
  
  svg {
    transform: ${props => props.$rotated ? 'rotate(180deg)' : 'none'};
  }
`;

// 직원 상세 뷰
export const EmployeeDetailView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmployeeDetailCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const EmployeeDetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

export const EmployeeDetailAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #e8eaed;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #5a6067;
`;

export const EmployeeDetailInfo = styled.div`
  flex: 1;
`;

export const EmployeeDetailName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 12px 0;
`;

export const EmployeeDetailBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const EmployeeDetailContact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 건강 체크 결과 섹션
export const HealthCheckCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const HealthCheckTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 20px 0;
`;

export const HealthCheckContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 200px;
  gap: 24px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const HealthMetrics = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
`;

export const HealthMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const HealthMetricLabel = styled.span`
  font-size: 12px;
  color: #5a6067;
`;

export const HealthMetricValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
`;

export const HealthMetricDivider = styled.div`
  width: 1px;
  height: 40px;
  background-color: #e2e8f0;
`;

export const MemoSection = styled.div`
  margin-top: 20px;
`;

export const MemoLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1f2328;
  margin-bottom: 8px;
`;

export const MemoInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2328;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: #5a6067;
  }

  &:focus {
    background-color: white;
    border-color: #6E8FB3;
    box-shadow: 0 0 0 2px rgba(110, 143, 179, 0.1);
  }
`;

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LineChartWrapper = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  
  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: #e2e8f0;
  }
`;

export const PieChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto;
`;

export const PieChartCenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
`;

export const PieChartDays = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2328;
  line-height: 1.2;
`;

export const PieChartLabel = styled.div`
  font-size: 12px;
  color: #5a6067;
  margin-top: 4px;
`;
