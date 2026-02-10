import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AdminPersonalHealthRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: #DADDE1;
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AdminPersonalHealthBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 다음 검진 예정일 카드
export const NextCheckupCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const NextCheckupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const NextCheckupTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const NextCheckupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

export const NextCheckupItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.$borderColor || 'var(--border)'};
  background: ${props => props.$bgGradient || 'transparent'};
`;

export const NextCheckupItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const NextCheckupItemContent = styled.div`
  flex: 1;
`;

export const NextCheckupItemLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$color || '#6E8FB3'};
  margin-bottom: 4px;
`;

export const NextCheckupItemDate = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1f2328;
`;

export const NextCheckupItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6e8fb3;
`;

// 심층 검진 검사 현황 그리드
export const DeepCheckupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

export const DeepCheckupCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const DeepCheckupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const DeepCheckupTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

// 완료 상태 박스
export const CompletedStatusBox = styled.div`
  padding: 16px;
  background-color: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const CompletedStatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const CompletedStatusText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #16a34a;
`;

export const CompletedStatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CompletedStatusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CompletedStatusLabel = styled.span`
  font-size: 14px;
  color: #6e8fb3;
`;

export const CompletedStatusValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
`;

// 결과 상세 박스 (정신/신체 동일 높이 - QuickDASH 기준 min-height, 알림 박스 하단 정렬)
export const ResultDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
  min-height: 206px;
`;

export const ResultDetailTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 8px 0;
`;

export const ResultDetailContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const ResultDetailMainText = styled.p`
  flex: 1;
  font-size: 12px;
  color: #6e8fb3;
  line-height: 1.6;
  margin: 0 0 12px 0;
  min-height: 0;
`;

export const ResultDetailText = styled.p`
  font-size: 12px;
  color: #6e8fb3;
  line-height: 1.6;
  margin: 0 0 12px 0;
`;

export const ResultDetailAlert = styled.div`
  margin-top: auto;
  min-height: 62px;
  padding: 12px;
  background-color: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 8px;
`;

export const ResultDetailAlertContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ResultDetailAlertText = styled.div`
  font-size: 12px;
  color: #6e8fb3;
`;

// 다음 검진일 박스
export const NextCheckupDateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: ${props => props.$bgColor || '#fafafa'};
  border: 1px solid ${props => props.$borderColor || 'var(--border)'};
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const NextCheckupDateLabel = styled.span`
  font-size: 14px;
  color: #1f2328;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NextCheckupDateValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$color || '#6e8fb3'};
`;

// 미완료 상태 박스
export const IncompleteStatusBox = styled.div`
  padding: 16px;
  background-color: ${props => {
    if (props.$isPurple) return '#faf5ff';
    return props.$isWarning ? '#fff7ed' : '#f9fafb';
  }};
  border: ${props => {
    if (props.$isPurple) return '2px solid #c084fc';
    return props.$isWarning ? '2px solid #fdba74' : '1px solid #e5e7eb';
  }};
  border-radius: 8px;
  text-align: center;
`;

export const IncompleteStatusIcon = styled.div`
  margin: 0 auto 12px;
  color: ${props => {
    if (props.$isPurple) return '#9333ea';
    return props.$isWarning ? '#f97316' : '#9ca3af';
  }};
`;

export const IncompleteStatusText = styled.p`
  font-size: 14px;
  font-weight: ${props => (props.$isWarning || props.$isPurple ? '600' : '400')};
  color: ${props => {
    if (props.$isPurple) return '#9333ea';
    return props.$isWarning ? '#f97316' : '#6e8fb3';
  }};
  margin: 0 0 8px 0;
`;

export const IncompleteStatusSubtext = styled.p`
  font-size: 12px;
  color: #6e8fb3;
  margin: 0 0 16px 0;
`;

// 모달 스타일 (Dialog 컴포넌트 내부 스타일)
export const SurveyModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: #F5F5F5;
`;

export const SurveyDescription = styled.div`
  font-size: 14px;
  color: #6e8fb3;
  line-height: 1.6;
  padding: 16px;
  background-color: #E5E5E5;
  border-radius: 8px;
`;

export const SurveyDivider = styled.div`
  border-top: 1px solid #dadde1;
  margin: 16px 0;
`;

export const SurveyQuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SurveyQuestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SurveyQuestionText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
  margin: 0;
`;

export const SurveyQuestionDesc = styled.p`
  font-size: 12px;
  color: #6e8fb3;
  margin: 0;
`;

export const SurveyAnswerButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
`;

export const SurveyAnswerButton = styled.button`
  flex: 1;
  min-width: 0;
  height: 36px;
  border-radius: 4px;
  border: 1px solid ${props => (props.$isSelected ? '#2563EB' : '#D1D5DB')};
  background-color: ${props => (props.$isSelected ? '#2563EB' : '#F3F4F6')};
  color: ${props => (props.$isSelected ? 'white' : '#374151')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => (props.$isSelected ? '#2563EB' : '#9CA3AF')};
    background-color: ${props => (props.$isSelected ? '#2563EB' : '#E5E7EB')};
  }
`;

export const SurveyInfoBox = styled.div`
  padding: 16px;
  background-color: #E5E5E5;
  border-radius: 8px;
`;

export const SurveyInfoText = styled.div`
  font-size: 12px;
  color: #6e8fb3;
  margin: 0;
  line-height: 1.5;
`;

export const SurveyModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 24px;
  background-color: white;
`;
