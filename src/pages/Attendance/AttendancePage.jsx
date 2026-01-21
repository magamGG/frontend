import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Modal } from '@/components/common/Modal';
import { CheckCircle2, XCircle, Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AttendanceRoot,
  AttendanceBody,
  PageHeader,
  PageTitle,
  PageDescription,
  StatsGrid,
  MainContentGrid,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateText,
  RequestList,
  PendingRequestCard,
  ApprovedRequestCard,
  RejectedRequestCard,
  RequestCardHeader,
  RequestCardContent,
  RequestCardTitle,
  ArtistName,
  RequestInfoList,
  RequestInfoItem,
  ActionButtonsContainer,
  ProcessedHistoryScroll,
  RejectionReasonBox,
  RejectionReasonText,
  ProcessedDateText,
  ModalContent,
  RequestPreviewBox,
  RequestPreviewHeader,
  RequestPreviewTitle,
  RequestPreviewInfo,
  FormField,
  FormLabel,
  FormTextarea,
  FormHelperText,
  ModalActions,
} from './AttendancePage.styled';

// 근태 신청 타입 정의
const ATTENDANCE_TYPE = {
  OFFICE: '출근',
  REMOTE: '재택근무',
  LEAVE: '휴재',
  WORKATION: '워케이션',
};

// 근태 신청 상태 정의
const REQUEST_STATUS = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '반려',
};

// 근태 타입별 색상 설정
const getTypeColor = (type) => {
  const colorMap = {
    [ATTENDANCE_TYPE.WORKATION]: 'bg-[#9C27B0]',
    [ATTENDANCE_TYPE.LEAVE]: 'bg-[#757575]',
    [ATTENDANCE_TYPE.REMOTE]: 'bg-[#FF9800]',
    [ATTENDANCE_TYPE.OFFICE]: 'bg-[#00ACC1]',
  };
  return colorMap[type] || 'bg-gray-500';
};

// 상태별 색상 설정
const getStatusColor = (status) => {
  const colorMap = {
    [REQUEST_STATUS.PENDING]: 'bg-yellow-500',
    [REQUEST_STATUS.APPROVED]: 'bg-green-500',
    [REQUEST_STATUS.REJECTED]: 'bg-red-500',
  };
  return colorMap[status] || 'bg-gray-500';
};

// 날짜 포맷팅 함수
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// TODO: Zustand store mapping - 근태 신청 목록
const initialRequests = [
  {
    id: 1,
    artistName: '김작가',
    type: ATTENDANCE_TYPE.LEAVE,
    startDate: '2026-01-20',
    endDate: '2026-01-22',
    days: 3,
    reason: '개인 사유로 인한 휴재 신청',
    status: REQUEST_STATUS.PENDING,
    requestDate: '2026-01-13',
  },
  {
    id: 2,
    artistName: '이작가',
    type: ATTENDANCE_TYPE.WORKATION,
    startDate: '2026-01-18',
    endDate: '2026-01-20',
    days: 3,
    reason: '제주도 워케이션, 신작 기획 작업 예정',
    status: REQUEST_STATUS.PENDING,
    requestDate: '2026-01-12',
  },
  {
    id: 3,
    artistName: '박작가',
    type: ATTENDANCE_TYPE.REMOTE,
    startDate: '2026-01-16',
    endDate: '2026-01-16',
    days: 1,
    reason: '집에서 작업이 필요한 상황',
    status: REQUEST_STATUS.PENDING,
    requestDate: '2026-01-14',
  },
  {
    id: 4,
    artistName: '김작가',
    type: ATTENDANCE_TYPE.LEAVE,
    startDate: '2026-01-10',
    endDate: '2026-01-12',
    days: 3,
    reason: '가족 행사',
    status: REQUEST_STATUS.APPROVED,
    requestDate: '2026-01-05',
    processedDate: '2026-01-06',
  },
  {
    id: 5,
    artistName: '최작가',
    type: ATTENDANCE_TYPE.WORKATION,
    startDate: '2026-01-08',
    endDate: '2026-01-10',
    days: 3,
    reason: '강릉 워케이션',
    status: REQUEST_STATUS.APPROVED,
    requestDate: '2026-01-02',
    processedDate: '2026-01-03',
  },
  {
    id: 6,
    artistName: '이작가',
    type: ATTENDANCE_TYPE.LEAVE,
    startDate: '2026-01-05',
    endDate: '2026-01-05',
    days: 1,
    reason: '개인 일정',
    status: REQUEST_STATUS.REJECTED,
    requestDate: '2026-01-03',
    rejectionReason: '해당 날짜는 중요한 에피소드 마감일입니다.',
    processedDate: '2026-01-04',
  },
];

export function AttendancePage() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [requests, setRequests] = useState(initialRequests);

  // 대기 중인 신청 필터링
  const pendingRequests = requests.filter((r) => r.status === REQUEST_STATUS.PENDING);

  // 처리된 신청 필터링 (승인/반려)
  const processedRequests = requests
    .filter((r) => r.status !== REQUEST_STATUS.PENDING)
    .sort((a, b) => {
      const dateA = new Date(a.processedDate || '').getTime();
      const dateB = new Date(b.processedDate || '').getTime();
      return dateB - dateA;
    });

  // 승인 처리
  const handleApprove = (request) => {
    setRequests(
      requests.map((r) =>
        r.id === request.id
          ? { ...r, status: REQUEST_STATUS.APPROVED, processedDate: new Date().toISOString().split('T')[0] }
          : r
      )
    );
    toast.success(`${request.artistName}의 ${request.type} 신청이 승인되었습니다.`);
  };

  // 반려 모달 열기
  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  // 반려 처리
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('반려 사유를 입력해주세요.');
      return;
    }

    if (selectedRequest) {
      setRequests(
        requests.map((r) =>
          r.id === selectedRequest.id
            ? {
                ...r,
                status: REQUEST_STATUS.REJECTED,
                rejectionReason: rejectionReason,
                processedDate: new Date().toISOString().split('T')[0],
              }
            : r
        )
      );
      toast.success(`${selectedRequest.artistName}의 ${selectedRequest.type} 신청이 반려되었습니다.`);
    }

    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  return (
    <AttendanceRoot>
      <AttendanceBody>
        {/* 페이지 헤더 */}
        <PageHeader>
          <PageTitle>근태 관리</PageTitle>
          <PageDescription>작가들의 근태 신청을 관리하세요</PageDescription>
        </PageHeader>

        {/* 통계 카드 */}
        <StatsGrid>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-medium text-muted-foreground">승인 대기</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{pendingRequests.length}건</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-muted-foreground">이번 달 승인</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {processedRequests.filter((r) => r.status === REQUEST_STATUS.APPROVED).length}건
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-muted-foreground">이번 달 반려</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {processedRequests.filter((r) => r.status === REQUEST_STATUS.REJECTED).length}건
            </p>
          </Card>
        </StatsGrid>

        {/* 메인 콘텐츠 */}
        <MainContentGrid>
          {/* 왼쪽: 승인/반려 대기 */}
          <SectionContainer>
            <SectionHeader>
              <SectionTitle>승인 대기 중</SectionTitle>
              {pendingRequests.length > 0 && (
                <Badge className="bg-white border border-border">{pendingRequests.length}건</Badge>
              )}
            </SectionHeader>

            <RequestList>
              {pendingRequests.length === 0 ? (
                <Card className="p-8">
                  <EmptyStateContainer>
                    <EmptyStateIcon>
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    </EmptyStateIcon>
                    <EmptyStateText>대기 중인 신청이 없습니다</EmptyStateText>
                  </EmptyStateContainer>
                </Card>
              ) : (
                pendingRequests.map((request) => (
                  <PendingRequestCard key={request.id}>
                    <RequestCardHeader>
                      <RequestCardContent>
                        <RequestCardTitle>
                          <ArtistName>{request.artistName}</ArtistName>
                          <Badge className={`${getTypeColor(request.type)} text-xs`}>{request.type}</Badge>
                        </RequestCardTitle>
                        <RequestInfoList>
                          <RequestInfoItem>
                            <Calendar className="w-3 h-3" />
                            <span>
                              {formatDate(request.startDate)} ~ {formatDate(request.endDate)} ({request.days}일)
                            </span>
                          </RequestInfoItem>
                          <RequestInfoItem>
                            <FileText className="w-3 h-3" />
                            <span>{request.reason}</span>
                          </RequestInfoItem>
                          <RequestInfoItem>
                            <Clock className="w-3 h-3" />
                            <span>신청일: {formatDate(request.requestDate)}</span>
                          </RequestInfoItem>
                        </RequestInfoList>
                      </RequestCardContent>
                    </RequestCardHeader>

                    <ActionButtonsContainer>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleOpenRejectModal(request)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        반려
                      </Button>
                    </ActionButtonsContainer>
                  </PendingRequestCard>
                ))
              )}
            </RequestList>
          </SectionContainer>

          {/* 오른쪽: 승인/반려 내역 */}
          <SectionContainer>
            <SectionHeader>
              <SectionTitle>처리 내역</SectionTitle>
              <Badge variant="outline">{processedRequests.length}건</Badge>
            </SectionHeader>

            <ProcessedHistoryScroll>
              {processedRequests.length === 0 ? (
                <Card className="p-8">
                  <EmptyStateContainer>
                    <EmptyStateIcon>
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    </EmptyStateIcon>
                    <EmptyStateText>처리된 내역이 없습니다</EmptyStateText>
                  </EmptyStateContainer>
                </Card>
              ) : (
                processedRequests.map((request) => {
                  const RequestCard =
                    request.status === REQUEST_STATUS.APPROVED ? ApprovedRequestCard : RejectedRequestCard;
                  return (
                    <RequestCard key={request.id}>
                      <RequestCardHeader>
                        <RequestCardContent>
                          <RequestCardTitle>
                            <ArtistName>{request.artistName}</ArtistName>
                            <Badge className={`${getTypeColor(request.type)} text-xs`}>{request.type}</Badge>
                            <Badge className={`${getStatusColor(request.status)} text-xs`}>{request.status}</Badge>
                          </RequestCardTitle>
                          <RequestInfoList>
                            <div>
                              {formatDate(request.startDate)} ~ {formatDate(request.endDate)} ({request.days}일)
                            </div>
                            <div>사유: {request.reason}</div>
                            {request.status === REQUEST_STATUS.REJECTED && request.rejectionReason && (
                              <RejectionReasonBox>
                                <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                                <RejectionReasonText>반려 사유: {request.rejectionReason}</RejectionReasonText>
                              </RejectionReasonBox>
                            )}
                          </RequestInfoList>
                        </RequestCardContent>
                      </RequestCardHeader>
                      <ProcessedDateText>
                        처리일: {request.processedDate ? formatDate(request.processedDate) : '-'}
                      </ProcessedDateText>
                    </RequestCard>
                  );
                })
              )}
            </ProcessedHistoryScroll>
          </SectionContainer>
        </MainContentGrid>
      </AttendanceBody>

      {/* 반려 사유 모달 */}
      <Modal isOpen={showRejectModal} onClose={handleCloseModal} title="신청 반려" maxWidth="md">
        <ModalContent>
          {selectedRequest && (
            <RequestPreviewBox>
              <RequestPreviewHeader>
                <RequestPreviewTitle>{selectedRequest.artistName}</RequestPreviewTitle>
                <Badge className={`${getTypeColor(selectedRequest.type)}`}>{selectedRequest.type}</Badge>
              </RequestPreviewHeader>
              <RequestPreviewInfo>
                {formatDate(selectedRequest.startDate)} ~ {formatDate(selectedRequest.endDate)} (
                {selectedRequest.days}일)
              </RequestPreviewInfo>
              <RequestPreviewInfo>사유: {selectedRequest.reason}</RequestPreviewInfo>
            </RequestPreviewBox>
          )}

          <FormField>
            <FormLabel>
              반려 사유 <span className="text-red-500">*</span>
            </FormLabel>
            <FormTextarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="반려 사유를 입력하세요"
              rows={4}
            />
            <FormHelperText>작가에게 전달될 반려 사유를 명확하게 작성해주세요.</FormHelperText>
          </FormField>

          <ModalActions>
            <Button variant="outline" onClick={handleCloseModal} className="flex-1">
              취소
            </Button>
            <Button variant="destructive" onClick={handleReject} className="flex-1">
              반려 확정
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </AttendanceRoot>
  );
}
