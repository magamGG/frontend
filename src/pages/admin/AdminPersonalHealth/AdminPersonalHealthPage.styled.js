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

// 다음 검진 예정일 카드 (AdminHealthPage와 동일)
export const NextCheckupCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckupItem = styled.div`
  padding: 16px;
  background: linear-gradient(to bottom right, ${props => {
    if (props.$bgColor === 'from-purple-50 to-purple-100/50') return '#F3E8FF, rgba(243, 232, 255, 0.5)';
    if (props.$bgColor === 'from-blue-50 to-blue-100/50') return '#DBEAFE, rgba(219, 234, 254, 0.5)';
    return '#F9FAFB, rgba(249, 250, 251, 0.5)';
  }});
  border-radius: 8px;
  border: 1px solid ${props => {
    if (props.$borderColor === 'border-purple-200') return '#E9D5FF';
    if (props.$borderColor === 'border-blue-200') return '#BFDBFE';
    return '#E5E7EB';
  }};
`;

export const CheckupItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CheckupItemInfo = styled.div`
  flex: 1;
`;

export const CheckupItemLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$color || '#6E8FB3'};
  margin-bottom: 4px;
`;

export const CheckupItemDate = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1f2328;
`;

export const CheckupItemBadge = styled.div`
  background-color: ${props => props.$bgColor || '#6E8FB3'};
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
`;

export const CheckupItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6E8FB3;
`;

export const CheckupItemMetaIcon = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CheckupItemMetaText = styled.span`
  font-size: 12px;
  color: #6E8FB3;
`;

// 심층 검진 검사 그리드
export const DeepCheckupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const DeepCheckupCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const DeepCheckupCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const DeepCheckupCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

export const DeepCheckupCardIcon = styled.div`
  color: ${props => props.$color || '#6E8FB3'};
`;

// 완료 상태 박스
export const CompletedStatusBox = styled.div`
  padding: 16px;
  background-color: #F0FDF4;
  border: 1px solid #86EFAC;
  border-radius: 8px;
`;

export const CompletedStatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const CompletedStatusTitle = styled.span`
  font-weight: 700;
  color: #10B981;
`;

export const CompletedStatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CompletedStatusLabel = styled.span`
  font-size: 14px;
  color: #6E8FB3;
`;

export const CompletedStatusValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
`;

// 결과 섹션
export const ResultSection = styled.div`
  padding: 16px;
  background-color: #fafafa;
  border-radius: 8px;
`;

export const ResultTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 8px 0;
`;

export const ResultDescription = styled.p`
  font-size: 12px;
  color: #6E8FB3;
  line-height: 1.6;
  margin: 0 0 12px 0;
`;

export const ResultAlertBox = styled.div`
  padding: 12px;
  background-color: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ResultAlertContent = styled.div`
  font-size: 12px;
  color: #6E8FB3;
  
  p {
    margin: 0 0 4px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// 다음 검진 박스
export const NextCheckupBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #F3E8FF;
  border: 1px solid #E9D5FF;
  border-radius: 8px;
`;

export const NextCheckupBoxContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NextCheckupBoxLabel = styled.span`
  font-size: 14px;
  color: #1f2328;
`;

export const NextCheckupBoxValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #9333EA;
`;

// 빈 상태 박스
export const EmptyStateBox = styled.div`
  padding: 24px;
  background-color: #F9FAFB;
  border: 2px solid #FED7AA;
  border-radius: 8px;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  margin: 0 auto 12px;
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  color: #6E8FB3;
  margin: 0 0 16px 0;
`;

export const EmptyStateButton = styled.button`
  padding: 10px 20px;
  background-color: #9333EA;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

// 설문 질문
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
  color: #6E8FB3;
  margin: 0;
`;

export const SurveyAnswerGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SurveyAnswerButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid ${props => props.$isSelected ? '#3F4A5A' : '#DADDE1'};
  background-color: ${props => props.$isSelected ? '#3F4A5A' : 'white'};
  color: ${props => props.$isSelected ? 'white' : '#1F2328'};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    border-color: #6E8FB3;
  }
`;

export const SurveyInfoBox = styled.div`
  padding: 12px;
  background-color: #DBEAFE;
  border: 1px solid #BFDBFE;
  border-radius: 8px;
  font-size: 12px;
  color: #6E8FB3;
  
  p {
    margin: 0;
    
    &:last-child {
      margin-top: 4px;
    }
  }
`;
