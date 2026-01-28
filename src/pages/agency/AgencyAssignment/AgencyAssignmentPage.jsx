import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Search,
  Users,
  UserPlus,
  X,
  Mail,
  Briefcase
} from 'lucide-react';
import {
  AgencyAssignmentRoot,
  AgencyAssignmentBody,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  SearchBarContainer,
  SearchIcon,
  ManagersGrid,
  ManagerCard,
  ManagerCardContent,
  ManagerCardHeader,
  ManagerAvatar,
  ManagerInfo,
  ManagerName,
  ManagerPosition,
  ManagerBadge,
  ManagerDetails,
  ManagerDetailItem,
  EmptyStateCard,
  EmptyStateIcon,
  EmptyStateText,
} from './AgencyAssignmentPage.styled';

// TODO: Zustand store mapping - 담당자 및 작가 목록
const initialManagers = [
  { id: 1, name: '김담당자', email: 'kim@agency.com', position: '담당자', assignedArtists: 5 },
  { id: 2, name: '이담당자', email: 'lee@agency.com', position: '담당자', assignedArtists: 3 },
  { id: 3, name: '박담당자', email: 'park@agency.com', position: '담당자', assignedArtists: 2 },
  { id: 4, name: '최담당자', email: 'choi@agency.com', position: '담당자', assignedArtists: 4 },
  { id: 5, name: '정담당자', email: 'jung@agency.com', position: '담당자', assignedArtists: 6 },
];

const initialArtists = [
  {
    id: 1,
    name: '김작가',
    email: 'kim.artist@agency.com',
    phone: '010-1111-2222',
    projects: 2,
    status: '활동중',
    assignedManager: initialManagers[0]
  },
  {
    id: 2,
    name: '이작가',
    email: 'lee.artist@agency.com',
    phone: '010-2222-3333',
    projects: 3,
    status: '활동중',
    assignedManager: initialManagers[1]
  },
  {
    id: 3,
    name: '박작가',
    email: 'park.artist@agency.com',
    phone: '010-3333-4444',
    projects: 1,
    status: '활동중',
    assignedManager: initialManagers[2]
  },
  {
    id: 4,
    name: '최작가',
    email: 'choi.artist@agency.com',
    phone: '010-4444-5555',
    projects: 0,
    status: '신인',
    assignedManager: undefined
  },
  {
    id: 5,
    name: '정작가',
    email: 'jung.artist@agency.com',
    phone: '010-5555-6666',
    projects: 2,
    status: '휴식',
    assignedManager: initialManagers[0]
  },
  {
    id: 6,
    name: '한작가',
    email: 'han.artist@agency.com',
    phone: '010-6666-7777',
    projects: 4,
    status: '활동중',
    assignedManager: initialManagers[1]
  },
  {
    id: 7,
    name: '강작가',
    email: 'kang.artist@agency.com',
    phone: '010-7777-8888',
    projects: 1,
    status: '신인',
    assignedManager: undefined
  },
];

export function AgencyAssignmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [managers, setManagers] = useState(initialManagers);
  const [artists, setArtists] = useState(initialArtists);

  const getStatusColor = (status) => {
    switch (status) {
      case '활동중':
        return 'bg-green-100 text-green-700';
      case '휴식':
        return 'bg-yellow-100 text-yellow-700';
      case '신인':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAssignArtist = (artistId) => {
    if (!selectedManager) return;

    setArtists(prev => prev.map(artist =>
      artist.id === artistId
        ? { ...artist, assignedManager: selectedManager }
        : artist
    ));

    setManagers(prev => prev.map(manager =>
      manager.id === selectedManager.id
        ? { ...manager, assignedArtists: manager.assignedArtists + 1 }
        : manager
    ));

    toast.success(`${artists.find(a => a.id === artistId)?.name}를 ${selectedManager.name}에게 배정했습니다.`);
  };

  const handleUnassignArtist = (artistId) => {
    const artist = artists.find(a => a.id === artistId);
    if (!artist || !artist.assignedManager || !selectedManager) return;

    setArtists(prev => prev.map(a =>
      a.id === artistId
        ? { ...a, assignedManager: undefined }
        : a
    ));

    setManagers(prev => prev.map(manager =>
      manager.id === artist.assignedManager.id
        ? { ...manager, assignedArtists: Math.max(0, manager.assignedArtists - 1) }
        : manager
    ));

    toast.success(`${artist.name}의 담당자 배정을 해제했습니다.`);
  };

  const openAssignModal = (manager) => {
    setSelectedManager(manager);
    setIsAssignModalOpen(true);
  };

  // Filter managers by search query
  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get artists assigned to selected manager
  const assignedArtists = selectedManager 
    ? artists.filter(artist => artist.assignedManager?.id === selectedManager.id)
    : [];

  // Get unassigned artists
  const unassignedArtists = artists.filter(artist => !artist.assignedManager);

  return (
    <AgencyAssignmentRoot>
      <AgencyAssignmentBody>
        {/* Header */}
        <HeaderSection>
          <HeaderTitle>담당자-작가 배정</HeaderTitle>
          <HeaderSubtitle>담당자별로 작가를 배정하고 관리합니다</HeaderSubtitle>
        </HeaderSection>

        {/* Search Bar */}
        <SearchBarContainer>
          <SearchIcon>
            <Search className="w-4 h-4 text-muted-foreground" />
          </SearchIcon>
          <Input
            type="text"
            placeholder="담당자 이름, 이메일 또는 직급으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </SearchBarContainer>

        {/* Manager Cards */}
        <ManagersGrid>
          {filteredManagers.map((manager) => (
            <ManagerCard 
              key={manager.id}
              onClick={() => openAssignModal(manager)}
            >
              <ManagerCardContent>
                <ManagerCardHeader>
                  <div className="flex items-center gap-3">
                    <ManagerAvatar>
                      <Users className="w-6 h-6 text-primary" />
                    </ManagerAvatar>
                    <ManagerInfo>
                      <ManagerName>{manager.name}</ManagerName>
                      <ManagerPosition>{manager.position}</ManagerPosition>
                    </ManagerInfo>
                  </div>
                </ManagerCardHeader>

                <ManagerDetails>
                  <ManagerDetailItem>
                    <Mail className="w-4 h-4" />
                    <span>{manager.email}</span>
                  </ManagerDetailItem>
                  <ManagerDetailItem>
                    <Users className="w-4 h-4" />
                    <span>담당 작가 {manager.assignedArtists}명</span>
                  </ManagerDetailItem>
                </ManagerDetails>
              </ManagerCardContent>
            </ManagerCard>
          ))}
        </ManagersGrid>

        {filteredManagers.length === 0 && (
          <EmptyStateCard>
            <EmptyStateIcon>
              <Users className="w-12 h-12 text-muted-foreground" />
            </EmptyStateIcon>
            <EmptyStateText>검색 결과가 없습니다</EmptyStateText>
          </EmptyStateCard>
        )}
      </AgencyAssignmentBody>

      {/* Assignment Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] bg-white">
          <DialogHeader>
            <DialogTitle>{selectedManager?.name} - 작가 배정 관리</DialogTitle>
            <DialogDescription>
              담당 작가를 추가하거나 제거할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Currently Assigned Artists */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                담당 작가 ({assignedArtists.length}명)
              </h3>
              
              {assignedArtists.length > 0 ? (
                <div className="space-y-2">
                  {assignedArtists.map((artist) => (
                    <div 
                      key={artist.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{artist.name}</span>
                          <Badge className={getStatusColor(artist.status)} style={{ fontSize: '10px' }}>
                            {artist.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{artist.email}</span>
                          <span>프로젝트: {artist.projects}개</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassignArtist(artist.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/10 rounded-lg">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">담당 작가가 없습니다</p>
                </div>
              )}
            </div>

            {/* Unassigned Artists */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                미배정 작가 ({unassignedArtists.length}명)
              </h3>
              
              {unassignedArtists.length > 0 ? (
                <div className="space-y-2">
                  {unassignedArtists.map((artist) => (
                    <div 
                      key={artist.id}
                      className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{artist.name}</span>
                          <Badge className={getStatusColor(artist.status)} style={{ fontSize: '10px' }}>
                            {artist.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{artist.email}</span>
                          <span>프로젝트: {artist.projects}개</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignArtist(artist.id)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        배정
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/10 rounded-lg">
                  <UserPlus className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">미배정 작가가 없습니다</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={() => setIsAssignModalOpen(false)}>
              완료
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AgencyAssignmentRoot>
  );
}
