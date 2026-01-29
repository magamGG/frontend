import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const ArtistDashboardRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const ArtistDashboardBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

// 메인 레이아웃 그리드 (데스크탑: 2fr 1fr)
export const MainLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 왼쪽 메인 컬럼
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 오른쪽 사이드바 컬럼
export const SidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 오늘의 상태 카드
export const TodayStatusCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const TodayStatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const TodayStatusHeaderLeft = styled.div`
  flex: 1;
`;

export const TodayStatusTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const TodayStatusTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0;
`;

export const TodayStatusDate = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const TodayStatusHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HealthCheckWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background-color: color-mix(in srgb, #fbbf24 20%, transparent);
  border: 1px solid color-mix(in srgb, #fbbf24 40%, transparent);
  border-radius: 8px;
`;

// 상태 선택 드롭다운
export const StatusSelectContainer = styled.div`
  margin-bottom: 16px;
`;

export const StatusSelectLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 8px;
`;

export const StatusSelect = styled.select`
  width: 100%;
  padding: 10px 16px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background-color: var(--background);
  color: var(--foreground);
  font-weight: 500;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary);
  }
`;

// 근태 상태 카드들
export const AttendanceStatusCard = styled.div`
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.$borderColor};
  background: ${props => props.$bgColor};
`;

export const AttendanceStatusContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const AttendanceStatusLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AttendanceStatusIconContainer = styled.div`
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.$iconBgColor};
`;

export const AttendanceStatusText = styled.div`
  flex: 1;
`;

export const AttendanceStatusTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1F2328;
  margin: 0 0 4px 0;
`;

export const AttendanceStatusDescription = styled.p`
  font-size: 14px;
  color: rgba(31, 35, 40, 0.6);
  margin: 0;
`;

export const AttendancePeriodBox = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: 1px solid ${props => props.$borderColor};
`;

export const AttendancePeriodLabel = styled.p`
  font-size: 12px;
  color: rgba(31, 35, 40, 0.5);
  margin: 0 0 4px 0;
`;

export const AttendancePeriodValue = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #1F2328;
  margin: 0;
`;

// 상태 미선택 카드
export const EmptyStatusCard = styled.div`
  padding: 24px;
  background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  text-align: center;
  padding: 48px 24px;
`;

export const EmptyStatusIcon = styled.div`
  width: 64px;
  height: 64px;
  background-color: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

export const EmptyStatusTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #4b5563;
  margin: 0 0 8px 0;
`;

export const EmptyStatusDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

// 피드백/마감일/신청현황 그리드
export const QuickInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
`;

export const QuickInfoCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const QuickInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

export const QuickInfoTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const QuickInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 피드백 아이템
export const FeedbackItem = styled.div`
  padding: 8px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.$borderColor || '#6E8FB3'};
  background-color: ${props => props.$isUnread ? 'color-mix(in srgb, #3b82f6 10%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)'};
`;

export const FeedbackItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const FeedbackProject = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
`;

export const FeedbackUnreadDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #3b82f6;
  border-radius: 50%;
`;

export const FeedbackContent = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const FeedbackMeta = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
`;

// 마감일 아이템
export const DeadlineItem = styled.div`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${props => props.$isUrgent ? 'color-mix(in srgb, #ef4444 20%, transparent)' : 'var(--border)'};
  background-color: ${props => props.$isUrgent ? 'color-mix(in srgb, #ef4444 10%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)'};
`;

export const DeadlineName = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
`;

export const DeadlineMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
`;

export const DeadlineDate = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 신청 현황 아이템
export const AttendanceRequestItem = styled.div`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
`;

export const AttendanceRequestHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const AttendanceRequestType = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
`;

export const AttendanceRequestDate = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 신청 현황 카드 헤더 (스크린샷 참고)
export const AttendanceRequestCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 4px 0;
`;

// 신청 현황 카드 리스트
export const AttendanceRequestCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 신청 현황 카드 아이템
export const AttendanceRequestCardItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: white;
  border: 1px solid var(--border);
  border-radius: 8px;
`;

export const AttendanceRequestCardItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const AttendanceRequestCardItemTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const AttendanceRequestCardItemDate = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const AttendanceRequestCardItemBadge = styled.div`
  padding: 4px 12px;
  border-radius: 9999px;
  background-color: ${props => props.$statusColor};
  color: white;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

// 오늘 할 일 카드
export const TasksCard = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const TasksTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
`;

export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--muted-foreground);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--foreground);
  }
`;

// 할 일 아이템
export const TaskItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  border: ${props => props.$isUrgent ? '2px solid color-mix(in srgb, #ef4444 20%, transparent)' : '1px solid var(--border)'};
  background: ${props => {
    if (props.$isCompleted) return 'white';
    if (props.$isUrgent) return 'linear-gradient(to right, color-mix(in srgb, #ef4444 10%, transparent), color-mix(in srgb, #f97316 10%, transparent))';
    return 'white';
  }};
  position: relative;
`;

export const TaskItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const TaskProject = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const TaskCompleteButton = styled.button`
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${props => props.$isCompleted ? '#10B981' : '#E5E7EB'};
  color: ${props => props.$isCompleted ? 'white' : '#6B7280'};
  
  &:hover {
    background-color: ${props => props.$isCompleted ? '#059669' : '#D1D5DB'};
  }
`;

export const TaskContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const TaskTitle = styled.h4`
  font-size: 16px;
  font-weight: ${props => props.$isUrgent ? '600' : '500'};
  color: var(--foreground);
  margin: 0;
  text-decoration: ${props => props.$isCompleted ? 'line-through' : 'none'};
  opacity: ${props => props.$isCompleted ? '0.5' : '1'};
  transition: all 0.2s;
`;

export const TaskBadgeContainer = styled.div`
  margin-bottom: 8px;
`;

export const TaskBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: ${props => {
    if (props.$badgeColor === 'destructive') return '#F97316';
    if (props.$badgeColor === 'blue') return '#3B82F6';
    if (props.$badgeColor === 'purple') return '#8B5CF6';
    return '#6B7280';
  }};
`;

export const TaskDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
  opacity: ${props => props.$isCompleted ? '0.5' : '1'};
  transition: all 0.2s;
`;

export const TaskViewAllButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 8px;
  background-color: transparent;
  border: none;
  color: var(--muted-foreground);
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--foreground);
  }
`;

// 할 일 모달 스타일
export const TaskModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskModalItem = styled.div`
  padding: 16px;
  background-color: #F9FAFB;
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const TaskModalItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const TaskModalBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  background-color: #E5E7EB;
  color: #6B7280;
  font-size: 12px;
  font-weight: 500;
  margin: 0;
`;

export const TaskModalTitleLabel = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 4px 0;
  font-weight: 500;
`;

export const TaskModalTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 12px 0;
  text-decoration: ${props => props.$isCompleted ? 'line-through' : 'none'};
  opacity: ${props => props.$isCompleted ? '0.5' : '1'};
  transition: all 0.2s;
`;

export const TaskModalDescriptionLabel = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 4px 0;
  font-weight: 500;
`;

export const TaskModalDescription = styled.p`
  font-size: 14px;
  color: var(--foreground);
  margin: 0 0 12px 0;
  opacity: ${props => props.$isCompleted ? '0.5' : '1'};
  transition: all 0.2s;
`;

export const TaskModalMeta = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 메모 섹션
export const MemoButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 2px dashed var(--border);
  border-radius: 8px;
  background-color: transparent;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: var(--primary);
    background-color: color-mix(in srgb, var(--primary) 5%, transparent);
  }
`;

export const MemoCard = styled.div`
  background-color: #FFFDE7;   /* 메모지 노란색 배경 */
  border: 1px solid #FFE082;   /* 연한 주황색 테두리 */
  border-radius: 16px;         /* 둥근 모서리 */
  padding: 20px;               /* 안쪽 여백 */
  margin-bottom: 16px;         /* 메모 간격 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* 살짝 그림자 효과 */
  position: relative;
`;

export const MemoHeader = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 12px;
`;

export const MemoTitle = styled.h3`
  margin: 0; 
  font-size: 1.1rem; 
  font-weight: 700;
  color: var(--foreground);
`;

export const MemoActions = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const MemoContent = styled.p`
  margin: 0;
  color: #444; 
  line-height: 1.5;
  white-space: pre-wrap;
`;

// 모달 폼 스타일
export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const ConditionButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
`;

export const ConditionButton = styled.button`
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid ${props => props.$isSelected ? 'var(--primary)' : 'var(--border)'};
  background-color: ${props => props.$isSelected ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent'};
  color: ${props => props.$isSelected ? 'var(--primary)' : 'var(--foreground)'};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: color-mix(in srgb, var(--primary) 50%, transparent);
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const RangeValue = styled.span`
  font-weight: 500;
  color: var(--foreground);
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 8px;
`;

// 경고 박스
export const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: color-mix(in srgb, #fbbf24 20%, transparent);
  border: 1px solid color-mix(in srgb, #fbbf24 40%, transparent);
  border-radius: 8px;
`;

export const WarningContent = styled.div`
  flex: 1;
`;

export const WarningTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const WarningDescription = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 모달 리스트 스타일
export const ModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
`;

export const ModalListItem = styled.div`
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.$borderColor || 'var(--border)'};
  background-color: ${props => props.$bgColor || 'color-mix(in srgb, var(--muted) 30%, transparent)'};
  transition: all 0.2s;
  box-shadow: ${props => props.$hasShadow ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};
`;

export const ModalListItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const ModalListItemContent = styled.div`
  flex: 1;
`;

export const ModalListItemBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const ModalListItemTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const ModalListItemText = styled.p`
  font-size: 14px;
  color: var(--foreground);
  margin: 0 0 12px 0;
  white-space: pre-wrap;
`;

export const ModalListItemMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const ModalListItemMetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 빈 상태
export const EmptyState = styled.div`
  text-align: center;
  padding: 64px 32px;
`;

export const EmptyStateIcon = styled.div`
  margin: 0 auto 12px;
  opacity: 0.5;
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 신청 현황 모달 스타일
export const AttendanceRequestModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const AttendanceRequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
`;

export const AttendanceRequestCard = styled.div`
  padding: 16px;
  background-color: white;
  border: 1px solid var(--border);
  border-radius: 8px;
`;

export const AttendanceRequestCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const AttendanceRequestStatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 9999px;
  background-color: ${props => props.$statusColor};
  color: white;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const AttendanceRequestInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AttendanceRequestTypeText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
`;

export const AttendanceRequestDateText = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const AttendanceRequestActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const AttendanceRequestSummary = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background-color: var(--muted);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const AttendanceRequestSummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const AttendanceRequestSummaryNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.$color || 'var(--foreground)'};
`;

export const AttendanceRequestSummaryLabel = styled.div`
  font-size: 12px;
  color: var(--muted-foreground);
`;
