import styled from 'styled-components';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: color-mix(in srgb, var(--card) 80%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  z-index: 50;
`;

export const HeaderContent = styled.div`
  height: 100%;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: visible; /* 모달이 잘리지 않도록 */
`;

export const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

export const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoDomain = styled.span`
  font-size: 10px;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1;
  white-space: nowrap;
  font-weight: 400;
`;

export const CurrentPageTitle = styled.h2`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
  z-index: 1;
  /* 1. 글자가 절대 아래로 떨어지지 않게 강제 고정 */
  white-space: nowrap;
  /* 2. flex 구조에서 찌그러지는 것을 방지 */
  flex-shrink: 0;
  min-width: max-content; /* 내용물만큼 최소 너비 확보 */
  /* 3. 너비 확인 및 조정 */
  width: auto !important;
`;

export const ActionsSection = styled.div`
  display: flex;
  flex-direction: row;    /* 가로 배치를 강제 */
  align-items: center;    /* 수직 중앙 정렬 */
  flex-shrink: 0;         /* 이 영역도 찌그러짐 방지 */
  gap: 12px;
  margin-left: auto;
  z-index: 2;
`;

export const AttendanceButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: var(--accent);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const NotificationButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* w-10 */
  height: 40px; /* h-10 */
  background-color: color-mix(in srgb, var(--muted) 50%, transparent); /* bg-muted/50 */
  border-radius: 8px; /* rounded-lg */
  cursor: pointer;
  flex-shrink: 0;
  border: none;
  color: var(--muted-foreground);
  transition: all 0.2s;
  transform: none; /* 버튼이 움직이지 않도록 고정 */

  &:hover {
    background-color: color-mix(in srgb, var(--primary) 20%, transparent); /* hover:bg-primary/20 */
    color: var(--primary); /* hover:text-primary */
  }

  svg {
    width: 20px; /* w-5 */
    height: 20px; /* h-5 */
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 6px; /* top-1.5 */
  right: 6px; /* right-1.5 */
  width: 8px; /* w-2 */
  height: 8px; /* h-2 */
  background-color: var(--status-deadline);
  border-radius: 50%;
  border: 1px solid white;
`;

export const NotificationPanel = styled.div`
  position: absolute;
  right: 0;
  top: 48px; /* top-12 (12 * 4px = 48px) */
  width: 320px; /* w-80 */
  background: white;
  border-radius: 8px; /* rounded-lg */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
  border: 1px solid var(--border);
  overflow: hidden;
  z-index: 9999;
  transform-origin: right top;
`;

export const NotificationArrow = styled.div`
  position: absolute;
  top: -8px; /* -top-2 */
  right: 12px; /* right-3 */
  width: 16px; /* w-4 */
  height: 16px; /* h-4 */
  background-color: white;
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
  transform: rotate(45deg);
`;

export const NotificationHeader = styled.div`
  padding: 16px; /* p-4 */
  border-bottom: 1px solid var(--border);
  background-color: color-mix(in srgb, var(--muted) 30%, transparent); /* bg-muted/30 */
`;

export const NotificationHeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const NotificationHeaderTitle = styled.h3`
  margin: 0; 
  font-size: 14px; /* text-sm */
  font-weight: 600; /* font-semibold */
  color: var(--foreground);
`;

export const MarkAllReadButton = styled.button`
  background: none; 
  border: none; 
  color: var(--primary); /* text-primary */
  font-size: 12px; /* text-xs */
  cursor: pointer;
  padding: 0;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const NotificationHeaderSubtitle = styled.p`
  font-size: 12px; /* text-xs */
  color: var(--muted-foreground);
  margin: 4px 0 0 0; /* mt-1 */
`;

export const NotificationList = styled.div`
  max-height: 384px; /* max-h-96 */
  overflow-y: auto;
  background-color: white;
`;

export const EmptyNotification = styled.div`
  padding: 32px;
  text-align: center;
  color: var(--muted-foreground);
  font-size: 14px;
`;

export const NotificationItem = styled.div`
  padding: 12px; /* p-3 */
  border-bottom: 1px solid var(--border);
  position: relative;
  transition: background-color 0.2s;
  cursor: pointer;
  background-color: ${props => props.$isUnread ? 'color-mix(in srgb, var(--primary) 5%, transparent)' : 'transparent'}; /* bg-primary/5 for unread */

  &:hover {
    background-color: color-mix(in srgb, var(--muted) 30%, transparent); /* hover:bg-muted/30 */
  }
`;

export const NotificationItemContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const NotificationItemMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotificationItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* gap-2 */
  margin-bottom: 4px; /* mb-1 */
`;

export const NotificationItemTitle = styled.h4`
  margin: 0; 
  font-size: 14px; /* text-sm */
  font-weight: 600; /* font-semibold */
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UnreadDot = styled.span`
  width: 8px; /* w-2 */
  height: 8px; /* h-2 */
  background: var(--primary); /* bg-primary */
  border-radius: 50%;
  flex-shrink: 0;
`;

export const NotificationItemMessage = styled.p`
  margin: 0 0 4px 0; /* mb-1 */
  font-size: 12px; /* text-xs */
  color: var(--muted-foreground);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const NotificationItemFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NotificationItemTime = styled.span`
  font-size: 12px; /* text-xs */
  color: var(--muted-foreground);
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--muted-foreground);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: var(--foreground);
  }
`;

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px; /* gap-2 */
  padding: 8px 12px; /* px-3 py-2 */
  background-color: color-mix(in srgb, var(--primary) 10%, transparent); /* bg-primary/10 */
  border-radius: 8px; /* rounded-lg */
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background-color: color-mix(in srgb, var(--primary) 20%, transparent); /* hover:bg-primary/20 */
  }
`;

export const ProfileAvatar = styled.div`
  background-color: var(--primary); /* bg-primary */
  border-radius: 50%; 
  width: 32px; /* w-8 */
  height: 32px; /* h-8 */
  display: flex; 
  justify-content: center; 
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
`;

export const ProfileInfo = styled.div`
  text-align: left;
  display: none; /* hidden */

  @media (min-width: 768px) {
    display: block; /* md:block */
  }
`;

export const ProfileName = styled.p`
  margin: 0;
  font-weight: 500; /* font-medium */
  color: var(--foreground);
  font-size: 14px; /* text-sm */
  line-height: 1.2;
`;

export const ProfileRole = styled.p`
  margin: 0;
  color: var(--muted-foreground);
  font-size: 12px; /* text-xs */
  line-height: 1.2;
`;

export const ProfileChevron = styled.div`
  width: 16px; /* w-4 */
  height: 16px; /* h-4 */
  color: var(--muted-foreground);
  transition: color 0.2s;
  flex-shrink: 0;
  margin-left: 4px; /* ml-1 */

  ${ProfileButton}:hover & {
    color: var(--primary); /* group-hover:text-primary */
  }
`;

// Header.styled.js 에 추가하거나, 기존 NotificationButton 스타일을 복사하세요.
export const MessengerButton = styled(NotificationButton)`
  /* 알림 버튼과 동일한 스타일, 필요 시 hover 색상만 변경 */
  &:hover {
    color: var(--primary); /* 예시: 메시지는 포인트 컬러로 강조 */
  }
`;