import { useState } from 'react';
import { Badge } from '@/app/components/ui/badge';
import { 
  Users, 
  Mail, 
  Phone, 
  Briefcase,
  Calendar,
  Activity,
  User
} from 'lucide-react';
import {
  AdminTeamRoot,
  AdminTeamBody,
  AdminTeamHeader,
  AdminTeamTitle,
  AdminTeamSubtitle,
  StatsGrid,
  StatCard,
  StatCardIcon,
  StatCardContent,
  StatCardLabel,
  StatCardValue,
  ArtistsGrid,
  ArtistCard,
  ArtistHeader,
  ArtistAvatar,
  ArtistInfo,
  ArtistName,
  ArtistGenreBadge,
  ContactInfo,
  ContactItem,
  ContactIcon,
  ContactText,
  ProjectsSection,
  ProjectsHeader,
  ProjectsHeaderText,
  ProjectsList,
  ProjectTag,
} from './AdminTeamPage.styled';

export function AdminTeamPage() {
  // TODO: Zustand store mapping - 메인 작가 목록
  const [mainArtists] = useState([
    {
      id: 1,
      name: '김작가',
      email: 'kim.artist@example.com',
      phone: '010-1234-5678',
      genre: '로맨스/판타지',
      projects: ['로맨스 판타지', '일상 코미디'],
      joinDate: '2024.03.15',
      status: '활동 중',
      recentActivity: '2시간 전',
      completedProjects: 12,
    },
    {
      id: 2,
      name: '이작가',
      email: 'lee.artist@example.com',
      phone: '010-2345-6789',
      genre: '학원/일상',
      projects: ['학원물'],
      joinDate: '2024.06.20',
      status: '활동 중',
      recentActivity: '1일 전',
      completedProjects: 8,
    },
    {
      id: 3,
      name: '박작가',
      email: 'park.artist@example.com',
      phone: '010-3456-7890',
      genre: '미스터리/스릴러',
      projects: ['미스터리 스릴러'],
      joinDate: '2023.12.10',
      status: '활동 중',
      recentActivity: '5시간 전',
      completedProjects: 15,
    },
  ]);

  const totalArtists = mainArtists.length;
  const totalProjects = mainArtists.reduce((sum, artist) => sum + artist.projects.length, 0);
  const activeArtists = mainArtists.filter(artist => artist.status === '활동 중').length;

  return (
    <AdminTeamRoot>
      <AdminTeamBody>
        {/* Header */}
        <AdminTeamHeader>
          <AdminTeamTitle>직원 관리</AdminTeamTitle>
          <AdminTeamSubtitle>담당 작가를 관리하세요</AdminTeamSubtitle>
        </AdminTeamHeader>

        {/* 통계 정보 - 작가 수 카드 */}
        <StatsGrid>
          <StatCard>
            <StatCardIcon $bgColor="rgba(110, 143, 179, 0.1)">
              <Users className="w-6 h-6" style={{ color: '#6E8FB3' }} />
            </StatCardIcon>
            <StatCardContent>
              <StatCardLabel>총 작가</StatCardLabel>
              <StatCardValue>{totalArtists}명</StatCardValue>
            </StatCardContent>
          </StatCard>
          
          <StatCard>
            <StatCardIcon $bgColor="rgba(59, 130, 246, 0.1)">
              <Briefcase className="w-6 h-6" style={{ color: '#3B82F6' }} />
            </StatCardIcon>
            <StatCardContent>
              <StatCardLabel>진행 중인 작품</StatCardLabel>
              <StatCardValue>{totalProjects}개</StatCardValue>
            </StatCardContent>
          </StatCard>
          
          <StatCard>
            <StatCardIcon $bgColor="rgba(34, 197, 94, 0.1)">
              <Activity className="w-6 h-6" style={{ color: '#22C55E' }} />
            </StatCardIcon>
            <StatCardContent>
              <StatCardLabel>활동 작가</StatCardLabel>
              <StatCardValue>{activeArtists}명</StatCardValue>
            </StatCardContent>
          </StatCard>
        </StatsGrid>

        {/* 작가 목록 */}
        <ArtistsGrid>
          {mainArtists.map((artist) => (
            <ArtistCard key={artist.id}>
              {/* 작가 헤더 */}
              <ArtistHeader>
                <ArtistAvatar>
                  <span>{artist.name.charAt(0)}</span>
                </ArtistAvatar>
                <ArtistInfo>
                  <ArtistName>{artist.name}</ArtistName>
                  <ArtistGenreBadge>{artist.genre}</ArtistGenreBadge>
                </ArtistInfo>
              </ArtistHeader>

              {/* 연락처 정보 */}
              <ContactInfo>
                <ContactItem>
                  <ContactIcon>
                    <Mail className="w-4 h-4" />
                  </ContactIcon>
                  <ContactText>{artist.email}</ContactText>
                </ContactItem>
                <ContactItem>
                  <ContactIcon>
                    <Phone className="w-4 h-4" />
                  </ContactIcon>
                  <ContactText>{artist.phone}</ContactText>
                </ContactItem>
              </ContactInfo>

              {/* 진행 중인 프로젝트 */}
              <ProjectsSection>
                <ProjectsHeader>
                  <Briefcase className="w-4 h-4" />
                  <ProjectsHeaderText>
                    진행 중인 작품 ({artist.projects.length})
                  </ProjectsHeaderText>
                </ProjectsHeader>
                <ProjectsList>
                  {artist.projects.map((project, idx) => (
                    <ProjectTag key={idx}>
                      {project}
                    </ProjectTag>
                  ))}
                </ProjectsList>
              </ProjectsSection>
            </ArtistCard>
          ))}
        </ArtistsGrid>
      </AdminTeamBody>
    </AdminTeamRoot>
  );
}
