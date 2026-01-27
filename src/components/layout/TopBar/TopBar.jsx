import { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  TopBarContainer,
  TopBarContent,
  LeftSection,
  TitleSection,
  Title,
  Subtitle,
  RightSection,
  SearchContainer,
  SearchIcon,
  NotificationButton,
  NotificationBadge,
} from './TopBar.styled';

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {() => void} props.onMenuClick
 * @param {import('react').RefObject<HTMLDivElement>} [props.scrollContainerRef]
 */
export function TopBar({ title, subtitle, onMenuClick, scrollContainerRef }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!scrollContainerRef?.current) return;
    
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }
      
      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollContainerRef]);

  return (
    <TopBarContainer $scrolled={scrolled} $visible={visible}>
      <TopBarContent>
        {/* Left: Menu + Title */}
        <LeftSection>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            style={{ display: 'none' }}
            className="lg:hidden"
          >
            <Menu style={{ width: '20px', height: '20px' }} />
          </Button>
          <TitleSection>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleSection>
        </LeftSection>

        {/* Right: Search + Notifications */}
        <RightSection>
          {/* Search - Hidden on mobile */}
          <SearchContainer>
            <SearchIcon>
              <Search style={{ width: '16px', height: '16px' }} />
            </SearchIcon>
            <Input 
              placeholder="검색..." 
              style={{ paddingLeft: '40px' }}
            />
          </SearchContainer>

          {/* Notifications */}
          <NotificationButton as={Button} variant="outline" size="icon">
            <Bell style={{ width: '20px', height: '20px' }} />
            <NotificationBadge />
          </NotificationButton>
        </RightSection>
      </TopBarContent>
    </TopBarContainer>
  );
}
