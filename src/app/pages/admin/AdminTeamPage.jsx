import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { Button } from '@/app/components/ui/button';
import { 
  Users, 
  Mail, 
  Phone, 
  Briefcase,
  Calendar,
  Activity,
  User
} from 'lucide-react';



export function AdminTeamPage() {
  // 메인 작가 목록
  const [mainArtists] = useState([
    {
      id,
      name: '김작가',
      email: 'kim.artist@example.com',
      phone: '010-1234-5678',
      genre: '로맨스/판타지',
      projects: ['로맨스 판타지', '일상 코미디'],
      joinDate: '2024.03.15',
      status: '활동 중',
      recentActivity: '2시간 전',
      completedProjects,
    },
    {
      id,
      name: '이작가',
      email: 'lee.artist@example.com',
      phone: '010-2345-6789',
      genre: '학원/일상',
      projects: ['학원물'],
      joinDate: '2024.06.20',
      status: '활동 중',
      recentActivity: '1일 전',
      completedProjects,
    },
    {
      id,
      name: '박작가',
      email: 'park.artist@example.com',
      phone: '010-3456-7890',
      genre: '미스터리/스릴러',
      projects: ['미스터리 스릴러'],
      joinDate: '2023.12.10',
      status: '활동 중',
      recentActivity: '5시간 전',
      completedProjects,
    },
  ]);

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">직원 관리</h1>
            <p className="text-sm text-muted-foreground mt-1">담당 작가를 관리하세요</p>
          </div>

          {/* 통계 정보 - 작가 수 카드 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">총 작가</span>
                  <p className="text-3xl font-bold text-foreground">{mainArtists.length}명</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">진행 중인 작품</span>
                  <p className="text-3xl font-bold text-foreground">
                    {mainArtists.reduce((sum, artist) => sum + artist.projects.length, 0)}개
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">활동 작가</span>
                  <p className="text-3xl font-bold text-foreground">{mainArtists.length}명</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 작가 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainArtists.map((artist) => (
              <Card 
                key={artist.id} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* 작가 헤더 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {artist.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">{artist.name}</h3>
                    <Badge className="bg-primary text-xs">
                      {artist.genre}
                    </Badge>
                  </div>
                </div>

                {/* 연락처 정보 */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground truncate">{artist.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{artist.phone}</span>
                  </div>
                </div>

                {/* 진행 중인 프로젝트 */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      진행 중인 작품 ({artist.projects.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {artist.projects.map((project, idx) => (
                      <div 
                        key={idx}
                        className="px-3 py-2 bg-muted/50 rounded-md text-sm text-foreground"
                      >
                        {project}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}