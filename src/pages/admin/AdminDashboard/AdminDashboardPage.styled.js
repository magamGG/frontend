import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AdminDashboardRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: #DADDE1;
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AdminDashboardBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 상단 2단 레이아웃
export const AdminDashboardTopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 출근 시작 카드
export const AttendanceStartCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const AttendanceStartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const AttendanceStartDateInfo = styled.div`
  flex: 1;
`;

export const AttendanceStartDate = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 8px 0;
`;

export const AttendanceStartDateSub = styled.p`
  font-size: 14px;
  color: #5a6067;
  margin: 0;
`;

export const AttendanceStartActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HealthCheckWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 6px;
`;

export const AttendanceStatusSelect = styled.div`
  margin-bottom: 16px;
`;

export const AttendanceStatusSelectLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  display: block;
  margin-bottom: 8px;
`;

export const AttendanceStatusSelectInput = styled.select`
  width: 100%;
  padding: 10px 16px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background-color: var(--background);
  color: var(--foreground);
  font-weight: 500;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
  }
`;

// 근태 상태 표시 박스
export const AttendanceStatusBox = styled.div`
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.$borderColor || 'var(--border)'};
  background: ${props => props.$bgColor || 'transparent'};
`;

export const AttendanceStatusBoxContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const AttendanceStatusBoxInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AttendanceStatusBoxIcon = styled.div`
  padding: 12px;
  background-color: ${props => props.$bgColor || 'transparent'};
  border-radius: 8px;
`;

export const AttendanceStatusBoxText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AttendanceStatusBoxTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2328;
  margin: 0 0 4px 0;
`;

export const AttendanceStatusBoxDescription = styled.p`
  font-size: 14px;
  color: rgba(31, 35, 40, 0.6);
  margin: 0;
`;

export const AttendanceStatusBoxPeriod = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: 1px solid ${props => props.$borderColor || 'var(--border)'};
`;

export const AttendanceStatusBoxPeriodLabel = styled.p`
  font-size: 12px;
  color: rgba(31, 35, 40, 0.5);
  margin: 0 0 4px 0;
`;

export const AttendanceStatusBoxPeriodValue = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #1f2328;
  margin: 0;
`;

// 상태 미선택 박스
export const AttendanceStatusEmpty = styled.div`
  padding: 24px;
  background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  text-align: center;
`;

export const AttendanceStatusEmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

export const AttendanceStatusEmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 8px 0;
`;

export const AttendanceStatusEmptyDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

// 현재 작업 중인 작가 카드
export const WorkingArtistsCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const WorkingArtistsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const WorkingArtistsTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const WorkingArtistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const WorkingArtistCard = styled.div`
  padding: 16px;
  background: linear-gradient(to bottom right, #eff6ff, rgba(239, 246, 255, 0.5));
  border-radius: 8px;
  border: 1px solid #bfdbfe;
`;

export const WorkingArtistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const WorkingArtistStatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const WorkingArtistName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1f2328;
`;

export const WorkingArtistProject = styled.p`
  font-size: 12px;
  color: #6e8fb3;
  margin: 0 0 8px 0;
`;

export const WorkingArtistMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #bfdbfe;
`;

export const WorkingArtistMetaLabel = styled.span`
  font-size: 12px;
  color: #6e8fb3;
`;

export const WorkingArtistMetaValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #1f2328;
`;

// 그래프 섹션
export const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ChartCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const ChartAlert = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ChartAlertText = styled.p`
  font-size: 14px;
  color: #991b1b;
  margin: 0;
`;

// 프로젝트 및 근태 섹션
export const ProjectsAttendanceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectsCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const ProjectsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const ProjectsHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProjectItem = styled.div`
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #dadde1;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #6e8fb3;
  }
`;

export const ProjectItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ProjectItemInfo = styled.div`
  flex: 1;
`;

export const ProjectItemTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const ProjectItemTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
  margin: 0;
`;

export const ProjectItemArtist = styled.p`
  font-size: 12px;
  color: #6e8fb3;
  margin: 0;
`;

export const ProjectItemMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #6e8fb3;
`;

export const ProjectsInfoBox = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #eff6ff;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ProjectsInfoText = styled.p`
  font-size: 14px;
  color: #1e3a8a;
  margin: 0;
`;

// 근태 예정 카드
export const AttendanceScheduleCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const AttendanceScheduleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const AttendanceScheduleHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AttendanceScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AttendanceScheduleItem = styled.div`
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #dadde1;
`;

export const AttendanceScheduleItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const AttendanceScheduleItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AttendanceScheduleItemName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
`;

export const AttendanceScheduleItemDate = styled.p`
  font-size: 12px;
  color: #6e8fb3;
  margin: 0;
`;

export const AttendanceScheduleWarningBox = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #fef3c7;
  border-radius: 8px;
  border: 1px solid #fde68a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AttendanceScheduleWarningText = styled.p`
  font-size: 14px;
  color: #92400e;
  margin: 0;
`;
