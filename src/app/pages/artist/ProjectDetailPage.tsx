import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
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
import { useDrag, useDrop } from 'react-dnd';

interface Project {
  id: number;
  title: string;
  platform: string;
  serialStatus: '연재중' | '휴재' | '완결';
  currentEpisode: number;
  thumbnail?: string;
  artistName?: string; // 작가명 추가
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: '출근' | '워케이션' | '휴재' | '재택근무';
  avatar?: string;
}

interface AvailableMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface KanbanCard {
  id: number;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  boardId: number;
  completed?: boolean;
  comments?: Comment[];
  assignedTo?: TeamMember | null;  // 담당자 추가
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  role?: string; // 작가 또는 담당자 구분
}

interface KanbanBoard {
  id: number;
  title: string;
  cards: KanbanCard[];
}

interface WeeklySchedule {
  date: string;
  day: string;
  events: string[];
}

const ITEM_TYPE = 'KANBAN_CARD';

// 드래그 가능한 카드 컴포넌트
function DraggableCard({ 
  card, 
  onEdit, 
  onDelete,
  projectColor
}: { 
  card: KanbanCard; 
  onEdit: (card: KanbanCard) => void;
  onDelete: (cardId: number) => void;
  projectColor: string;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: card.id, boardId: card.boardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`group bg-white border-l-4 rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ borderLeftColor: projectColor }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        {/* 제목 */}
        <h4 className="font-semibold text-sm text-foreground flex-1 break-words">{card.title}</h4>

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
              onDelete(card.id);
            }}
            className="text-muted-foreground hover:text-destructive p-1"
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
    </div>
  );
}

// 드롭 가능한 보드 컴포넌트
function DroppableBoard({
  board,
  onCardDrop,
  onEdit,
  onDelete,
  onAddCard,
  onDeleteBoard,
  projectColor
}: {
  board: KanbanBoard;
  onCardDrop: (cardId: number, sourceBoardId: number, targetBoardId: number) => void;
  onEdit: (card: KanbanCard) => void;
  onDelete: (cardId: number) => void;
  onAddCard: (boardId: number) => void;
  onDeleteBoard: (boardId: number) => void;
  projectColor: string;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: number; boardId: number }) => {
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
          onClick={() => onDeleteBoard(board.id)}
          className="text-muted-foreground hover:text-destructive p-1"
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
            onDelete={onDelete}
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

export function ProjectDetailPage({ 
  project, 
  onBack,
  isArtistView = false, // 작가 뷰인지 담당자 뷰인지 구분
}: { 
  project: Project; 
  onBack: () => void;
  isArtistView?: boolean;
}) {
  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  // 프로젝트 색상 상태
  const [projectColor, setProjectColor] = useState('#6E8FB3'); // 기본 색상
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  // 팀원 데이터
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: '김작가',
      role: '메인 작가',
      email: 'kim@example.com',
      phone: '010-1234-5678',
      status: '출근',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 2,
      name: '이채색',
      role: '채색 담당',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      status: '출근',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      id: 3,
      name: '박배경',
      role: '배경 작가',
      email: 'park@example.com',
      phone: '010-3456-7890',
      status: '워케이션',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    {
      id: 4,
      name: '최스토리',
      role: '스토리 작가',
      email: 'choi@example.com',
      phone: '010-4567-8901',
      status: '재택근무',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  ]);

  // 추가 가능한 팀원 리스트
  const [availableMembers] = useState<AvailableMember[]>([
    {
      id: 5,
      name: '정어시',
      role: '어시스턴트',
      email: 'jung@example.com',
      phone: '010-5678-9012',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      id: 6,
      name: '한효과',
      role: '효과 담당',
      email: 'han@example.com',
      phone: '010-6789-0123',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    },
    {
      id: 7,
      name: '송편집',
      role: '편집 담당',
      email: 'song@example.com',
      phone: '010-7890-1234',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
  ]);

  // 칸반 보드 데이터
  const [boards, setBoards] = useState<KanbanBoard[]>([
    {
      id: 1,
      title: '할 일',
      cards: [
        { id: 1, title: '43화 스토리보드', description: '스토리 구성 및 콘티 작업', startDate: '2025-01-15', dueDate: '2025-01-20', boardId: 1 },
        { id: 2, title: '44화 스크립트 검토', description: '작가와 스크립트 회의', startDate: '2025-01-17', dueDate: '2025-01-22', boardId: 1 },
      ],
    },
    {
      id: 2,
      title: '진행중',
      cards: [
        { id: 3, title: '42화 채색', description: '메인 씬 채색 작업', startDate: '2025-01-16', dueDate: '2025-01-18', boardId: 2 },
      ],
    },
    {
      id: 3,
      title: '완료',
      cards: [
        { id: 4, title: '41화 업로드', description: '네이버 웹툰 업로드 완료', startDate: '2025-01-13', dueDate: '2025-01-14', boardId: 3 },
      ],
    },
  ]);

  // 주간 일정
  const [weeklySchedule] = useState<WeeklySchedule[]>([
    { date: '1/15', day: '오늘 (수)', events: ['42화 채색 마감', '팀 미팅 3PM'] },
    { date: '1/16', day: '목', events: ['43화 스토리보드 시작'] },
    { date: '1/17', day: '금', events: [] },
    { date: '1/18', day: '토', events: ['42화 최종 검수'] },
    { date: '1/19', day: '일', events: ['42화 업로드'] },
    { date: '1/20', day: '월', events: ['43화 스토리보드 마감'] },
    { date: '1/21', day: '화', events: ['44화 기획 회의'] },
  ]);

  // 모달 상태
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isAddTeamMemberModalOpen, setIsAddTeamMemberModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [currentBoardId, setCurrentBoardId] = useState<number | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [isTeamEditMode, setIsTeamEditMode] = useState(false); // 팀원 모달 수정 모드
  const [editingTeamMembers, setEditingTeamMembers] = useState<TeamMember[]>([]); // 수정중인 팀원 임시 상태
  
  // 코멘트 관련 상태
  const [newComment, setNewComment] = useState('');
  const [cardComments, setCardComments] = useState<Comment[]>([]);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  
  // 담당자 선택 상태 (아티스트 뷰용)
  const [selectedAssignee, setSelectedAssignee] = useState<TeamMember | null>(null);
  
  const [cardForm, setCardForm] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
  });

  const [newBoardTitle, setNewBoardTitle] = useState('');

  // 편집 모드 토글
  const handleToggleEditMode = () => {
    if (isEditMode) {
      // 저장
      toast.success('변경사항이 저장되었습니다.');
      setIsEditMode(false);
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

  // 표지 이미지 변경
  const handleChangeThumbnail = () => {
    const newUrl = prompt('새 이미지 URL을 입력하세요:', editedProject.thumbnail);
    if (newUrl) {
      setEditedProject({ ...editedProject, thumbnail: newUrl });
    }
  };

  // 팀원 삭제 (수정 모드에서만 임시 상태에 적용)
  const handleDeleteTeamMember = (memberId: number) => {
    if (editingTeamMembers.length <= 1) {
      toast.error('최소 1명의 팀원은 필요합니다.');
      return;
    }
    setEditingTeamMembers(editingTeamMembers.filter(m => m.id !== memberId));
  };

  // 팀원 추가 (수정 모드에서만 임시 상태에 적용)
  const handleAddTeamMembers = () => {
    if (selectedMemberIds.length === 0) {
      toast.error('추가할 팀원을 선택해주세요.');
      return;
    }

    const newMembers = availableMembers
      .filter(m => selectedMemberIds.includes(m.id))
      .map(m => ({ ...m, status: '출근' as const }));

    setEditingTeamMembers([...editingTeamMembers, ...newMembers]);
    setIsAddTeamMemberModalOpen(false);
    setSelectedMemberIds([]);
    toast.success(`${newMembers.length}명의 팀원이 추가되었습니다.`);
  };

  // 팀원 수정 모드 시작
  const handleStartTeamEdit = () => {
    setEditingTeamMembers([...teamMembers]); // 현재 팀원 복사
    setIsTeamEditMode(true);
  };

  // 팀원 수정 완료 (저장)
  const handleSaveTeamEdit = () => {
    setTeamMembers([...editingTeamMembers]); // 임시 상태를 실제로 저장
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
  const toggleMemberSelection = (memberId: number) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // 이미 추가된 팀원 제외한 리스트
  const notAddedMembers = availableMembers.filter(
    am => !teamMembers.some(tm => tm.id === am.id)
  );

  // 상태별 테두리 색상
  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case '출근':
        return 'border-green-500';
      case '워케이션':
        return 'border-red-500';
      case '재택근무':
        return 'border-blue-500';
      default:
        return 'border-border';
    }
  };

  // 상태별 배지 색상
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '출근':
        return 'bg-green-500 hover:bg-green-600';
      case '워케이션':
        return 'bg-red-500 hover:bg-red-600';
      case '재택근무':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  // 카드 드롭 핸들러
  const handleCardDrop = (cardId: number, sourceBoardId: number, targetBoardId: number) => {
    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      const sourceBoard = newBoards.find(b => b.id === sourceBoardId);
      const targetBoard = newBoards.find(b => b.id === targetBoardId);

      if (sourceBoard && targetBoard) {
        const cardIndex = sourceBoard.cards.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
          const [card] = sourceBoard.cards.splice(cardIndex, 1);
          card.boardId = targetBoardId;
          targetBoard.cards.push(card);
        }
      }

      return newBoards;
    });
    toast.success('카드가 이동되었습니다.');
  };

  // 카드 추가/수정
  const handleSaveCard = () => {
    if (!cardForm.title || !cardForm.dueDate) {
      toast.error('제목과 날짜를 입력해주세요.');
      return;
    }

    if (editingCard) {
      // 수정
      setBoards((prevBoards) =>
        prevBoards.map((board) => ({
          ...board,
          cards: board.cards.map((card) =>
            card.id === editingCard.id
              ? { ...card, ...cardForm, assignedTo: selectedAssignee }
              : card
          ),
        }))
      );
      toast.success('카드가 수정되었습니다.');
    } else if (currentBoardId !== null) {
      // 추가
      const newCard: KanbanCard = {
        id: Date.now(),
        ...cardForm,
        boardId: currentBoardId,
        assignedTo: selectedAssignee,
      };

      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === currentBoardId
            ? { ...board, cards: [...board.cards, newCard] }
            : board
        )
      );
      toast.success('카드가 추가되었습니다.');
    }

    setIsCardModalOpen(false);
    setEditingCard(null);
    setCurrentBoardId(null);
    setCardForm({ title: '', description: '', startDate: '', dueDate: '' });
    setSelectedAssignee(null);
    setNewComment('');
    setCardComments([]);
  };

  // 카드 삭제
  const handleDeleteCard = (cardId: number) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) => ({
        ...board,
        cards: board.cards.filter((card) => card.id !== cardId),
      }))
    );
    toast.success('카드가 삭제되었습니다.');
  };

  // 보드 추가
  const handleAddBoard = () => {
    if (!newBoardTitle) {
      toast.error('보드 이름을 입력해주세요.');
      return;
    }

    const newBoard: KanbanBoard = {
      id: Date.now(),
      title: newBoardTitle,
      cards: [],
    };

    setBoards([...boards, newBoard]);
    toast.success('보드가 추가되었습니다.');
    setIsBoardModalOpen(false);
    setNewBoardTitle('');
  };

  // 보드 삭제
  const handleDeleteBoard = (boardId: number) => {
    if (boards.length <= 1) {
      toast.error('최소 1개의 보드는 필요합니다.');
      return;
    }

    setBoards(boards.filter(b => b.id !== boardId));
    toast.success('보드가 삭제되었습니다.');
  };

  // 코멘트 추가 핸들러
  const handleAddComment = () => {
    if (!newComment.trim() || !editingCard) {
      toast.error('코멘트를 입력해주세요.');
      return;
    }

    const comment: Comment = {
      id: Date.now(),
      author: '김작가', // 아티스트 이름
      content: newComment,
      createdAt: new Date().toLocaleString('ko-KR'),
      role: 'artist' // 아티스트
    };

    // 카드의 코멘트 목록에 추가
    const updatedCard = {
      ...editingCard,
      comments: [...(editingCard.comments || []), comment]
    };

    setEditingCard(updatedCard);
    setCardComments([...(editingCard.comments || []), comment]);

    // localStorage에 피드백 저장
    const feedback = {
      id: `artist-${Date.now()}`,
      projectId: project.id,
      project: project.title,
      cardTitle: editingCard.title,
      content: newComment,
      from: '김작가',
      date: '방금 전',
      isRead: false,
      role: 'artist'
    };

    const existingFeedbacks = localStorage.getItem('artistFeedbacks');
    const feedbacks = existingFeedbacks ? JSON.parse(existingFeedbacks) : [];
    feedbacks.unshift(feedback);
    localStorage.setItem('artistFeedbacks', JSON.stringify(feedbacks));

    setNewComment('');
    toast.success('코멘트가 추가되었습니다.');
  };

  // 코멘트 수정 시작
  const handleStartEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditingCommentContent(comment.content);
  };

  // 코멘트 수정 저장
  const handleSaveEditComment = () => {
    if (!editingComment || !editingCard) return;

    const updatedComments = (editingCard.comments || []).map((c) =>
      c.id === editingComment.id
        ? { ...c, content: editingCommentContent }
        : c
    );

    const updatedCard = {
      ...editingCard,
      comments: updatedComments
    };

    setEditingCard(updatedCard);
    setCardComments(updatedComments);

    // 보드 상태도 업데이트
    setBoards((prevBoards) =>
      prevBoards.map((board) => ({
        ...board,
        cards: board.cards.map((card) =>
          card.id === editingCard.id
            ? updatedCard
            : card
        ),
      }))
    );

    setEditingComment(null);
    setEditingCommentContent('');
    toast.success('코멘트가 수정되었습니다.');
  };

  // 코멘트 삭제
  const handleDeleteComment = (commentId: number) => {
    if (!editingCard) return;

    const updatedComments = (editingCard.comments || []).filter((c) => c.id !== commentId);

    const updatedCard = {
      ...editingCard,
      comments: updatedComments
    };

    setEditingCard(updatedCard);
    setCardComments(updatedComments);

    // 보드 상태도 업데이트
    setBoards((prevBoards) =>
      prevBoards.map((board) => ({
        ...board,
        cards: board.cards.map((card) =>
          card.id === editingCard.id
            ? updatedCard
            : card
        ),
      }))
    );

    toast.success('코멘트가 삭제되었습니다.');
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
                      >
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleToggleEditMode}
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      편집
                    </Button>
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
                    onClick={isEditMode ? handleChangeThumbnail : undefined}
                  >
                    <ImageWithFallback
                      src={editedProject.thumbnail || 'https://images.unsplash.com/photo-1591788806059-cb6e2f6a2498?w=400'}
                      alt={editedProject.title}
                      className="w-32 h-44 object-cover rounded-lg border-2 border-border shadow-md"
                    />
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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

                  {/* 작가명 */}
                  {editedProject.artistName && (
                    <div className="mb-3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editedProject.artistName}
                          onChange={(e) => setEditedProject({ ...editedProject, artistName: e.target.value })}
                          placeholder="작가명"
                          className="text-lg text-muted-foreground px-2 py-1 border border-border rounded-md bg-background"
                        />
                      ) : (
                        <p className="text-lg text-muted-foreground">작가: {editedProject.artistName}</p>
                      )}
                    </div>
                  )}
                  
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
                        onChange={(e) => setEditedProject({ ...editedProject, serialStatus: e.target.value as '연재중' | '휴재' | '완결' })}
                        className="text-sm px-3 py-1 border border-border rounded-md bg-background text-foreground"
                      >
                        <option>연재중</option>
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
                    >
                      <Users className="w-4 h-4 mr-2" />
                      팀원 보기 ({teamMembers.length}명)
                    </Button>

                    {/* 프로젝트 색상 선택 */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">프로젝트 일정 색상</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {colorPalette.map((item) => (
                          <button
                            key={item.color}
                            onClick={() => {
                              setProjectColor(item.color);
                              toast.success(`프로젝트 색상이 ${item.name}로 변경되었습니다.`);
                            }}
                            className="group relative"
                            title={item.name}
                          >
                            <div
                              className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
                                projectColor === item.color
                                  ? 'ring-2 ring-offset-2 ring-foreground'
                                  : 'hover:ring-2 hover:ring-offset-1 hover:ring-border'
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
                  <h2 className="text-xl font-bold text-foreground">프로젝트 관리</h2>
                  <Button
                    size="sm"
                    onClick={() => setIsBoardModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    보드 추가
                  </Button>
                </div>

                <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 flex-1 min-h-0">
                  {boards.map((board) => (
                    <DroppableBoard
                      key={board.id}
                      board={board}
                      onCardDrop={handleCardDrop}
                      onEdit={(card) => {
                        setEditingCard(card);
                        setSelectedAssignee(card.assignedTo || null);
                        setCardForm({
                          title: card.title,
                          description: card.description,
                          startDate: card.startDate,
                          dueDate: card.dueDate,
                        });
                        setIsCardModalOpen(true);
                      }}
                      onDelete={handleDeleteCard}
                      onAddCard={(boardId) => {
                        setCurrentBoardId(boardId);
                        setIsCardModalOpen(true);
                      }}
                      onDeleteBoard={handleDeleteBoard}
                      projectColor={projectColor}
                    />
                  ))}
                </div>
              </Card>
            </div>

            {/* 오른쪽: 이번 주 팀 일정 */}
            <div className="w-80 flex-shrink-0">
              <Card className="p-6 h-[calc(100vh-320px)] flex flex-col">
                <h2 className="text-xl font-bold text-foreground mb-4">이번 주 팀 일정</h2>
                
                <div className="space-y-3 overflow-y-auto flex-1">
                  {weeklySchedule.map((schedule, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-l-4 ${
                        schedule.day.includes('오늘')
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/20'
                      }`}
                      style={{
                        borderLeftColor: schedule.events.length > 0 ? projectColor : undefined
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-foreground">{schedule.day}</span>
                        <span className="text-xs text-muted-foreground">{schedule.date}</span>
                      </div>
                      
                      {schedule.events.length > 0 ? (
                        <div className="space-y-1">
                          {schedule.events.map((event, eventIdx) => (
                            <p key={eventIdx} className="text-xs text-foreground">• {event}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">일정 없음</p>
                      )}
                    </div>
                  ))}
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
            {(isTeamEditMode ? editingTeamMembers : teamMembers).map((member) => (
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
                    src={member.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
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

                {/* 팀원 수정 모드일 때만 삭제 버튼 표시 */}
                {isTeamEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTeamMember(member.id);
                    }}
                    className="ml-2 text-muted-foreground hover:text-destructive p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 수정 모드가 아닐 때: 하단에 수정 버튼 (가운데 정렬, 얇은 구분선 위) - 담당자 뷰에서만 표시 */}
          {!isTeamEditMode && !isArtistView && (
            <>
              <div className="border-t border-border mt-4 mb-3" />
              <div className="flex justify-center">
                <Button
                  size="sm"
                  onClick={handleStartTeamEdit}
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
              </div>
            </>
          )}

          {/* 수정 모드일 때: 하단에 저장/취소 버튼 */}
          {isTeamEditMode && (
            <>
              {/* 팀원 추가 버튼 */}
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
              
              <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelTeamEdit}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSaveTeamEdit}
                >
                  저장
                </Button>
              </div>
            </>
          )}
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

          {notAddedMembers.length === 0 ? (
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
                      src={member.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
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
              
              {/* 담당자 선택 */}
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">담당자</label>
                <select
                  value={selectedAssignee?.id || ''}
                  onChange={(e) => {
                    const selected = teamMembers.find(m => m.id === Number(e.target.value));
                    setSelectedAssignee(selected || null);
                  }}
                  className="w-full px-4 py-2.5 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm bg-background text-foreground"
                >
                  <option value="">선택하세요</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.role}
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

            {/* 코멘트 목록 */}
            <div className="space-y-4 max-h-[450px] overflow-y-auto">
              {(editingCard?.comments || cardComments).map((comment) => (
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
                          {comment.author.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{comment.author}</span>
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
                          onClick={() => handleDeleteComment(comment.id)}
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
              {(!editingCard?.comments || editingCard.comments.length === 0) && cardComments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">아직 코멘트가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 보드 추가 모달 */}
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