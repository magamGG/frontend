import styled from 'styled-components';

export const LayoutContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: var(--background);
`;

export const SectionsContainer = styled.div`
  height: 100%;
  overflow: hidden;
`;

export const ScrollContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding-top: 80px;

  /* Hide scrollbar but keep functionality */
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Additional hide-scrollbar class support */
  &.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const SectionContent = styled.div`
  width: 100%;
`;

export const DockNavigation = styled.div`
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
`;

export const DockContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background-color: color-mix(in srgb, var(--card) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

export const DockButton = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    transform: translateY(-8px) scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  top: -48px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;

  ${DockButton}:hover & {
    opacity: 1;
    transform: translateX(-50%) translateY(-4px);
  }
`;

export const TooltipContent = styled.div`
  background-color: var(--foreground);
  color: var(--background);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
`;

export const TooltipArrow = styled.div`
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background-color: var(--foreground);
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.3s;

  ${({ $isActive }) =>
    $isActive
      ? `
    width: 56px;
    height: 56px;
    background-color: var(--primary);
    color: var(--primary-foreground);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  `
      : `
    width: 48px;
    height: 48px;
    background-color: color-mix(in srgb, var(--muted) 50%, transparent);
    color: var(--muted-foreground);

    ${DockButton}:hover & {
      background-color: color-mix(in srgb, var(--primary) 20%, transparent);
      color: var(--primary);
    }
  `}
`;

export const ActiveIndicator = styled.div`
  position: absolute;
  bottom: -4px;
  width: 6px;
  height: 6px;
  background-color: var(--primary);
  border-radius: 50%;
`;
