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





export function AgencyAssignmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // 담당자 목록
  const [managers, setManagers] = useState([
    { id, name: '김담당자', email: 'kim@agency.com', position: '시니어 매니저', assignedArtists,
    { id, name: '이담당자', email: 'lee@agency.com', position: '매니저', assignedArtists,
    { id, name: '박담당자', email: 'park@agency.com', position: '주니어 매니저', assignedArtists,
    { id, name: '최담당자', email: 'choi@agency.com', position: '매니저', assignedArtists,
    { id, name: '정담당자', email: 'jung@agency.com', position: '시니어 매니저', assignedArtists,
  ]);

  // 작가 목록
  const [artists, setArtists] = useState([
    {
      id,
      name: '김작가',
      email: 'kim.artist@agency.com',
      phone: '010-1111-2222',
      projects,
      status: '활동중',
      assignedManager,
    {
      id,
      name: '이작가',
      email: 'lee.artist@agency.com',
      phone: '010-2222-3333',
      projects,
      status: '활동중',
      assignedManager,
    {
      id,
      name: '박작가',
      email: 'park.artist@agency.com',
      phone: '010-3333-4444',
      projects,
      status: '활동중',
      assignedManager,
    {
      id,
      name: '최작가',
      email: 'choi.artist@agency.com',
      phone: '010-4444-5555',
      projects,
      status: '신인',
      assignedManager,
    {
      id,
      name: '정작가',
      email: 'jung.artist@agency.com',
      phone: '010-5555-6666',
      projects,
      status: '휴식',
      assignedManager,
    {
      id,
      name: '한작가',
      email: 'han.artist@agency.com',
      phone: '010-6666-7777',
      projects,
      status: '활동중',
      assignedManager,
    {
      id,
      name: '강작가',
      email: 'kang.artist@agency.com',
      phone: '010-7777-8888',
      projects,
      status: '신인',
      assignedManager,
  ]);

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
      manager.id === artist.assignedManager!.id
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
    <div className="w-full h-full">
      <div className="pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">담당자-작가 배정</h1>
            <p className="text-sm text-muted-foreground">
              담당자별로 작가를 배정하고 관리합니다
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="담당자 이름, 이메일 또는 직급으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Manager Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredManagers.map((manager) => (
              <Card 
                key={manager.id}
                className="p-5 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
                onClick={() => openAssignModal(manager)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{manager.name}</h3>
                      <p className="text-xs text-muted-foreground">{manager.position}</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-lg px-3 py-1">
                    {manager.assignedArtists}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{manager.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>담당 작가 {manager.assignedArtists}명</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredManagers.length === 0 && (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">검색 결과가 없습니다</p>
            </Card>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col bg-white p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedManager?.name} - 작가 배정 관리</DialogTitle>
            <DialogDescription>
              담당 작가를 추가하거나 제거할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto min-h-0 flex-1 pr-1 hide-scrollbar">
            {/* 담당 작가 - 2명 높이만 보이고 나머지는 스크롤 */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                담당 작가 ({assignedArtists.length}명)
              </h3>
              
              {assignedArtists.length > 0 ? (
                <div className="overflow-y-auto max-h-[176px] space-y-2 pr-1 hide-scrollbar">
                  {assignedArtists.map((artist) => (
                    <div 
                      key={artist.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg flex-shrink-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground truncate">{artist.name}</span>
                          <Badge className={getStatusColor(artist.status)} style={{ fontSize: '10px' }}>
                            {artist.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground truncate">
                          <span>{artist.email}</span>
                          <span>프로젝트: {artist.projects}개</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassignArtist(artist.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
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

            {/* 미배정 작가 - 2명 높이만 보이고 나머지는 스크롤 */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                미배정 작가 ({unassignedArtists.length}명)
              </h3>
              
              {unassignedArtists.length > 0 ? (
                <div className="overflow-y-auto max-h-[176px] space-y-2 pr-1 hide-scrollbar">
                  {unassignedArtists.map((artist) => (
                    <div 
                      key={artist.id}
                      className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex-shrink-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground truncate">{artist.name}</span>
                          <Badge className={getStatusColor(artist.status)} style={{ fontSize: '10px' }}>
                            {artist.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground truncate">
                          <span>{artist.email}</span>
                          <span>프로젝트: {artist.projects}개</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignArtist(artist.id)}
                        className="text-primary hover:bg-primary/10 flex-shrink-0"
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

          <div className="flex justify-end pt-4 mt-4 border-t border-border flex-shrink-0">
            <Button onClick={() => setIsAssignModalOpen(false)}>
              완료
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
