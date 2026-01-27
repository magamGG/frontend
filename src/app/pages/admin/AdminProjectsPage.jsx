import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { BookOpen, Users, Calendar, AlertCircle, Plus, Search, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ProjectDetailPage } from '@/app/pages/artist/ProjectDetailPage';





export function AdminProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 필터 상태
  const [statusFilters, setStatusFilters] = useState(['전체']);
  const [selectedArtistFilter, setSelectedArtistFilter] = useState(null);

  // 정렬 상태
  const [sortType, setSortType] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // 작품 추가 폼 상태
  const [newProjectForm, setNewProjectForm] = useState({
    artistId,
    title,
    platform: '네이버 웹툰',
    genre,
    schedule,
    thumbnail,
    thumbnailFile,
  });

  // 페이지 제목 변경을 위한 헤더 업데이트
  useEffect(() => {
    const headerTitle = document.querySelector('h1.text-2xl.font-bold');
    if (headerTitle) {
      if (showDetailPage) {
        headerTitle.textContent = '프로젝트 상세';
      } else {
        headerTitle.textContent = '프로젝트 관리';
      }
    }
  }, [showDetailPage]);

  // 작가 목록 (샘플 데이터)
  const [artists] = useState([
    { id, name: '김작가' },
    { id, name: '이작가' },
    { id, name: '박작가' },
    { id, name: '최작가' },
    { id, name: '정작가' },
  ]);

  const [projects, setProjects] = useState([
    {
      id,
      title: '로맨스 판타지',
      platform: '네이버 웹툰',
      status,
      serialStatus: '연재중',
      currentEpisode,
      deadline: 'D-2',
      genre: '로맨스/판타지',
      description: '매주 일요일 업데이트. 현재 스토리보드 단계입니다.',
      schedule: '매주 일요일 오전 10시',
      thumbnail: 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400',
      artistName: '김작가',
      artistId,
    },
    {
      id,
      title: '학원물',
      platform: '카카오페이지',
      status,
      serialStatus: '연재중',
      currentEpisode,
      deadline: 'D-5',
      genre: '학원/일상',
      description: '매주 수요일 업데이트. 러프 스케치 단계입니다.',
      schedule: '매주 수요일 오후 2시',
      thumbnail: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
      artistName: '이작가',
      artistId,
    },
    {
      id,
      title: '미스터리 스릴러',
      platform: '레진코믹스',
      status,
      serialStatus: '휴재',
      currentEpisode,
      deadline: '휴재중',
      genre: '미스터리/스릴러',
      description: '2025년 3월 재연재 예정',
      schedule: '휴재중 (3월 재개 예정)',
      thumbnail: 'https://images.unsplash.com/photo-1618556662146-0c86c2466516?w=400',
      artistName: '박작가',
      artistId,
    },
    {
      id,
      title: '액션 판타지',
      platform: '네이버 시리즈',
      status,
      serialStatus: '완결',
      currentEpisode,
      deadline: '완결',
      genre: '액션/판타지',
      description: '총 120화 완결. 조회수 2.5M을 기록했습니다.',
      schedule: '완결 (2024년 12월)',
      thumbnail: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400',
      artistName: '최작가',
      artistId,
    },
    {
      id,
      title: '일상 코미디',
      platform: '카카오웹툰',
      status,
      serialStatus: '연재중',
      currentEpisode,
      deadline: 'D-7',
      genre: '일상/코미디',
      description: '매주 금요일 업데이트',
      schedule: '매주 금요일 오후 6시',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      artistName: '김작가',
      artistId,
    },
  ]);

  // localStorage에서 작품 데이터 로드
  useEffect(() => {
    const stored = localStorage.getItem('adminProjectsData');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.length > 0) {
        setProjects(data);
      }
    }
  }, []);

  // 작품 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('adminProjectsData', JSON.stringify(projects));
  }, [projects]);

  // 상태 필터 토글
  const toggleFilter = (filter) => {
    if (filter === '전체') {
      setStatusFilters(['전체']);
    } else {
      const newFilters = statusFilters.includes(filter)
        ? statusFilters.filter(f => f !== filter)
        : [...statusFilters.filter(f => f !== '전체'), filter];
      
      setStatusFilters(newFilters.length === 0 ? ['전체'] : newFilters);
    }
  };

  // 필터링된 프로젝트
  const filteredProjects = projects.filter(project => {
    // 상태 필터
    const statusMatch = statusFilters.includes('전체') || statusFilters.includes(project.serialStatus);
    
    // 작가 필터
    const artistMatch = !selectedArtistFilter || project.artistId === selectedArtistFilter;
    
    return statusMatch && artistMatch;
  });

  // 정렬 핸들러
  const handleSort = (type) => {
    if (sortType === type) {
      if (sortOrder === 'asc') {
        // 1번 클릭 → 2번 클릭: 내림차순으로 변경
        setSortOrder('desc');
      } else {
        // 2번 클릭 → 3번 클릭: 정렬 해제 (기본 업데이트 순으로)
        setSortType(null);
        setSortOrder('asc');
      }
    } else {
      // 새로운 정렬 타입이면 오름차순으로 시작
      setSortType(type);
      setSortOrder('asc');
    }
  };

  // 정렬된 프로젝트
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortType) return 0;

    if (sortType === 'name') {
      // 가나다순 정렬
      const comparison = a.title.localeCompare(b.title, 'ko');
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    if (sortType === 'deadline') {
      // 마감일자 정렬
      const getDeadlineValue = (deadline) => {
        if (deadline === '완결') return 9999;
        if (deadline === '휴재중') return 9998;
        if (deadline.startsWith('D-')) {
          const days = parseInt(deadline.substring(2));
          return days;
        }
        return 9997;
      };

      const aValue = getDeadlineValue(a.deadline);
      const bValue = getDeadlineValue(b.deadline);
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // 작품 추가 핸들러
  const handleAddProject = () => {
    if (!newProjectForm.artistId || !newProjectForm.title || !newProjectForm.genre) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const selectedArtist = artists.find(a => a.id === newProjectForm.artistId);
    if (!selectedArtist) {
      toast.error('작가를 선택해주세요.');
      return;
    }

    const newProject = {
      id: Date.now(),
      title: newProjectForm.title,
      platform: newProjectForm.platform,
      status,
      serialStatus: '연재중',
      currentEpisode,
      deadline: 'D-7',
      genre: newProjectForm.genre,
      schedule: newProjectForm.schedule || '미정',
      thumbnail: newProjectForm.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400',
      artistName: selectedArtist.name,
      artistId: newProjectForm.artistId,
    };

    setProjects([...projects, newProject]);
    setIsAddModalOpen(false);
    setNewProjectForm({
      artistId,
      title,
      platform: '네이버 웹툰',
      genre,
      schedule,
      thumbnail,
      thumbnailFile,
    });
    toast.success('작품이 추가되었습니다.');
  };

  // 썸네일 파일 선택 핸들러
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일을 읽어서 미리보기 URL 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        setNewProjectForm({
          ...newProjectForm,
          thumbnail,
          thumbnailFile,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowDetailPage(true);
  };

  // 통계 계산
  const stats = {
    totalArtists: new Set(projects.map(p => p.artistId)).size, // 팀당 작가 수
    totalProjects: projects.length, // 담당 프로젝트 수
    todayDeadlines: projects.filter(p => 
      p.deadline.includes('D-0') || p.deadline.includes('D-1') || p.deadline.includes('D-2')
    ).slice(0, 3).length, // 오늘 마감 작품 3개
  };

  // 상태별 배지 색상
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case '연재중':
        return 'bg-green-500 hover:bg-green-600';
      case '휴재':
        return 'bg-orange-500 hover:bg-orange-600';
      case '완결':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      {/* 작품 상세 페이지 표시 */}
      {showDetailPage && selectedProject ? (
        <ProjectDetailPage 
          project={selectedProject} 
          onBack={() => setShowDetailPage(false)} 
        />
      ) : (
        /* 작품 목록 표시 */
        <div className="pb-24 px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">프로젝트 관리</h1>
                <p className="text-sm text-muted-foreground mt-1">담당 작가들의 작품을 관리하세요</p>
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                프로젝트 추가
              </Button>
            </div>

            {/* 상단 통계 카드 - 3개만 표시 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">팀당 작가 수</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalArtists}명</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">담당 프로젝트 수</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.totalProjects}개</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">오늘 마감 작품</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stats.todayDeadlines}개</p>
              </Card>
            </div>

            {/* 필터 영역 */}
            <Card className="p-4 mb-6">
              <div className="space-y-4">
                {/* 작가 카테고리 탭 */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">작가:</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedArtistFilter === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedArtistFilter(null)}
                      className={selectedArtistFilter === null ? 'bg-primary' : ''}
                    >
                      전체
                    </Button>
                    {artists.map((artist) => (
                      <Button
                        key={artist.id}
                        variant={selectedArtistFilter === artist.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedArtistFilter(artist.id)}
                        className={selectedArtistFilter === artist.id ? 'bg-primary' : ''}
                      >
                        {artist.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 구분선 */}
                <div className="w-full border-t border-border" />

                {/* 작품 상태 필터 & 정렬 */}
                <div className="flex items-center justify-between">
                  {/* 작품 상태 필터 */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">상태:</span>
                    <div className="flex gap-2">
                      {['전체', '연재중', '휴재', '완결'].map((filter) => (
                        <Button
                          key={filter}
                          variant={statusFilters.includes(filter) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleFilter(filter)}
                          className={statusFilters.includes(filter) ? getStatusBadgeColor(filter === '전체' ? '' : filter) {filter}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 정렬 */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">정렬:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={sortType === 'name' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1"
                      >
                        가나다순
                        {sortType === 'name' && (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                        {sortType === 'name' && (
                          <span className="text-xs ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </Button>
                      <Button
                        variant={sortType === 'deadline' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSort('deadline')}
                        className="flex items-center gap-1"
                      >
                        마감일순
                        {sortType === 'deadline' && (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                        {sortType === 'deadline' && (
                          <span className="text-xs ml-1">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 작품 리스트 */}
            <div className="space-y-4 max-h-[calc(100vh-420px)] overflow-y-auto pr-2">
              {sortedProjects.map((project) => (
                <Card 
                  key={project.id}
                  className="p-5 cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex items-center gap-5">
                    {/* 왼쪽: 썸네일 */}
                    <div className="flex-shrink-0">
                      <ImageWithFallback
                        src={project.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400'}
                        alt={project.title}
                        className="w-24 h-32 object-cover rounded-md border-2 border-border"
                      />
                    </div>

                    {/* 가운데: 작품 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {project.artistName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.genre}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-foreground">
                          <BookOpen className="w-3 h-3 inline mr-1" />
                          {project.platform}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-foreground">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {project.schedule}
                        </span>
                      </div>
                    </div>

                    {/* 오른쪽: 상태 정보 */}
                    <div className="flex-shrink-0 text-right space-y-2">
                      <Badge className={getStatusBadgeColor(project.serialStatus)}>
                        {project.serialStatus}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        현재 {project.currentEpisode}화
                      </p>
                      <p className="text-xs text-muted-foreground">
                        마감: {project.deadline}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {sortedProjects.length === 0 && (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">해당 조건의 작품이 없습니다</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 작품 추가 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="프로젝트 추가"
      >
        <div className="space-y-4">
          {/* 작가 선택 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              작가 선택 <span className="text-red-500">*</span>
            </label>
            <select
              value={newProjectForm.artistId}
              onChange={(e) => setNewProjectForm({ ...newProjectForm, artistId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value={0}>작가를 선택하세요</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          {/* 프로젝트명 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              프로젝트명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newProjectForm.title}
              onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
              placeholder="프로젝트명을 입력하세요"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>

          {/* 장르 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              장르 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newProjectForm.genre}
              onChange={(e) => setNewProjectForm({ ...newProjectForm, genre: e.target.value })}
              placeholder="예: 로맨스/판타지"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>

          {/* 플랫폼 선택 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              플랫폼 <span className="text-red-500">*</span>
            </label>
            <select
              value={newProjectForm.platform}
              onChange={(e) => setNewProjectForm({ ...newProjectForm, platform: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option>네이버 웹툰</option>
              <option>카카오페이지</option>
              <option>카카오웹툰</option>
              <option>레진코믹스</option>
              <option>네이버 시리즈</option>
              <option>리디북스</option>
              <option>탑툰</option>
            </select>
          </div>

          {/* 연재 일정 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              연재 일정
            </label>
            <input
              type="text"
              value={newProjectForm.schedule}
              onChange={(e) => setNewProjectForm({ ...newProjectForm, schedule: e.target.value })}
              placeholder="예: 매주 일요일 오전 10시"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>

          {/* 썸네일 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              썸네일 첨부 (선택)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {newProjectForm.thumbnail && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">미리보기:</p>
                <ImageWithFallback
                  src={newProjectForm.thumbnail}
                  alt="썸네일 미리보기"
                  className="w-24 h-32 object-cover rounded-md border-2 border-border"
                />
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleAddProject}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              등록
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}