import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { Calendar, User, CheckCircle2, XCircle, Plus, AlignLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  AbsenteeManagementRoot,
  AbsenteeManagementBody,
  OverviewGrid,
  RequestButtonSection,
  CurrentAbsencesCard,
  CardTitle,
  AbsenceList,
  AbsenceItem,
  AbsenceItemHeader,
  AbsenceItemLeft,
  AvatarContainer,
  AvatarText,
  AbsenceItemInfo,
  AbsenceItemName,
  AbsenceItemRole,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  ProjectsSection,
  ActionButtons,
  UpcomingScheduleCard,
  ScheduleList,
  ScheduleItem,
  ScheduleItemContent,
  ScheduleItemLeft,
  ScheduleItemName,
  ScheduleItemDate,
  ModalForm,
  FormRow,
  FormLabel,
  FormSelect,
  FormInput,
  FormTextarea,
  FormLabelWithIcon,
  ModalActions,
  DetailContent,
  DetailCard,
  DetailHeader,
  DetailAvatar,
  DetailAvatarText,
  DetailInfo,
  DetailName,
  DetailRole,
  DetailInfoList,
  DetailInfoItem,
  DetailInfoLabel,
  DetailInfoValue,
  DetailDescription,
  DetailActions,
} from './AbsenteeManagementPage.styled';

// 휴재 사유 타입 정의
const ABSENCE_REASON = {
  BREAK: 'break',
  EMERGENCY_BREAK: 'emergency-break',
  WORKATION: 'workation',
  SICK_LEAVE: 'sick-leave',
};

// 휴재 사유 표시명 매핑
const REASON_LABELS = {
  [ABSENCE_REASON.BREAK]: '휴재',
  [ABSENCE_REASON.EMERGENCY_BREAK]: '긴급 휴재',
  [ABSENCE_REASON.WORKATION]: '워케이션',
  [ABSENCE_REASON.SICK_LEAVE]: '건강 관리',
};

// 근태 상태 정의
const ABSENCE_STATUS = {
  APPROVED: '승인됨',
  PENDING: '대기중',
};

// TODO: Zustand store mapping - 근태 신청 목록
const initialAbsenceRequests = [
  {
    id: 1,
    name: '박채색',
    role: '채색 담당',
    reason: REASON_LABELS[ABSENCE_REASON.BREAK],
    startDate: '2026.01.10',
    endDate: '2026.01.20',
    status: ABSENCE_STATUS.APPROVED,
    projects: ['학원물', '액션 판타지'],
    description: '개인 건강 관리를 위한 일시 중단',
  },
  {
    id: 2,
    name: '최스토리',
    role: '스토리 작가',
    reason: REASON_LABELS[ABSENCE_REASON.EMERGENCY_BREAK],
    startDate: '2026.01.12',
    endDate: '2026.01.15',
    status: ABSENCE_STATUS.PENDING,
    projects: ['로맨스 판타지'],
    description: '건강 상의 이유로 긴급 휴재',
  },
];

// TODO: Zustand store mapping - 예정된 휴재 일정
const upcomingSchedules = [
  { name: '이어시', dates: '2026.02.01 - 02.05', reason: '휴재' },
  { name: '정배경', dates: '2026.02.10 - 02.15', reason: '워케이션' },
  { name: '김작가', dates: '2026.03.01 - 03.10', reason: '워케이션' },
];

export function AbsenteeManagementPage() {
  const [absenceRequests, setAbsenceRequests] = useState(initialAbsenceRequests);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    reason: ABSENCE_REASON.BREAK,
    startDate: '',
    endDate: '',
    projects: '',
    description: '',
  });

  // 통계 계산
  const currentAbsences = absenceRequests.filter((req) => req.status === ABSENCE_STATUS.APPROVED).length;
  const pendingRequests = absenceRequests.filter((req) => req.status === ABSENCE_STATUS.PENDING).length;
  const approvedThisMonth = 5; // TODO: Zustand store에서 가져오기

  // 근태 신청 제출
  const handleRequestSubmit = () => {
    if (!newRequest.startDate || !newRequest.endDate) {
      toast.error('시작일과 종료일을 입력해주세요.');
      return;
    }

    const request = {
      id: Date.now(),
      name: '김작가', // TODO: 현재 사용자 정보에서 가져오기
      role: '작가',
      reason: REASON_LABELS[newRequest.reason],
      startDate: newRequest.startDate.replace(/-/g, '.'),
      endDate: newRequest.endDate.replace(/-/g, '.'),
      status: ABSENCE_STATUS.PENDING,
      projects: newRequest.projects.split(',').map((p) => p.trim()).filter(Boolean),
      description: newRequest.description,
    };

    setAbsenceRequests([...absenceRequests, request]);
    setIsRequestModalOpen(false);
    setNewRequest({
      reason: ABSENCE_REASON.BREAK,
      startDate: '',
      endDate: '',
      projects: '',
      description: '',
    });
    toast.success('근태 신청이 완료되었습니다.');
  };

  // 승인 처리
  const handleApprove = (id) => {
    setAbsenceRequests(
      absenceRequests.map((req) => (req.id === id ? { ...req, status: ABSENCE_STATUS.APPROVED } : req))
    );
    toast.success('근태가 승인되었습니다.');
  };

  // 거부 처리
  const handleReject = (id) => {
    setAbsenceRequests(absenceRequests.filter((req) => req.id !== id));
    toast.error('근태가 거부되었습니다.');
  };

  // 상세 모달 열기
  const openDetailModal = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  return (
    <AbsenteeManagementRoot>
      <AbsenteeManagementBody>
        {/* 개요 통계 */}
        <OverviewGrid>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">현재 휴재 중</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{currentAbsences}명</p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">예정된 휴재</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{upcomingSchedules.length}건</p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-3 h-3 text-destructive" />
              <span className="text-xs text-muted-foreground">승인 대기</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{pendingRequests}건</p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">이번 달 승인</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{approvedThisMonth}건</p>
          </Card>
        </OverviewGrid>

        {/* 근태 신청 버튼 */}
        <RequestButtonSection>
          <Button onClick={() => setIsRequestModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            근태 신청
          </Button>
        </RequestButtonSection>

        {/* 현재 휴재 중인 작가/팀원 */}
        <CurrentAbsencesCard>
          <CardTitle>현재 휴재 중인 작가/팀원</CardTitle>
          <AbsenceList>
            {absenceRequests.map((person) => (
              <AbsenceItem key={person.id} onClick={() => openDetailModal(person)}>
                <AbsenceItemHeader>
                  <AbsenceItemLeft>
                    <AvatarContainer>
                      <AvatarText>{person.name[0]}</AvatarText>
                    </AvatarContainer>
                    <AbsenceItemInfo>
                      <AbsenceItemName>{person.name}</AbsenceItemName>
                      <AbsenceItemRole>{person.role}</AbsenceItemRole>
                    </AbsenceItemInfo>
                  </AbsenceItemLeft>
                  <Badge variant={person.status === ABSENCE_STATUS.APPROVED ? 'default' : 'secondary'}>
                    {person.status}
                  </Badge>
                </AbsenceItemHeader>

                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>사유</InfoLabel>
                    <InfoValue>{person.reason}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>기간</InfoLabel>
                    <InfoValue>
                      {person.startDate} ~ {person.endDate}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>

                <ProjectsSection>
                  <InfoLabel>담당 작품</InfoLabel>
                  <InfoValue>{person.projects.join(', ')}</InfoValue>
                </ProjectsSection>

                {person.status === ABSENCE_STATUS.PENDING && (
                  <ActionButtons onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" className="flex-1" onClick={() => handleApprove(person.id)}>
                      승인
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleReject(person.id)}>
                      거부
                    </Button>
                  </ActionButtons>
                )}
              </AbsenceItem>
            ))}
          </AbsenceList>
        </CurrentAbsencesCard>

        {/* 예정된 휴재 일정 */}
        <UpcomingScheduleCard>
          <CardTitle>예정된 휴재 일정</CardTitle>
          <ScheduleList>
            {upcomingSchedules.map((schedule, idx) => (
              <ScheduleItem key={idx}>
                <ScheduleItemContent>
                  <ScheduleItemLeft>
                    <ScheduleItemName>{schedule.name}</ScheduleItemName>
                    <ScheduleItemDate>{schedule.dates}</ScheduleItemDate>
                  </ScheduleItemLeft>
                  <Badge variant="outline">{schedule.reason}</Badge>
                </ScheduleItemContent>
              </ScheduleItem>
            ))}
          </ScheduleList>
        </UpcomingScheduleCard>
      </AbsenteeManagementBody>

      {/* 근태 신청 모달 */}
      <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="근태 신청" maxWidth="xl">
        <ModalForm>
          <FormRow>
            <FormLabel>사유</FormLabel>
            <FormSelect
              value={newRequest.reason}
              onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
            >
              <option value={ABSENCE_REASON.BREAK}>휴재</option>
              <option value={ABSENCE_REASON.EMERGENCY_BREAK}>긴급 휴재</option>
              <option value={ABSENCE_REASON.WORKATION}>워케이션</option>
              <option value={ABSENCE_REASON.SICK_LEAVE}>건강 관리</option>
            </FormSelect>
          </FormRow>

          <FormRow>
            <FormLabel>시작 날짜</FormLabel>
            <FormInput
              type="date"
              value={newRequest.startDate}
              onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
            />
          </FormRow>

          <FormRow>
            <FormLabel>종료 날짜</FormLabel>
            <FormInput
              type="date"
              value={newRequest.endDate}
              onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
            />
          </FormRow>

          <FormRow>
            <FormLabel>담당 작품</FormLabel>
            <FormInput
              type="text"
              placeholder="작품명을 쉼표로 구분하여 입력 (예: 내 웹툰, 신작)"
              value={newRequest.projects}
              onChange={(e) => setNewRequest({ ...newRequest, projects: e.target.value })}
            />
          </FormRow>

          <FormRow>
            <FormLabelWithIcon>
              <AlignLeft className="w-4 h-4" />
              상세 설명
            </FormLabelWithIcon>
            <FormTextarea
              placeholder="상세한 사유를 입력해주세요"
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              rows={3}
            />
          </FormRow>

          <ModalActions>
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleRequestSubmit}>신청</Button>
          </ModalActions>
        </ModalForm>
      </Modal>

      {/* 상세 정보 모달 */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="근태 상세 정보"
        maxWidth="lg"
      >
        {selectedRequest && (
          <DetailContent>
            <DetailCard>
              <DetailHeader>
                <DetailAvatar>
                  <DetailAvatarText>{selectedRequest.name[0]}</DetailAvatarText>
                </DetailAvatar>
                <DetailInfo>
                  <DetailName>{selectedRequest.name}</DetailName>
                  <DetailRole>{selectedRequest.role}</DetailRole>
                </DetailInfo>
              </DetailHeader>

              <DetailInfoList>
                <DetailInfoItem>
                  <DetailInfoLabel>상태:</DetailInfoLabel>
                  <Badge variant={selectedRequest.status === ABSENCE_STATUS.APPROVED ? 'default' : 'secondary'}>
                    {selectedRequest.status}
                  </Badge>
                </DetailInfoItem>
                <DetailInfoItem>
                  <DetailInfoLabel>사유:</DetailInfoLabel>
                  <DetailInfoValue>{selectedRequest.reason}</DetailInfoValue>
                </DetailInfoItem>
                <DetailInfoItem>
                  <DetailInfoLabel>기간:</DetailInfoLabel>
                  <DetailInfoValue>
                    {selectedRequest.startDate} ~ {selectedRequest.endDate}
                  </DetailInfoValue>
                </DetailInfoItem>
                <DetailInfoItem alignStart>
                  <DetailInfoLabel>담당 작품:</DetailInfoLabel>
                  <DetailInfoValue textRight>{selectedRequest.projects.join(', ')}</DetailInfoValue>
                </DetailInfoItem>
                {selectedRequest.description && (
                  <DetailDescription>
                    <DetailInfoLabel style={{ display: 'block', marginBottom: '4px' }}>상세 설명:</DetailInfoLabel>
                    <DetailInfoValue style={{ display: 'block' }}>{selectedRequest.description}</DetailInfoValue>
                  </DetailDescription>
                )}
              </DetailInfoList>
            </DetailCard>

            {selectedRequest.status === ABSENCE_STATUS.PENDING && (
              <DetailActions>
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleApprove(selectedRequest.id);
                    setIsDetailModalOpen(false);
                  }}
                >
                  승인
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    handleReject(selectedRequest.id);
                    setIsDetailModalOpen(false);
                  }}
                >
                  거부
                </Button>
              </DetailActions>
            )}
          </DetailContent>
        )}
      </Modal>
    </AbsenteeManagementRoot>
  );
}
