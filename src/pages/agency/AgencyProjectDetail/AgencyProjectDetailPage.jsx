import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  Briefcase,
  MessageSquare,
  Circle,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { getProjectThumbnailUrl, getMemberProfileUrl, PROJECT_THUMBNAIL_PLACEHOLDER, MEMBER_AVATAR_PLACEHOLDER } from '@/api/config';
import { projectService } from '@/api/services';
import { toast } from 'sonner';
import {
  AgencyProjectDetailRoot,
  AgencyProjectDetailBody,
  BackButtonContainer,
  ProjectHeaderCard,
  ProjectHeaderContent,
  ProjectThumbnail,
  ProjectInfo,
  ProjectTitle,
  ProjectArtist,
  ProjectBadges,
  ProjectTeamSection,
  ProjectTeamHeader,
  ProjectManagementSection,
  ProjectManagementTitle,
  KanbanBoardsContainer,
  WeeklyScheduleSection,
  WeeklyScheduleTitle,
  WeeklyScheduleListScroll,
  ReadOnlyCard,
  ReadOnlyCardHeader,
  ReadOnlyCardHeaderContent,
  ReadOnlyCardTitle,
  ReadOnlyCardDescription,
  ReadOnlyCardFooter,
  ReadOnlyCardFooterLeft,
  ReadOnlyCardDate,
  ReadOnlyCardAssignee,
  ReadOnlyCardComments,
  ReadOnlyBoard,
  ReadOnlyBoardTitleContainer,
  ReadOnlyBoardTitle,
  ReadOnlyBoardCards,
  ContentGrid,
  ContentGridLeft,
  ContentGridRight,
} from './AgencyProjectDetailPage.styled';

// 읽기 전용 카드 컴포넌트
function ReadOnlyCardComponent({ card }) {
  const commentCount = card.comments?.length || 0;

  return (
    <ReadOnlyCard>
      <ReadOnlyCardHeader>
        <ReadOnlyCardHeaderContent>
        {card.completed && (
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
        )}
        <ReadOnlyCardTitle>{card.title}</ReadOnlyCardTitle>
        </ReadOnlyCardHeaderContent>
      </ReadOnlyCardHeader>
      <ReadOnlyCardDescription>{card.description}</ReadOnlyCardDescription>
      <ReadOnlyCardFooter>
        <ReadOnlyCardFooterLeft>
          <ReadOnlyCardDate>
            <Calendar className="w-3 h-3" />
            <span>{card.dueDate}</span>
          </ReadOnlyCardDate>
          {card.assignedTo && (
            <ReadOnlyCardAssignee>
              <Users className="w-3 h-3" />
              <span>{card.assignedTo.name}</span>
            </ReadOnlyCardAssignee>
          )}
        </ReadOnlyCardFooterLeft>
        {commentCount > 0 && (
          <ReadOnlyCardComments>
            <MessageSquare className="w-3 h-3" />
            <span>{commentCount}</span>
          </ReadOnlyCardComments>
        )}
      </ReadOnlyCardFooter>
    </ReadOnlyCard>
  );
}

// 읽기 전용 보드 컴포넌트
function ReadOnlyBoardComponent({ board }) {
  return (
    <ReadOnlyBoard>
      <ReadOnlyBoardTitleContainer>
      <ReadOnlyBoardTitle>{board.title}</ReadOnlyBoardTitle>
      </ReadOnlyBoardTitleContainer>
      <ReadOnlyBoardCards>
        {board.cards.map((card) => (
          <ReadOnlyCardComponent key={card.id} card={card} />
        ))}
      </ReadOnlyBoardCards>
    </ReadOnlyBoard>
  );
}

export function AgencyProjectDetailPage({ project, onBack }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);

  // PROJECT_NO(project.id)로 PROJECT_MEMBER 조회
  useEffect(() => {
    if (!project?.id) return;
    const fetchMembers = async () => {
      setTeamMembersLoading(true);
      try {
        const result = await projectService.getProjectMembers(project.id);
        const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
        setTeamMembers(
          list.map((m) => ({
            id: m.memberNo,
            name: m.memberName || m.memberEmail || '-',
            role: m.projectMemberRole || '-',
            email: m.memberEmail || '',
            phone: m.memberPhone || '',
            status: m.todayAttendanceStatus || (m.memberStatus === '휴면' ? '휴면' : '작업 시작 전'),
            avatar: getMemberProfileUrl(m.memberProfileImage),
          }))
        );
      } catch (err) {
        toast.error('팀원 목록을 불러오는데 실패했습니다.');
        setTeamMembers([]);
      } finally {
        setTeamMembersLoading(false);
      }
    };
    fetchMembers();
  }, [project?.id]);

  // PROJECT_NO(project.id)로 KANBAN_BOARD, KANBAN_CARD 조회 (읽기 전용)
  const [boards, setBoards] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(false);

  useEffect(() => {
    if (!project?.id) return;
    const fetchBoards = async () => {
      setBoardsLoading(true);
      try {
        const result = await projectService.getKanbanBoard(project.id);
        const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
        const mapped = list.map((b) => ({
          id: b.id,
          title: b.title || '',
          cards: (b.cards || []).map((c) => ({
            id: c.id,
            title: c.title || '',
            description: c.description || '',
            startDate: c.startDate || '',
            dueDate: c.dueDate || '',
            boardId: c.boardId ?? b.id,
            completed: !!c.completed,
            assignedTo: c.assignedTo
              ? {
                  id: c.assignedTo.id,
                  name: c.assignedTo.name,
                  role: c.assignedTo.role,
                  email: c.assignedTo.email,
                  avatar: getMemberProfileUrl(c.assignedTo.avatar),
                }
              : null,
          })),
        }));
        setBoards(mapped);
      } catch (err) {
        toast.error('업무 보드를 불러오는데 실패했습니다.');
        setBoards([]);
      } finally {
        setBoardsLoading(false);
      }
    };
    fetchBoards();
  }, [project?.id]);

  // 주간 업무 내역: 담당자 프로젝트 상세(ProjectDetail) '남은 마감일' 카드와 동일 구조. 마감일 임박 순, D-n 표시, 기간 지난 것은 제외
  const weeklyWorkList = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const items = [];
    boards.forEach((board) => {
      (board.cards || []).forEach((card) => {
        const dueStr = card.dueDate ? String(card.dueDate).slice(0, 10) : null;
        if (!dueStr) return;
        const dueDate = new Date(dueStr);
        dueDate.setHours(0, 0, 0, 0);
        const diffMs = dueDate - today;
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return;
        const dLabel = diffDays === 0 ? 'D-Day' : `D-${diffDays}`;
        const dateStr = `${dueDate.getMonth() + 1}/${dueDate.getDate()}`;
        const assigneeName = card.assignedTo?.name || '';
        items.push({
          id: `${board.id}-${card.id}`,
          title: card.title,
          assigneeName,
          dueDate: dueStr,
          dateStr,
          dLabel,
        });
      });
    });
    items.sort((a, b) => (a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0));
    return items;
  }, [boards]);

  // 모달 상태
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // 담당자 배치 모달
  const [isAssignManagerModalOpen, setIsAssignManagerModalOpen] = useState(false);
  const [assignableManagers, setAssignableManagers] = useState([]);
  const [assignableManagersLoading, setAssignableManagersLoading] = useState(false);
  const [selectedAssignableManager, setSelectedAssignableManager] = useState(null);
  const [assigningManager, setAssigningManager] = useState(false);

  const refreshProjectData = async () => {
    if (!project?.id) return;
    try {
      const [membersRes, boardsRes] = await Promise.all([
        projectService.getProjectMembers(project.id),
        projectService.getKanbanBoard(project.id),
      ]);
      const memberList = Array.isArray(membersRes) ? membersRes : membersRes?.content ?? membersRes?.data ?? [];
      setTeamMembers(
        memberList.map((m) => ({
          id: m.memberNo,
          name: m.memberName || m.memberEmail || '-',
          role: m.projectMemberRole || '-',
          email: m.memberEmail || '',
          phone: m.memberPhone || '',
          status: m.todayAttendanceStatus || (m.memberStatus === '휴면' ? '휴면' : '작업 시작 전'),
          avatar: getMemberProfileUrl(m.memberProfileImage),
        }))
      );
      const boardList = Array.isArray(boardsRes) ? boardsRes : boardsRes?.content ?? boardsRes?.data ?? [];
      setBoards(
        boardList.map((b) => ({
          id: b.id,
          title: b.title || '',
          cards: (b.cards || []).map((c) => ({
            id: c.id,
            title: c.title || '',
            description: c.description || '',
            startDate: c.startDate || '',
            dueDate: c.dueDate || '',
            boardId: c.boardId ?? b.id,
            completed: !!c.completed,
            assignedTo: c.assignedTo
              ? {
                  id: c.assignedTo.id,
                  name: c.assignedTo.name,
                  role: c.assignedTo.role,
                  email: c.assignedTo.email,
                  avatar: getMemberProfileUrl(c.assignedTo.avatar),
                }
              : null,
          })),
        }))
      );
    } catch (e) {
      toast.error('데이터를 새로고침하는데 실패했습니다.');
    }
  };

  const openAssignManagerModal = async () => {
    setIsAssignManagerModalOpen(true);
    setAssignableManagers([]);
    setSelectedAssignableManager(null);
    setAssignableManagersLoading(true);
    try {
      const result = await projectService.getAssignableManagers(project.id);
      const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
      setAssignableManagers(list);
    } catch (err) {
      toast.error('배치 가능 담당자 목록을 불러오는데 실패했습니다.');
      setAssignableManagers([]);
    } finally {
      setAssignableManagersLoading(false);
    }
  };

  const handleAssignManager = async () => {
    if (!selectedAssignableManager?.managerNo) {
      toast.error('담당자를 선택해주세요.');
      return;
    }
    setAssigningManager(true);
    try {
      await projectService.assignManagerToProject(project.id, selectedAssignableManager.managerNo);
      toast.success('담당자가 성공적으로 배치되었습니다.');
      setIsAssignManagerModalOpen(false);
      setSelectedAssignableManager(null);
      await refreshProjectData();
    } catch (err) {
      toast.error(err?.response?.data?.message || '담당자 배치에 실패했습니다.');
    } finally {
      setAssigningManager(false);
    }
  };

  // 상태별 배지 색상 (작업중/작업 종료/작업 시작 전 + 휴면 등)
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case '작업중':
        return 'bg-green-500 hover:bg-green-600';
      case '작업 종료':
        return 'bg-blue-500 hover:bg-blue-600';
      case '작업 시작 전':
        return 'bg-amber-500 hover:bg-amber-600';
      case '휴면':
        return 'bg-gray-500 hover:bg-gray-600';
      case '워케이션':
        return 'bg-red-500 hover:bg-red-600';
      case '재택근무':
        return 'bg-blue-500 hover:bg-blue-600';
      case '출근':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <AgencyProjectDetailRoot>
      <AgencyProjectDetailBody>
        {/* 상단 헤더 */}
        <BackButtonContainer>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            프로젝트 목록으로
          </Button>
        </BackButtonContainer>

        <ProjectHeaderCard>
          <ProjectHeaderContent>
            {/* 작품 표지 */}
            <ProjectThumbnail>
              <ImageWithFallback
                src={getProjectThumbnailUrl(project.thumbnail) || PROJECT_THUMBNAIL_PLACEHOLDER}
                alt={project.title}
                className="w-32 h-44 object-cover rounded-lg border-2 border-border shadow-md"
              />
            </ProjectThumbnail>

            {/* 작품 정보 */}
            <ProjectInfo>
              <ProjectTitle>{project.title}</ProjectTitle>

              {/* 작가명 */}
              {project.artistName && (
                <ProjectArtist>작가: {project.artistName}</ProjectArtist>
              )}
              
              <ProjectBadges>
                <Badge className="bg-primary text-sm px-3 py-1">{project.platform}</Badge>
                <Badge className="bg-green-500 text-sm px-3 py-1">{project.serialStatus}</Badge>
              </ProjectBadges>

              {/* 팀원 정보 */}
              <ProjectTeamSection>
                <ProjectTeamHeader>
                  <Users className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                  <span style={{ color: 'var(--foreground)', fontSize: '0.875rem' }}>
                    팀원 ({teamMembersLoading ? '...' : `${teamMembers.length}명`})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTeamModalOpen(true)}
                    disabled={teamMembersLoading}
                    style={{ 
                      marginLeft: '8px',
                      backgroundColor: 'var(--muted)',
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    팀원 보기
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openAssignManagerModal}
                    disabled={teamMembersLoading || teamMembers.some((m) => m.role === '담당자')}
                    title={teamMembers.some((m) => m.role === '담당자') ? '이미 담당자가 배정된 프로젝트입니다' : '담당자 배치'}
                    style={{ 
                      marginLeft: '8px',
                      backgroundColor: teamMembers.some((m) => m.role === '담당자') ? 'var(--muted)' : 'var(--primary)',
                      color: teamMembers.some((m) => m.role === '담당자') ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                      borderColor: teamMembers.some((m) => m.role === '담당자') ? 'var(--border)' : 'var(--primary)'
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    담당자 배치
                  </Button>
                </ProjectTeamHeader>
              </ProjectTeamSection>
            </ProjectInfo>
          </ProjectHeaderContent>
        </ProjectHeaderCard>

        <ContentGrid>
          {/* 왼쪽 열: 프로젝트 관리 (칸반 보드) */}
          <ContentGridLeft>
            <ProjectManagementSection>
              <ProjectManagementTitle>업무 일정 보드</ProjectManagementTitle>

              <KanbanBoardsContainer>
                {boardsLoading ? (
                  <p className="text-sm text-muted-foreground">업무 보드 불러오는 중...</p>
                ) : boards.length === 0 ? (
                  <p className="text-sm text-muted-foreground">등록된 보드가 없습니다.</p>
                ) : (
                  boards.map((board) => (
                    <ReadOnlyBoardComponent key={board.id} board={board} />
                  ))
                )}
              </KanbanBoardsContainer>
            </ProjectManagementSection>
          </ContentGridLeft>

          {/* 오른쪽 열: 주간 업무 내역 (마감일 임박 순) */}
          <ContentGridRight>
            <WeeklyScheduleSection>
              <WeeklyScheduleTitle>주간 업무 내역</WeeklyScheduleTitle>

              <WeeklyScheduleListScroll>
                {weeklyWorkList.length === 0 ? null : (
                  weeklyWorkList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border-l-4 bg-muted/20"
                      style={{ borderLeftColor: 'var(--primary)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-foreground">마감일 {item.dateStr}</span>
                        <span className="text-xs font-medium text-primary">{item.dLabel}</span>
                      </div>
                      <p className="text-xs text-foreground">
                        • {item.title}
                        {item.assigneeName && <span className="text-muted-foreground"> ({item.assigneeName})</span>}
                      </p>
                    </div>
                  ))
                )}
              </WeeklyScheduleListScroll>
            </WeeklyScheduleSection>
          </ContentGridRight>
        </ContentGrid>
      </AgencyProjectDetailBody>

      {/* 팀원 모달 */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          setSelectedMember(null);
        }}
        title="팀원 보기"
        maxWidth="md"
      >
        <div>
          {/* 팀원 목록 */}
          <div className="space-y-0 divide-y divide-border">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="py-3 px-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  {/* 프로필 사진 */}
                  <ImageWithFallback
                    src={member.avatar || MEMBER_AVATAR_PLACEHOLDER}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  
                  {/* 이름과 역할 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>

                  {/* 현재 상태 */}
                  <Badge className={`${getStatusBadgeColor(member.status)} text-xs px-2 py-1`}>
                    {member.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* 팀원 프로필 상세 모달 */}
      <Modal
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
        title="팀원 프로필"
        maxWidth="md"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={selectedMember.avatar || MEMBER_AVATAR_PLACEHOLDER}
                alt={selectedMember.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">{selectedMember.name}</h3>
                <Badge className={getStatusBadgeColor(selectedMember.status)}>
                  {selectedMember.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">직무</p>
                  <p className="text-sm font-medium text-foreground">{selectedMember.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">이메일</p>
                  <p className="text-sm font-medium text-foreground">{selectedMember.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">전화번호</p>
                  <p className="text-sm font-medium text-foreground">{selectedMember.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 담당자 배치 모달 */}
      <Modal
        isOpen={isAssignManagerModalOpen}
        onClose={() => {
          setIsAssignManagerModalOpen(false);
          setSelectedAssignableManager(null);
        }}
        title="담당자 배치"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            프로젝트 작가와 연결된 담당자만 배치 가능합니다. 새 담당자를 선택하면 기존 담당자의 업무가 자동으로 이관됩니다.
          </p>
          {assignableManagersLoading ? (
            <p className="text-sm text-muted-foreground">배치 가능 담당자 목록을 불러오는 중...</p>
          ) : assignableManagers.length === 0 ? (
            <p className="text-sm text-muted-foreground">배치 가능한 담당자가 없습니다. 작가에게 배정된 담당자가 있는지 확인해주세요.</p>
          ) : (
            <>
              <div className="space-y-0 divide-y divide-border max-h-64 overflow-y-auto">
                {assignableManagers.map((m) => (
                  <div
                    key={m.managerNo}
                    onClick={() => setSelectedAssignableManager(m)}
                    className={`py-3 px-3 flex items-center gap-3 cursor-pointer transition-colors ${selectedAssignableManager?.managerNo === m.managerNo ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/30'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{m.memberName || '-'}</p>
                      <p className="text-xs text-muted-foreground">담당자 No. {m.managerNo}</p>
                    </div>
                    {selectedAssignableManager?.managerNo === m.managerNo && (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAssignManagerModalOpen(false)}>
                  취소
                </Button>
                <Button
                  onClick={handleAssignManager}
                  disabled={!selectedAssignableManager || assigningManager}
                >
                  {assigningManager ? '배치 중...' : '담당자 배치'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </AgencyProjectDetailRoot>
  );
}
