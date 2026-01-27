import styled from 'styled-components';

export const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 80px;
  background-color: var(--card);
  border-right: 1px solid var(--border);
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  gap: 8px;
`;

export const Logo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 24px;
`;

export const NavigationItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 0 8px;
`;

export const NavButton = styled.button`
  position: relative;
  width: 100%;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--muted-foreground);

  ${({ $isActive }) =>
    $isActive
      ? `
    background-color: var(--primary);
    color: var(--primary-foreground);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  `
      : `
    &:hover {
      background-color: var(--accent);
      color: var(--foreground);
    }
  `}
`;

export const Tooltip = styled.div`
  position: absolute;
  left: 100%;
  margin-left: 16px;
  padding: 8px 12px;
  background-color: var(--foreground);
  color: var(--background);
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  pointer-events: none;

  ${NavButton}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

export const TooltipArrow = styled.div`
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-right-color: var(--foreground);
`;

export const ActiveIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 32px;
  background-color: var(--primary-foreground);
  border-radius: 0 4px 4px 0;
`;

export const SectionIndicators = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

export const Indicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transition: all 0.3s;

  ${({ $isActive }) =>
    $isActive
      ? `
    background-color: var(--primary);
    width: 8px;
    height: 8px;
  `
      : `
    background-color: color-mix(in srgb, var(--muted-foreground) 30%, transparent);
  `}
`;
