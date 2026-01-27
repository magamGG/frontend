import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AdminCalendarRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
  overflow-y: auto;
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AdminCalendarBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

// 메인 레이아웃 그리드 (데스크탑: 2fr 1fr)
export const AdminCalendarLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  min-height: calc(100vh - 180px);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// 필터 카드
export const AdminCalendarFilterCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 16px;
`;

export const AdminCalendarFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const AdminCalendarFilterField = styled.div`
  flex: 1;
`;

export const AdminCalendarFilterLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  display: block;
  margin-bottom: 4px;
`;

export const AdminCalendarFilterSelect = styled.select`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  border: 2px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 12px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
  }
`;

// 캘린더 카드
export const AdminCalendarCard = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const AdminCalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

export const AdminCalendarHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const AdminCalendarMonthTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const AdminCalendarHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 근태 범례
export const AdminCalendarLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
`;

export const AdminCalendarLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AdminCalendarLegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid ${props => props.$borderColor || 'transparent'};
  background-color: ${props => props.$backgroundColor || 'transparent'};
`;

export const AdminCalendarLegendLabel = styled.span`
  font-size: 12px;
  color: var(--muted-foreground);
`;

// 캘린더 그리드 컨테이너
export const AdminCalendarGridContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

// 요일 헤더 그리드
export const AdminCalendarDaysOfWeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 8px;
  flex-shrink: 0;
`;

export const AdminCalendarDayOfWeekHeader = styled.div`
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted-foreground);
`;

// 날짜 그리드
export const AdminCalendarDatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
  flex: 1;
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
`;

// 날짜 셀
export const AdminCalendarDateCell = styled.div`
  width: 100%;
  height: 100%;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  border: ${props => props.$isToday ? '2px solid #22C55E' : '1px solid var(--border)'};
  border-right: ${props => props.$isToday ? '2px solid #22C55E' : '1px solid var(--border)'};
  border-bottom: ${props => props.$isToday ? '2px solid #22C55E' : '1px solid var(--border)'};
  border-top: ${props => props.$isToday ? '2px solid #22C55E' : '1px solid var(--border)'};
  border-left: ${props => props.$isToday ? '2px solid #22C55E' : '1px solid var(--border)'};
  padding: 8px;
  background-color: ${props => {
    if (props.$isToday) return '#ECFDF5'; // 연한 초록색 배경 (다른 곳에서 사용하지 않는 색)
    if (props.$attendanceType === 'workation') return 'rgba(168, 85, 247, 0.15)';
    if (props.$attendanceType === 'break') return 'rgba(156, 163, 175, 0.25)';
    return 'transparent';
  }};
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;

  &:hover {
    background-color: ${props => {
      if (props.$isToday) return '#D1FAE5'; // 호버 시 약간 더 진한 초록색
      if (props.$attendanceType === 'workation') return 'rgba(168, 85, 247, 0.25)';
      if (props.$attendanceType === 'break') return 'rgba(156, 163, 175, 0.35)';
      return 'color-mix(in srgb, var(--muted) 50%, transparent)';
    }};
  }
`;

export const AdminCalendarDateNumber = styled.div`
  font-size: 14px;
  font-weight: ${props => (props.$isToday ? '700' : '500')};
  color: ${props => (props.$isToday ? 'var(--primary)' : 'var(--foreground)')};
  margin-bottom: 4px;
  flex-shrink: 0;
`;

export const AdminCalendarDateEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow: visible;
  position: relative;
`;

// 메모 표시
export const AdminCalendarDateMemo = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
  cursor: pointer;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;

  &:hover {
    background-color: #fde68a;
  }
`;

// 이벤트 바 (다중 날짜)
export const AdminCalendarEventBar = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${props => props.$color || '#6E8FB3'};
  width: ${props => props.$width || '100%'};
  position: ${props => (props.$isMultiDay ? 'absolute' : 'relative')};
  left: ${props => (props.$isMultiDay ? '0' : 'auto')};
  top: ${props => (props.$isMultiDay ? `${props.$topOffset || 0}px` : 'auto')};
  z-index: ${props => (props.$isMultiDay ? 10 : 1)};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

// 더보기 텍스트 (일정 3개 이상일 때)
export const AdminCalendarMoreEvents = styled.div`
  font-size: 12px;
  color: white;
  background-color: #8B5CF6;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background-color: #7C3AED;
  }
`;

// 사이드바
export const AdminCalendarSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

export const AdminCalendarSidebarCard = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
`;

export const AdminCalendarSidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

export const AdminCalendarSidebarHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AdminCalendarSidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const AdminCalendarSidebarMoreButton = styled.button`
  font-size: 12px;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: var(--primary);
    opacity: 0.8;
  }
`;

export const AdminCalendarSidebarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
`;

// 일정 조정 아이템
export const AdminCalendarScheduleChangeItem = styled.div`
  padding: 12px;
  background-color: #eff6ff;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
  flex-shrink: 0;
`;

export const AdminCalendarScheduleChangeHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const AdminCalendarScheduleChangeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AdminCalendarScheduleChangeTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #1e3a8a;
  margin: 0;
`;

export const AdminCalendarScheduleChangeEpisode = styled.p`
  font-size: 12px;
  color: #1e40af;
  margin: 0;
`;

export const AdminCalendarScheduleChangeDates = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

export const AdminCalendarScheduleChangeDate = styled.span`
  font-size: 12px;
  color: #2563eb;
  text-decoration: ${props => (props.$isOld ? 'line-through' : 'none')};
`;

export const AdminCalendarScheduleChangeArrow = styled.span`
  font-size: 12px;
  color: #2563eb;
`;

export const AdminCalendarScheduleChangeReason = styled.p`
  font-size: 12px;
  color: #3b82f6;
  margin: 4px 0 0 0;
`;

// 다가오는 마감 아이템
export const AdminCalendarDeadlineItem = styled.div`
  padding: 12px;
  background-color: #fff7ed;
  border-radius: 8px;
  border: 1px solid #fed7aa;
  flex-shrink: 0;
`;

export const AdminCalendarDeadlineContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const AdminCalendarDeadlineColorBar = styled.div`
  width: 4px;
  height: 100%;
  border-radius: 2px;
  flex-shrink: 0;
  background-color: ${props => props.$color || 'var(--primary)'};
  min-height: 40px;
`;

export const AdminCalendarDeadlineDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AdminCalendarDeadlineTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #92400e;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AdminCalendarDeadlineDate = styled.p`
  font-size: 12px;
  color: #c2410c;
  margin: 0 0 8px 0;
`;

// 빈 상태
export const AdminCalendarEmptyState = styled.div`
  text-align: center;
  color: var(--muted-foreground);
  font-size: 12px;
  padding: 16px;
  background-color: color-mix(in srgb, var(--muted) 20%, transparent);
  border-radius: 8px;
`;

// 모달 스타일
export const AdminCalendarModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AdminCalendarModalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AdminCalendarModalLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const AdminCalendarModalTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
  }
`;

export const AdminCalendarModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
`;

// 더보기 모달 리스트
export const AdminCalendarModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
`;

export const AdminCalendarModalListItem = styled.div`
  padding: 16px;
  background-color: ${props => (props.$bgColor || '#eff6ff')};
  border-radius: 8px;
  border: 1px solid ${props => (props.$borderColor || '#bfdbfe')};
  flex-shrink: 0;
`;

export const AdminCalendarModalListItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const AdminCalendarModalListItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AdminCalendarModalListItemTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${props => (props.$textColor || '#1e3a8a')};
  margin: 0;
`;

export const AdminCalendarModalListItemSubtitle = styled.p`
  font-size: 12px;
  color: ${props => (props.$subTextColor || '#1e40af')};
  margin: 0;
`;

export const AdminCalendarModalListItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

export const AdminCalendarModalListItemDate = styled.span`
  font-size: 12px;
  color: ${props => (props.$textColor || '#2563eb')};
  text-decoration: ${props => (props.$isOld ? 'line-through' : 'none')};
`;

export const AdminCalendarModalListItemArrow = styled.span`
  font-size: 12px;
  color: ${props => (props.$textColor || '#2563eb')};
`;

export const AdminCalendarModalListItemReason = styled.p`
  font-size: 12px;
  color: ${props => (props.$reasonColor || '#3b82f6')};
  margin: 4px 0 0 0;
`;

export const AdminCalendarModalEmptyState = styled.div`
  text-align: center;
  color: var(--muted-foreground);
  font-size: 14px;
  padding: 32px;
  background-color: color-mix(in srgb, var(--muted) 20%, transparent);
  border-radius: 8px;
`;

// 일정 상세 모달 스타일 (작가 캘린더와 동일)
export const AdminEventDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AdminEventDetailCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => `${props.$color}10`};
  border-left: 4px solid ${props => props.$color};
`;

export const AdminEventDetailTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const AdminEventDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
`;

export const AdminEventDetailText = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;
