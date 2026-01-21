import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const RiskAnalysisRoot = styled.div`
  min-height: 100vh;
  background-color: #DADDE1;
  padding: 32px;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const RiskAnalysisBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`;

export const BackButton = styled.button`
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
  background-color: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: white;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333333;
  margin: 0;
`;

// 위험군 그리드 (데스크탑: 2열)
export const RiskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const RiskCard = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
`;

export const RiskCardBorder = styled.div`
  width: 6px;
  background-color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#FF4D4F';
      case 'orange':
        return '#FA8C16';
      default:
        return '#e5e7eb';
    }
  }};
`;

export const RiskCardContent = styled.div`
  flex: 1;
  padding: 24px;
`;

export const RiskCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const RiskCardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#FF4D4F';
      case 'orange':
        return '#FA8C16';
      default:
        return '#333333';
    }
  }};
  margin: 0;
`;

export const RiskCardCount = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#FF4D4F';
      case 'orange':
        return '#FA8C16';
      default:
        return '#333333';
    }
  }};
`;

export const RiskCardDescription = styled.p`
  font-size: 0.875rem;
  color: #666666;
  margin: 0 0 24px 0;
`;

export const RiskUserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RiskUserItem = styled.div`
  background-color: ${props => {
    switch (props.$variant) {
      case 'high':
        return '#FFF1F0';
      case 'caution':
        return '#FFF7E6';
      default:
        return '#f9fafb';
    }
  }};
  border-radius: 12px;
  padding: 16px;
`;

export const RiskUserName = styled.h3`
  font-weight: bold;
  color: #333333;
  font-size: 1rem;
  margin: 0;
`;

export const RiskUserDept = styled.span`
  font-weight: normal;
  color: #666666;
`;

export const RiskUserScore = styled.div`
  font-size: 0.875rem;
  color: ${props => {
    switch (props.$color) {
      case 'red':
        return '#FF4D4F';
      case 'orange':
        return '#FA8C16';
      default:
        return '#666666';
    }
  }};
`;
