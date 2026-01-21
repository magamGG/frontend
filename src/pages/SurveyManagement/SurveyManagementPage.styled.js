import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const SurveyManagementRoot = styled.div`
  min-height: 100vh;
  background-color: #DADDE1;
  padding: 32px;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const SurveyManagementBody = styled.div`
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
  justify-content: space-between;
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

// 탭 컨테이너
export const TabsContainer = styled.div`
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

export const TabButton = styled.button`
  padding-bottom: 16px;
  padding-left: 8px;
  padding-right: 8px;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
  color: ${props => props.$active ? '#8E44AD' : '#666666'};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${props => props.$active ? '#8E44AD' : '#333333'};
  }
`;

export const TabIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #8E44AD;
`;

// 설문 그리드 (데스크탑: 3열)
export const SurveyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const SurveyCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const SurveyIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #8E44AD;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const SurveyCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: bold;
  color: #333333;
  margin: 0 0 4px 0;
`;

export const SurveyCardDescription = styled.p`
  font-size: 0.875rem;
  color: #666666;
  margin: 0 0 12px 0;
`;

export const SurveyStatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const SurveyActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const SurveyActionButton = styled.button`
  flex: ${props => props.$danger ? 'none' : '1'};
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  border: 1px solid var(--border);
  background-color: transparent;
  color: ${props => props.$danger ? '#dc2626' : 'var(--foreground)'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    background-color: ${props => props.$danger ? '#fef2f2' : 'var(--accent)'};
    color: ${props => props.$danger ? '#b91c1c' : 'var(--foreground)'};
  }
`;

// 새 템플릿 추가 카드
export const AddTemplateCard = styled.button`
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  border: 2px dashed #d1d5db;
  transition: border-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  cursor: pointer;
  background: transparent;

  &:hover {
    border-color: #8E44AD;
  }
`;

export const AddTemplateIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const AddTemplateText = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #666666;
  margin: 0;
`;
