import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Mail, Lock, User, Phone, Building, Briefcase, Edit, Check, Palette, Pen, BookOpen, Paintbrush, ArrowLeft, MapPin } from 'lucide-react';
import { MapPickerModal } from '@/components/modals/MapPickerModal';
import { toast } from 'sonner';
import { memberService } from '@/api';
import { formatPhoneNumber, normalizePhoneNumber } from '@/utils/phoneFormatter';
import api from '@/api/axios';
import {
  SignupRoot,
  BackgroundPattern,
  SignupContainer,
  BackButton,
  LogoTitleSection,
  LogoIconWrapper,
  MainTitle,
  SubTitle,
  SignupCard,
  FormSection,
  InputGroup,
  InputLabel,
  InputWrapper,
  InputField,
  RoleSelectionGrid,
  RoleButton,
  FormGrid,
  Divider,
  Footer,
} from './SignupPage.styled';

// TODO: Zustand store mapping - 사용자 역할 타입
const USER_ROLES = {
  ARTIST: 'artist',
  MANAGER: 'manager',
  AGENCY: 'agency',
};

// 역할 목록
const roleList = [
  {
    id: USER_ROLES.ARTIST,
    icon: Edit,
    title: '아티스트',
    description: '작가 및 어시스트',
    color: 'var(--status-workation)',
  },
  {
    id: USER_ROLES.MANAGER,
    icon: Briefcase,
    title: '담당자',
    description: '프로젝트 매니저/편집자',
    color: 'var(--chart-2)',
  },
  {
    id: USER_ROLES.AGENCY,
    icon: Building,
    title: '에이전시',
    description: '제작사/에이전시 운영자',
    color: 'var(--chart-2)',
  },
];

// 작가 세부 직무 목록
const artistSpecializationList = [
  { value: 'webtoon-writer', label: '웹툰 작가', icon: Pen },
  { value: 'webnovel-writer', label: '웹소설 작가', icon: BookOpen },
  { value: 'assistant-coloring', label: '어시스트 - 채색', icon: Palette },
  { value: 'assistant-lineart', label: '어시스트 - 선화', icon: Paintbrush },
  { value: 'assistant-other', label: '어시스트 - 기타', icon: Paintbrush },
];

export function SignupPage({ onSignup, onBackToLogin }) {
  // URL 파라미터에서 OAuth 정보 확인
  const [isOAuthMode, setIsOAuthMode] = useState(false);
  const [oauthProvider, setOauthProvider] = useState(null);
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [artistSpecialization, setArtistSpecialization] = useState(null);
  const [customSpecializationInput, setCustomSpecializationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isComposing, setIsComposing] = useState({ name: false, phone: false, specialization: false, verificationCode: false }); // IME 조합 상태 추적
  const [signupFormData, setSignupFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    organization: '',
  });
  
  const [showMapPicker, setShowMapPicker] = useState(false);
  // 이메일 인증 관련 상태
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // 재전송 타이머 (초)
  
  // URL 파라미터에서 OAuth 정보 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const name = params.get('name');
    const oauth = params.get('oauth');
    
    if (email && name && oauth) {
      setIsOAuthMode(true);
      setOauthProvider(oauth);
      setSignupFormData(prev => ({
        ...prev,
        email: email,
        name: name,
      }));
      // OAuth 모드에서는 이메일 인증 완료로 간주
      setIsEmailVerified(true);
    }
  }, []);

  // 이메일 변경 시 인증 상태 초기화
  useEffect(() => {
    if (signupFormData.email) {
      setIsEmailVerified(false);
      setEmailVerificationCode('');
    }
  }, [signupFormData.email]);
  
  // 재전송 타이머
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);
  
  // 인증 코드 전송
  const handleSendVerificationCode = async () => {
    if (!signupFormData.email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupFormData.email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    setIsSendingCode(true);
    try {
      await api.post('/api/auth/email/send-code', {
        email: signupFormData.email,
      });
      toast.success('인증 코드가 전송되었습니다.');
      setResendTimer(60); // 1분 타이머 시작
    } catch (error) {
      const errorMessage = error?.response?.data?.message || '인증 코드 전송에 실패했습니다.';
      toast.error(errorMessage);
      console.error('Send verification code error:', error);
    } finally {
      setIsSendingCode(false);
    }
  };
  
  // 인증 코드 검증
  const handleVerifyCode = async () => {
    if (!emailVerificationCode || emailVerificationCode.length !== 6) {
      toast.error('6자리 인증 코드를 입력해주세요.');
      return;
    }
    
    setIsVerifyingCode(true);
    try {
      const response = await api.post('/api/auth/email/verify-code', {
        email: signupFormData.email,
        code: emailVerificationCode,
      });
      
      // axios interceptor가 response.data를 직접 반환하므로 response 자체가 data입니다
      if (response.verified) {
        setIsEmailVerified(true);
        toast.success('이메일 인증이 완료되었습니다.');
      } else {
        toast.error(response.message || '인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || '인증 코드 검증에 실패했습니다.';
      toast.error(errorMessage);
      console.error('Verify code error:', error);
    } finally {
      setIsVerifyingCode(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // IME 조합 중일 때는 필터링하지 않음
    if (name === 'name' && isComposing.name) {
      setSignupFormData({
        ...signupFormData,
        [name]: value,
      });
      return;
    }
    
    if (name === 'phone' && isComposing.phone) {
      setSignupFormData({
        ...signupFormData,
        [name]: value,
      });
      return;
    }
    
    // 연락처 입력 시 자동 포맷팅
    if (name === 'phone') {
      // 숫자만 허용
      const numericOnly = value.replace(/[^0-9]/g, '');
      const formatted = formatPhoneNumber(numericOnly);
      setSignupFormData({
        ...signupFormData,
        [name]: formatted,
      });
    } else if (name === 'name') {
      // 이름은 한글(완성형 + 자모), 영문만 허용 (공백 제외)
      // 한글 자모 범위: 초성(ㄱ~ㅎ: U+1100~U+1112), 중성(ㅏ~ㅣ: U+1161~U+1175), 종성(ㄱ~ㅎ: U+11A8~U+11C2)
      // 완성형 한글: 가~힣 (U+AC00~U+D7A3)
      const filtered = value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]/g, '');
      setSignupFormData({
        ...signupFormData,
        [name]: filtered,
      });
    } else if (name === 'password' || name === 'confirmPassword') {
      // 비밀번호는 띄어쓰기 제거
      const filtered = value.replace(/\s/g, '');
      setSignupFormData({
        ...signupFormData,
        [name]: filtered,
      });
    } else if (name === 'email') {
      // 이메일은 띄어쓰기 제거
      const filtered = value.replace(/\s/g, '');
      setSignupFormData({
        ...signupFormData,
        [name]: filtered,
      });
    } else {
      setSignupFormData({
        ...signupFormData,
        [name]: value,
      });
    }
  };

  // IME 조합 시작
  const handleCompositionStart = (e) => {
    const name = e.target.name;
    setIsComposing(prev => ({ ...prev, [name]: true }));
  };

  // IME 조합 종료
  const handleCompositionEnd = (e) => {
    const name = e.target.name;
    setIsComposing(prev => ({ ...prev, [name]: false }));
    // 조합 종료 후 필터링 적용
    if (name === 'specialization') {
      // 기타 직무 입력: 숫자, 특수문자 제거 (공백은 허용)
      const filtered = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]/g, '');
      setCustomSpecializationInput(filtered);
    } else {
      handleInputChange(e);
    }
  };

  // 초성이 포함되어 있는지 검증 (한글 자모가 포함되어 있으면 true)
  const hasHangulJamo = (text) => {
    if (!text) return false;
    // 한글 자모가 있는지 확인 (ㄱ~ㅎ, ㅏ~ㅣ)
    return /[ㄱ-ㅎㅏ-ㅣ]/.test(text);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role !== USER_ROLES.ARTIST) {
      setArtistSpecialization(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('역할을 선택해주세요.');
      return;
    }
    if (selectedRole === USER_ROLES.ARTIST && !artistSpecialization) {
      toast.error('세부 직무를 선택해주세요.');
      return;
    }
    // 기타 직무 선택 시 입력값 검증
    if (selectedRole === USER_ROLES.ARTIST && artistSpecialization === 'assistant-other') {
      if (!customSpecializationInput || !customSpecializationInput.trim()) {
        toast.error('기타 직무를 입력해주세요.');
        return;
      }
      // 기타 직무 입력에 초성이 포함되어 있는지 검증
      if (hasHangulJamo(customSpecializationInput)) {
        toast.error('직무를 완성해주세요. 초성을 포함할 수 없습니다.');
        return;
      }
    }
    // 이름에 초성이 포함되어 있는지 검증
    if (hasHangulJamo(signupFormData.name)) {
      toast.error('이름을 완성해주세요. 초성을 포함할 수 없습니다.');
      return;
    }
    // OAuth 모드가 아닐 때만 비밀번호 검증
    if (!isOAuthMode) {
      if (signupFormData.password !== signupFormData.confirmPassword) {
        toast.error('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      // 이메일 인증 확인 - 테스트를 위해 주석처리
      /*
      if (!isEmailVerified) {
        toast.error('이메일 인증을 완료해주세요.');
        return;
      }
      */
    }

    setIsLoading(true);
    try {
      // DB 스키마에 MEMBER_ID 필드가 없으므로 MEMBER_EMAIL만 사용
      const memberData = {
        memberName: signupFormData.name,
        memberEmail: signupFormData.email, // UNIQUE, 로그인 ID로 사용
        memberPhone: normalizePhoneNumber(signupFormData.phone), // DB 저장용 포맷
        memberAddress: signupFormData.address?.trim() || '',
        memberRole: selectedRole === USER_ROLES.ARTIST 
          ? (artistSpecialization === 'webtoon-writer' ? '웹툰 작가'
            : artistSpecialization === 'webnovel-writer' ? '웹소설 작가'
            : artistSpecialization === 'assistant-coloring' ? '어시스트 - 채색'
            : artistSpecialization === 'assistant-lineart' ? '어시스트 - 선화'
            : artistSpecialization === 'assistant-other' ? `어시스트 - ${customSpecializationInput.trim()}`
            : '웹툰 작가')
          : selectedRole === USER_ROLES.MANAGER ? '담당자'
          : selectedRole === USER_ROLES.AGENCY ? '에이전시 관리자'
          : '웹툰 작가',
      };
      
      // OAuth 모드가 아닐 때만 비밀번호 추가
      if (!isOAuthMode) {
        memberData.memberPassword = signupFormData.password;
      } else {
        // OAuth 모드일 경우 OAuth 플래그 추가
        memberData.oauthProvider = oauthProvider;
      }
      
      // 역할별로 다른 필드 추가
      if (selectedRole === USER_ROLES.ARTIST) {
        // 아티스트는 선택적으로 에이전시에 속할 수 있으므로 agencyNo는 null (비소속 허용)
        memberData.agencyNo = null;
      } else if (selectedRole === USER_ROLES.MANAGER) {
        // 담당자는 선택적으로 에이전시 코드로 기존 에이전시에 가입 (비소속 허용)
        // organization 필드가 비어있지 않으면 에이전시 코드로 처리, 비어있으면 비소속
        if (signupFormData.organization && signupFormData.organization.trim() !== '') {
          memberData.agencyCode = signupFormData.organization;
        }
        // organization이 비어있으면 agencyCode를 보내지 않아서 비소속으로 가입됨
      } else if (selectedRole === USER_ROLES.AGENCY) {
        // 에이전시 관리자는 새 에이전시를 생성 (필수)
        memberData.agencyName = signupFormData.organization;
      }

      await memberService.register(memberData);
      toast.success('회원가입이 완료되었습니다.');
      onSignup();
    } catch (error) {
      const errorMessage = error?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      toast.error(errorMessage);
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupRoot>
      <BackgroundPattern />
      
      <BackButton onClick={onBackToLogin}>
        <ArrowLeft size={20} />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>로그인으로 돌아가기</span>
      </BackButton>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SignupContainer>
          <LogoTitleSection>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <LogoIconWrapper>
                <img 
                  src="/images/hourglass.png" 
                  alt="마감지기 로고" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </LogoIconWrapper>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <MainTitle>회원가입</MainTitle>
              <SubTitle>마감지기와 함께 효율적인 웹툰 제작을 시작하세요</SubTitle>
            </motion.div>
          </LogoTitleSection>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <SignupCard>
                <FormSection 
                  onSubmit={(e) => {
                    // 로딩 중이면 제출 방지
                    if (isLoading) {
                      e.preventDefault();
                      return;
                    }
                    handleSubmit(e);
                  }}
                >
                  {/* Role Selection */}
                  <InputGroup>
                    <InputLabel>역할 선택 *</InputLabel>
                    <RoleSelectionGrid>
                      {roleList.map((role) => {
                        const RoleIcon = role.icon;
                        const isSelected = selectedRole === role.id;
                        
                        return (
                          <motion.div
                            key={role.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <RoleButton
                              type="button"
                              onClick={() => handleRoleChange(role.id)}
                              $isSelected={isSelected}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: 'var(--primary)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1,
                                  }}
                                >
                                  <Check size={12} style={{ color: 'var(--primary-foreground)' }} />
                                </motion.div>
                              )}
                              
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '8px', 
                                textAlign: 'center',
                                width: '100%',
                              }}>
                                <div style={{ 
                                  width: '48px', 
                                  height: '48px', 
                                  backgroundColor: role.color, 
                                  borderRadius: '8px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}>
                                  <RoleIcon size={24} style={{ color: 'white' }} />
                                </div>
                                <div style={{ width: '100%' }}>
                                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>{role.title}</p>
                                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', margin: 0, lineHeight: '1.2' }}>{role.description}</p>
                                </div>
                              </div>
                            </RoleButton>
                          </motion.div>
                        );
                      })}
                    </RoleSelectionGrid>
                  </InputGroup>

                  {/* Artist Specialization */}
                  {selectedRole === USER_ROLES.ARTIST && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <InputGroup>
                        <InputLabel>세부 직무 선택 *</InputLabel>
                        <Select 
                          value={artistSpecialization || ''} 
                          open={isSelectOpen}
                          onOpenChange={setIsSelectOpen}
                          onValueChange={(value) => {
                            setArtistSpecialization(value);
                            setIsSelectOpen(false); // 선택 시 즉시 닫기
                            if (value !== 'assistant-other') {
                              setCustomSpecializationInput('');
                            }
                          }}
                        >
                          <SelectTrigger style={{ width: '100%' }}>
                            <SelectValue placeholder="직무를 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {artistSpecializationList.map((spec) => {
                              const SpecIcon = spec.icon;
                              return (
                                <SelectItem key={spec.value} value={spec.value}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <SpecIcon size={16} />
                                    <span>{spec.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        {artistSpecialization === 'assistant-other' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <InputGroup>
                              <InputLabel>기타 직무 입력 *</InputLabel>
                              <InputWrapper>
                                <Edit className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                                <InputField
                                  type="text"
                                  name="specialization"
                                  value={customSpecializationInput}
                                  onChange={(e) => {
                                    // IME 조합 중일 때는 필터링하지 않음
                                    if (isComposing.specialization) {
                                      setCustomSpecializationInput(e.target.value);
                                      return;
                                    }
                                    // 기타 직무 입력: 숫자, 특수문자 제거 (공백은 허용)
                                    const filtered = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]/g, '');
                                    setCustomSpecializationInput(filtered);
                                  }}
                                  onCompositionStart={handleCompositionStart}
                                  onCompositionEnd={handleCompositionEnd}
                                  placeholder="예: 스토리 작가, 3D 배경 등"
                                  required
                                />
                              </InputWrapper>
                            </InputGroup>
                          </motion.div>
                        )}
                      </InputGroup>
                    </motion.div>
                  )}

                  <Divider />

                  {/* Personal Information */}
                  <FormGrid>
                    <InputGroup>
                      <InputLabel>이름 *</InputLabel>
                      <InputWrapper>
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                        <InputField
                          type="text"
                          name="name"
                          value={signupFormData.name}
                          onChange={handleInputChange}
                          onCompositionStart={handleCompositionStart}
                          onCompositionEnd={handleCompositionEnd}
                          onKeyDown={(e) => {
                            // 스페이스바 입력 차단
                            if (e.key === ' ' || e.key === 'Space') {
                              e.preventDefault();
                            }
                          }}
                          placeholder="홍길동"
                          maxLength={20}
                          required
                        />
                      </InputWrapper>
                    </InputGroup>

                    <InputGroup>
                      <InputLabel>연락처 *</InputLabel>
                      <InputWrapper>
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                        <InputField
                          type="tel"
                          name="phone"
                          value={signupFormData.phone}
                          onChange={handleInputChange}
                          onCompositionStart={handleCompositionStart}
                          onCompositionEnd={handleCompositionEnd}
                          onKeyDown={(e) => {
                            // 숫자, 백스페이스, Delete, 화살표 키만 허용
                            if (!/[0-9]/.test(e.key) && 
                                !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'].includes(e.key) &&
                                !(e.ctrlKey || e.metaKey)) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="010-1234-5678"
                          maxLength={13}
                          required
                        />
                      </InputWrapper>
                    </InputGroup>
                  </FormGrid>

                  <InputGroup>
                    <InputLabel>주소</InputLabel>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <InputWrapper style={{ flex: 1 }}>
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                        <InputField
                          type="text"
                          name="address"
                          value={signupFormData.address}
                          onChange={handleInputChange}
                          placeholder="주소를 입력하거나 지도에서 선택하세요"
                          maxLength={100}
                        />
                      </InputWrapper>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMapPicker(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                      >
                        <MapPin size={16} />
                        지도에서 선택
                      </Button>
                    </div>
                    <MapPickerModal
                      open={showMapPicker}
                      onOpenChange={setShowMapPicker}
                      onSelect={(addr) => setSignupFormData(prev => ({ ...prev, address: addr }))}
                    />
                  </InputGroup>

                    <InputGroup>
                      <InputLabel>이메일 *</InputLabel>
                      {isOAuthMode ? (
                        <div>
                          <InputWrapper>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                            <InputField
                              type="email"
                              name="email"
                              value={signupFormData.email}
                              disabled={true}
                              style={{
                                backgroundColor: 'var(--muted)',
                                cursor: 'not-allowed',
                              }}
                            />
                          </InputWrapper>
                          <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--muted-foreground)' }}>
                            OAuth로 인증된 이메일입니다.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <InputWrapper style={{ flex: 1 }}>
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                              <InputField
                                type="email"
                                name="email"
                                value={signupFormData.email}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                  // 스페이스바 입력 자체를 막기
                                  if (e.key === ' ') {
                                    e.preventDefault();
                                  }
                                }}
                                placeholder="example@email.com"
                                maxLength={50}
                                required
                                disabled={isEmailVerified}
                                style={{
                                  backgroundColor: isEmailVerified ? 'var(--muted)' : undefined,
                                }}
                              />
                            </InputWrapper>
                            <Button
                              type="button"
                              onClick={handleSendVerificationCode}
                              disabled={isSendingCode || resendTimer > 0 || isEmailVerified || !signupFormData.email}
                              style={{
                                minWidth: '120px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {resendTimer > 0 ? `${resendTimer}초` : isSendingCode ? '전송 중...' : '인증 코드 전송'}
                            </Button>
                          </div>
                          {!isEmailVerified && (
                            <div style={{ marginTop: '8px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <InputWrapper style={{ flex: 1 }}>
                                  <InputField
                                    type="text"
                                    value={emailVerificationCode}
                                    onChange={(e) => {
                                      // IME 조합 중일 때는 필터링하지 않음
                                      if (isComposing.verificationCode) {
                                        setEmailVerificationCode(e.target.value);
                                        return;
                                      }
                                      // 숫자만 입력 가능
                                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                      setEmailVerificationCode(value);
                                    }}
                                    onCompositionStart={() => {
                                      setIsComposing(prev => ({ ...prev, verificationCode: true }));
                                    }}
                                    onCompositionEnd={(e) => {
                                      setIsComposing(prev => ({ ...prev, verificationCode: false }));
                                      // 조합 종료 후 숫자만 남기기
                                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                      setEmailVerificationCode(value);
                                    }}
                                    placeholder="인증 코드 6자리"
                                    maxLength={6}
                                    style={{
                                      fontFamily: 'monospace',
                                      fontSize: '16px',
                                      letterSpacing: '2px',
                                      textAlign: 'center',
                                    }}
                                  />
                                </InputWrapper>
                                <Button
                                  type="button"
                                  onClick={handleVerifyCode}
                                  disabled={isVerifyingCode || emailVerificationCode.length !== 6}
                                  style={{
                                    minWidth: '100px',
                                  }}
                                >
                                  {isVerifyingCode ? '확인 중...' : '인증 확인'}
                                </Button>
                              </div>
                            </div>
                          )}
                          {isEmailVerified && (
                            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--primary)', fontWeight: 500 }}>
                              ✓ 이메일 인증이 완료되었습니다.
                            </p>
                          )}
                        </>
                      )}
                    </InputGroup>

                  {selectedRole === USER_ROLES.AGENCY && (
                    <InputGroup>
                      <InputLabel>에이전시명</InputLabel>
                      <InputWrapper>
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                        <InputField
                          type="text"
                          name="organization"
                          value={signupFormData.organization}
                          onChange={handleInputChange}
                          placeholder="스튜디오 마감지기"
                          maxLength={30}
                        />
                      </InputWrapper>
                    </InputGroup>
                  )}

                  {!isOAuthMode && (
                    <FormGrid>
                      <InputGroup>
                        <InputLabel>비밀번호 *</InputLabel>
                        <InputWrapper>
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                          <InputField
                            type="password"
                            name="password"
                            value={signupFormData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            maxLength={100}
                            required
                          />
                        </InputWrapper>
                      </InputGroup>

                      <InputGroup>
                        <InputLabel>비밀번호 확인 *</InputLabel>
                        <InputWrapper>
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                          <InputField
                            type="password"
                            name="confirmPassword"
                            value={signupFormData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            maxLength={100}
                            required
                          />
                        </InputWrapper>
                      </InputGroup>
                    </FormGrid>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      required
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        borderColor: 'var(--border)',
                        accentColor: 'var(--primary)',
                      }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                      <span style={{ color: 'var(--foreground)' }}>서비스 이용약관</span> 및{' '}
                      <span style={{ color: 'var(--foreground)' }}>개인정보 처리방침</span>에 동의합니다
                    </span>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ width: '100%', padding: '16px', fontSize: '14px', fontWeight: 600 }}
                  >
                    {isLoading ? '회원가입 중...' : '회원가입'}
                  </Button>
                </FormSection>
              </SignupCard>
            </Card>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '16px' }}
          >
            이미 계정이 있으신가요?{' '}
            <button onClick={onBackToLogin} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>
              로그인
            </button>
          </motion.p>
        </SignupContainer>
      </motion.div>
    </SignupRoot>
  );
}
