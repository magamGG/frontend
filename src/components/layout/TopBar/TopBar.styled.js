import styled from 'styled-components';

export const TopBarContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  transition: all 0.3s;

  ${({ $scrolled }) =>
    $scrolled
      ? `
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  `
      : ''}

  ${({ $visible }) =>
    $visible
      ? `
    transform: translateY(0);
  `
      : `
    transform: translateY(-100%);
  `}
`;

export const TopBarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const TitleSection = styled.div``;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 256px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--muted-foreground);
`;

export const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: var(--destructive);
  border-radius: 50%;
`;
