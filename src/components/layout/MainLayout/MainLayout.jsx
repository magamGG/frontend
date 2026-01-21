import { useState, useRef } from 'react';
import { Sidebar } from '../Sidebar';
import { TopBar } from '../TopBar';
import {
  LayoutContainer,
  Overlay,
  SidebarWrapper,
  MainContent,
  MainScrollArea,
  ContentContainer,
} from './MainLayout.styled';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {import('react').ReactNode} props.children
 */
export function MainLayout({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  return (
    <LayoutContainer>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <Overlay 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Hidden on mobile, slide in when open */}
      <SidebarWrapper $isOpen={sidebarOpen}>
        <Sidebar />
      </SidebarWrapper>

      {/* Main Content - Full Screen */}
      <MainContent>
        <TopBar 
          title={title} 
          subtitle={subtitle} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          scrollContainerRef={mainRef}
        />
        <MainScrollArea ref={mainRef}>
          <ContentContainer>
            {children}
          </ContentContainer>
        </MainScrollArea>
      </MainContent>
    </LayoutContainer>
  );
}
