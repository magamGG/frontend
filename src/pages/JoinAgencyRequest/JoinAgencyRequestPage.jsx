import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Building2, User, Mail, Phone, Key, Send, ArrowLeft, CheckCircle2, Edit } from 'lucide-react';
import { toast } from 'sonner';
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
  
  // TODO: Zustand store에서 사용자 정보 가져오기
  const [userData, setUserData] = useState({
    name: '김작가',
    email: 'kim.artist@example.com',
    phone: '010-1234-5678',
  });
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...userData });
  const [agencyCode, setAgencyCode] = useState('');

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
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

    setUserData({ ...editFormData });
    setIsEditingProfile(false);
    toast.success('개인 정보가 수정되었습니다.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!agencyCode) {
      toast.error('회사 전용 코드를 입력해주세요.');
      return;
    }

    // TODO: API 호출로 에이전시 가입 요청 전송
    setTimeout(() => {
      setStep('success');
      toast.success('에이전시 가입 요청이 전송되었습니다!');
    }, 1000);
  };

  const handleComplete = () => {
    onSuccess();
  };

  if (step === 'success') {
    return (
      <JoinAgencyRequestRoot>
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

              <SuccessTitle>요청이 전송되었습니다!</SuccessTitle>
              <SuccessDescription>
                에이전시 담당자가 검토 후 승인하면<br />
                알림을 받으실 수 있습니다.
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
                <InfoRow>
                  <InfoLabel>회사 코드</InfoLabel>
                  <InfoValue>{agencyCode}</InfoValue>
                </InfoRow>
              </SuccessInfoBox>

              <Button onClick={handleComplete} style={{ width: '100%', padding: '24px' }}>
                완료
              </Button>
            </SuccessCard>
          </Card>
        </motion.div>
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
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      <InputField
                        id="agencyCode"
                        type="text"
                        placeholder="예: AGENCY-2026-001"
                        value={agencyCode}
                        onChange={(e) => setAgencyCode(e.target.value)}
                        required
                        $mono
                        style={{ height: '48px' }}
                      />
                    </InputWrapper>
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>
                      에이전시 담당자에게 전용 코드를 문의하세요
                    </p>
                  </InputGroup>
                </div>

                <Button type="submit" style={{ width: '100%', padding: '24px', fontSize: '16px', fontWeight: 600 }}>
                  <Send size={20} style={{ marginRight: '8px' }} />
                  가입 요청 보내기
                </Button>
              </FormSection>

              <InfoAlert>
                <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                  <strong>💡 안내:</strong> 가입 요청 후 에이전시 담당자의 승인이 필요합니다. 
                  승인 완료 시 등록하신 이메일로 알림이 전송됩니다.
                </p>
              </InfoAlert>
            </RequestCard>
          </Card>
        </JoinAgencyRequestContainer>
      </motion.div>

      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent style={{ maxWidth: '500px', backgroundColor: 'white' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '18px', color: '#1F2328', fontWeight: 'bold' }}>개인 정보 수정</DialogTitle>
            <DialogDescription style={{ fontSize: '14px', color: '#6E8FB3' }}>
              회원가입 시 입력한 개인 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="edit-name" style={{ fontSize: '14px', color: '#1F2328' }}>이름 *</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => handleEditInputChange('name', e.target.value)}
                style={{ backgroundColor: 'white', borderColor: '#DADDE1', color: '#1F2328' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="edit-email" style={{ fontSize: '14px', color: '#1F2328' }}>이메일 *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleEditInputChange('email', e.target.value)}
                style={{ backgroundColor: 'white', borderColor: '#DADDE1', color: '#1F2328' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Label htmlFor="edit-phone" style={{ fontSize: '14px', color: '#1F2328' }}>연락처 *</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) => handleEditInputChange('phone', e.target.value)}
                placeholder="010-0000-0000"
                style={{ backgroundColor: 'white', borderColor: '#DADDE1', color: '#1F2328' }}
              />
              <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0 }}>
                하이픈(-)을 포함하여 입력해주세요
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #DADDE1' }}>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              취소
            </Button>
            <Button style={{ backgroundColor: '#3F4A5A' }} onClick={handleSaveProfile}>
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </JoinAgencyRequestRoot>
  );
}
