import { useState, useEffect, useMemo, useRef } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  X, 
  Calendar, 
  Mail, 
  Phone, 
  Briefcase,
  Trash2,
  Edit,
  Save,
  XCircle,
  MessageSquare,
  Circle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { projectService, memberService } from '@/api/services';
import useAuthStore from '@/store/authStore';
import { getProjectThumbnailUrl, getMemberProfileUrl, PROJECT_THUMBNAIL_PLACEHOLDER, MEMBER_AVATAR_PLACEHOLDER } from '@/api/config';
import { useDrag, useDrop } from 'react-dnd';
import { DraggableCardContainer } from './ProjectDetailPage.styled';

/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {string} title
 * @property {string} platform
 * @property {'연재' | '휴재' | '완결'} serialStatus
 * @property {number} currentEpisode
 * @property {string} [thumbnail]
 * @property {string} [artistName]
 */

/**
 * @typedef {Object} TeamMember
 * @property {number} id
 * @property {string} name
 * @property {string} role
 * @property {string} email
 * @property {string} phone
 * @property {'출근' | '워케이션' | '휴재' | '재택근무'} status
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} AvailableMember
 * @property {number} id
 * @property {string} name
 * @property {string} role
 * @property {string} email
 * @property {string} phone
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} KanbanCard
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} startDate
 * @property {string} dueDate
 * @property {number} boardId
 * @property {boolean} [completed]
 * @property {Comment[]} [comments]
 * @property {TeamMember | null} [assignedTo]
 */

/**
 * @typedef {Object} Comment
 * @property {number} id
 * @property {string} author
 * @property {string} content
 * @property {string} createdAt
 * @property {string} [role]
 */

/**
 * @typedef {Object} KanbanBoard
 * @property {number} id
 * @property {string} title
 * @property {KanbanCard[]} cards
 */

/**
 * @typedef {Object} WeeklySchedule
 * @property {string} date
 * @property {string} day
 * @property {string[]} events
 */

const ITEM_TYPE = 'KANBAN_CARD';

/**
 * @param {Object} props
 * @param {KanbanCard} props.card
 * @param {(card: KanbanCard) => void} props.onEdit
 * @param {(card: KanbanCard) => void} props.onRequestDeleteCard
 * @param {(cardId: number) => void} props.onToggleComplete
 * @param {string} props.projectColor
 */
function DraggableCard({ 
  card, 
  onEdit, 
  onRequestDeleteCard,
  onToggleComplete,
  projectColor
}) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: card.id, boardId: card.boardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    if (onToggleComplete) {
      onToggleComplete(card.id);
    }
  };

  return (
    <DraggableCardContainer
      ref={drag}
      $borderColor={projectColor}
      $isDragging={isDragging}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        {/* 체크 버튼과 제목 */}
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            onClick={handleToggleComplete}
            className="flex-shrink-0 mt-0.5 text-muted-foreground hover:text-green-600 transition-colors"
            aria-label={card.completed ? '완료 취소' : '완료 표시'}
          >
            {card.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <h4 className="font-semibold text-sm text-foreground flex-1 break-words">{card.title}</h4>
        </div>

        {/* 편집/삭제 버튼 */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="text-muted-foreground hover:text-primary p-1"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestDeleteCard?.(card);
            }}
            className="text-muted-foreground hover:text-destructive p-1"
            title="카드 삭제"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        <span>{card.dueDate}</span>
      </div>
      {card.assignedTo && (
        <div className="flex items-center gap-1 text-xs text-[#6E8FB3] mt-2 bg-[#6E8FB3]/10 px-2 py-1 rounded">
          <Users className="w-3 h-3" />
          <span className="font-medium">{card.assignedTo.name}</span>
        </div>
      )}
    </DraggableCardContainer>
  );
}

/**
 * @param {Object} props
 * @param {KanbanBoard} props.board
 * @param {(cardId: number, sourceBoardId: number, targetBoardId: number) => void} props.onCardDrop
 * @param {(card: KanbanCard) => void} props.onEdit
 * @param {(card: KanbanCard) => void} props.onRequestDeleteCard
 * @param {(cardId: number) => void} props.onToggleComplete
 * @param {(boardId: number) => void} props.onAddCard
 * @param {(board: { id: number, title: string }) => void} props.onRequestDeleteBoard
 * @param {string} props.projectColor
 */
function DroppableBoard({
  board,
  onCardDrop,
  onEdit,
  onRequestDeleteCard,
  onToggleComplete,
  onAddCard,
  onRequestDeleteBoard,
  projectColor
}) {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item) => {
      if (item.boardId !== board.id) {
        onCardDrop(item.id, item.boardId, board.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-muted/30 rounded-lg p-4 min-w-[280px] max-w-[280px] flex-shrink-0 flex flex-col ${
        isOver ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="font-bold text-foreground">{board.title}</h3>
        <button
          onClick={() => onRequestDeleteBoard?.(board)}
          className="text-muted-foreground hover:text-destructive p-1"
          title="보드 삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2 mb-3 overflow-y-auto pr-1 flex-1">
        {board.cards.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            onEdit={onEdit}
            onRequestDeleteCard={onRequestDeleteCard}
            onToggleComplete={onToggleComplete}
            projectColor={projectColor}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full flex-shrink-0"
        onClick={() => onAddCard(board.id)}
      >
        <Plus className="w-4 h-4 mr-2" />
        카드 추가
      </Button>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {Project} props.project
 * @param {() => void} props.onBack
 * @param {(updatedProject: Project) => void} [props.onProjectUpdate] - 저장 후 호출 (목록 갱신용)
 * @param {() => void} [props.onProjectDelete] - 삭제 후 호출
 * @param {boolean} [props.isArtistView]
 */
export function ProjectDetailPage({ 
  project, 
  onBack,
  onProjectUpdate,
  onProjectDelete,
  isArtistView = false,
}) {
  const { user } = useAuthStore();

  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  const [isSaving, setIsSaving] = useState(false);

  // DB 색상 문자열 → hex 매핑 (기본색 등)
  const resolveProjectColor = (c) => {
    if (!c) return '#6E8FB3';
    if (c.startsWith('#')) return c;
    const nameToHex = { 기본색: '#6E8FB3', 블루: '#6E8FB3', 퍼플: '#9B59B6', 그린: '#27AE60', 오렌지: '#E67E22', 레드: '#E74C3C', 핑크: '#EC407A', 브라운: '#8D6E63', 인디고: '#5C6BC0', 틸: '#26A69A', 라임: '#9CCC65', 앰버: '#FFA726', 그레이: '#78909C' };
    return nameToHex[c] || '#6E8FB3';
  };
  const [projectColor, setProjectColor] = useState(() => resolveProjectColor(project?.projectColor));
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    setProjectColor(resolveProjectColor(project?.projectColor));
  }, [project?.id, project?.projectColor]);

  // 색상 팔레트 (구글 캘린더 스타일)
  const colorPalette = [
    { name: '블루', color: '#6E8FB3' },
    { name: '퍼플', color: '#9B59B6' },
    { name: '그린', color: '#27AE60' },
    { name: '오렌지', color: '#E67E22' },
    { name: '레드', color: '#E74C3C' },
    { name: '핑크', color: '#EC407A' },
    { name: '브라운', color: '#8D6E63' },
    { name: '인디고', color: '#5C6BC0' },
    { name: '틸', color: '#26A69A' },
    { name: '라임', color: '#9CCC65' },
    { name: '앰버', color: '#FFA726' },
    { name: '그레이', color: '#78909C' },
  ];

  // 팀원 데이터 (DB PROJECT_MEMBER에서 조회)
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
            projectMemberNo: m.projectMemberNo,
            name: m.memberName || m.memberEmail || '-',
            role: m.projectMemberRole || m.memberRole || '-',
            projectMemberRole: m.projectMemberRole || '',
            memberRole: m.memberRole || '',
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

  // 현재 사용자의 이 프로젝트 내 역할 (PROJECT_MEMBER_ROLE) — 담당자일 때만 팀원 추가/삭제 노출
  const currentUserProjectRole = useMemo(() => {
    if (!user?.memberNo || !teamMembers?.length) return null;
    const me = teamMembers.find((m) => m.id === user.memberNo);
    return me?.projectMemberRole || me?.role || null;
  }, [user?.memberNo, teamMembers]);
  const isManagerRole = currentUserProjectRole === '담당자';

  // 로그인 회원의 배정 작가 (MANAGER·ARTIST_ASSIGNMENT) — 작가명 SELECT 옵션
  const [assignedArtists, setAssignedArtists] = useState([]);
  const [assignedArtistsLoading, setAssignedArtistsLoading] = useState(false);
  useEffect(() => {
    if (!user?.memberNo) return;
    const fetchArtists = async () => {
      setAssignedArtistsLoading(true);
      try {
        const result = await memberService.getMyAssignedArtists();
        const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
        setAssignedArtists(list.map((m) => ({ id: m.memberNo, name: m.memberName || m.memberEmail || '-' })));
      } catch {
        setAssignedArtists([]);
      } finally {
        setAssignedArtistsLoading(false);
      }
    };
    fetchArtists();
  }, [user?.memberNo]);

  // 추가 가능한 팀원 (DB: MEMBER_ROLE != 담당자/작가, 프로젝트 미소속)
  const [availableMembers, setAvailableMembers] = useState([]);
  const [addableMembersLoading, setAddableMembersLoading] = useState(false);
  const [isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen] = useState(false);

  // 팀원 추가 모달 열릴 때 추가 가능 회원 API 조회
  useEffect(() => {
    if (!isAddTeamMemberModalOpen || !project?.id) return;
    const fetchAddable = async () => {
      setAddableMembersLoading(true);
      try {
        const result = await projectService.getAddableMembers(project.id);
        const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
        setAvailableMembers(
          list.map((m) => ({
            id: m.memberNo,
            name: m.memberName || m.memberEmail || '-',
            role: m.memberRole || m.projectMemberRole || '-',
            email: m.memberEmail || '',
            phone: m.memberPhone || '',
            avatar: getMemberProfileUrl(m.memberProfileImage),
          }))
        );
      } catch (err) {
        toast.error('추가 가능한 팀원 목록을 불러오는데 실패했습니다.');
        setAvailableMembers([]);
      } finally {
        setAddableMembersLoading(false);
      }
    };
    fetchAddable();
  }, [isAddTeamMemberModalOpen, project?.id]);

  // PROJECT_NO(project.id)로 KANBAN_BOARD, KANBAN_CARD 조회
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
            createdAt: c.createdAt || null,
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

  // 보드 상태를 localStorage에 저장하는 함수 (로컬 편집용 - 추후 API 연동 시 대체)
  const saveBoardsToLocalStorage = (updatedBoards) => {
    localStorage.setItem(`kanban_boards_${project?.id}`, JSON.stringify(updatedBoards));
  };

  // KANBAN_CARD 마감일(kanban_card_ended_at) 내림차순 목록 + D-n 표시 (기간 지난 마감일 제외)
  const dueDateSortedCards = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const items = [];
    boards.forEach((board) => {
      (board.cards || []).forEach((card) => {
        const dueStr = card.dueDate ? String(card.dueDate).slice(0, 10) : null;
        if (!dueStr) return;
        const dueDate = new Date(dueStr);
        dueDate.setHours(0, 0, 0, 0);
        const diffMs = dueDate - today;
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        // 기간 지난 마감일(diffDays < 0)은 목록에서 제외
        if (diffDays < 0) return;
        let dLabel;
        if (diffDays === 0) dLabel = 'D-Day';
        else dLabel = `D-${diffDays}`;
        const dateStr = `${dueDate.getMonth() + 1}/${dueDate.getDate()}`;
        const dayName = dayNames[dueDate.getDay()];
        items.push({
          card,
          dueStr,
          dueDate,
          dLabel,
          dateStr,
          dayName,
          assigneeName: card.assignedTo?.name || '',
        });
      });
    });
    // kanban_card_ended_at(마감일) 내림차순
    items.sort((a, b) => (a.dueStr > b.dueStr ? 1 : a.dueStr < b.dueStr ? -1 : 0));
    return items;
  }, [boards]);

  // 모달 상태
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [isTeamEditMode, setIsTeamEditMode] = useState(false);
  const [editingTeamMembers, setEditingTeamMembers] = useState([]);
  
  // 코멘트 관련 상태
  const [newComment, setNewComment] = useState('');
  const [cardComments, setCardComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  
  // 담당자 선택 상태 (아티스트 뷰용)
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  
  const [cardForm, setCardForm] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
  });

  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
  const [pendingDeleteBoard, setPendingDeleteBoard] = useState(null);
  const [pendingDeleteCard, setPendingDeleteCard] = useState(null);
  const [pendingDeleteComment, setPendingDeleteComment] = useState(null);
  const [pendingDeleteTeamMember, setPendingDeleteTeamMember] = useState(null);

  // 편집 모드 토글
  const handleToggleEditMode = async () => {
    if (isEditMode) {
      // 저장 - API 호출
      setIsSaving(true);
      try {
        const startDateStr = editedProject.startDate
          ? (typeof editedProject.startDate === 'string' && editedProject.startDate.length >= 10
              ? editedProject.startDate.slice(0, 10)
              : null)
          : null;
        const payload = {
          projectName: editedProject.title,
          projectStatus: editedProject.serialStatus || '연재',
          projectColor: projectColor || '기본색',
          platform: editedProject.platform,
          projectGenre: editedProject.genre || undefined,
          projectCycle: editedProject.scheduleDays ? Number(editedProject.scheduleDays) : undefined,
          projectStartedAt: startDateStr ? `${startDateStr}T00:00:00` : undefined,
          thumbnailFile: editedProject.thumbnail || undefined,
          artistMemberNo: editedProject.artistId ?? undefined,
        };
        const data = await projectService.updateProject(project.id, payload);
        const savedStartDateStr = data?.projectStartedAt ? String(data.projectStartedAt).slice(0, 10) : null;
        const scheduleDays = data?.projectCycle ?? null;
        const deadlineDn = (() => {
          if (!savedStartDateStr || !scheduleDays) return '미정';
          const start = new Date(savedStartDateStr);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          start.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
          if (daysDiff < 0) return '미정';
          const cyclesPassed = Math.floor(daysDiff / scheduleDays);
          const nextDate = new Date(start);
          nextDate.setDate(start.getDate() + (cyclesPassed + 1) * scheduleDays);
          const next = nextDate;
          const daysUntil = Math.round((next - today) / (1000 * 60 * 60 * 24));
          if (daysUntil > 0) return `D-${daysUntil}`;
          if (daysUntil === 0) return 'D-Day';
          return `D+${Math.abs(daysUntil)}`;
        })();
        const updatedProject = {
          id: data?.projectNo ?? project.id,
          title: data?.projectName ?? editedProject.title,
          platform: data?.platform || '미정',
          serialStatus: data?.projectStatus || '연재',
          genre: data?.projectGenre || '',
          schedule: data?.projectCycle ? `${data.projectCycle}일` : '미정',
          scheduleDays,
          startDate: savedStartDateStr,
          thumbnail: data?.thumbnailFile ?? editedProject.thumbnail ?? null,
          artistName: data?.artistName ?? editedProject.artistName ?? '',
          artistId: data?.artistMemberNo ?? editedProject.artistId,
          deadline: deadlineDn,
          projectColor: data?.projectColor ?? projectColor ?? project?.projectColor ?? '#6E8FB3',
        };
        setEditedProject(updatedProject);
        setIsEditMode(false);
        toast.success('변경사항이 저장되었습니다.');
        onProjectUpdate?.(updatedProject);
      } catch (err) {
        toast.error(err?.response?.data?.message || '저장에 실패했습니다.');
      } finally {
        setIsSaving(false);
      }
    } else {
      // 편집 모드 시작
      setEditedProject(project);
      setIsEditMode(true);
    }
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditedProject(project);
    setIsEditMode(false);
    toast.info('편집이 취소되었습니다.');
  };

  // 프로젝트 삭제
  const handleDeleteProject = async () => {
    setIsSaving(true);
    try {
      await projectService.deleteProject(project.id);
      setIsDeleteProjectModalOpen(false);
      toast.success('프로젝트가 삭제되었습니다.');
      onProjectDelete?.();
      onBack();
    } catch (err) {
      toast.error(err?.response?.data?.message || '삭제에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const thumbnailInputRef = useRef(null);

  // 표지 이미지 변경 (편집 모드에서만 - 파일 선택)
  const handleChangeThumbnail = () => {
    if (!isEditMode) return;
    thumbnailInputRef.current?.click();
  };

  const handleThumbnailFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }
    e.target.value = '';
    try {
      const result = await projectService.uploadThumbnail(file);
      const fileName = typeof result === 'string' ? result : result?.data ?? result?.fileName ?? null;
      if (fileName) {
        setEditedProject((prev) => ({ ...prev, thumbnail: fileName }));
        toast.success('썸네일이 변경되었습니다. 저장 버튼을 눌러 적용해주세요.');
      }
    } catch (err) {
      toast.error(err?.message || '썸네일 업로드에 실패했습니다.');
    }
  };

  // 팀원 삭제 (PROJECT_MEMBER에서 삭제 후 목록 갱신)
  const handleDeleteTeamMember = async (projectMemberNo) => {
    if (!project?.id || projectMemberNo == null) return;
    try {
      await projectService.deleteProjectMember(project.id, projectMemberNo);
      toast.success('팀원이 삭제되었습니다.');
      setPendingDeleteTeamMember(null);

      // 팀원 목록 API 재조회
      const result = await projectService.getProjectMembers(project.id);
      const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
      setTeamMembers(
        list.map((m) => ({
          id: m.memberNo,
          projectMemberNo: m.projectMemberNo,
          name: m.memberName || m.memberEmail || '-',
          role: m.projectMemberRole || m.memberRole || '-',
          projectMemberRole: m.projectMemberRole || '',
          memberRole: m.memberRole || '',
          email: m.memberEmail || '',
          phone: m.memberPhone || '',
          status: m.todayAttendanceStatus || (m.memberStatus === '휴면' ? '휴면' : '작업 시작 전'),
          avatar: getMemberProfileUrl(m.memberProfileImage),
        }))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || '팀원 삭제에 실패했습니다.');
    }
  };

  // 팀원 추가 - DB PROJECT_MEMBER에 저장 후 팀원 목록 갱신
  const handleAddTeamMembers = async () => {
    if (selectedMemberIds.length === 0) {
      toast.error('추가할 팀원을 선택해주세요.');
      return;
    }
    if (!project?.id) return;

    const memberNosToAdd = selectedMemberIds;
    try {
      await projectService.addProjectMembers(project.id, memberNosToAdd);
      toast.success(`${memberNosToAdd.length}명의 팀원이 추가되었습니다.`);
      setIsAddTeamMemberModalOpen(false);
      setSelectedMemberIds([]);

      // 팀원 목록 API 재조회 (projectMemberNo 포함해 삭제 시 사용)
      const result = await projectService.getProjectMembers(project.id);
      const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
      const refreshed = list.map((m) => ({
        id: m.memberNo,
        projectMemberNo: m.projectMemberNo,
        name: m.memberName || m.memberEmail || '-',
        role: m.projectMemberRole || m.memberRole || '-',
        projectMemberRole: m.projectMemberRole || '',
        memberRole: m.memberRole || '',
        email: m.memberEmail || '',
        phone: m.memberPhone || '',
        status: m.todayAttendanceStatus || (m.memberStatus === '휴면' ? '휴면' : '작업 시작 전'),
        avatar: getMemberProfileUrl(m.memberProfileImage),
      }));
      setTeamMembers(refreshed);
      setEditingTeamMembers(refreshed);
    } catch (err) {
      toast.error(err?.message || '팀원 추가에 실패했습니다.');
    }
  };

  // 팀원 수정 모드 시작
  const handleStartTeamEdit = () => {
    setEditingTeamMembers([...teamMembers]);
    setIsTeamEditMode(true);
  };

  // 팀원 수정 완료 (저장)
  const handleSaveTeamEdit = () => {
    setTeamMembers([...editingTeamMembers]);
    setIsTeamEditMode(false);
    setEditingTeamMembers([]);
    toast.success('팀원 변경사항이 저장되었습니다.');
  };

  // 팀원 수정 취소
  const handleCancelTeamEdit = () => {
    setIsTeamEditMode(false);
    setEditingTeamMembers([]);
  };

  // 팀원 체크박스 토글
  const toggleMemberSelection = (memberId) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // 이미 추가된 팀원 제외한 리스트 (편집 모드에서는 편집 중 리스트 기준)
  const currentTeam = isTeamEditMode ? editingTeamMembers : teamMembers;
  const notAddedMembers = availableMembers.filter(
    am => !currentTeam.some(tm => tm.id === am.id)
  );

  // 상태별 테두리 색상 (작업중/작업 종료/작업 시작 전)
  const getStatusBorderColor = (status) => {
    switch (status) {
      case '작업중':
      case '출근':
        return 'border-green-500';
      case '작업 종료':
        return 'border-blue-500';
      case '작업 시작 전':
        return 'border-amber-500';
      case '워케이션':
        return 'border-red-500';
      case '재택근무':
        return 'border-blue-500';
      case '휴면':
        return 'border-gray-400';
      default:
        return 'border-border';
    }
  };

  // 상태별 배지 색상
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case '작업중':
      case '출근':
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
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  // 카드 완료 상태 토글 핸들러 (Y <-> N, API 호출)
  const handleToggleComplete = async (cardId) => {
    if (!project?.id) return;
    const board = boards.flatMap((b) => (b.cards || []).map((c) => ({ ...c, boardId: b.id }))).find((c) => c.id === cardId);
    if (!board) return;
    const newCompleted = !board.completed;
    try {
      const result = await projectService.updateKanbanCard(project.id, cardId, { completed: newCompleted });
      setBoards((prevBoards) =>
        prevBoards.map((b) => ({
          ...b,
          cards: (b.cards || []).map((c) =>
            c.id === cardId ? { ...c, completed: !!(result?.completed ?? newCompleted) } : c
          ),
        }))
      );
      toast.success(newCompleted ? '완료 처리되었습니다.' : '완료가 취소되었습니다.');
    } catch (err) {
      toast.error(err?.message || '상태 변경에 실패했습니다.');
    }
  };

  // 카드 드롭 핸들러 (KANBAN_CARD.BOARD_NO 업데이트)
  const handleCardDrop = async (cardId, sourceBoardId, targetBoardId) => {
    if (sourceBoardId === targetBoardId) return;
    if (!project?.id) return;

    try {
      await projectService.updateKanbanCard(project.id, cardId, { boardId: targetBoardId });
      setBoards((prevBoards) => {
        const newBoards = prevBoards.map((b) => ({ ...b, cards: [...(b.cards || [])] }));
        const sourceBoard = newBoards.find((b) => b.id === sourceBoardId);
        const targetBoard = newBoards.find((b) => b.id === targetBoardId);

        if (sourceBoard && targetBoard) {
          const cardIndex = sourceBoard.cards.findIndex((c) => c.id === cardId);
          if (cardIndex !== -1) {
            const [card] = sourceBoard.cards.splice(cardIndex, 1);
            targetBoard.cards.push({ ...card, boardId: targetBoardId });
          }
        }
        return newBoards;
      });
      toast.success('카드가 이동되었습니다.');
    } catch (err) {
      toast.error(err?.message || '카드 이동에 실패했습니다.');
    }
  };

  // 카드 추가/수정
  const handleSaveCard = async () => {
    if (!cardForm.title?.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!cardForm.dueDate) {
      toast.error('마감일을 입력해주세요.');
      return;
    }

    if (editingCard && project?.id) {
      // 수정 - KANBAN_CARD UPDATE
      try {
        const payload = {
          title: cardForm.title.trim(),
          description: (cardForm.description ?? '').trim(),  // 빈 문자열이면 백엔드에서 null로 저장
          completed: editingCard.completed ?? false,
        };
        if (cardForm.startDate) {
          payload.startDate = cardForm.startDate.trim();
        }
        if (cardForm.dueDate) {
          payload.dueDate = cardForm.dueDate.trim();
        }
        if (selectedAssignee) {
          if (selectedAssignee.projectMemberNo != null) {
            payload.projectMemberNo = selectedAssignee.projectMemberNo;
          } else {
            payload.memberNo = selectedAssignee.id;
          }
        }
        const result = await projectService.updateKanbanCard(project.id, editingCard.id, payload);
        const updatedCard = {
          id: result.id,
          title: result.title || cardForm.title,
          description: result.description || cardForm.description || '',
          startDate: result.startDate || cardForm.startDate || '',
          dueDate: result.dueDate || cardForm.dueDate || '',
          boardId: result.boardId ?? editingCard.boardId,
          createdAt: result.createdAt ?? editingCard.createdAt,
          assignedTo: result.assignedTo
            ? {
                id: result.assignedTo.id,
                name: result.assignedTo.name,
                role: result.assignedTo.role,
                email: result.assignedTo.email,
                avatar: getMemberProfileUrl(result.assignedTo.avatar),
              }
            : selectedAssignee ?? editingCard.assignedTo,
          completed: !!result.completed,
        };
        setBoards((prevBoards) =>
          prevBoards.map((board) => ({
            ...board,
            cards: board.cards.map((card) =>
              card.id === editingCard.id ? updatedCard : card
            ),
          }))
        );
        toast.success('카드가 수정되었습니다.');
      } catch (err) {
        toast.error(err?.message || '카드 수정에 실패했습니다.');
        return;
      }
      setIsCardModalOpen(false);
      setEditingCard(null);
      setCurrentBoardId(null);
      setCardForm({ title: '', description: '', startDate: '', dueDate: '' });
      setSelectedAssignee(null);
      setNewComment('');
      setCardComments([]);
      return;
    }

    if (currentBoardId !== null && project?.id) {
      // 추가 - KANBAN_CARD INSERT
      if (!selectedAssignee) {
        toast.error('담당자를 선택해주세요.');
        return;
      }
      try {
        const payload = {
          title: cardForm.title.trim(),
          description: cardForm.description?.trim() || null,
          boardId: currentBoardId,
        };
        if (cardForm.startDate) {
          payload.startDate = cardForm.startDate.trim();
        }
        if (cardForm.dueDate) {
          payload.dueDate = cardForm.dueDate.trim();
        }
        if (selectedAssignee.projectMemberNo != null) {
          payload.projectMemberNo = selectedAssignee.projectMemberNo;
        } else {
          payload.memberNo = selectedAssignee.id;
        }
        const result = await projectService.createKanbanCard(project.id, payload);
        const newCard = {
          id: result.id,
          title: result.title || cardForm.title,
          description: result.description || cardForm.description || '',
          startDate: result.startDate || cardForm.startDate || '',
          dueDate: result.dueDate || cardForm.dueDate || '',
          boardId: result.boardId ?? currentBoardId,
          createdAt: result.createdAt || null,
          assignedTo: result.assignedTo
            ? {
                id: result.assignedTo.id,
                name: result.assignedTo.name,
                role: result.assignedTo.role,
                email: result.assignedTo.email,
                avatar: getMemberProfileUrl(result.assignedTo.avatar),
              }
            : selectedAssignee,
          completed: !!result.completed,
        };
        setBoards((prevBoards) =>
          prevBoards.map((board) =>
            board.id === currentBoardId
              ? { ...board, cards: [...board.cards, newCard] }
              : board
          )
        );
        toast.success('카드가 추가되었습니다.');
      } catch (err) {
        toast.error(err?.message || '카드 추가에 실패했습니다.');
        return;
      }
    }

    setIsCardModalOpen(false);
    setEditingCard(null);
    setCurrentBoardId(null);
    setCardForm({ title: '', description: '', startDate: '', dueDate: '' });
    setSelectedAssignee(null);
    setNewComment('');
    setCardComments([]);
  };

  // 카드 삭제 (KANBAN_CARD_STATUS를 D로 변경 → 목록에서 숨김)
  const handleDeleteCard = async (cardId) => {
    if (!project?.id) return;

    try {
      await projectService.updateKanbanCard(project.id, cardId, { status: 'D' });
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          cards: board.cards.filter((card) => card.id !== cardId),
        }))
      );
      toast.success('카드가 삭제되었습니다.');
    } catch (err) {
      toast.error(err?.message || '카드 삭제에 실패했습니다.');
    }
  };

  // 보드 추가 (KANBAN_BOARD INSERT)
  const handleAddBoard = async () => {
    if (!newBoardTitle?.trim()) {
      toast.error('보드 이름을 입력해주세요.');
      return;
    }
    if (!project?.id) return;

    try {
      const result = await projectService.createKanbanBoard(project.id, newBoardTitle.trim());
      const newBoard = {
        id: result.id,
        title: result.title || newBoardTitle.trim(),
        cards: (result.cards || []).map((c) => ({
          id: c.id,
          title: c.title || '',
          description: c.description || '',
          startDate: c.startDate || '',
          dueDate: c.dueDate || '',
          boardId: c.boardId ?? result.id,
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
      };
      setBoards((prev) => [...prev, newBoard]);
      toast.success('보드가 추가되었습니다.');
      setIsBoardModalOpen(false);
      setNewBoardTitle('');
    } catch (err) {
      toast.error(err?.message || '보드 추가에 실패했습니다.');
    }
  };

  // 보드 삭제 (KANBAN_BOARD_STATUS를 N으로 변경 → 목록에서 숨김)
  const handleDeleteBoard = async (boardId) => {
    if (!project?.id) return;

    try {
      await projectService.updateKanbanBoardStatus(project.id, boardId, 'N');
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
      toast.success('보드가 삭제되었습니다.');
    } catch (err) {
      toast.error(err?.message || '보드 삭제에 실패했습니다.');
    }
  };

  // 코멘트 추가 핸들러 (COMMENT INSERT)
  const handleAddComment = async () => {
    if (!newComment.trim() || !editingCard) {
      toast.error('코멘트를 입력해주세요.');
      return;
    }
    if (!project?.id) return;

    try {
      const result = await projectService.createComment(project.id, editingCard.id, newComment.trim());
      const comment = {
        id: result.id,
        author: result.authorName ?? useAuthStore.getState().user?.memberName ?? '작성자',
        authorMemberNo: result.authorMemberNo ?? useAuthStore.getState().user?.memberNo ?? null,
        content: result.content || newComment.trim(),
        createdAt: result.commentCreatedAt || new Date().toLocaleString('ko-KR'),
        role: useAuthStore.getState().user?.memberRole || '',
      };
      const updatedComments = [...cardComments, comment];
      const updatedCard = {
        ...editingCard,
        comments: updatedComments,
      };
      setEditingCard(updatedCard);
      setCardComments(updatedComments);
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          cards: board.cards.map((card) =>
            card.id === editingCard.id ? updatedCard : card
          ),
        }))
      );
      setNewComment('');
      toast.success('코멘트가 추가되었습니다.');
    } catch (err) {
      toast.error(err?.message || '코멘트 추가에 실패했습니다.');
    }
  };

  // 코멘트 수정 시작
  const handleStartEditComment = (comment) => {
    setEditingComment(comment);
    setEditingCommentContent(comment.content);
  };

  // 코멘트 수정 저장
  const handleSaveEditComment = async () => {
    if (!editingComment || !editingCard || !project?.id) return;
    const content = (editingCommentContent ?? '').trim();
    if (!content) {
      toast.error('코멘트 내용을 입력해주세요.');
      return;
    }
    try {
      await projectService.updateComment(project.id, editingCard.id, editingComment.id, { content });
      const updatedComments = cardComments.map((c) =>
        c.id === editingComment.id ? { ...c, content } : c
      );
      const updatedCard = { ...editingCard, comments: updatedComments };
      setEditingCard(updatedCard);
      setCardComments(updatedComments);
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          cards: board.cards.map((card) =>
            card.id === editingCard.id ? updatedCard : card
          ),
        }))
      );
      setEditingComment(null);
      setEditingCommentContent('');
      toast.success('코멘트가 수정되었습니다.');
    } catch (err) {
      toast.error(err?.response?.data?.message || '코멘트 수정에 실패했습니다.');
    }
  };

  // 코멘트 삭제 (COMMENT_STATUS를 B로 변경 → 숨김)
  const handleDeleteComment = async (commentId) => {
    if (!editingCard || !project?.id) return;
    try {
      await projectService.updateComment(project.id, editingCard.id, commentId, { status: 'block' });
      const updatedComments = cardComments.filter((c) => c.id !== commentId);
      const updatedCard = { ...editingCard, comments: updatedComments };
      setEditingCard(updatedCard);
      setCardComments(updatedComments);
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          cards: board.cards.map((card) =>
            card.id === editingCard.id ? updatedCard : card
          ),
        }))
      );
      setPendingDeleteComment(null);
      toast.success('코멘트가 삭제되었습니다.');
    } catch (err) {
      toast.error(err?.response?.data?.message || '코멘트 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar bg-background">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          {/* 상단 헤더 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                프로젝트 목록으로
              </Button>

              {/* 편집 버튼 - 담당자 뷰에서만 표시 */}
              {!isArtistView && (
                <div className="flex gap-2">
                  {isEditMode ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        취소
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleToggleEditMode}
                        className="bg-primary hover:bg-primary/90"
                        disabled={isSaving}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? '저장 중...' : '저장'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={handleToggleEditMode}
                        variant="outline"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        편집
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setIsDeleteProjectModalOpen(true)}
                        disabled={isSaving}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            <Card className="p-6">
              <div className="flex gap-6">
                {/* 작품 표지 */}
                <div className="flex-shrink-0">
                  <div
                    className={`relative group ${isEditMode ? 'cursor-pointer' : ''}`}
                    onClick={handleChangeThumbnail}
                  >
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailFileChange}
                    />
                    <ImageWithFallback
                      src={getProjectThumbnailUrl(editedProject.thumbnail) || PROJECT_THUMBNAIL_PLACEHOLDER}
                      alt={editedProject.title}
                      className="w-32 h-44 object-cover rounded-lg border-2 border-border shadow-md"
                    />
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-white text-xs font-medium">클릭하여 변경</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 작품 정보 */}
                <div className="flex-1">
                  {/* 작품명 */}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedProject.title}
                      onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                      className="text-3xl font-bold text-foreground mb-3 w-full px-2 py-1 border border-border rounded-md bg-background"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-foreground mb-3">{editedProject.title}</h1>
                  )}

                  {/* 작가명 — 담당자 배정 작가(MANAGER·ARTIST_ASSIGNMENT) SELECT */}
                  <div className="mb-3">
                    {isEditMode ? (
                      <select
                        value={editedProject.artistId ?? ''}
                        onChange={(e) => {
                          const id = e.target.value ? Number(e.target.value) : null;
                          const artist = (id && assignedArtists.find((a) => a.id === id)) || { id, name: '' };
                          const name = artist.name || (editedProject.artistId === id ? editedProject.artistName : '');
                          setEditedProject({
                            ...editedProject,
                            artistId: id,
                            artistName: name || editedProject.artistName,
                          });
                        }}
                        className="text-sm text-muted-foreground px-2 py-1 border border-border rounded-md bg-background"
                      >
                        <option value="">작가 선택</option>
                        {assignedArtistsLoading ? (
                          <option disabled>불러오는 중...</option>
                        ) : (
                          [
                            ...(editedProject.artistId && !assignedArtists.some((a) => a.id === editedProject.artistId)
                              ? [{ id: editedProject.artistId, name: editedProject.artistName || '현재 작가' }]
                              : []),
                            ...assignedArtists,
                          ]
                            .filter((a, i, arr) => arr.findIndex((x) => x.id === a.id) === i)
                            .map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.name}
                              </option>
                            ))
                        )}
                      </select>
                    ) : (
                      editedProject.artistName && (
                        <p className="text-lg text-muted-foreground">작가: {editedProject.artistName}</p>
                      )
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    {/* 플랫폼 */}
                    {isEditMode ? (
                      <select
                        value={editedProject.platform}
                        onChange={(e) => setEditedProject({ ...editedProject, platform: e.target.value })}
                        className="text-sm px-3 py-1 border border-border rounded-md bg-background text-foreground"
                      >
                        <option>네이버 웹툰</option>
                        <option>카카오페이지</option>
                        <option>카카오웹툰</option>
                        <option>레진코믹스</option>
                        <option>네이버 시리즈</option>
                        <option>리디북스</option>
                        <option>탑툰</option>
                      </select>
                    ) : (
                      <Badge className="bg-primary text-sm px-3 py-1">{editedProject.platform}</Badge>
                    )}

                    {/* 연재 상태 */}
                    {isEditMode ? (
                      <select
                        value={editedProject.serialStatus}
                        onChange={(e) => setEditedProject({ ...editedProject, serialStatus: e.target.value })}
                        className="text-sm px-3 py-1 border border-border rounded-md bg-background text-foreground"
                      >
                        <option>연재</option>
                        <option>휴재</option>
                        <option>완결</option>
                      </select>
                    ) : (
                      <Badge className="bg-green-500 text-sm px-3 py-1">{editedProject.serialStatus}</Badge>
                    )}
                  </div>

                  {/* 팀원 버튼 */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsTeamModalOpen(true)}
                      disabled={teamMembersLoading}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      팀원 보기 ({teamMembersLoading ? '...' : `${teamMembers.length}명`})
                    </Button>

                    {/* 프로젝트 색상 선택 (편집 모드에서만 변경 가능) */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">프로젝트 일정 색상</label>
                      <div className={`flex items-center gap-2 flex-wrap ${!isEditMode ? 'opacity-80' : ''}`}>
                        {colorPalette.map((item) => (
                          <button
                            key={item.color}
                            type="button"
                            disabled={!isEditMode}
                            onClick={() => {
                              setProjectColor(item.color);
                              toast.success(`프로젝트 색상이 ${item.name}로 변경되었습니다.`);
                            }}
                            className={`group relative ${!isEditMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            title={isEditMode ? item.name : '편집 버튼을 눌러 색상 변경'}
                          >
                            <div
                              className={`w-7 h-7 rounded-full transition-all ${
                                isEditMode ? 'hover:scale-110' : ''
                              } ${
                                projectColor === item.color
                                  ? 'ring-2 ring-offset-2 ring-foreground'
                                  : isEditMode ? 'hover:ring-2 hover:ring-offset-1 hover:ring-border' : ''
                              }`}
                              style={{ backgroundColor: item.color }}
                            />
                            {projectColor === item.color && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 메인 컨텐츠 영역 */}
          <div className="flex gap-6">
            {/* 왼쪽: 칸반 보드 */}
            <div className="flex-1 min-w-0">
              <Card className="p-6 h-[calc(100vh-320px)] flex flex-col">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h2 className="text-xl font-bold text-foreground">업무 일정 보드</h2>
                  <Button
                    size="sm"
                    onClick={() => setIsBoardModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    보드 추가
                  </Button>
                </div>

                {boardsLoading ? (
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">업무 보드 불러오는 중...</p>
                    </div>
                  </div>
                ) : boards.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">보드를 추가해서 업무 일정을 기록하세요</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 flex-1 min-h-0">
                    {boards.map((board) => (
                      <DroppableBoard
                        key={board.id}
                        board={board}
                        onCardDrop={handleCardDrop}
                        onEdit={async (card) => {
                          setEditingCard(card);
                          const assignee = card.assignedTo;
                          const matched = assignee?.id != null && teamMembers.length > 0
                            ? teamMembers.find((m) => String(m.projectMemberNo ?? m.id) === String(assignee.id))
                            : null;
                          setSelectedAssignee(matched || assignee || null);
                          setCardForm({
                            title: card.title,
                            description: card.description,
                            startDate: card.startDate,
                            dueDate: card.dueDate,
                          });
                          setCardComments([]);
                          setIsCardModalOpen(true);
                          if (project?.id && card.id) {
                            try {
                              const result = await projectService.getComments(project.id, card.id);
                              const list = Array.isArray(result) ? result : result?.content ?? result?.data ?? [];
                              const comments = list.map((c) => ({
                                id: c.id,
                                content: c.content || '',
                                author: c.authorName ?? '작성자',
                                authorMemberNo: c.authorMemberNo ?? null,
                                createdAt: c.commentCreatedAt || '-',
                              }));
                              setCardComments(comments);
                              setEditingCard((prev) => (prev ? { ...prev, comments } : null));
                            } catch {
                              setCardComments([]);
                              setEditingCard((prev) => (prev ? { ...prev, comments: [] } : null));
                            }
                          }
                        }}
                        onRequestDeleteCard={(card) => setPendingDeleteCard({ id: card.id, title: card.title || '이 카드' })}
                        onToggleComplete={handleToggleComplete}
                        onAddCard={(boardId) => {
                          setCurrentBoardId(boardId);
                          setEditingCard(null);
                          setCardComments([]);
                          setIsCardModalOpen(true);
                        }}
                        onRequestDeleteBoard={(board) => setPendingDeleteBoard({ id: board.id, title: board.title || '이 보드' })}
                        projectColor={projectColor}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* 오른쪽: 마감일(kanban_card_ended_at) 내림차순 + D-n */}
            <div className="w-80 flex-shrink-0">
              <Card className="p-6 h-[calc(100vh-320px)] flex flex-col">
                <h2 className="text-xl font-bold text-foreground mb-4">남은 마감일</h2>
                
                <div className="space-y-3 overflow-y-auto flex-1">
                  {dueDateSortedCards.length > 0 ? (
                    dueDateSortedCards.map((item, idx) => (
                      <div
                        key={item.card.id ?? idx}
                        className="p-3 rounded-lg border-l-4 bg-muted/20"
                        style={{ borderLeftColor: projectColor }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-foreground">마감일 {item.dateStr}</span>
                          <span className="text-xs font-medium text-primary">{item.dLabel}</span>
                        </div>
                        <p className="text-xs text-foreground">
                          • {item.card.title}
                          {item.assigneeName && <span className="text-muted-foreground"> ({item.assigneeName})</span>}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">마감일이 있는 카드가 없습니다.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 팀원 모달 */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          setIsTeamEditMode(false);
          setEditingTeamMembers(teamMembers);
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
                    <p className="text-xs text-muted-foreground">{member.memberRole || member.role}</p>
                  </div>

                  {/* 현재 상태 */}
                  <Badge className={`${getStatusBadgeColor(member.status)} text-xs px-2 py-1`}>
                    {member.status}
                  </Badge>
                </div>

                {/* 팀원 삭제 버튼 — 담당자만 노출, 작가/담당자 역할에는 미노출 */}
                {isManagerRole && member.role !== '작가' && member.role !== '담당자' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteTeamMember(member);
                    }}
                    className="ml-2 text-muted-foreground hover:text-destructive p-1"
                    title="팀원 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 팀원 추가 버튼 — PROJECT_MEMBER_ROLE이 담당자일 때만 */}
          {isManagerRole && (
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setIsAddTeamMemberModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                팀원 추가
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* 팀원 삭제 확인 모달 */}
      <Modal
        isOpen={!!pendingDeleteTeamMember}
        onClose={() => setPendingDeleteTeamMember(null)}
        title="팀원 삭제 확인"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <strong>{pendingDeleteTeamMember?.name}</strong> 팀원을 삭제하시겠습니까?
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPendingDeleteTeamMember(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDeleteTeamMember?.projectMemberNo != null) {
                  handleDeleteTeamMember(pendingDeleteTeamMember.projectMemberNo);
                }
              }}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 팀원 추가 모달 */}
      <Modal
        isOpen={isAddTeamMemberModalOpen}
        onClose={() => {
          setIsAddTeamMemberModalOpen(false);
          setSelectedMemberIds([]);
        }}
        title="팀원 추가"
        maxWidth="md"
      >
        <div>
          <p className="text-sm text-muted-foreground mb-4">추가할 팀원을 선택하세요.</p>

          {addableMembersLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">불러오는 중...</p>
            </div>
          ) : notAddedMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">추가 가능한 팀원이 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto">
                {notAddedMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.includes(member.id)}
                      onChange={() => toggleMemberSelection(member.id)}
                      className="w-4 h-4 rounded border-border"
                    />
                    
                    <ImageWithFallback
                      src={member.avatar || MEMBER_AVATAR_PLACEHOLDER}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                      <p className="text-xs text-muted-foreground">{member.memberRole || member.role}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsAddTeamMemberModalOpen(false);
                    setSelectedMemberIds([]);
                  }}
                >
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAddTeamMembers}
                  disabled={selectedMemberIds.length === 0}
                >
                  추가 ({selectedMemberIds.length}명)
                </Button>
              </div>
            </>
          )}
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
                src={selectedMember.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
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
                  <p className="text-sm font-medium text-foreground">{selectedMember.memberRole || selectedMember.role}</p>
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

      {/* 카드 추가/수정 모달 - Trello/Atlassian 스타일 */}
      <Modal
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setEditingCard(null);
          setCurrentBoardId(null);
          setCardForm({ title: '', description: '', startDate: '', dueDate: '' });
          setSelectedAssignee(null);
          setNewComment('');
          setCardComments([]);
        }}
        title={boards.find(b => b.id === (editingCard?.boardId || currentBoardId))?.title || ''}
        maxWidth="6xl"
      >
        <div className="flex gap-10 min-h-[600px]">
          {/* 왼쪽 컬럼 - 카드 정보 */}
          <div className="flex-1 space-y-6">
            {/* 제목 입력 */}
            <div>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={cardForm.title}
                onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                className="w-full text-2xl font-semibold px-4 py-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background text-foreground"
              />
            </div>

            {/* Date inputs */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-foreground">Date and assignee</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">시작일</label>
                  <input
                    type="date"
                    value={cardForm.startDate}
                    onChange={(e) => setCardForm({ ...cardForm, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">마감일</label>
                  <input
                    type="date"
                    value={cardForm.dueDate}
                    onChange={(e) => setCardForm({ ...cardForm, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm bg-background text-foreground"
                  />
                </div>
              </div>
              {editingCard?.createdAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  생성일: {(() => {
                    try {
                      const d = new Date(editingCard.createdAt);
                      return isNaN(d.getTime()) ? editingCard.createdAt : d.toLocaleString('ko-KR');
                    } catch {
                      return editingCard.createdAt;
                    }
                  })()}
                </p>
              )}
              {/* 담당자 선택: 프로젝트 멤버 번호(projectMemberNo) 기준 조회, 멤버 이름·직책 표시 */}
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">담당자</label>
                <select
                  value={selectedAssignee != null ? String(selectedAssignee.projectMemberNo ?? selectedAssignee.id) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const selected = val ? teamMembers.find((m) => String(m.projectMemberNo ?? m.id) === val) : null;
                    setSelectedAssignee(selected || null);
                  }}
                  className="w-full px-4 py-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm bg-background text-foreground"
                >
                  <option value="">선택하세요</option>
                  {teamMembers.map((member) => (
                    <option key={member.projectMemberNo ?? member.id} value={String(member.projectMemberNo ?? member.id)}>
                      {member.name} - {member.memberRole || member.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold text-foreground">Description</h3>
              </div>
              <textarea
                placeholder="작업 내용을 자세히 설명해주세요..."
                value={cardForm.description}
                onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                rows={14}
                className="w-full px-4 py-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm bg-background text-foreground resize-none"
              />
            </div>

            {/* 저장/취소 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCardModalOpen(false);
                  setEditingCard(null);
                  setCurrentBoardId(null);
                  setCardForm({ title: '', description: '', startDate: '', dueDate: '' });
                  setSelectedAssignee(null);
                  setNewComment('');
                  setCardComments([]);
                }}
              >
                취소
              </Button>
              <Button onClick={handleSaveCard} className="bg-primary hover:bg-primary/90">
                {editingCard ? '수정' : '추가'}
              </Button>
            </div>
          </div>

          {/* 오른쪽 컬럼 - Comments and activity */}
          <div className="w-96 border-l border-border pl-10">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Comments and activity</h3>
            </div>

            {/* 코멘트 입력 */}
            <div className="mb-6">
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-primary rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm bg-background text-foreground resize-none"
              />
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  onClick={handleAddComment}
                  className="bg-primary hover:bg-primary/90"
                >
                  Save
                </Button>
              </div>
            </div>

            {/* 코멘트 목록 - KANBAN_CARD_NO(editingCard.id) 기준으로 조회한 COMMENT 전부 표시 */}
            <div className="space-y-4 max-h-[450px] overflow-y-auto">
              {cardComments.map((comment) => (
                <div key={comment.id} className="bg-muted/30 rounded-lg p-4">
                  {editingComment && editingComment.id === comment.id ? (
                    /* 수정 모드 */
                    <div className="space-y-3">
                      <textarea
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm bg-background text-foreground resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEditComment}
                          className="bg-primary hover:bg-primary/90"
                        >
                          저장
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingComment(null);
                            setEditingCommentContent('');
                          }}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* 일반 보기 모드 */
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {(comment.author || '작성자').charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{comment.author ?? '작성자'}</span>
                          <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      {/* 수정/삭제 버튼 */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleStartEditComment(comment)}
                          className="text-muted-foreground hover:text-primary p-1"
                          title="수정"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setPendingDeleteComment(comment)}
                          className="text-muted-foreground hover:text-destructive p-1"
                          title="삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {cardComments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">아직 코멘트가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 보드 삭제 확인 모달 */}
      <Modal
        isOpen={!!pendingDeleteBoard}
        onClose={() => setPendingDeleteBoard(null)}
        title="보드 삭제 확인"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <strong>{pendingDeleteBoard?.title}</strong> 보드를 삭제하시겠습니까?
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPendingDeleteBoard(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!pendingDeleteBoard?.id) return;
                await handleDeleteBoard(pendingDeleteBoard.id);
                setPendingDeleteBoard(null);
              }}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 카드 삭제 확인 모달 */}
      <Modal
        isOpen={!!pendingDeleteCard}
        onClose={() => setPendingDeleteCard(null)}
        title="카드 삭제 확인"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <strong>{pendingDeleteCard?.title}</strong> 카드를 삭제하시겠습니까?
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPendingDeleteCard(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!pendingDeleteCard?.id) return;
                await handleDeleteCard(pendingDeleteCard.id);
                setPendingDeleteCard(null);
              }}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 코멘트 삭제 확인 모달 */}
      <Modal
        isOpen={!!pendingDeleteComment}
        onClose={() => setPendingDeleteComment(null)}
        title="코멘트 삭제 확인"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            이 코멘트를 삭제하시겠습니까?
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPendingDeleteComment(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDeleteComment?.id) {
                  handleDeleteComment(pendingDeleteComment.id);
                }
              }}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 프로젝트 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteProjectModalOpen}
        onClose={() => setIsDeleteProjectModalOpen(false)}
        title="프로젝트 삭제 확인"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <strong>{editedProject?.title}</strong> 프로젝트를 정말 삭제하시겠습니까? 삭제된 프로젝트는 복구할 수 없습니다.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteProjectModalOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject} disabled={isSaving}>
              {isSaving ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBoardModalOpen}
        onClose={() => {
          setIsBoardModalOpen(false);
          setNewBoardTitle('');
        }}
        title="보드 추가"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">보드 이름</label>
            <input
              type="text"
              placeholder="예: 검수중"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsBoardModalOpen(false);
                setNewBoardTitle('');
              }}
            >
              취소
            </Button>
            <Button className="flex-1" onClick={handleAddBoard}>
              추가
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
