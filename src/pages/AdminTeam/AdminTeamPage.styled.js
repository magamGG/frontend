import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AdminTeamRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: #DADDE1;
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AdminTeamBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 헤더 섹션
export const AdminTeamHeader = styled.div`
  margin-bottom: 8px;
`;

export const AdminTeamTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 8px 0;
`;

export const AdminTeamSubtitle = styled.p`
  font-size: 14px;
  color: #5a6067;
  margin: 0;
`;

// 통계 카드 그리드
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const StatCardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.$bgColor || 'rgba(110, 143, 179, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StatCardContent = styled.div`
  flex: 1;
`;

export const StatCardLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #5a6067;
  display: block;
  margin-bottom: 4px;
`;

export const StatCardValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #1f2328;
  margin: 0;
`;

// 작가 목록 그리드 (데스크탑: 4열)
export const ArtistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ArtistCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
    border-color: #6E8FB3;
  }
`;

export const ArtistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

export const ArtistAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6E8FB3 0%, #4A6FA5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-size: 24px;
    font-weight: 700;
    color: white;
  }
`;

export const ArtistInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ArtistName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2328;
  margin: 0 0 8px 0;
`;

export const ArtistGenreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #6E8FB3;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
`;

// 연락처 정보
export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ContactIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #5a6067;
`;

export const ContactText = styled.span`
  font-size: 14px;
  color: #1f2328;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 프로젝트 섹션
export const ProjectsSection = styled.div`
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

export const ProjectsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #5a6067;
`;

export const ProjectsHeaderText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #5a6067;
`;

export const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProjectTag = styled.div`
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2328;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:hover {
    background-color: #e9ecef;
    border-color: #6E8FB3;
  }
`;
