import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { ChevronLeft, ChevronRight, Plus, AlignLeft, Palette } from 'lucide-react';
import { toast } from 'sonner';
import {
  CalendarRoot,
  CalendarBody,
  CalendarLayoutGrid,
  CalendarCard,
  CalendarHeader,
  CalendarHeaderLeft,
  CalendarMonthTitle,
  CalendarHeaderRight,
  CalendarGridContainer,
  DaysOfWeekGrid,
  DayOfWeekHeader,
  DatesGrid,
  DateCell,
  DateNumber,
  DateEventsList,
  DateEventItem,
  DateMoreEvents,
  UpcomingEventsSidebar,
  UpcomingEventsCard,
  UpcomingEventsTitle,
  UpcomingEventsList,
  UpcomingEventItem,
  UpcomingEventContent,
  UpcomingEventColorBar,
  UpcomingEventDetails,
  UpcomingEventTitle,
  UpcomingEventDate,
  UpcomingEventProject,
  EmptyUpcomingEvents,
  ModalForm,
  FormTitleInput,
  FormRow,
  FormLabel,
  FormSelect,
  ColorPickerContainer,
  ColorPickerLabel,
  ColorPickerGrid,
  ColorPickerButton,
  FormTextarea,
  ModalActions,
  EventDetailContainer,
  EventDetailCard,
  EventDetailTitle,
  EventDetailInfo,
  EventDetailText,
  EventDetailActions,
} from './CalendarPage.styled';

// 작업 유형 정의
const WORK_TYPE = {
  NONE: 'none',
  SERIALIZATION: 'serialization',
  BREAK: 'break',
  WORKATION: 'workation',
  OTHER: 'other',
};

// 작업 유형 표시명
const WORK_TYPE_LABELS = {
  [WORK_TYPE.SERIALIZATION]: '마감',
  [WORK_TYPE.BREAK]: '휴재',
  [WORK_TYPE.WORKATION]: '워케이션',
  [WORK_TYPE.OTHER]: '기타',
};

// 색상 프리셋
const COLOR_PRESETS = [
  { color: '#EF4444', name: '빨강' },
  { color: '#F59E0B', name: '주황' },
  { color: '#10B981', name: '초록' },
  { color: '#3B82F6', name: '파랑' },
  { color: '#6E8FB3', name: '스틸블루' },
  { color: '#8B5CF6', name: '보라' },
  { color: '#EC4899', name: '핑크' },
  { color: '#6B7280', name: '회색' },
];

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const currentMonth = '2026년 1월';
const currentDay = 13; // 오늘 날짜

export function CalendarPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    project: 'all',
    color: '#6E8FB3',
    description: '',
    workType: WORK_TYPE.NONE,
  });

  // TODO: Zustand store mapping - 모든 일정 데이터
  const [allEvents, setAllEvents] = useState([
    {
      id: '1',
      date: 5,
      title: '에피소드 42 마감',
      workType: WORK_TYPE.SERIALIZATION,
      project: '내 웹툰',
      description: '최종 검수 필요',
      color: '#EF4444',
    },
    {
      id: '2',
      date: 8,
      title: '에피소드 43 스케치 완료',
      workType: WORK_TYPE.SERIALIZATION,
      project: '내 웹툰',
      color: '#F59E0B',
    },
    {
      id: '3',
      date: 12,
      title: '팀 미팅',
      workType: WORK_TYPE.NONE,
      project: '전체',
      color: '#3B82F6',
    },
    {
      id: '4',
      date: 15,
      title: '휴재',
      workType: WORK_TYPE.BREAK,
      project: '전체',
      color: '#6E8FB3',
    },
    {
      id: '5',
      date: 20,
      title: '신작 기획안 제출',
      workType: WORK_TYPE.NONE,
      project: '신작',
      color: '#EF4444',
    },
    {
      id: '6',
      date: 18,
      title: '전체 회의',
      workType: WORK_TYPE.NONE,
      project: '전체',
      color: '#3B82F6',
    },
    {
      id: '7',
      date: 22,
      title: '워크숍',
      workType: WORK_TYPE.NONE,
      project: '전체',
      color: '#10B981',
    },
  ]);

  // 필터링된 일정
  const filteredEvents = allEvents.filter((event) => {
    if (filterCategory === 'all') return true;
    return event.project === filterCategory;
  });

  // 선택된 날짜의 일정들
  const selectedDateEvents = selectedDate ? filteredEvents.filter((e) => e.date === selectedDate) : [];

  // 다가오는 일정 (오늘 기준 이후, 정렬됨)
  const upcomingEvents = filteredEvents
    .filter((e) => e.date >= currentDay)
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  // 날짜 클릭 핸들러
  const handleDateClick = (day) => {
    const dayEvents = filteredEvents.filter((e) => e.date === day);
    if (dayEvents.length > 0) {
      setSelectedDate(day);
      setSelectedEventIndex(0);
    }
  };

  // 일정 추가 핸들러
  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!newEvent.startDate) {
      toast.error('시작 날짜를 선택해주세요.');
      return;
    }

    const event = {
      id: Date.now().toString(),
      date: parseInt(newEvent.startDate.split('-')[2]) || 1,
      title: newEvent.title,
      workType: newEvent.workType,
      project: newEvent.project === 'all' ? '전체' : newEvent.project,
      description: newEvent.description,
      color: newEvent.color,
    };
    setAllEvents([...allEvents, event]);
    setIsAddModalOpen(false);
    setNewEvent({
      title: '',
      startDate: '',
      endDate: '',
      project: 'all',
      color: '#6E8FB3',
      description: '',
      workType: WORK_TYPE.NONE,
    });
    toast.success('일정이 추가되었습니다.');
  };

  // 일정 수정 핸들러
  const handleEditEvent = () => {
    if (!editingEvent) return;

    const updatedEvents = allEvents.map((e) => (e.id === editingEvent.id ? editingEvent : e));
    setAllEvents(updatedEvents);
    setIsEditModalOpen(false);
    setEditingEvent(null);
    toast.success('일정이 수정되었습니다.');
  };

  // 일정 삭제 핸들러
  const handleDeleteEvent = (eventId) => {
    setAllEvents(allEvents.filter((e) => e.id !== eventId));
    setSelectedDate(null);
    toast.success('일정이 삭제되었습니다.');
  };

  // 수정 모달 열기
  const openEditModal = () => {
    const eventToEdit = selectedDateEvents[selectedEventIndex];
    if (eventToEdit) {
      setEditingEvent({ ...eventToEdit });
      setSelectedDate(null);
      setIsEditModalOpen(true);
    }
  };

  return (
    <CalendarRoot>
      <CalendarBody>
        <CalendarLayoutGrid>
          {/* 왼쪽: 캘린더 (2/3) */}
          <CalendarCard>
            <CalendarHeader>
              <CalendarHeaderLeft>
                <CalendarMonthTitle>{currentMonth}</CalendarMonthTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CalendarHeaderLeft>

              <CalendarHeaderRight>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-9 px-3 py-2 rounded-md border-2 border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors min-w-[110px]"
                >
                  <option value="all">전체</option>
                  <option value="내 웹툰">내 웹툰</option>
                  <option value="신작">신작</option>
                </select>

                <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  일정 추가
                </Button>
              </CalendarHeaderRight>
            </CalendarHeader>

            <CalendarGridContainer>
              {/* 요일 헤더 */}
              <DaysOfWeekGrid>
                {daysOfWeek.map((day) => (
                  <DayOfWeekHeader key={day}>{day}</DayOfWeekHeader>
                ))}
              </DaysOfWeekGrid>

              {/* 날짜 그리드 */}
              <DatesGrid>
                {/* 첫 주 빈 셀 (1월 1일이 수요일이므로 3개) */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* 날짜 셀들 */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === currentDay;
                  const dayEvents = filteredEvents.filter((e) => e.date === day);

                  return (
                    <DateCell
                      key={day}
                      onClick={() => handleDateClick(day)}
                      $isToday={isToday}
                    >
                      <DateNumber $isToday={isToday}>{day}</DateNumber>
                      <DateEventsList>
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <DateEventItem key={idx} $color={event.color}>
                            {event.title}
                          </DateEventItem>
                        ))}
                        {dayEvents.length > 3 && (
                          <DateMoreEvents>+{dayEvents.length - 3}개 더보기</DateMoreEvents>
                        )}
                      </DateEventsList>
                    </DateCell>
                  );
                })}

                {/* 마지막 주 빈 셀 */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`empty-end-${i}`} />
                ))}
              </DatesGrid>
            </CalendarGridContainer>
          </CalendarCard>

          {/* 오른쪽: 다가오는 일정 (1/3) */}
          <UpcomingEventsSidebar>
            <UpcomingEventsCard>
              <UpcomingEventsTitle>다가오는 일정</UpcomingEventsTitle>
              <UpcomingEventsList>
                {upcomingEvents.length === 0 ? (
                  <EmptyUpcomingEvents>다가오는 일정이 없습니다</EmptyUpcomingEvents>
                ) : (
                  upcomingEvents.map((event, idx) => (
                    <UpcomingEventItem
                      key={idx}
                      onClick={() => {
                        setSelectedDate(event.date);
                        setSelectedEventIndex(0);
                      }}
                    >
                      <UpcomingEventContent>
                        <UpcomingEventColorBar $color={event.color} />
                        <UpcomingEventDetails>
                          <UpcomingEventTitle>{event.title}</UpcomingEventTitle>
                          <UpcomingEventDate>1월 {event.date}일</UpcomingEventDate>
                          <UpcomingEventProject>{event.project}</UpcomingEventProject>
                        </UpcomingEventDetails>
                      </UpcomingEventContent>
                      <Badge
                        className="text-xs"
                        variant={
                          event.workType === WORK_TYPE.SERIALIZATION
                            ? 'destructive'
                            : event.workType === WORK_TYPE.BREAK
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {WORK_TYPE_LABELS[event.workType] || '기타'}
                      </Badge>
                    </UpcomingEventItem>
                  ))
                )}
              </UpcomingEventsList>
            </UpcomingEventsCard>
          </UpcomingEventsSidebar>
        </CalendarLayoutGrid>
      </CalendarBody>

      {/* 일정 추가 모달 */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="일정 추가" maxWidth="xl">
        <ModalForm>
          <FormTitleInput
            type="text"
            placeholder="제목 추가"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />

          <FormRow>
            <FormLabel>시작 날짜</FormLabel>
            <input
              type="date"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            />
          </FormRow>

          <FormRow>
            <FormLabel>종료 날짜</FormLabel>
            <input
              type="date"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            />
          </FormRow>

          <FormRow>
            <FormLabel>작업 유형</FormLabel>
            <FormSelect
              value={newEvent.workType}
              onChange={(e) => setNewEvent({ ...newEvent, workType: e.target.value })}
            >
              <option value={WORK_TYPE.NONE}>없음</option>
              <option value={WORK_TYPE.SERIALIZATION}>연재</option>
              <option value={WORK_TYPE.BREAK}>휴재</option>
              <option value={WORK_TYPE.WORKATION}>워케이션</option>
              <option value={WORK_TYPE.OTHER}>기타</option>
            </FormSelect>
          </FormRow>

          <FormRow>
            <FormLabel>작품</FormLabel>
            <FormSelect
              value={newEvent.project}
              onChange={(e) => setNewEvent({ ...newEvent, project: e.target.value })}
            >
              <option value="all">전체</option>
              <option value="내 웹툰">내 웹툰</option>
              <option value="신작">신작</option>
            </FormSelect>
          </FormRow>

          <FormRow>
            <ColorPickerContainer>
              <ColorPickerLabel>
                <Palette className="w-4 h-4" />
                색상
              </ColorPickerLabel>
              <ColorPickerGrid>
                {COLOR_PRESETS.map((preset) => (
                  <ColorPickerButton
                    key={preset.color}
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, color: preset.color })}
                    $color={preset.color}
                    $isSelected={newEvent.color === preset.color}
                    title={preset.name}
                  />
                ))}
              </ColorPickerGrid>
            </ColorPickerContainer>
          </FormRow>

          <FormRow>
            <ColorPickerLabel>
              <AlignLeft className="w-4 h-4" />
              설명
            </ColorPickerLabel>
            <FormTextarea
              placeholder="설명 추가"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
            />
          </FormRow>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddEvent}>저장</Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      {/* 일정 수정 모달 */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="일정 수정" maxWidth="xl">
        {editingEvent && (
          <ModalForm>
            <FormTitleInput
              type="text"
              placeholder="제목 추가"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
            />

            <FormRow>
              <FormLabel>작업 유형</FormLabel>
              <FormSelect
                value={editingEvent.workType}
                onChange={(e) => setEditingEvent({ ...editingEvent, workType: e.target.value })}
              >
                <option value={WORK_TYPE.NONE}>없음</option>
                <option value={WORK_TYPE.SERIALIZATION}>연재</option>
                <option value={WORK_TYPE.BREAK}>휴재</option>
                <option value={WORK_TYPE.WORKATION}>워케이션</option>
                <option value={WORK_TYPE.OTHER}>기타</option>
              </FormSelect>
            </FormRow>

            <FormRow>
              <FormLabel>작품</FormLabel>
              <FormSelect
                value={editingEvent.project}
                onChange={(e) => setEditingEvent({ ...editingEvent, project: e.target.value })}
              >
                <option value="all">전체</option>
                <option value="내 웹툰">내 웹툰</option>
                <option value="신작">신작</option>
              </FormSelect>
            </FormRow>

            <FormRow>
              <ColorPickerContainer>
                <ColorPickerLabel>
                  <Palette className="w-4 h-4" />
                  색상
                </ColorPickerLabel>
                <ColorPickerGrid>
                  {COLOR_PRESETS.map((preset) => (
                    <ColorPickerButton
                      key={preset.color}
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, color: preset.color })}
                      $color={preset.color}
                      $isSelected={editingEvent.color === preset.color}
                      title={preset.name}
                    />
                  ))}
                </ColorPickerGrid>
              </ColorPickerContainer>
            </FormRow>

            <FormRow>
              <ColorPickerLabel>
                <AlignLeft className="w-4 h-4" />
                설명
              </ColorPickerLabel>
              <FormTextarea
                placeholder="설명 추가"
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                rows={3}
              />
            </FormRow>

            <ModalActions>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                취소
              </Button>
              <Button onClick={handleEditEvent}>저장</Button>
            </ModalActions>
          </ModalForm>
        )}
      </Modal>

      {/* 날짜 클릭 시 일정 상세 모달 */}
      <Modal
        isOpen={selectedDate !== null && selectedDateEvents.length > 0}
        onClose={() => setSelectedDate(null)}
        title={`1월 ${selectedDate}일 일정`}
        maxWidth="lg"
      >
        {selectedDateEvents.length > 0 && (
          <EventDetailContainer>
            {selectedDateEvents.length > 1 && (
              <FormRow>
                <FormLabel>일정 선택</FormLabel>
                <FormSelect
                  value={selectedEventIndex}
                  onChange={(e) => setSelectedEventIndex(Number(e.target.value))}
                >
                  {selectedDateEvents.map((event, idx) => (
                    <option key={idx} value={idx}>
                      {event.title}
                    </option>
                  ))}
                </FormSelect>
              </FormRow>
            )}

            {selectedDateEvents[selectedEventIndex] && (
              <>
                <EventDetailCard $color={selectedDateEvents[selectedEventIndex].color}>
                  <EventDetailTitle>{selectedDateEvents[selectedEventIndex].title}</EventDetailTitle>
                  <EventDetailInfo>
                    <EventDetailText>
                      <strong>날짜:</strong> 2026년 1월 {selectedDate}일
                    </EventDetailText>
                    <EventDetailText>
                      <strong>작품:</strong> {selectedDateEvents[selectedEventIndex].project}
                    </EventDetailText>
                    <EventDetailText>
                      <strong>유형:</strong>{' '}
                      <Badge
                        variant={
                          selectedDateEvents[selectedEventIndex].workType === WORK_TYPE.SERIALIZATION
                            ? 'destructive'
                            : selectedDateEvents[selectedEventIndex].workType === WORK_TYPE.BREAK
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {WORK_TYPE_LABELS[selectedDateEvents[selectedEventIndex].workType] || '기타'}
                      </Badge>
                    </EventDetailText>
                    {selectedDateEvents[selectedEventIndex].description && (
                      <div style={{ paddingTop: '8px' }}>
                        <strong className="block mb-1">설명:</strong>
                        <EventDetailText>{selectedDateEvents[selectedEventIndex].description}</EventDetailText>
                      </div>
                    )}
                  </EventDetailInfo>
                </EventDetailCard>

                <EventDetailActions>
                  <Button variant="outline" className="flex-1" onClick={openEditModal}>
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDeleteEvent(selectedDateEvents[selectedEventIndex].id)}
                  >
                    삭제
                  </Button>
                </EventDetailActions>
              </>
            )}
          </EventDetailContainer>
        )}
      </Modal>
    </CalendarRoot>
  );
}
