import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Mail, Lock, User, Phone, Building, Briefcase, Edit, Check, Palette, Pen, BookOpen, Paintbrush, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { memberService } from '@/api';
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
  { value: 'assistant-lighting', label: '어시스트 - 조명', icon: Paintbrush },
  { value: 'assistant-background', label: '어시스트 - 배경', icon: Paintbrush },
  { value: 'assistant-lineart', label: '어시스트 - 선화', icon: Paintbrush },
  { value: 'assistant-other', label: '어시스트 - 기타', icon: Paintbrush },
];

export function SignupPage({ onSignup, onBackToLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [artistSpecialization, setArtistSpecialization] = useState(null);
  const [customSpecializationInput, setCustomSpecializationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupFormData, setSignupFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    organization: '',
  });

  const handleInputChange = (e) => {
    setSignupFormData({
      ...signupFormData,
      [e.target.name]: e.target.value,
    });
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
    if (signupFormData.password !== signupFormData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // DB 스키마에 MEMBER_ID 필드가 없으므로 MEMBER_EMAIL만 사용
      const memberData = {
        memberName: signupFormData.name,
        memberPassword: signupFormData.password,
        memberEmail: signupFormData.email, // UNIQUE, 로그인 ID로 사용
        memberPhone: signupFormData.phone,
        memberRole: selectedRole === USER_ROLES.ARTIST 
          ? (artistSpecialization === 'webtoon-writer' ? '웹툰 작가'
            : artistSpecialization === 'webnovel-writer' ? '웹소설 작가'
            : artistSpecialization === 'assistant-coloring' ? '어시스트 - 채색'
            : artistSpecialization === 'assistant-lighting' ? '어시스트 - 조명'
            : artistSpecialization === 'assistant-background' ? '어시스트 - 배경'
            : artistSpecialization === 'assistant-lineart' ? '어시스트 - 선화'
            : artistSpecialization === 'assistant-other' ? '어시스트- 기타'
            : '웹툰 작가')
          : selectedRole === USER_ROLES.MANAGER ? '담당자'
          : selectedRole === USER_ROLES.AGENCY ? '에이전시 관리자'
          : '웹툰 작가',
      };
      
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="3" fill="currentColor" style={{ color: 'var(--primary-foreground)' }} />
                  <path d="M12 12C8 12 6 14 6 14V18C6 18 8 20 12 20C16 20 18 18 18 18V14C18 14 16 12 12 12Z" fill="currentColor" style={{ color: 'var(--primary-foreground)' }} />
                  <path d="M8 6C8 6 9 4 12 4C15 4 16 6 16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: 'var(--primary-foreground)' }} />
                </svg>
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
                <FormSection onSubmit={handleSubmit}>
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
                          onValueChange={(value) => {
                            setArtistSpecialization(value);
                            if (value !== 'assistant-other') {
                              setCustomSpecialization('');
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
                                  value={customSpecializationInput}
                                  onChange={(e) => setCustomSpecializationInput(e.target.value)}
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
                          placeholder="홍길동"
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
                          placeholder="010-1234-5678"
                          required
                        />
                      </InputWrapper>
                    </InputGroup>
                  </FormGrid>

                  <InputGroup>
                    <InputLabel>이메일 *</InputLabel>
                    <InputWrapper>
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                      <InputField
                        type="email"
                        name="email"
                        value={signupFormData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        required
                      />
                    </InputWrapper>
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
                        />
                      </InputWrapper>
                    </InputGroup>
                  )}

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
                          required
                        />
                      </InputWrapper>
                    </InputGroup>
                  </FormGrid>

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

                  <Button type="submit" style={{ width: '100%', padding: '16px', fontSize: '14px', fontWeight: 600 }}>
                    회원가입
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
