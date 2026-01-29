import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const SurveyListManagementRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color: var(--background);
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
  color: var(--foreground);
  margin: 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--accent);
  margin: 0;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  background-color: var(--primary);
  color: white;
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: color-mix(in srgb, var(--primary) 90%, black);
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
  color: var(--foreground);
  margin: 0;
`;

export const SurveyListEmpty = styled.div`
  text-align: center;
  padding: 48px 0;
  color: var(--accent);
`;

// 설문 아이템
export const SurveyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--card);
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--muted);
  }
`;

export const SurveyItemContent = styled.div`
  flex: 1;
`;

export const SurveyItemTitle = styled.div`
  font-weight: 500;
  color: var(--foreground);
  font-size: 0.875rem;
`;

export const SurveyItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.75rem;
  color: var(--accent);
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
  color: ${props => props.$danger ? 'var(--destructive)' : 'var(--accent)'};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.$danger ? 'color-mix(in srgb, var(--destructive) 90%, black)' : 'var(--primary)'};
  }
`;
