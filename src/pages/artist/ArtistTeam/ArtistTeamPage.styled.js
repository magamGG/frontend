import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const ArtistTeamRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const ArtistTeamBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 페이지 헤더
export const ArtistTeamHeader = styled.div`
  margin-bottom: 8px;
`;

export const ArtistTeamTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const ArtistTeamDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 팀 개요 통계 그리드 (데스크탑: 4열)
export const ArtistTeamOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ArtistTeamOverviewCard = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ArtistTeamOverviewContent = styled.div`
  flex: 1;
`;

export const ArtistTeamOverviewLabel = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 8px 0;
`;

export const ArtistTeamOverviewValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

export const ArtistTeamOverviewValueGreen = styled(ArtistTeamOverviewValue)`
  color: #16a34a;
`;

export const ArtistTeamOverviewValueAmber = styled(ArtistTeamOverviewValue)`
  color: #d97706;
`;

export const ArtistTeamOverviewIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.$bgColor || 'var(--primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
`;

// 팀원 목록 카드
export const ArtistTeamMembersCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const ArtistTeamMembersTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

// 팀원 그리드 (데스크탑: 2열)
export const ArtistTeamMembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 팀원 카드
export const ArtistTeamMemberCard = styled.div`
  padding: 20px;
  border-radius: 8px;
  border: 2px solid ${props => (props.isMe ? 'rgba(var(--primary-rgb), 0.3)' : 'var(--border)')};
  background-color: ${props => (props.isMe ? 'color-mix(in srgb, var(--primary) 5%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)')};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => (props.isMe ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'color-mix(in srgb, var(--muted) 40%, transparent)')};
  }
`;

export const ArtistTeamMemberHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

export const ArtistTeamMemberAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${props => (props.isMe ? 'var(--primary)' : 'var(--muted)')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ArtistTeamMemberAvatarText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${props => (props.isMe ? 'var(--primary-foreground)' : 'var(--muted-foreground)')};
`;

export const ArtistTeamMemberInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ArtistTeamMemberNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const ArtistTeamMemberName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const ArtistTeamMemberRole = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const ArtistTeamMemberInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const ArtistTeamMemberInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ArtistTeamMemberInfoLabel = styled.span`
  font-size: 14px;
  color: var(--muted-foreground);
`;

export const ArtistTeamMemberInfoValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const ArtistTeamMemberProductivity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ArtistTeamMemberProductivityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ArtistTeamMemberActions = styled.div`
  display: flex;
  gap: 8px;
`;

// 최근 활동 카드
export const ArtistTeamActivityCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const ArtistTeamActivityTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

export const ArtistTeamActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ArtistTeamActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
`;

export const ArtistTeamActivityAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => (props.isPrimary ? 'var(--primary)' : 'var(--muted)')};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ArtistTeamActivityAvatarText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${props => (props.isPrimary ? 'var(--primary-foreground)' : 'var(--muted-foreground)')};
`;

export const ArtistTeamActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ArtistTeamActivityText = styled.p`
  font-size: 14px;
  color: var(--foreground);
  margin: 0 0 4px 0;

  strong {
    font-weight: 600;
  }
`;

export const ArtistTeamActivityTime = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;
