import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { 
  Bell, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AgencyJoinRequestsRoot,
  AgencyJoinRequestsBody,
  HeaderSection,
  HeaderIcon,
  HeaderTitle,
  HeaderSubtitle,
  StatisticsGrid,
  StatisticsCard,
  StatisticsCardContent,
  StatisticsIcon,
  StatisticsLabel,
  StatisticsValue,
  PendingSection,
  PendingSectionHeader,
  PendingSectionTitle,
  PendingBadge,
  PendingRequestsList,
  RequestCard,
  RequestCardContent,
  RequestAvatar,
  RequestInfo,
  RequestNameRow,
  RequestName,
  RequestDetails,
  RequestDetailItem,
  RequestMessage,
  RequestActions,
  ProcessedSection,
  ProcessedSectionTitle,
  ProcessedRequestsList,
  ProcessedRequestCard,
  EmptyStateCard,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  DetailModalContent,
  StatusSection,
  InfoSection,
  InfoSectionTitle,
  InfoItem,
  InfoLabel,
  InfoValue,
  MessageSection,
  MessageContent,
} from './AgencyJoinRequestsPage.styled';

// TODO: Zustand store mapping - 가입 요청 목록
const initialRequests = [
  {
    id: '1',
    name: '김작가',
    email: 'kim.artist@example.com',
    phone: '010-1234-5678',
    position: '웹툰 작가',
    userType: 'individual',
    agencyCode: 'AGENCY-2026-001',
    message: '안녕하세요. 웹툰 작가 김작가입니다. 귀사와 함께 작업하고 싶습니다.',
    requestDate: '2026-01-17',
    status: 'pending'
  },
  {
    id: '2',
    name: '이담당',
    email: 'lee.manager@example.com',
    phone: '010-9876-5432',
    position: '담당자',
    userType: 'manager',
    agencyCode: 'AGENCY-2026-001',
    message: '프로젝트 관리 경력 5년차 이담당입니다.',
    requestDate: '2026-01-16',
    status: 'pending'
  },
  {
    id: '3',
    name: '박신입',
    email: 'park.newbie@example.com',
    phone: '010-5555-7777',
    position: '어시스턴트',
    userType: 'individual',
    agencyCode: 'AGENCY-2026-001',
    message: '',
    requestDate: '2026-01-15',
    status: 'approved'
  }
];

export function AgencyJoinRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (requestId) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' }
          : req
      )
    );
    toast.success('가입 요청이 승인되었습니다.');
    setIsDetailModalOpen(false);
  };

  const handleReject = (requestId) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'rejected' }
          : req
      )
    );
    toast.success('가입 요청이 거절되었습니다.');
    setIsDetailModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">대기중</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">거절됨</Badge>;
      default:
        return null;
    }
  };

  const getUserTypeBadge = (userType) => {
    return userType === 'individual' 
      ? <Badge className="bg-purple-100 text-purple-700 border-purple-200">작가</Badge>
      : <Badge className="bg-blue-100 text-blue-700 border-blue-200">담당자</Badge>;
  };

  return (
    <AgencyJoinRequestsRoot>
      <AgencyJoinRequestsBody>
        {/* Header */}
        <HeaderSection>
          <HeaderIcon>
            <Bell className="w-8 h-8 text-primary" />
          </HeaderIcon>
          <div>
            <HeaderTitle>가입 요청 관리</HeaderTitle>
            <HeaderSubtitle>새로운 작가 및 담당자의 에이전시 가입 요청을 관리하세요</HeaderSubtitle>
          </div>
        </HeaderSection>

        {/* Statistics Cards */}
        <StatisticsGrid>
          <StatisticsCard>
            <StatisticsCardContent>
              <div>
                <StatisticsLabel>대기중인 요청</StatisticsLabel>
                <StatisticsValue>{pendingRequests.length}</StatisticsValue>
              </div>
              <StatisticsIcon $color="yellow">
                <Clock className="w-6 h-6 text-yellow-600" />
              </StatisticsIcon>
            </StatisticsCardContent>
          </StatisticsCard>

          <StatisticsCard>
            <StatisticsCardContent>
              <div>
                <StatisticsLabel>승인된 요청</StatisticsLabel>
                <StatisticsValue>
                  {requests.filter(r => r.status === 'approved').length}
                </StatisticsValue>
              </div>
              <StatisticsIcon $color="green">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </StatisticsIcon>
            </StatisticsCardContent>
          </StatisticsCard>

          <StatisticsCard>
            <StatisticsCardContent>
              <div>
                <StatisticsLabel>전체 요청</StatisticsLabel>
                <StatisticsValue>{requests.length}</StatisticsValue>
              </div>
              <StatisticsIcon $color="blue">
                <Building2 className="w-6 h-6 text-blue-600" />
              </StatisticsIcon>
            </StatisticsCardContent>
          </StatisticsCard>
        </StatisticsGrid>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <PendingSection>
            <PendingSectionHeader>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <PendingSectionTitle>새로운 요청</PendingSectionTitle>
              <PendingBadge>{pendingRequests.length}</PendingBadge>
            </PendingSectionHeader>

            <PendingRequestsList>
              {pendingRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RequestCard>
                    <RequestCardContent>
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <RequestAvatar>
                          <User className="w-6 h-6 text-primary-foreground" />
                        </RequestAvatar>

                        {/* Info */}
                        <RequestInfo>
                          <RequestNameRow>
                            <RequestName>{request.name}</RequestName>
                            {getUserTypeBadge(request.userType)}
                            {getStatusBadge(request.status)}
                          </RequestNameRow>
                          
                          <RequestDetails>
                            <RequestDetailItem>
                              <Mail className="w-4 h-4" />
                              {request.email}
                            </RequestDetailItem>
                            <RequestDetailItem>
                              <Briefcase className="w-4 h-4" />
                              {request.position || '미입력'}
                            </RequestDetailItem>
                            <RequestDetailItem>
                              <Phone className="w-4 h-4" />
                              {request.phone || '미입력'}
                            </RequestDetailItem>
                            <RequestDetailItem>
                              <Calendar className="w-4 h-4" />
                              {request.requestDate}
                            </RequestDetailItem>
                          </RequestDetails>

                          {request.message && (
                            <RequestMessage>
                              {request.message}
                            </RequestMessage>
                          )}
                        </RequestInfo>
                      </div>

                      {/* Actions */}
                      <RequestActions>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewDetail(request)}
                          className="flex-1 md:w-full"
                        >
                          상세보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 md:w-full border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          승인
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="flex-1 md:w-full border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          거절
                        </Button>
                      </RequestActions>
                    </RequestCardContent>
                  </RequestCard>
                </motion.div>
              ))}
            </PendingRequestsList>
          </PendingSection>
        )}

        {/* Processed Requests Section */}
        {processedRequests.length > 0 && (
          <ProcessedSection>
            <ProcessedSectionTitle>처리 완료</ProcessedSectionTitle>

            <ProcessedRequestsList>
              {processedRequests.map((request) => (
                <ProcessedRequestCard key={request.id}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{request.name}</h3>
                          {getUserTypeBadge(request.userType)}
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {request.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {request.requestDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetail(request)}
                    >
                      상세보기
                    </Button>
                  </div>
                </ProcessedRequestCard>
              ))}
            </ProcessedRequestsList>
          </ProcessedSection>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <EmptyStateCard>
            <EmptyStateIcon>
              <Bell className="w-8 h-8 text-muted-foreground" />
            </EmptyStateIcon>
            <EmptyStateTitle>가입 요청이 없습니다</EmptyStateTitle>
            <EmptyStateText>새로운 가입 요청이 들어오면 여기에 표시됩니다</EmptyStateText>
          </EmptyStateCard>
        )}
      </AgencyJoinRequestsBody>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>가입 요청 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedRequest?.name}님의 가입 요청 내역입니다
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <DetailModalContent>
              {/* Status */}
              <StatusSection>
                <span className="font-medium text-foreground">상태</span>
                {getStatusBadge(selectedRequest.status)}
              </StatusSection>

              {/* Personal Info */}
              <InfoSection>
                <InfoSectionTitle>
                  <User className="w-5 h-5 mr-2 text-primary" />
                  개인 정보
                </InfoSectionTitle>
                <div className="space-y-3">
                  <InfoItem>
                    <InfoLabel>이름</InfoLabel>
                    <InfoValue>{selectedRequest.name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>계정 유형</InfoLabel>
                    {getUserTypeBadge(selectedRequest.userType)}
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>이메일</InfoLabel>
                    <InfoValue>{selectedRequest.email}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>연락처</InfoLabel>
                    <InfoValue>{selectedRequest.phone || '미입력'}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>
                      {selectedRequest.userType === 'individual' ? '작가명' : '직책'}
                    </InfoLabel>
                    <InfoValue>{selectedRequest.position || '미입력'}</InfoValue>
                  </InfoItem>
                </div>
              </InfoSection>

              {/* Agency Info */}
              <InfoSection>
                <InfoSectionTitle>
                  <Building2 className="w-5 h-5 mr-2 text-primary" />
                  에이전시 정보
                </InfoSectionTitle>
                <div className="space-y-3">
                  <InfoItem>
                    <InfoLabel>회사 코드</InfoLabel>
                    <InfoValue className="font-mono">{selectedRequest.agencyCode}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>요청일</InfoLabel>
                    <InfoValue>{selectedRequest.requestDate}</InfoValue>
                  </InfoItem>
                </div>
              </InfoSection>

              {/* Message */}
              {selectedRequest.message && (
                <MessageSection>
                  <h4 className="font-semibold text-foreground mb-3">메시지</h4>
                  <MessageContent>
                    <p className="text-foreground whitespace-pre-wrap">{selectedRequest.message}</p>
                  </MessageContent>
                </MessageSection>
              )}

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => handleApprove(selectedRequest.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    승인
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => handleReject(selectedRequest.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    거절
                  </Button>
                </div>
              )}
            </DetailModalContent>
          )}
        </DialogContent>
      </Dialog>
    </AgencyJoinRequestsRoot>
  );
}
