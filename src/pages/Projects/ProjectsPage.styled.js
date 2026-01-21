import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const ProjectsRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const ProjectsBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

// 헤더 액션 영역
export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const HeaderActionsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const FilterButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

// 작품 그리드 (데스크탑: 4열, 태블릿: 3열, 모바일: 2열)
export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  overflow: hidden;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 작품 카드
export const ProjectCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

// 작품 카드 헤더
export const ProjectCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ProjectCardTitleSection = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProjectCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const ProjectCardPlatform = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 작품 정보 리스트
export const ProjectInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

export const ProjectInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ProjectInfoLabel = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const ProjectInfoValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
`;

// 진행률 섹션
export const ProgressSection = styled.div`
  margin-bottom: 12px;
`;

export const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

// 액션 버튼 그룹
export const ProjectActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;
