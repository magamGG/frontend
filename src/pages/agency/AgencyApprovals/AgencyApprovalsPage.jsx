import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { CheckCircle2, XCircle, Calendar, FileText, Clock, AlertCircle, User, Briefcase, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { agencyService, leaveService } from '@/api';
import useAuthStore from '@/store/authStore';
import { RequestDetailModal } from '@/components/modals/RequestDetailModal/RequestDetailModal';
import {
  AgencyApprovalsRoot,
  AgencyApprovalsBody,
  HeaderSection,
  HeaderTitle,
  HeaderSubtitle,
  StatisticsGrid,
  StatisticsCard,
  ContentGrid,
  PendingSection,
  SectionHeader,
  SectionTitle,
  SectionBadge,
  RequestCard,
  RequestCardHeader,
  RequestCardTitle,
  RequestCardInfo,
  RequestCardInfoItem,
  RequestCardActions,
  EmptyStateCard,
  EmptyStateIcon,
  EmptyStateText,
} from './AgencyApprovalsPage.styled';

const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'join', label: '가입', color: '#00ACC1' },
  { value: 'attendance', label: '근태', color: '#9C27B0' },
  { value: 'annual', label: '연차' },
  { value: 'half', label: '반차' },
  { value: 'sick', label: '병가' },
  { value: 'workation', label: '워케이션' },
  { value: 'remote', label: '재택근무' },
  { value: 'vacation', label: '휴가' },
];

export function AgencyApprovalsPage() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvedDays, setApprovedDays] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  
  // 에이전시 가입 요청 및 근태 신청 목록 조회
  useEffect(() => {
    const fetchAllRequests = async () => {
      if (!user?.agencyNo) {
        return;
      }
      
      setIsLoading(true);
      try {
        // 가입 요청과 근태 신청을 병렬로 조회
        const [joinResponse, attendanceResponse] = await Promise.all([
          agencyService.getJoinRequests(user.agencyNo),
          leaveService.getAgencyRequests(user.agencyNo),
        ]);
        
        // 가입 요청 변환
        const formattedJoinRequests = joinResponse.map((req) => ({
          id: `join-${req.newRequestNo}`,
          originalId: req.newRequestNo,
          type: '가입',
          category: 'join',
          requester: req.memberName,
          role: req.memberRole,
          email: req.memberEmail,
          phone: req.memberPhone,
          reason: `${req.memberRole} 가입 신청`,
          status: req.newRequestStatus === '대기' ? '대기' : req.newRequestStatus === '승인' ? '승인' : '반려',
          submittedDate: req.newRequestDate ? new Date(req.newRequestDate).toISOString().split('T')[0] : '',
          processedDate: req.newRequestStatus !== '대기' ? req.newRequestDate ? new Date(req.newRequestDate).toISOString().split('T')[0] : '' : null,
        }));
        
        // 근태 신청 변환
        const formattedAttendanceRequests = attendanceResponse.map((req) => ({
          id: `attendance-${req.attendanceRequestNo}`,
          originalId: req.attendanceRequestNo,
          type: req.attendanceRequestType,
          category: 'attendance',
          requester: req.memberName,
          role: '작가', // 기본값
          startDate: req.attendanceRequestStartDate ? new Date(req.attendanceRequestStartDate).toISOString().split('T')[0] : '',
          endDate: req.attendanceRequestEndDate ? new Date(req.attendanceRequestEndDate).toISOString().split('T')[0] : '',
          days: req.attendanceRequestUsingDays,
          reason: req.attendanceRequestReason || '',
          workcationLocation: req.workcationLocation,
          medicalFileUrl: req.medicalFileUrl,
          attachedFile: req.medicalFileUrl ? req.medicalFileUrl.split('/').pop() : null,
          projectName: req.projectName,
          status: req.attendanceRequestStatus === 'PENDING' ? '대기' 
                : req.attendanceRequestStatus === 'APPROVED' ? '승인' 
                : req.attendanceRequestStatus === 'REJECTED' ? '반려' : '대기',
          rejectionReason: req.attendanceRequestRejectReason,
          submittedDate: req.attendanceRequestCreatedAt ? new Date(req.attendanceRequestCreatedAt).toISOString().split('T')[0] : '',
          processedDate: req.attendanceRequestUpdatedAt ? new Date(req.attendanceRequestUpdatedAt).toISOString().split('T')[0] : null,
        }));
        
        // 모든 요청 합치기
        setRequests([...formattedJoinRequests, ...formattedAttendanceRequests]);
      } catch (error) {
        console.error('요청 목록 조회 실패:', error);
        toast.error('요청 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllRequests();
  }, [user?.agencyNo]);

  // 카테고리별 필터링
  const filteredRequests = selectedCategory === 'all' 
    ? requests 
    : requests.filter(r => r.category === selectedCategory);
  const pendingRequests = filteredRequests.filter(r => r.status === '대기');
  const processedRequests = filteredRequests.filter(r => r.status !== '대기')
    .sort((a, b) => {
      const dateA = new Date(a.processedDate || '').getTime();
      const dateB = new Date(b.processedDate || '').getTime();
      return dateB - dateA;
    });

  const handleOpenApproveModal = (request) => {
    setSelectedRequest(request);
    // 병가인 경우에만 모달 표시, 아니면 바로 승인
    if (request.category === 'sick') {
      setShowApproveModal(true);
      setApprovedDays('');
    } else {
      handleApproveDirect(request);
    }
  };

  const handleApproveDirect = async (request) => {
    try {
      if (request.category === 'join') {
        // 가입 요청 승인 API 호출
        const response = await agencyService.approveJoinRequest(request.originalId);
        console.log('가입 승인 API 응답:', response);
      } else if (request.category === 'attendance') {
        // TODO: 근태 승인 API 구현 필요
        // 현재는 프론트엔드 상태만 업데이트
        console.log('근태 승인 처리:', request.originalId);
      }
      
      // 로컬 상태 업데이트
      setRequests(requests.map(r => 
        r.id === request.id 
          ? { ...r, status: '승인', processedDate: new Date().toISOString().split('T')[0] }
          : r
      ));
      toast.success(`${request.requester}의 ${request.type} 신청이 승인되었습니다.`);
    } catch (error) {
      console.error('승인 API 호출 실패:', error);
      toast.error('승인 처리에 실패했습니다.');
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    // 병가인 경우 인정 일 수 확인
    if (selectedRequest.category === 'sick' && !approvedDays.trim()) {
      toast.error('인정 일 수를 입력해주세요.');
      return;
    }

    try {
      // 백엔드 API 호출
      const response = await agencyService.approveJoinRequest(selectedRequest.id);
      console.log('승인 API 응답:', response);
      
      // API 성공 시 로컬 상태 업데이트
      setRequests(requests.map(r => 
        r.id === selectedRequest.id 
          ? { ...r, status: '승인', processedDate: new Date().toISOString().split('T')[0] }
          : r
      ));
      toast.success(`${selectedRequest.requester}의 ${selectedRequest.type} 신청이 승인되었습니다.`);
    } catch (error) {
      console.error('승인 API 호출 실패:', error);
      toast.error('승인 처리에 실패했습니다.');
    }

    setShowApproveModal(false);
    setSelectedRequest(null);
    setApprovedDays('');
  };

  const handleCancelApproval = async () => {
    if (!selectedRequest) return;

    try {
      // 백엔드 API 호출 (승인 취소)
      // await agencyService.cancelApproval(selectedRequest.id);
      
      // 로컬 상태 업데이트
      setRequests(requests.map(r => 
        r.id === selectedRequest.id 
          ? { ...r, status: '승인 취소됨', processedDate: new Date().toISOString().split('T')[0] }
          : r
      ));
      toast.success(`${selectedRequest.requester}의 ${selectedRequest.type} 승인이 취소되었습니다.`);
    } catch (error) {
      console.error('승인 취소 API 호출 실패:', error);
      toast.error('승인 취소 처리에 실패했습니다.');
    }

    setShowCancelConfirmModal(false);
    setSelectedRequest(null);
  };

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleOpenDetailModal = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('반려 사유를 입력해주세요.');
      return;
    }

    if (selectedRequest) {
      try {
        if (selectedRequest.category === 'join') {
          // 가입 요청 거절 API 호출
          const response = await agencyService.rejectJoinRequest(selectedRequest.originalId, rejectionReason);
          console.log('가입 거절 API 응답:', response);
        } else if (selectedRequest.category === 'attendance') {
          // TODO: 근태 반려 API 구현 필요
          // 현재는 프론트엔드 상태만 업데이트
          console.log('근태 반려 처리:', selectedRequest.originalId);
        }
        
        // 로컬 상태 업데이트
        setRequests(requests.map(r => 
          r.id === selectedRequest.id 
            ? { 
                ...r, 
                status: '반려', 
                rejectionReason: rejectionReason,
                processedDate: new Date().toISOString().split('T')[0]
              }
            : r
        ));
        toast.success(`${selectedRequest.requester}의 ${selectedRequest.type} 신청이 반려되었습니다.`);
      } catch (error) {
        console.error('거절 API 호출 실패:', error);
        toast.error('반려 처리에 실패했습니다.');
      }
    }

    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case '휴가':
      case '연차':
      case '반차':
      case '휴재':
        return 'bg-[#9C27B0]';
      case '가입':
        return 'bg-[#00ACC1]';
      case '신작':
        return 'bg-[#FF9800]';
      case '워케이션':
        return 'bg-[#E91E63]';
      case '재택근무':
        return 'bg-[#4CAF50]';
      case '병가':
        return 'bg-[#FF5722]';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '대기':
        return 'bg-[#FFC107]';
      case '승인':
        return 'bg-[#4CAF50]';
      case '반려':
        return 'bg-[#F44336]';
      case '승인 취소됨':
        return 'bg-gray-400';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case '대기':
        return '대기';
      case '승인':
        return '승인';
      case '반려':
        return '반려';
      case '승인 취소됨':
        return '승인 취소됨';
      default:
        return status;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 통계 계산
  const allPendingCount = requests.filter(r => r.status === '대기').length;
  const thisMonthApproved = requests.filter(r => r.status === '승인').length;
  const thisMonthRejected = requests.filter(r => r.status === '반려').length;

  const selectedCategoryInfo = CATEGORIES.find(c => c.value === selectedCategory);

  return (
    <AgencyApprovalsRoot>
      <AgencyApprovalsBody>
        {/* Header */}
        <HeaderSection>
          <HeaderTitle>요청 관리</HeaderTitle>
          <HeaderSubtitle>직원들의 휴가, 가입, 작가의 신작을 처리할 수 있습니다</HeaderSubtitle>
        </HeaderSection>

        {/* 통계 */}
        <StatisticsGrid>
          <StatisticsCard>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#FFC107]" />
              <span className="text-xs font-medium text-muted-foreground">승인 대기</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{allPendingCount}건</p>
          </StatisticsCard>
          <StatisticsCard>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
              <span className="text-xs font-medium text-muted-foreground">이번 달 승인</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{thisMonthApproved}건</p>
          </StatisticsCard>
          <StatisticsCard>
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-[#F44336]" />
              <span className="text-xs font-medium text-muted-foreground">이번 달 반려</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{thisMonthRejected}건</p>
          </StatisticsCard>
        </StatisticsGrid>

        {/* 카테고리 필터 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-foreground">카테고리:</span>
            <div className="flex gap-2 flex-wrap flex-1">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={selectedCategory === category.value ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-white'}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ContentGrid>
          {/* Left: 승인/반려 대기 */}
          <PendingSection>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle>승인 대기 중</SectionTitle>
              <Badge variant="outline" className="bg-white border border-border">{pendingRequests.length}건</Badge>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <EmptyStateCard>
                  <EmptyStateIcon>
                    <Clock className="w-12 h-12 opacity-50 animate-spin" />
                  </EmptyStateIcon>
                  <EmptyStateText>로딩 중...</EmptyStateText>
                </EmptyStateCard>
              ) : pendingRequests.length === 0 ? (
                <EmptyStateCard>
                  <EmptyStateIcon>
                    <FileText className="w-12 h-12 opacity-50" />
                  </EmptyStateIcon>
                  <EmptyStateText>대기 중인 신청이 없습니다</EmptyStateText>
                </EmptyStateCard>
              ) : (
                pendingRequests.map((request) => (
                  <RequestCard key={request.id} onClick={() => handleOpenDetailModal(request)} style={{ cursor: 'pointer' }}>
                    <RequestCardHeader>
                      <div className="flex-1">
                        <RequestCardTitle>
                          <h4 className="font-semibold text-foreground">{request.requester}</h4>
                          <Badge className={`${getTypeColor(request.type)} text-xs`}>
                            {request.type}
                          </Badge>
                        </RequestCardTitle>
                        <RequestCardInfo>
                          <RequestCardInfoItem>
                            <span>{request.role}</span>
                          </RequestCardInfoItem>
                          
                          {request.category === 'vacation' && (
                            <>
                              <RequestCardInfoItem>
                                <span>
                                  {formatDate(request.startDate)} ~ {formatDate(request.endDate)} 
                                  ({request.days}일)
                                </span>
                              </RequestCardInfoItem>
                            </>
                          )}
                          
                          {request.category === 'join' && (
                            <>
                              <RequestCardInfoItem>
                                <span>{request.email}</span>
                              </RequestCardInfoItem>
                              <RequestCardInfoItem>
                                <span>{request.phone}</span>
                              </RequestCardInfoItem>
                            </>
                          )}
                          
                          {request.category === 'attendance' && (
                            <>
                              <RequestCardInfoItem>
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {formatDate(request.startDate)} ~ {formatDate(request.endDate)} 
                                  ({request.days}일)
                                </span>
                              </RequestCardInfoItem>
                              {request.workcationLocation && (
                                <RequestCardInfoItem>
                                  <MapPin className="w-3 h-3" />
                                  <span>장소: {request.workcationLocation}</span>
                                </RequestCardInfoItem>
                              )}
                            </>
                          )}
                          
                          {request.category === 'project' && (
                            <>
                              <RequestCardInfoItem>
                                <span>{request.projectName}</span>
                              </RequestCardInfoItem>
                              <RequestCardInfoItem>
                                <span>작가: {request.artist}</span>
                              </RequestCardInfoItem>
                              <RequestCardInfoItem>
                                <span>플랫폼: {request.platform}</span>
                              </RequestCardInfoItem>
                            </>
                          )}
                          
                          <RequestCardInfoItem>
                            <span>{request.reason}</span>
                          </RequestCardInfoItem>
                          <RequestCardInfoItem>
                            <span>신청일: {formatDate(request.submittedDate)}</span>
                          </RequestCardInfoItem>
                        </RequestCardInfo>
                      </div>
                    </RequestCardHeader>

                    <RequestCardActions onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white"
                        onClick={() => handleOpenApproveModal(request)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[#F44336] text-[#F44336] hover:bg-red-50"
                        onClick={() => handleOpenRejectModal(request)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        반려
                      </Button>
                    </RequestCardActions>
                  </RequestCard>
                ))
              )}
            </div>
          </PendingSection>

          {/* Right: 승인/반려 내역 */}
          <div className="rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">처리 내역</h3>
              <Badge variant="outline" className="bg-white border border-border">{processedRequests.length}건</Badge>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {processedRequests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground bg-white rounded-lg border border-border">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">처리된 내역이 없습니다</p>
                </div>
              ) : (
                processedRequests.map((request) => (
                  <div 
                    key={request.id} 
                    onClick={() => handleOpenDetailModal(request)}
                    className={`p-4 rounded-lg border bg-white cursor-pointer ${
                      request.status === '승인' 
                        ? 'border-[#A5D6A7]' 
                        : request.status === '반려'
                        ? 'border-[#EF9A9A]'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-foreground">{request.requester}</h5>
                          <Badge className={`${getTypeColor(request.type)} text-xs text-white`}>
                            {request.type}
                          </Badge>
                          {request.status !== '승인 취소됨' && (
                            <Badge className={`${getStatusColor(request.status)} text-xs text-white`}>
                              {getStatusText(request.status)}
                            </Badge>
                          )}
                          {request.status === '승인 취소됨' && (
                            <Badge className="bg-gray-400 text-xs text-white">
                              {getStatusText(request.status)}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {request.category === 'vacation' && (
                            <div>
                              {formatDate(request.startDate)} ~ {formatDate(request.endDate)} 
                              ({request.days}일)
                            </div>
                          )}
                          {request.category === 'join' && (
                            <div>{request.email}</div>
                          )}
                          {request.category === 'attendance' && (
                            <div>
                              {formatDate(request.startDate)} ~ {formatDate(request.endDate)} 
                              ({request.days}일)
                              {request.workcationLocation && ` - ${request.workcationLocation}`}
                            </div>
                          )}
                          {request.category === 'project' && (
                            <div>{request.projectName} - {request.artist}</div>
                          )}
                          {request.reason && <div>사유: {request.reason}</div>}
                          {request.status === '반려' && request.rejectionReason && (
                            <div className="flex items-start gap-1 mt-2 p-2 bg-red-100 rounded border border-red-200">
                              <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                              <span className="text-red-900">반려 사유: {request.rejectionReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {request.status === '승인' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                            setShowCancelConfirmModal(true);
                          }}
                          className="text-[#F44336] hover:text-[#D32F2F] p-1 flex items-center gap-1"
                          title="취소"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="text-xs">취소</span>
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                      처리일: {formatDate(request.processedDate || '')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ContentGrid>
      </AgencyApprovalsBody>

      {/* 반려 사유 입력 모달 */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">요청 반려</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#1F2328] mb-2 block">
                반려 사유 <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="반려 사유를 입력하세요..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[120px] bg-[#F5F5F5] border-[#DADDE1] text-[#1F2328]"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedRequest(null);
              }}
            >
              취소
            </Button>
            <Button 
              className="bg-[#F44336] hover:bg-[#D32F2F] text-white" 
              onClick={handleReject}
            >
              반려
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 승인 모달 (병가인 경우) */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">
              {selectedRequest?.category === 'sick' ? '병가 승인' : '승인'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRequest?.category === 'sick' ? (
              <div>
                <label className="text-sm font-medium text-[#1F2328] mb-2 block">
                  인정 일 수
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="예: 3"
                    value={approvedDays}
                    onChange={(e) => setApprovedDays(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm text-[#1F2328]">일</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">인정 일 수를 입력하세요</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {selectedRequest?.requester}의 {selectedRequest?.type} 신청을 승인하시겠습니까?
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowApproveModal(false);
                setSelectedRequest(null);
                setApprovedDays('');
              }}
            >
              취소
            </Button>
            <Button 
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white" 
              onClick={handleApprove}
            >
              승인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 승인 취소 확인 모달 */}
      <Dialog open={showCancelConfirmModal} onOpenChange={setShowCancelConfirmModal}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">승인 취소</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-[#1F2328]">
              정말 취소하겠습니까?
            </p>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCancelConfirmModal(false);
                setSelectedRequest(null);
              }}
            >
              취소
            </Button>
            <Button 
              className="bg-[#F44336] hover:bg-[#D32F2F] text-white" 
              onClick={handleCancelApproval}
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 상세보기 모달 */}
      <RequestDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        request={selectedRequest}
      />
    </AgencyApprovalsRoot>
  );
}
