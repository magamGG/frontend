import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/app/components/Modal';
import { ChevronLeft, ChevronRight, Plus, AlignLeft, Palette } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Event {
  id: string;
  date: number;
  title: string;
  workType: 'serialization' | 'break' | 'workation' | 'other';
  project: string;
  description?: string;
  color?: string;
}

export function CalendarPage() {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const currentMonth = '2026년 1월';
  
  const [filterCategory, setFilterCategory] = useState<'all' | string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    project: 'all' as 'all' | '내 웹툰' | '신작',
    color: '#6E8FB3' as string,
    description: '',
    workType: 'none' as 'serialization' | 'break' | 'workation' | 'other',
  });

  // 모든 일정 데이터
  const [allEvents, setAllEvents] = useState<Event[]>([
    { id: '1', date: 5, title: '에피소드 42 마감', workType: 'serialization', project: '내 웹툰', description: '최종 검수 필요', color: '#EF4444' },
    { id: '2', date: 8, title: '에피소드 43 스케치 완료', workType: 'serialization', project: '내 웹툰', color: '#F59E0B' },
    { id: '3', date: 12, title: '팀 미팅', workType: 'none', project: '전체', color: '#3B82F6' },
    { id: '4', date: 15, title: '휴재', workType: 'break', project: '전체', color: '#6E8FB3' },
    { id: '5', date: 20, title: '신작 기획안 제출', workType: 'none', project: '신작', color: '#EF4444' },
    { id: '6', date: 18, title: '전체 회의', workType: 'none', project: '전체', color: '#3B82F6' },
    { id: '7', date: 22, title: '워크숍', workType: 'none', project: '전체', color: '#10B981' },
  ]);

  // 필터링된 일정
  const filteredEvents = allEvents.filter(event => {
    if (filterCategory === 'all') return true;
    return event.project === filterCategory;
  });

  // 선택된 날짜의 일정들
  const selectedDateEvents = selectedDate ? filteredEvents.filter(e => e.date === selectedDate) : [];

  // 다가오는 일정 (오늘 기준 이후, 정렬됨)
  const upcomingEvents = filteredEvents
    .filter(e => e.date >= 13)
    .sort((a, b) => a.date - b.date)
    .slice(0, 5);

  const handleDateClick = (day: number) => {
    const dayEvents = filteredEvents.filter(e => e.date === day);
    if (dayEvents.length > 0) {
      setSelectedDate(day);
      setSelectedEventIndex(0);
    }
  };

  const handleAddEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      date: parseInt(newEvent.startDate.split('-')[2]) || 1,
      title: newEvent.title,
      workType: newEvent.workType,
      project: newEvent.project,
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
      workType: 'none',
    });
    toast.success('일정이 추가되었습니다.');
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;
    
    const updatedEvents = allEvents.map(e => 
      e.id === editingEvent.id ? editingEvent : e
    );
    setAllEvents(updatedEvents);
    setIsEditModalOpen(false);
    setEditingEvent(null);
    toast.success('일정이 수정되었습니다.');
  };

  const handleDeleteEvent = (eventId: string) => {
    setAllEvents(allEvents.filter(e => e.id !== eventId));
    setSelectedDate(null);
    toast.success('일정이 삭제되었습니다.');
  };

  const openEditModal = () => {
    const eventToEdit = selectedDateEvents[selectedEventIndex];
    if (eventToEdit) {
      setEditingEvent({ ...eventToEdit });
      setSelectedDate(null);
      setIsEditModalOpen(true);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto hide-scrollbar">
      <div className="pb-24 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(100vh - 180px)' }}>
            {/* Left Column - Calendar (2/3) */}
            <div className="col-span-2">
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-foreground">2026년 1월</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* 작품별 필터 select box */}
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
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 min-h-0 flex flex-col">
                  {/* Days of week */}
                  <div className="grid grid-cols-7 gap-2 mb-2 flex-shrink-0">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center py-2 text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar dates grid */}
                  <div className="grid grid-cols-7 grid-rows-5 gap-2 flex-1">
                    {/* Empty cells before first day */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-full h-full" />
                    ))}

                    {/* Days */}
                    {Array.from({ length: 31 }).map((_, i) => {
                      const day = i + 1;
                      const isToday = day === 13;
                      const dayEvents = filteredEvents.filter(e => e.date === day);

                      return (
                        <div
                          key={day}
                          onClick={() => handleDateClick(day)}
                          className={`w-full h-full border rounded p-2 hover:bg-muted/50 transition-colors cursor-pointer flex flex-col ${
                            isToday ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          <div className={`text-sm font-medium mb-1 flex-shrink-0 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                            {day}
                          </div>
                          <div className="space-y-1 flex-1 overflow-hidden">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                              <div
                                key={idx}
                                className="text-xs px-1 py-1 rounded truncate"
                                style={{ 
                                  backgroundColor: `${event.color}20`,
                                  color: event.color
                                }}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-muted-foreground px-1">
                                +{dayEvents.length - 3}개 더보기
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Empty cells after last day */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`empty-end-${i}`} className="w-full h-full" />
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Upcoming Events (1/3) */}
            <div>
              <Card className="p-5 h-full flex flex-col">
                <h3 className="font-semibold text-foreground mb-4 text-base">다가오는 일정</h3>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {upcomingEvents.map((event, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedDate(event.date);
                        setSelectedEventIndex(0);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div 
                          className="w-1 h-full rounded-full mr-2 flex-shrink-0"
                          style={{ backgroundColor: event.color }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-1">{event.title}</p>
                          <p className="text-xs text-muted-foreground">1월 {event.date}일</p>
                          <p className="text-xs text-muted-foreground mt-1">{event.project}</p>
                        </div>
                      </div>
                      <Badge 
                        className="text-xs"
                        variant={
                          event.workType === 'serialization' ? 'destructive' : 
                          event.workType === 'break' ? 'default' : 
                          'secondary'
                        }
                      >
                        {event.workType === 'serialization' ? '마감' : 
                         event.workType === 'break' ? '휴재' : 
                         event.workType === 'workation' ? '워케이션' : '기타'}
                      </Badge>
                    </div>
                  ))}
                  
                  {upcomingEvents.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      다가오는 일정이 없습니다
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 일정 추가 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="일정 추가"
        maxWidth="xl"
      >
        <div className="space-y-3">
          {/* 제목 입력 */}
          <div>
            <input
              type="text"
              placeholder="제목 추가"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-3 py-2 text-lg border-b-2 border-border focus:border-primary outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* 날짜 */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">시작 날짜</label>
              <input
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">종료 날짜</label>
              <input
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              />
            </div>
          </div>

          {/* 유형 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">유형</label>
            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            >
              <option value="event">이벤트</option>
              <option value="deadline">마감</option>
              <option value="meeting">미팅</option>
              <option value="break">휴재</option>
            </select>
          </div>

          {/* 작업 유형 (연재/휴재/워케이션) */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">작업 유형</label>
            <select
              value={newEvent.workType}
              onChange={(e) => setNewEvent({ ...newEvent, workType: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            >
              <option value="none">없음</option>
              <option value="serialization">연재</option>
              <option value="break">휴재</option>
              <option value="workation">워케이션</option>
              <option value="other">기타</option>
            </select>
          </div>

          {/* 작품 선택 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">작품</label>
            <select
              value={newEvent.project}
              onChange={(e) => setNewEvent({ ...newEvent, project: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
            >
              <option value="all">전체</option>
              <option value="내 웹툰">내 웹툰</option>
              <option value="신작">신작</option>
            </select>
          </div>

          {/* 색상 선택 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
              <Palette className="w-4 h-4" />
              색상
            </label>
            <div className="flex items-center gap-2">
              {[
                { color: '#EF4444', name: '빨강' },
                { color: '#F59E0B', name: '주황' },
                { color: '#10B981', name: '초록' },
                { color: '#3B82F6', name: '파랑' },
                { color: '#6E8FB3', name: '스틸블루' },
                { color: '#8B5CF6', name: '보라' },
                { color: '#EC4899', name: '핑크' },
                { color: '#6B7280', name: '회색' },
              ].map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => setNewEvent({ ...newEvent, color: preset.color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${ 
                    newEvent.color === preset.color 
                      ? 'border-foreground scale-110' 
                      : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              설명
            </label>
            <textarea
              placeholder="설명 추가"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleAddEvent}>
              저장
            </Button>
          </div>
        </div>
      </Modal>

      {/* 일정 수정 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="일정 수정"
        maxWidth="xl"
      >
        {editingEvent && (
          <div className="space-y-3">
            {/* 제목 입력 */}
            <div>
              <input
                type="text"
                placeholder="제목 추가"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full px-3 py-2 text-lg border-b-2 border-border focus:border-primary outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* 유형 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">유형</label>
              <select
                value={editingEvent.type}
                onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              >
                <option value="event">이벤트</option>
                <option value="deadline">마감</option>
                <option value="meeting">미팅</option>
                <option value="break">휴재</option>
              </select>
            </div>

            {/* 작업 유형 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">작업 유형</label>
              <select
                value={editingEvent.workType}
                onChange={(e) => setEditingEvent({ ...editingEvent, workType: e.target.value as any })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              >
                <option value="none">없음</option>
                <option value="serialization">연재</option>
                <option value="break">휴재</option>
                <option value="workation">워케이션</option>
                <option value="other">기타</option>
              </select>
            </div>

            {/* 작품 선택 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">작품</label>
              <select
                value={editingEvent.project}
                onChange={(e) => setEditingEvent({ ...editingEvent, project: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
              >
                <option value="all">전체</option>
                <option value="내 웹툰">내 웹툰</option>
                <option value="신작">신작</option>
              </select>
            </div>

            {/* 색상 선택 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                <Palette className="w-4 h-4" />
                색상
              </label>
              <div className="flex items-center gap-2">
                {[
                  { color: '#EF4444', name: '빨강' },
                  { color: '#F59E0B', name: '주황' },
                  { color: '#10B981', name: '초록' },
                  { color: '#3B82F6', name: '파랑' },
                  { color: '#6E8FB3', name: '스틸블루' },
                  { color: '#8B5CF6', name: '보라' },
                  { color: '#EC4899', name: '핑크' },
                  { color: '#6B7280', name: '회색' },
                ].map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setEditingEvent({ ...editingEvent, color: preset.color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${ 
                      editingEvent.color === preset.color 
                        ? 'border-foreground scale-110' 
                        : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block flex items-center gap-2">
                <AlignLeft className="w-4 h-4" />
                설명
              </label>
              <textarea
                placeholder="설명 추가"
                value={editingEvent.description || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                취소
              </Button>
              <Button onClick={handleEditEvent}>
                저장
              </Button>
            </div>
          </div>
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
          <div className="space-y-3">
            {/* 일정이 여러 개일 경우 selectbox */}
            {selectedDateEvents.length > 1 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">일정 선택</label>
                <select
                  value={selectedEventIndex}
                  onChange={(e) => setSelectedEventIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring outline-none text-sm bg-background text-foreground"
                >
                  {selectedDateEvents.map((event, idx) => (
                    <option key={idx} value={idx}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 선택된 일정 상세 정보 */}
            {selectedDateEvents[selectedEventIndex] && (
              <div className="space-y-3">
                <div 
                  className="p-4 rounded-lg"
                  style={{ 
                    backgroundColor: `${selectedDateEvents[selectedEventIndex].color}10`,
                    borderLeft: `4px solid ${selectedDateEvents[selectedEventIndex].color}`
                  }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {selectedDateEvents[selectedEventIndex].title}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <strong>날짜:</strong> 2026년 1월 {selectedDate}일
                    </p>
                    <p className="text-muted-foreground">
                      <strong>작품:</strong> {selectedDateEvents[selectedEventIndex].project}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>유형:</strong>{' '}
                      <Badge 
                        variant={
                          selectedDateEvents[selectedEventIndex].workType === 'serialization' ? 'destructive' : 
                          selectedDateEvents[selectedEventIndex].workType === 'break' ? 'default' : 
                          'secondary'
                        }
                      >
                        {selectedDateEvents[selectedEventIndex].workType === 'serialization' ? '마감' : 
                         selectedDateEvents[selectedEventIndex].workType === 'break' ? '휴재' : 
                         selectedDateEvents[selectedEventIndex].workType === 'workation' ? '워케이션' : '기타'}
                      </Badge>
                    </p>
                    {selectedDateEvents[selectedEventIndex].description && (
                      <div className="pt-2">
                        <strong className="block mb-1">설명:</strong>
                        <p className="text-muted-foreground">
                          {selectedDateEvents[selectedEventIndex].description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
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
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}