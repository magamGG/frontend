import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const TeamRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const TeamBody = styled.div`
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
  flex-shrink: 0;
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

// 팀 개요 통계 그리드 (데스크탑: 4열)
export const TeamOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 팀원 그리드 (데스크탑: 3열, 태블릿: 2열)
export const TeamMembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 팀원 카드
export const TeamMemberCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

// 팀원 카드 헤더
export const TeamMemberHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

export const AvatarContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AvatarText = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-foreground);
`;

export const TeamMemberInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TeamMemberNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const TeamMemberName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const TeamMemberRole = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 팀원 정보 리스트
export const TeamMemberInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

export const TeamMemberInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TeamMemberInfoLabel = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const TeamMemberInfoValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  ${props => props.truncate && `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 8px;
  `}
`;

// 생산성 섹션
export const ProductivitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProductivityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 액션 버튼 그룹
export const TeamMemberActions = styled.div`
  display: flex;
  gap: 8px;
`;
