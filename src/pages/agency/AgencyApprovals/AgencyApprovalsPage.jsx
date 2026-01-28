import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { CheckCircle2, XCircle, Calendar, FileText, Clock, AlertCircle, User, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { agencyService } from '@/api';
import useAuthStore from '@/store/authStore';
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
  { value: 'join', label: '가입', color: '#00ACC1' },
];

export function AgencyApprovalsPage() {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('join');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  
  // 에이전시 가입 요청 목록 조회
  useEffect(() => {
    const fetchJoinRequests = async () => {
      if (!user?.agencyNo) {
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await agencyService.getJoinRequests(user.agencyNo);
        // API 응답을 프론트엔드 형식으로 변환
        const formattedRequests = response.map((req) => ({
          id: req.newRequestNo,
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
        setRequests(formattedRequests);
      } catch (error) {
        console.error('에이전시 가입 요청 목록 조회 실패:', error);
        toast.error('에이전시 가입 요청 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJoinRequests();
  }, [user?.agencyNo]);

  // 카테고리별 필터링
  const filteredRequests = requests.filter(r => r.category === selectedCategory);
  const pendingRequests = filteredRequests.filter(r => r.status === '대기');
  const processedRequests = filteredRequests.filter(r => r.status !== '대기')
    .sort((a, b) => {
      const dateA = new Date(a.processedDate || '').getTime();
      const dateB = new Date(b.processedDate || '').getTime();
      return dateB - dateA;
    });

  const handleApprove = async (request) => {
    try {
      // 백엔드 API 호출
      const response = await agencyService.approveJoinRequest(request.id);
      console.log('승인 API 응답:', response);
      
      // API 성공 시 로컬 상태 업데이트
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

  const handleOpenRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('반려 사유를 입력해주세요.');
      return;
    }

    if (selectedRequest) {
      try {
        // 백엔드 API 호출
        const response = await agencyService.rejectJoinRequest(selectedRequest.id, rejectionReason);
        console.log('거절 API 응답:', response);
        
        // API 성공 시 로컬 상태 업데이트
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
        return 'bg-[#9C27B0]';
      case '가입':
        return 'bg-[#00ACC1]';
      case '신작':
        return 'bg-[#FF9800]';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '대기':
        return 'bg-yellow-500';
      case '승인':
        return 'bg-green-500';
      case '반려':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-medium text-muted-foreground">승인 대기</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{allPendingCount}건</p>
          </StatisticsCard>
          <StatisticsCard>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-muted-foreground">이번 달 승인</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{thisMonthApproved}건</p>
          </StatisticsCard>
          <StatisticsCard>
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-muted-foreground">이번 달 반려</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{thisMonthRejected}건</p>
          </StatisticsCard>
        </StatisticsGrid>

        {/* 카테고리 필터 */}
        <Card className="p-4 mb-6 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">카테고리:</span>
            <div className="flex gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={selectedCategory === category.value ? `bg-[${category.color}] hover:bg-[${category.color}]/90` : ''}
                  style={selectedCategory === category.value ? { backgroundColor: category.color } : {}}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <ContentGrid>
          {/* Left: 승인/반려 대기 */}
          <PendingSection>
            <SectionHeader>
              <SectionTitle>승인 대기 중</SectionTitle>
              {pendingRequests.length > 0 && (
                <SectionBadge>{pendingRequests.length}건</SectionBadge>
              )}
            </SectionHeader>

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
                  <RequestCard key={request.id}>
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
                            <User className="w-3 h-3" />
                            <span>{request.role}</span>
                          </RequestCardInfoItem>
                          
                          {request.category === 'vacation' && (
                            <>
                              <RequestCardInfoItem>
                                <Calendar className="w-3 h-3" />
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
                                <FileText className="w-3 h-3" />
                                <span>{request.email}</span>
                              </RequestCardInfoItem>
                              <RequestCardInfoItem>
                                <FileText className="w-3 h-3" />
                                <span>{request.phone}</span>
                              </RequestCardInfoItem>
                            </>
                          )}
                          
                          {request.category === 'project' && (
                            <>
                              <RequestCardInfoItem>
                                <Briefcase className="w-3 h-3" />
                                <span>{request.projectName}</span>
                              </RequestCardInfoItem>
                              <RequestCardInfoItem>
                                <User className="w-3 h-3" />
                                <span>작가: {request.artist}</span>
                              </RequestCardInfoItem>
                              <RequestCardInfoItem>
                                <FileText className="w-3 h-3" />
                                <span>플랫폼: {request.platform}</span>
                              </RequestCardInfoItem>
                            </>
                          )}
                          
                          <RequestCardInfoItem>
                            <FileText className="w-3 h-3" />
                            <span>{request.reason}</span>
                          </RequestCardInfoItem>
                          <RequestCardInfoItem>
                            <Clock className="w-3 h-3" />
                            <span>신청일: {formatDate(request.submittedDate)}</span>
                          </RequestCardInfoItem>
                        </RequestCardInfo>
                      </div>
                    </RequestCardHeader>

                    <RequestCardActions>
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
                    </RequestCardActions>
                  </RequestCard>
                ))
              )}
            </div>
          </PendingSection>

          {/* Right: 승인/반려 내역 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">처리 내역</h3>
              <Badge variant="outline">{processedRequests.length}건</Badge>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
              {processedRequests.length === 0 ? (
                <Card className="p-8 bg-white">
                  <div className="text-center text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">처리된 내역이 없습니다</p>
                  </div>
                </Card>
              ) : (
                processedRequests.map((request) => (
                  <Card 
                    key={request.id} 
                    className={`p-4 ${
                      request.status === '승인' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-foreground">{request.requester}</h5>
                          <Badge className={`${getTypeColor(request.type)} text-xs`}>
                            {request.type}
                          </Badge>
                          <Badge className={`${getStatusColor(request.status)} text-xs`}>
                            {request.status}
                          </Badge>
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
                          {request.category === 'project' && (
                            <div>{request.projectName} - {request.artist}</div>
                          )}
                          <div>사유: {request.reason}</div>
                          {request.status === '반려' && request.rejectionReason && (
                            <div className="flex items-start gap-1 mt-2 p-2 bg-red-100 rounded border border-red-200">
                              <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                              <span className="text-red-900">반려 사유: {request.rejectionReason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      처리일: {formatDate(request.processedDate || '')}
                    </div>
                  </Card>
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
            <DialogTitle className="text-lg text-[#1F2328] font-bold">반려 사유 입력</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {selectedRequest?.requester}의 {selectedRequest?.type} 신청을 반려하는 사유를 입력해주세요.
            </p>
            <Textarea
              placeholder="반려 사유를 입력하세요..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px] bg-white border-[#DADDE1] text-[#1F2328]"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
              }}
            >
              취소
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleReject}
            >
              반려하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AgencyApprovalsRoot>
  );
}
