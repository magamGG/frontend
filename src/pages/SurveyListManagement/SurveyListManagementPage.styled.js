import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const SurveyListManagementRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: #DADDE1;
  padding: 24px;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const SurveyListManagementBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 헤더 영역
export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BackButton = styled.button`
  height: 32px;
  width: 32px;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1F2328;
  margin: 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6E8FB3;
  margin: 0;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #3F4A5A;
  color: white;
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2F3A4A;
  }
`;

// 탭 카드
export const TabCard = styled.div`
  padding: 16px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const TabButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const TabButton = styled.button`
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid var(--border);
  background-color: ${props => props.variant === 'default' ? 'var(--primary)' : 'transparent'};
  color: ${props => props.variant === 'default' ? 'var(--primary-foreground)' : 'var(--foreground)'};

  &:hover {
    opacity: 0.8;
  }
`;

// 설문 목록 카드
export const SurveyListCard = styled.div`
  padding: 20px;
  background-color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const SurveyListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SurveyListTitle = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  color: #1F2328;
  margin: 0;
`;

export const SurveyListEmpty = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #6E8FB3;
`;

// 설문 아이템
export const SurveyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #FAFAFA;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #F0F0F0;
  }
`;

export const SurveyItemContent = styled.div`
  flex: 1;
`;

export const SurveyItemTitle = styled.div`
  font-weight: 500;
  color: #1F2328;
  font-size: 0.875rem;
`;

export const SurveyItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
  color: #6E8FB3;
  margin-top: 4px;
`;

export const SurveyItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionButton = styled.button`
  height: 32px;
  width: 32px;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$danger ? '#dc2626' : '#6E8FB3'};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.$danger ? '#b91c1c' : '#3F4A5A'};
  }
`;
