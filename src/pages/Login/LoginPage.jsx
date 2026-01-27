import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Mail, Lock, Edit, Building, Users, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/api';
import useAuthStore from '@/store/authStore';
import {
  LoginRoot,
  BackgroundPattern,
  LoginContainer,
  LogoTitleSection,
  LogoIconWrapper,
  MainTitle,
  SubTitle,
  LoginCard,
  FormSection,
  InputGroup,
  InputLabel,
  InputWrapper,
  InputField,
  InputIcon,
  CheckboxLinkGroup,
  CheckboxLabel,
  LinkButton,
  Divider,
  DividerText,
  Footer,
  DemoAccountBar,
  DemoAccountBarContainer,
  DemoAccountBarItem,
  DemoAccountBarIcon,
  DemoAccountBarLabel,
} from './LoginPage.styled';

// 사용자 역할 타입 상수
const USER_ROLE_TYPES = {
  INDIVIDUAL: 'individual',
  MANAGER: 'manager',
  AGENCY: 'agency',
  ALL: 'all',
};

// 데모 계정 설정
const demoAccountList = [
  {
    id: USER_ROLE_TYPES.INDIVIDUAL,
    icon: Edit,
    label: '개인작가',
    email: 'demo@artist.com',
    color: '#a855f7',
  },
  {
    id: USER_ROLE_TYPES.MANAGER,
    icon: Building,
    label: '담당자',
    email: 'demo@manager.com',
    color: '#3b82f6',
  },
  {
    id: USER_ROLE_TYPES.AGENCY,
    icon: Users,
    label: '에이전시',
    email: 'demo@agency.com',
    color: '#22c55e',
  },
  {
    id: 'no-agency',
    icon: UserPlus,
    label: '소속없음',
    email: 'demo@individual.com',
    color: '#6b7280',
  },
];


export function LoginPage({ onLogin, onShowSignup, onShowForgotPassword }) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailInput || !passwordInput) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // DB 스키마에 MEMBER_ID 필드가 없으므로 MEMBER_EMAIL을 로그인 ID로 사용
      const response = await authService.login({
        memberEmail: emailInput, // 이메일을 로그인 ID로 사용
        memberPassword: passwordInput,
      });
      
      // 가이드 문서에 따른 응답 데이터 구조
      login({
        token: response.token || response.accessToken,
        memberNo: response.memberNo,
        memberName: response.memberName || emailInput,
        memberRole: response.memberRole,
        agencyNo: response.agencyNo,
      });
      
      toast.success('로그인에 성공했습니다.');
      
      // memberRole과 agencyNo를 기반으로 리다이렉트 결정
      // onLogin에 실제 memberRole과 agencyNo를 전달
      onLogin(response.memberRole, response.agencyNo);
    } catch (error) {
      const errorMessage = error?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (account) => {
    // 데모 계정은 로그인 API 호출 없이 바로 로그인 처리
    // roleType을 실제 MEMBER_ROLE 값으로 매핑
    let memberRole = '';
    let agencyNo = 1; // 데모는 기본적으로 에이전시 소속
    
    if (roleType === USER_ROLE_TYPES.INDIVIDUAL) {
      memberRole = '웹툰 작가';
    } else if (roleType === USER_ROLE_TYPES.MANAGER) {
      memberRole = '담당자';
    } else if (roleType === USER_ROLE_TYPES.AGENCY) {
      memberRole = '에이전시 관리자';
    }
    
    login({
      token: 'demo-token',
      memberNo: 0,
      memberName: '데모 사용자',
      memberRole: memberRole,
      agencyNo: agencyNo,
    });
    onLogin(memberRole, agencyNo);
  };

  const handleNoAgencyLogin = () => {
    // 비소속 계정으로 시작하기 - AGENCY_NO가 null인 경우
    login({
      token: 'demo-token',
      memberNo: 0,
      memberName: '데모 사용자',
      memberRole: '웹툰 작가',
      agencyNo: null, // 비소속
    });
    onLogin('웹툰 작가', null);
  };

  return (
    <LoginRoot>
      <BackgroundPattern />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LoginContainer>
          {/* Logo & Title */}
          <LogoTitleSection>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <LogoIconWrapper>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <MainTitle>마감지기</MainTitle>
              <SubTitle>웹툰 제작사를 위한 B2B SaaS 대시보드</SubTitle>
            </motion.div>
          </LogoTitleSection>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <LoginCard>
                <FormSection onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <InputGroup>
                    <InputLabel>이메일</InputLabel>
                    <InputWrapper>
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      <InputField
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="kim.artist@example.com"
                        required
                        disabled={isLoading}
                      />
                    </InputWrapper>
                  </InputGroup>

                  {/* Password Input */}
                  <InputGroup>
                    <InputLabel>비밀번호</InputLabel>
                    <InputWrapper>
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                      <InputField
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </InputWrapper>
                  </InputGroup>

                  {/* Remember & Forgot */}
                  <CheckboxLinkGroup>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          borderColor: 'var(--border)',
                          accentColor: 'var(--primary)',
                        }}
                      />
                      <span>로그인 상태 유지</span>
                    </CheckboxLabel>
                    <LinkButton type="button" onClick={onShowForgotPassword}>
                      비밀번호 찾기
                    </LinkButton>
                  </CheckboxLinkGroup>

                  {/* Login Button */}
                  <Button 
                    type="submit" 
                    style={{ width: '100%', padding: '24px', fontSize: '16px', fontWeight: 600 }}
                    disabled={isLoading}
                  >
                    {isLoading ? '로그인 중...' : '로그인'}
                  </Button>
                </FormSection>

                {/* Divider */}
                <Divider>
                  <DividerText>또는</DividerText>
                </Divider>

                {/* Google Login */}
                <Button
                  type="button"
                  variant="outline"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderColor: 'var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                  }}
                  onClick={() => {
                    // TODO: Google 로그인 로직
                    console.log('Google login clicked');
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.64 9.2045C17.64 8.5665 17.5827 7.9525 17.4764 7.3635H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.2045Z" fill="#4285F4"/>
                    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                  </svg>
                  <span>Google로 로그인</span>
                </Button>

              </LoginCard>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '24px' }}
          >
            계정이 없으신가요?{' '}
            <LinkButton onClick={onShowSignup} style={{ fontWeight: 500 }}>
              회원가입
            </LinkButton>
          </motion.p>
        </LoginContainer>
      </motion.div>

      {/* 체험 계정 바 (오른쪽 하단) */}
      <DemoAccountBar>
        <DemoAccountBarContainer>
          {demoAccountList.map((account) => {
            const AccountIcon = account.icon;
            return (
              <DemoAccountBarItem
                key={account.id}
                onClick={() => handleDemoLogin(account)}
                $color={account.color}
                disabled={isLoading}
                title={account.email}
              >
                <DemoAccountBarIcon $color={account.color}>
                  <AccountIcon size={16} />
                </DemoAccountBarIcon>
                <DemoAccountBarLabel>{account.label}</DemoAccountBarLabel>
              </DemoAccountBarItem>
            );
          })}
        </DemoAccountBarContainer>
      </DemoAccountBar>
    </LoginRoot>
  );
}
