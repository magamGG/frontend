import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import { memberService } from '@/api';
import useAuthStore from '@/store/authStore';
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

<<<<<<< Updated upstream:src/pages/AgencyAssignment/AgencyAssignmentPage.jsx
// TODO: Zustand store mapping - 담당자 및 작가 목록
const initialManagers = [
  { id: 1, name: '김담당자', email: 'kim@agency.com', position: '시니어 매니저', assignedArtists: 5 },
  { id: 2, name: '이담당자', email: 'lee@agency.com', position: '매니저', assignedArtists: 3 },
  { id: 3, name: '박담당자', email: 'park@agency.com', position: '주니어 매니저', assignedArtists: 2 },
  { id: 4, name: '최담당자', email: 'choi@agency.com', position: '매니저', assignedArtists: 4 },
  { id: 5, name: '정담당자', email: 'jung@agency.com', position: '시니어 매니저', assignedArtists: 6 },
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

=======
>>>>>>> Stashed changes:src/pages/agency/AgencyAssignment/AgencyAssignmentPage.jsx
export function AgencyAssignmentPage() {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 담당자 및 작가 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.agencyNo) {
        return;
      }

      setIsLoading(true);
      try {
        // 담당자 목록 조회 (MANAGER 테이블에서 조회)
        const managersResponse = await memberService.getManagersByAgency(user.agencyNo);
        console.log('담당자 목록 응답:', managersResponse);
        
        // 응답 데이터 처리 (응답이 객체로 감싸져 있을 수 있음)
        let managersList = [];
        if (Array.isArray(managersResponse)) {
          managersList = managersResponse;
        } else if (managersResponse?.data && Array.isArray(managersResponse.data)) {
          managersList = managersResponse.data;
        } else if (managersResponse?.data?.data && Array.isArray(managersResponse.data.data)) {
          managersList = managersResponse.data.data;
        }
        
        console.log('처리된 담당자 목록:', managersList);
        
        // 작가 목록 조회
        const artistsResponse = await memberService.getArtistsByAgency(user.agencyNo);
        console.log('작가 목록 응답:', artistsResponse);
        
        // 작가 응답 데이터 처리
        let artistsList = [];
        if (Array.isArray(artistsResponse)) {
          artistsList = artistsResponse;
        } else if (artistsResponse?.data && Array.isArray(artistsResponse.data)) {
          artistsList = artistsResponse.data;
        } else if (artistsResponse?.data?.data && Array.isArray(artistsResponse.data.data)) {
          artistsList = artistsResponse.data.data;
        }
        
        console.log('처리된 작가 목록:', artistsList);

        // 담당자 데이터 변환 (MANAGER 테이블의 데이터 사용)
        const mappedManagers = managersList.map((manager) => {
          // 작가 목록에서 해당 담당자에게 배정된 작가 수 계산
          // managerNo는 MANAGER 테이블의 MANAGER_NO를 의미
          const assignedCount = artistsList.filter(
            (artist) => artist.managerNo === manager.managerNo
          ).length;
          
          return {
            id: manager.managerNo, // MANAGER 테이블의 MANAGER_NO 사용
            memberNo: manager.memberNo, // MEMBER 테이블의 MEMBER_NO도 함께 저장
            name: manager.memberName,
            email: manager.memberEmail,
            position: manager.memberRole,
            assignedArtists: assignedCount,
          };
        });
        
        console.log('매핑된 담당자 목록:', mappedManagers);

        // 작가 데이터 변환
        const mappedArtists = artistsList.map((artist) => {
          // 상태는 memberStatus를 기반으로 매핑
          let status = '활동중';
          if (artist.memberStatus === 'ACTIVE') {
            status = '활동중';
          } else if (artist.memberStatus === 'BLOCKED') {
            status = '휴식';
          }

          // ARTIST_ASSIGNMENT에 없는 작가는 managerNo가 null이거나 undefined
          // 명시적으로 null/undefined 체크하여 미배정 작가로 처리
          const managerNo = artist.managerNo || null;
          const assignedManager = managerNo 
            ? mappedManagers.find(m => m.id === managerNo) 
            : undefined;

          return {
            id: artist.memberNo,
            name: artist.memberName,
            email: artist.memberEmail,
            phone: artist.memberPhone || '',
            projects: 0, // 프로젝트 수는 필요시 별도 조회
            status: status,
            managerNo: managerNo, // 명시적으로 저장
            assignedManager: assignedManager, // 배정된 담당자 (없으면 undefined)
          };
        });
        
        console.log('매핑된 작가 목록:', mappedArtists);
        console.log('미배정 작가 수:', mappedArtists.filter(a => !a.assignedManager).length);

        setManagers(mappedManagers);
        setArtists(mappedArtists);
        
        if (mappedManagers.length === 0) {
          console.warn('MANAGER 테이블에 담당자가 없습니다. member_role이 "담당자"인 멤버가 MANAGER 테이블에 등록되어 있는지 확인하세요.');
          toast.warning('담당자가 없습니다. MANAGER 테이블에 담당자를 등록해주세요.');
        }
      } catch (error) {
        console.error('담당자/작가 목록 조회 실패:', error);
        console.error('에러 상세:', error.response?.data || error.message);
        toast.error(`담당자/작가 목록을 불러오는데 실패했습니다: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.agencyNo]);

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

  const handleAssignArtist = async (artistId) => {
    if (!selectedManager) {
      toast.error('담당자를 선택해주세요.');
      return;
    }

    try {
      console.log('작가 배정 시작:', {
        artistId,
        managerNo: selectedManager.id, // MANAGER 테이블의 MANAGER_NO
        managerName: selectedManager.name
      });

      // 백엔드 API 호출: ARTIST_ASSIGNMENT 테이블에 등록
      // managerNo는 MANAGER 테이블의 MANAGER_NO를 전달
      await memberService.assignArtistToManager(artistId, selectedManager.id);
      
      console.log('작가 배정 성공:', {
        artistId,
        managerNo: selectedManager.id
      });

      // 상태 업데이트: 작가의 managerNo와 assignedManager 설정
      setArtists(prev => prev.map(artist =>
        artist.id === artistId
          ? { 
              ...artist, 
              managerNo: selectedManager.id, // MANAGER 테이블의 MANAGER_NO
              assignedManager: selectedManager 
            }
          : artist
      ));

      // 담당자의 담당 작가 수 업데이트
      setManagers(prev => prev.map(manager =>
        manager.id === selectedManager.id
          ? { ...manager, assignedArtists: manager.assignedArtists + 1 }
          : manager
      ));

      toast.success(`${artists.find(a => a.id === artistId)?.name}를 ${selectedManager.name}에게 배정했습니다.`);
    } catch (error) {
      console.error('작가 배정 실패:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      toast.error(`작가 배정에 실패했습니다: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUnassignArtist = async (artistId) => {
    const artist = artists.find(a => a.id === artistId);
    if (!artist || !artist.assignedManager) {
      toast.error('배정된 담당자가 없습니다.');
      return;
    }

    try {
      console.log('작가 배정 해제 시작:', {
        artistId,
        artistName: artist.name,
        currentManagerNo: artist.managerNo
      });

      // 백엔드 API 호출: ARTIST_ASSIGNMENT 테이블에서 삭제
      await memberService.unassignArtistFromManager(artistId);
      
      console.log('작가 배정 해제 성공:', artistId);

      // 상태 업데이트: managerNo를 null로 설정하고 assignedManager를 undefined로 설정
      const previousManager = artist.assignedManager;
      setArtists(prev => prev.map(a =>
        a.id === artistId
          ? { 
              ...a, 
              managerNo: null, // 명시적으로 null로 설정하여 미배정 작가로 표시
              assignedManager: undefined 
            }
          : a
      ));

      // 담당자의 담당 작가 수 업데이트
      setManagers(prev => prev.map(manager =>
        manager.id === previousManager.id
          ? { ...manager, assignedArtists: Math.max(0, manager.assignedArtists - 1) }
          : manager
      ));

      toast.success(`${artist.name}의 담당자 배정을 해제했습니다.`);
    } catch (error) {
      console.error('작가 배정 해제 실패:', error);
      console.error('에러 상세:', error.response?.data || error.message);
      toast.error(`작가 배정 해제에 실패했습니다: ${error.response?.data?.message || error.message}`);
    }
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

  // Get unassigned artists (ARTIST_ASSIGNMENT에 없는 작가 = managerNo가 null이거나 undefined인 작가)
  // artist_assignment 테이블에 없는 작가는 전부 미배정 작가로 표시
  const unassignedArtists = artists.filter(artist => {
    // managerNo가 null, undefined, 0이거나 assignedManager가 없는 경우 미배정 작가로 처리
    const hasNoManagerNo = artist.managerNo === null || artist.managerNo === undefined || artist.managerNo === 0;
    const hasNoAssignedManager = !artist.assignedManager;
    const isUnassigned = hasNoManagerNo || hasNoAssignedManager;
    
    return isUnassigned;
  });
  
  console.log('전체 작가 수:', artists.length);
  console.log('미배정 작가 수:', unassignedArtists.length);
  console.log('미배정 작가 목록:', unassignedArtists.map(a => ({ 
    id: a.id, 
    name: a.name, 
    managerNo: a.managerNo, 
    assignedManager: a.assignedManager 
  })));

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
        {isLoading ? (
          <EmptyStateCard>
            <EmptyStateIcon>
              <Users className="w-12 h-12 text-muted-foreground animate-pulse" />
            </EmptyStateIcon>
            <EmptyStateText>담당자 목록을 불러오는 중...</EmptyStateText>
          </EmptyStateCard>
        ) : (
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
                  <ManagerBadge>
                    {manager.assignedArtists}
                  </ManagerBadge>
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
        )}

        {!isLoading && filteredManagers.length === 0 && (
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
