import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Building2, User, Mail, Phone, Key, Send, ArrowLeft, CheckCircle2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { agencyService, memberService } from '@/api';
import useAuthStore from '@/store/authStore';
import { formatPhoneNumber, normalizePhoneNumber } from '@/utils/phoneFormatter';
import {
  JoinAgencyRequestRoot,
  BackgroundPattern,
  JoinAgencyRequestContainer,
  BackButton,
  HeaderSection,
  LogoIconWrapper,
  MainTitle,
  SubTitle,
  RequestCard,
  FormSection,
  SectionHeader,
  SectionTitle,
  InfoBox,
  InfoRow,
  InfoLabel,
  InfoValue,
  Divider,
  InputGroup,
  InputWrapper,
  InputField,
  InfoAlert,
  SuccessCard,
  SuccessIconWrapper,
  SuccessTitle,
  SuccessDescription,
  SuccessInfoBox,
} from './JoinAgencyRequestPage.styled';

export function JoinAgencyRequestPage({ onBack, onSuccess }) {
  const [step, setStep] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMemberInfo, setIsLoadingMemberInfo] = useState(true);
  const user = useAuthStore((state) => state.user);
  
  // Zustand store에서 사용자 정보 가져오기
  const [userData, setUserData] = useState({
    name: user?.memberName || '',
    email: '', // DB에서 가져올 예정
    phone: '', // DB에서 가져올 예정
  });
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...userData });
  const [agencyCodeInput, setAgencyCodeInput] = useState('');
  const [agencyName, setAgencyName] = useState('');
  
  // 사용자 정보 초기화 - DB에서 가져오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
      if (!user?.memberNo) {
        setIsLoadingMemberInfo(false);
        return;
      }

      try {
        setIsLoadingMemberInfo(true);
        // DB에서 회원 정보 가져오기
        // axios interceptor가 이미 response.data를 반환하므로 response 자체가 데이터
        const memberInfo = await memberService.getMyPageInfo(user.memberNo);
        
        setUserData({
          name: memberInfo.memberName || user?.memberName || '',
          email: memberInfo.memberEmail || '',
          phone: memberInfo.memberPhone || '',
        });
        setEditFormData({
          name: memberInfo.memberName || user?.memberName || '',
          email: memberInfo.memberEmail || '',
          phone: memberInfo.memberPhone || '',
        });
      } catch (error) {
        console.error('회원 정보 조회 실패:', error);
        toast.error('회원 정보를 불러오는데 실패했습니다.');
        // 실패 시 기본값 사용
        setUserData(prev => ({ ...prev, name: user?.memberName || '' }));
        setEditFormData(prev => ({ ...prev, name: user?.memberName || '' }));
      } finally {
        setIsLoadingMemberInfo(false);
      }
    };

    fetchMemberInfo();
  }, [user?.memberNo]);

  // 대기 중인 가입 요청 확인
  useEffect(() => {
    const checkPendingRequest = async () => {
      if (!user?.memberNo) return;

      try {
        const myRequest = await agencyService.getMyPendingJoinRequest();
        
        console.log('🔍 [대기 중인 요청 확인] 전체 응답:', myRequest);
        console.log('🔍 [대기 중인 요청 확인] 응답 타입:', typeof myRequest);
        console.log('🔍 [대기 중인 요청 확인] agencyName:', myRequest?.agencyName);
        console.log('🔍 [대기 중인 요청 확인] newRequestStatus:', myRequest?.newRequestStatus);
        
        // 대기 중인 요청이 있으면 success 화면으로 전환
        if (myRequest && myRequest.newRequestStatus === '대기') {
          setStep('success');
          setAgencyName(myRequest.agencyName || '');
          console.log('✅ [대기 중인 요청 확인] 에이전시명 설정됨:', myRequest.agencyName);
        }
      } catch (error) {
        // 204 No Content는 정상 (대기 중인 요청 없음)
        console.log('⚠️ [대기 중인 요청 확인] 에러 발생:', error);
        console.log('⚠️ [대기 중인 요청 확인] 에러 status:', error?.status);
        console.log('⚠️ [대기 중인 요청 확인] 에러 response.status:', error?.response?.status);
        if (error?.status !== 204 && error?.response?.status !== 204) {
          console.error('❌ [대기 중인 요청 확인] 가입 요청 상태 확인 실패:', error);
        }
      }
    };

    checkPendingRequest();
  }, [user?.memberNo]);

  // 성공 화면 렌더링 시 agencyName 상태 확인
  useEffect(() => {
    if (step === 'success') {
      console.log('🔍 [성공 화면] step이 success로 변경됨');
      console.log('🔍 [성공 화면] 현재 agencyName 상태:', agencyName);
      console.log('🔍 [성공 화면] 표시될 텍스트:', agencyName ? `${agencyName}에 요청이 전송되었습니다!` : '요청이 전송되었습니다!');
    }
  }, [step, agencyName]);

  const handleEditInputChange = (field, value) => {
    // 연락처 입력 시 자동 포맷팅
    if (field === 'phone') {
      const formatted = formatPhoneNumber(value);
      setEditFormData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setEditFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveProfile = async () => {
    if (!editFormData.name || !editFormData.email || !editFormData.phone) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(editFormData.phone)) {
      toast.error('올바른 연락처 형식을 입력해주세요. (010-0000-0000)');
      return;
    }

    // DB에 프로필 정보 업데이트
    try {
      await memberService.updateProfile(user.memberNo, {
        memberName: editFormData.name,
        memberPhone: normalizePhoneNumber(editFormData.phone), // DB 저장용 포맷
        memberAddress: '', // 주소는 필요시 추가
      });
      
      setUserData({ ...editFormData });
      setIsEditingProfile(false);
      toast.success('개인 정보가 수정되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      toast.error('개인 정보 수정에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agencyCodeInput.trim()) {
      toast.error('회사 전용 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        agencyCode: agencyCodeInput.trim(),
        memberName: userData.name,
        memberEmail: userData.email,
        memberPhone: userData.phone,
      };

      const response = await agencyService.requestJoinAgency(requestData);
      
      console.log('🔍 [가입 요청 전송] 전체 응답:', response);
      console.log('🔍 [가입 요청 전송] 응답 타입:', typeof response);
      console.log('🔍 [가입 요청 전송] response?.agencyName:', response?.agencyName);
      console.log('🔍 [가입 요청 전송] response 구조:', JSON.stringify(response, null, 2));
      
      // 응답에서 에이전시명 가져오기
      if (response?.agencyName) {
        setAgencyName(response.agencyName);
        console.log('✅ [가입 요청 전송] 에이전시명 설정됨:', response.agencyName);
      } else {
        console.warn('⚠️ [가입 요청 전송] 응답에 agencyName이 없습니다. 응답:', response);
      }
      
      toast.success('에이전시 가입 요청이 전송되었습니다!');
      // 요청 완료 화면으로 전환. 대시보드 이동은 "완료" 버튼 클릭 시에만 handleComplete → onSuccess 로 처리.
      setStep('success');
      console.log('✅ [가입 요청 전송] success 화면으로 전환, agencyName 상태:', agencyName);
    } catch (error) {
      const errorMessage = error?.message || '에이전시 가입 요청 전송에 실패했습니다. 다시 시도해주세요.';
      toast.error(errorMessage);
      console.error('Join agency request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    // "완료" 클릭 시 로그인 화면으로만 이동. 대시보드 이동은 에이전시가 new_request 승인 후 사용자가 다시 로그인할 때.
    onSuccess();
  };

  // 로딩 중일 때 표시
  if (isLoadingMemberInfo) {
    return (
      <JoinAgencyRequestRoot>
        <BackgroundPattern />
        <JoinAgencyRequestContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div>회원 정보를 불러오는 중...</div>
        </JoinAgencyRequestContainer>
      </JoinAgencyRequestRoot>
    );
  }

  // 요청 완료 화면: "완료" 클릭 시 대시보드로 가지 않고 로그인 화면으로 이동. 에이전시 승인 후 재로그인 시 대시보드로 이동.
  if (step === 'success') {
    return (
      <JoinAgencyRequestRoot>
        <BackgroundPattern />
        <JoinAgencyRequestContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '512px' }}
          >
            <Card>
              <SuccessCard>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <SuccessIconWrapper>
                    <div>
                      <CheckCircle2 size={48} />
                    </div>
                  </SuccessIconWrapper>
                </motion.div>

                <SuccessTitle>
                  {agencyName ? `${agencyName}에 요청이 전송되었습니다!` : '요청이 전송되었습니다!'}
                </SuccessTitle>
                <SuccessDescription>
                  에이전시 관리자가 검토 후 승인하면 알림을 받으실 수 있습니다.
                  <br />
                  승인 후 다시 로그인하시면 대시보드로 이동합니다.
                </SuccessDescription>

                <SuccessInfoBox>
                  <InfoRow>
                    <InfoLabel>이름</InfoLabel>
                    <InfoValue>{userData.name}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>이메일</InfoLabel>
                    <InfoValue>{userData.email}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>연락처</InfoLabel>
                    <InfoValue>{userData.phone}</InfoValue>
                  </InfoRow>
                </SuccessInfoBox>

                <Button onClick={handleComplete} style={{ width: '100%', padding: '24px' }}>
                  로그인 화면으로
                </Button>
              </SuccessCard>
            </Card>
          </motion.div>
        </JoinAgencyRequestContainer>
      </JoinAgencyRequestRoot>
    );
  }

  return (
    <JoinAgencyRequestRoot>
      <BackgroundPattern />
      
      <BackButton onClick={onBack}>
        <ArrowLeft size={20} />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>뒤로가기</span>
      </BackButton>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <JoinAgencyRequestContainer>
          <HeaderSection>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <LogoIconWrapper>
                <Building2 size={40} style={{ color: 'var(--primary-foreground)' }} />
              </LogoIconWrapper>
            </motion.div>
            
            <MainTitle>에이전시 가입 요청</MainTitle>
            <SubTitle>소속 에이전시의 전용 코드를 입력하여 가입 요청을 보내세요</SubTitle>
          </HeaderSection>

          <Card>
            <RequestCard>
              <FormSection onSubmit={handleSubmit}>
                <div>
                  <SectionHeader>
                    <SectionTitle>
                      <User size={20} style={{ color: 'var(--primary)' }} />
                      개인 정보
                    </SectionTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditFormData({ ...userData });
                        setIsEditingProfile(true);
                      }}
                    >
                      <Edit size={16} style={{ marginRight: '4px' }} />
                      수정
                    </Button>
                  </SectionHeader>
                  
                  <InfoBox>
                    <InfoRow>
                      <InfoLabel>이름</InfoLabel>
                      <InfoValue>{userData.name}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>이메일</InfoLabel>
                      <InfoValue>{userData.email}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>연락처</InfoLabel>
                      <InfoValue>{userData.phone}</InfoValue>
                    </InfoRow>
                  </InfoBox>
                </div>

                <Divider />

                <div>
                  <SectionTitle style={{ marginBottom: '16px' }}>
                    <Building2 size={20} style={{ color: 'var(--primary)' }} />
                    에이전시 정보
                  </SectionTitle>
                  
                  <InputGroup>
                    <Label htmlFor="agencyCode">회사 전용 코드 *</Label>
                    <InputWrapper>
                      <Key style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'var(--muted-foreground)' }} />
                      <InputField
                        id="agencyCode"
                        type="text"
                        placeholder="예: 12345678901"
                        value={agencyCodeInput}
                        onChange={(e) => setAgencyCodeInput(e.target.value)}
                        disabled={isLoading}
                        required
                        $mono
                        style={{ height: '48px' }}
                      />
                    </InputWrapper>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>
                      에이전시 관리자에게 전용 코드를 문의하세요
                    </p>
                  </InputGroup>
                </div>

                <Button type="submit" style={{ width: '100%', padding: '24px', fontSize: '16px', fontWeight: 600 }} disabled={isLoading}>
                  <Send size={20} style={{ marginRight: '8px' }} />
                  {isLoading ? '전송 중...' : '가입 요청 보내기'}
                </Button>
              </FormSection>

              <InfoAlert>
                <p style={{ fontSize: '14px', color: 'var(--chart-2)', margin: 0 }}>
                  <strong>💡 안내:</strong> 가입 요청 후 에이전시 관리자의 승인이 필요합니다. 
                  승인 완료 시 등록하신 이메일로 알림이 전송됩니다.
                </p>
              </InfoAlert>
            </RequestCard>
          </Card>
        </JoinAgencyRequestContainer>
      </motion.div>

      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent style={{ maxWidth: '500px', backgroundColor: 'var(--card)' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px', color: 'var(--foreground)', fontWeight: 'bold' }}>개인 정보 수정</DialogTitle>
            <DialogDescription style={{ fontSize: '14px', color: 'var(--accent)' }}>
              회원가입 시 입력한 개인 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="edit-name" style={{ fontSize: '14px', color: 'var(--foreground)' }}>이름 *</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => handleEditInputChange('name', e.target.value)}
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="edit-email" style={{ fontSize: '14px', color: 'var(--foreground)' }}>이메일 *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleEditInputChange('email', e.target.value)}
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="edit-phone" style={{ fontSize: '14px', color: 'var(--foreground)' }}>연락처 *</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editFormData.phone}
                onChange={(e) => handleEditInputChange('phone', e.target.value)}
                placeholder="010-1234-5678"
                maxLength={13}
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              취소
            </Button>
            <Button style={{ backgroundColor: 'var(--primary)' }} onClick={handleSaveProfile}>
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </JoinAgencyRequestRoot>
  );
}
