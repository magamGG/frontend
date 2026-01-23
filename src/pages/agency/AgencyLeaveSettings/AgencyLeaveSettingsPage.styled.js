import styled from 'styled-components';
import theme from '@/styles/theme';

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const LeaveManagementBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[6]} ${theme.spacing[12]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

// 페이지 헤더
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing[4]};
`;

export const PageTitle = styled.h1`
  font-size: ${theme.fonts.size['2xl']};
  font-weight: ${theme.fonts.weight.bold};
  color: var(--foreground);
  margin: 0 0 ${theme.spacing[1]} 0;
`;

export const PageDescription = styled.p`
  font-size: ${theme.fonts.size.sm};
  color: var(--muted-foreground);
  margin: 0;
`;

// 메인 콘텐츠 영역
export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
`;

// 차트 섹션
export const ChartSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[5]};
  box-shadow: ${theme.shadows.sm};
`;

export const ChartTitle = styled.h3`
  font-size: ${theme.fonts.size.base};
  font-weight: ${theme.fonts.weight.semibold};
  color: var(--foreground);
  margin: 0 0 ${theme.spacing[4]} 0;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
`;

// 상단 그리드 레이아웃 (번아웃 모니터링 + 기본 연차 설정)
export const TopGridSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.xl}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }

  > * {
    min-height: 180px;
  }
`;

// 리스크 대시보드 섹션
export const RiskDashboardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

export const RiskDashboardCard = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[4]};
  box-shadow: ${theme.shadows.sm};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const RiskDashboardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

export const RiskDashboardTitle = styled.h2`
  font-size: ${theme.fonts.size.lg};
  font-weight: ${theme.fonts.weight.bold};
  color: var(--foreground);
  margin: 0;
`;

export const RiskDashboardSubtitle = styled.p`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
  margin: 0;
`;

export const TimeWeightedInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background-color: var(--card);
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
  margin-bottom: ${theme.spacing[3]};
`;

// 구간별 상세 정보 카드 (컴팩트 버전)
export const RiskCategoryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const RiskCategoryCard = styled.div`
  background: ${props => {
    if (props.$color === '#ef4444') return '#fee2e2'; // 은은한 빨간색
    if (props.$color === '#22c55e') return '#dcfce7'; // 은은한 초록색
    if (props.$color === '#f59e0b') return '#fef3c7'; // 은은한 노란색
    return 'white';
  }};
  border: 1px solid ${props => {
    if (props.$color === '#ef4444') return '#fecaca'; // 빨간색 테두리
    if (props.$color === '#22c55e') return '#bbf7d0'; // 초록색 테두리
    if (props.$color === '#f59e0b') return '#fde68a'; // 노란색 테두리
    return 'var(--border)';
  }};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.base};

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

export const RiskCategoryCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

export const RiskCategoryCardTitle = styled.h3`
  font-size: ${theme.fonts.size.base};
  font-weight: ${theme.fonts.weight.semibold};
  color: var(--foreground);
  margin: 0;
`;

export const RiskCategoryCardSubtitle = styled.p`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
  margin: 0;
`;

export const RiskCategoryCardCount = styled.div`
  font-size: ${theme.fonts.size['3xl']};
  font-weight: ${theme.fonts.weight.bold};
  color: ${props => props.$color || 'var(--foreground)'};
  margin: ${theme.spacing[2]} 0;
  line-height: 1;
`;

export const RiskCategoryCardDescription = styled.p`
  font-size: ${theme.fonts.size.sm};
  color: var(--muted-foreground);
  margin: 0;
`;

export const RiskCategoryCardAction = styled.div`
  margin-top: ${theme.spacing[3]};
  padding-top: ${theme.spacing[3]};
  border-top: 1px solid ${props => {
    if (props.$color === '#ef4444') return '#fecaca'; // 빨간색 구분선
    if (props.$color === '#22c55e') return '#bbf7d0'; // 초록색 구분선
    if (props.$color === '#f59e0b') return '#fde68a'; // 노란색 구분선
    return 'var(--border)';
  }};
`;

// 연차 정책 섹션
export const PolicySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

export const PolicyCard = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[4]};
  box-shadow: ${theme.shadows.sm};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const PolicyCardHeader = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

export const PolicyCardTitle = styled.h2`
  font-size: ${theme.fonts.size.base};
  font-weight: ${theme.fonts.weight.semibold};
  color: var(--foreground);
  margin: 0 0 ${theme.spacing[1]} 0;
`;

export const PolicyCardDescription = styled.p`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
  margin: 0;
`;

export const PolicyForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  flex: 1;
`;

export const PolicyFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

export const PolicyFormLabel = styled.label`
  font-size: ${theme.fonts.size.sm};
  font-weight: ${theme.fonts.weight.medium};
  color: var(--foreground);
`;

export const PolicyFormInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.fonts.size.base};
  color: var(--foreground);
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};
  outline: none;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(63, 74, 90, 0.1);
  }
`;

export const PolicyFormHelperText = styled.p`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
  margin: 0;
`;

export const PolicyFormActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-top: auto;
`;

// 중앙 그리드 레이아웃 (직원 목록 + 변경 로그)
export const MiddleGridSection = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: ${theme.spacing[4]};
  align-items: start;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

// 직원 관리 섹션
export const EmployeeManagementSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

export const EmployeeManagementCard = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[5]};
  box-shadow: ${theme.shadows.sm};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const EmployeeSearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing[4]};
  max-width: 100%;
`;

export const EmployeeSearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing[3]};
  display: flex;
  align-items: center;
  color: var(--muted-foreground);
  pointer-events: none;
`;

export const EmployeeSearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  padding-left: ${theme.spacing[10]};
  font-size: ${theme.fonts.size.sm};
  color: var(--foreground);
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};
  outline: none;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(63, 74, 90, 0.1);
  }
`;

export const EmployeeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
`;

export const EmployeeTableHeader = styled.thead`
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
`;

export const EmployeeTableHeaderCell = styled.th`
  padding: ${theme.spacing[3]} ${theme.spacing[3]};
  font-size: ${theme.fonts.size.xs};
  font-weight: ${theme.fonts.weight.semibold};
  color: var(--foreground);
  text-align: ${props => props.$align || 'left'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const EmployeeTableRow = styled.tr`
  border-bottom: 1px solid var(--border);
  transition: background-color ${theme.transitions.fast};

  &:hover {
    background-color: var(--card);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const EmployeeTableCell = styled.td`
  padding: ${theme.spacing[3]} ${theme.spacing[3]};
  font-size: ${theme.fonts.size.sm};
  color: var(--foreground);
  text-align: ${props => props.$align || 'left'};
`;

// 로그 섹션
export const LogSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

export const LogCard = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[5]};
  box-shadow: ${theme.shadows.sm};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const LogCardHeader = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

export const LogCardTitle = styled.h2`
  font-size: ${theme.fonts.size.base};
  font-weight: ${theme.fonts.weight.semibold};
  color: var(--foreground);
  margin: 0 0 ${theme.spacing[1]} 0;
`;

export const LogCardDescription = styled.p`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
  margin: 0;
`;

export const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  margin-bottom: ${theme.spacing[3]};
  flex: 1;
`;

export const LogTableHeader = styled.thead`
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
`;

export const LogTableHeaderCell = styled.th`
  padding: ${theme.spacing[3]} ${theme.spacing[3]};
  font-size: ${theme.fonts.size.xs};
  font-weight: ${theme.fonts.weight.semibold};
  color: var(--foreground);
  text-align: ${props => props.$align || 'left'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const LogTableRow = styled.tr`
  border-bottom: 1px solid var(--border);
  transition: background-color ${theme.transitions.fast};

  &:hover {
    background-color: var(--card);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const LogTableCell = styled.td`
  padding: ${theme.spacing[3]} ${theme.spacing[3]};
  font-size: ${theme.fonts.size.sm};
  color: var(--foreground);
  text-align: ${props => props.$align || 'left'};
`;

export const LogPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing[2]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid var(--border);
`;

export const LogPaginationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.md};
  background-color: white;
  color: var(--foreground);
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: var(--card);
    border-color: var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 모달 폼
export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
`;

export const ModalFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

export const ModalFormLabel = styled.label`
  font-size: ${theme.fonts.size.base};
  font-weight: ${theme.fonts.weight.medium};
  color: var(--foreground);
`;

export const ModalFormInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.fonts.size.sm};
  color: var(--foreground);
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};
  outline: none;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(63, 74, 90, 0.2);
  }

  /* Number input 스피너 제거 */
  &[type="number"] {
    -moz-appearance: textfield;
  }

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const ModalFormSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.fonts.size.sm};
  color: var(--foreground);
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};
  outline: none;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(63, 74, 90, 0.2);
  }
`;

export const ModalFormTextarea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.fonts.size.sm};
  color: var(--foreground);
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};
  resize: vertical;
  font-family: inherit;
  min-height: 80px;
  outline: none;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(63, 74, 90, 0.2);
  }
`;

export const ModalFormHelperText = styled.p`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
  margin: 0;
`;

export const ModalFormActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid var(--border);
`;

// 연차 소진 분포도 차트 스타일
export const DistributionChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
`;

export const DistributionChartHeader = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing[6]};
`;

export const DistributionChartHeaderLeft = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

export const DistributionChartHeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

export const DistributionChartHeaderContent = styled.div`
  flex: 1;
`;

export const DistributionChartTitle = styled.h2`
  font-size: ${theme.fonts.size['2xl']};
  font-weight: ${theme.fonts.weight.bold};
  color: var(--foreground);
  margin: 0 0 ${theme.spacing[1]} 0;
`;

export const DistributionChartDescription = styled.p`
  font-size: ${theme.fonts.size.sm};
  color: var(--muted-foreground);
  margin: ${theme.spacing[1]} 0 0 0;
  line-height: 1.6;
`;

export const DistributionChartLegend = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  font-size: ${theme.fonts.size.xs};
  font-weight: ${theme.fonts.weight.medium};
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1.5]};
  padding: ${theme.spacing[1.5]} ${theme.spacing[3]};
  border-radius: 9999px;
  border: 1px solid ${props => props.$borderColor || 'var(--border)'};
  background: ${props => props.$bgColor || 'white'};
  color: ${props => props.$textColor || 'var(--foreground)'};
`;

export const LegendDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$color || 'var(--foreground)'};
`;

export const DistributionChartCard = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm};
  position: relative;
`;

export const DistributionChartContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
`;

// 분기 정보 카드
export const SeasonInfoCard = styled.div`
  background: white;
  padding: ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
`;

export const SeasonInfoLabel = styled.span`
  font-size: ${theme.fonts.size.sm};
  color: var(--muted-foreground);
  font-weight: ${theme.fonts.weight.medium};
`;

export const SeasonInfoTitle = styled.div`
  font-size: ${theme.fonts.size['2xl']};
  font-weight: ${theme.fonts.weight.bold};
  color: var(--foreground);
  margin: ${theme.spacing[2]} 0;
`;

export const SeasonInfoSubtitle = styled.div`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
  margin-top: ${theme.spacing[2]};
`;

export const ChartBackgroundLayer = styled.div`
  position: absolute;
  top: 20px;
  left: 70px;
  right: 30px;
  bottom: 20px;
  pointer-events: none;
  z-index: 0;
  display: flex;
  height: calc(100% - 40px);
  width: calc(100% - 100px);
`;

export const BackgroundZone = styled.div`
  height: 100%;
`;

export const RiskZone = styled(BackgroundZone)`
  width: 30%;
  background: #fee2e2;
  opacity: 0.6;
`;

export const HealthyZone = styled(BackgroundZone)`
  width: 50%;
  background: #dcfce7;
  opacity: 0.6;
`;

export const CompleteZone = styled(BackgroundZone)`
  width: 20%;
  background: #fef3c7;
  opacity: 0.6;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.$bgColor || 'white'};
  border: 1px solid ${props => props.$borderColor || 'var(--border)'};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[5]};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StatCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[2]};
`;

export const StatCardIcon = styled.div`
  background: white;
  padding: ${theme.spacing[2]};
  border-radius: 50%;
  box-shadow: ${theme.shadows.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatCardTitle = styled.span`
  font-size: ${theme.fonts.size.sm};
  font-weight: ${theme.fonts.weight.bold};
  color: ${props => props.$textColor || 'var(--foreground)'};
`;

export const StatCardValue = styled.div`
  font-size: ${theme.fonts.size['3xl']};
  font-weight: ${theme.fonts.weight.bold};
  color: var(--foreground);
  margin-left: ${theme.spacing[1]};
`;

export const StatCardStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${theme.spacing[1]};
`;

export const StatCardStatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatCardStatLabel = styled.div`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
`;

export const StatCardStatValue = styled.div`
  font-size: ${theme.fonts.size.xl};
  font-weight: ${theme.fonts.weight.bold};
  color: ${props => props.$color || 'var(--foreground)'};
`;

export const StatCardDivider = styled.div`
  height: 32px;
  width: 1px;
  background: var(--border);
  margin: 0 ${theme.spacing[2]};
`;

// 직원 리스트 모달 스타일
export const EmployeeListModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: ${theme.spacing[4]};
  animation: fadeIn 0.2s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const EmployeeListModal = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows['2xl']};
  width: 100%;
  max-width: 32rem;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

export const EmployeeListModalHeader = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EmployeeListModalHeaderContent = styled.div`
  flex: 1;
`;

export const EmployeeListModalTitle = styled.h3`
  font-size: ${theme.fonts.size.xl};
  font-weight: ${theme.fonts.weight.bold};
  color: var(--foreground);
  margin: 0 0 ${theme.spacing[1]} 0;
`;

export const EmployeeListModalDescription = styled.p`
  font-size: ${theme.fonts.size.sm};
  color: var(--muted-foreground);
  margin: 0;
`;

export const EmployeeListModalCloseButton = styled.button`
  padding: ${theme.spacing[2]};
  border-radius: 50%;
  transition: ${theme.transitions.fast};
  color: var(--muted-foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--card);
    color: var(--foreground);
  }
`;

export const EmployeeListModalBody = styled.div`
  overflow-y: auto;
  padding: ${theme.spacing[6]};
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--card);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--muted-foreground);
  }
`;

export const EmployeeListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${theme.spacing[3]};
  
  @media (min-width: ${theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const EmployeeListItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]};
  background: var(--card);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid var(--border);
  transition: ${theme.transitions.fast};
  
  &:hover {
    border-color: var(--primary);
  }
`;

export const EmployeeListAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fonts.size.xs};
  font-weight: ${theme.fonts.weight.bold};
  color: var(--foreground);
`;

export const EmployeeListInfo = styled.div`
  flex: 1;
`;

export const EmployeeListName = styled.div`
  font-size: ${theme.fonts.size.sm};
  font-weight: ${theme.fonts.weight.bold};
  color: var(--foreground);
`;

export const EmployeeListRole = styled.div`
  font-size: ${theme.fonts.size.xs};
  color: var(--muted-foreground);
`;

export const EmployeeListEmpty = styled.div`
  text-align: center;
  padding: ${theme.spacing[10]} 0;
  color: var(--muted-foreground);
`;

export const EmployeeListModalFooter = styled.div`
  padding: ${theme.spacing[4]};
  border-top: 1px solid var(--border);
  background: var(--card);
  border-radius: 0 0 ${theme.borderRadius.xl} ${theme.borderRadius.xl};
  display: flex;
  justify-content: flex-end;
`;

export const EmployeeListModalCloseButtonFooter = styled.button`
  padding: ${theme.spacing[2]} ${theme.spacing[6]};
  background: var(--foreground);
  color: white;
  border-radius: ${theme.borderRadius.lg};
  border: none;
  font-size: ${theme.fonts.size.sm};
  font-weight: ${theme.fonts.weight.medium};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  
  &:hover {
    opacity: 0.9;
  }
`;
