import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--background);
  overflow: hidden;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
`;

export const SidebarWrapper = styled.div`
  position: fixed;
  z-index: 50;
  height: 100%;
  transition: transform 0.3s;

  @media (min-width: 1024px) {
    position: relative;
    transform: translateX(0) !important;
  }

  ${({ $isOpen }) =>
    $isOpen
      ? `
    transform: translateX(0);
  `
      : `
    transform: translateX(-100%);
  `}
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

export const MainScrollArea = styled.main`
  flex: 1;
  overflow-y: auto;
`;

export const ContentContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
`;
