import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Mail, Lock, Edit, Building, Users, UserPlus } from 'lucide-react';
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
  DemoAccountGroup,
  DemoAccountButton,
  DemoAccountTextArea,
  DemoAccountEmail,
  Footer,
} from './LoginPage.styled';

// TODO: Zustand store mapping - 사용자 역할 타입
const USER_ROLES = {
  INDIVIDUAL: 'individual',
  MANAGER: 'manager',
  AGENCY: 'agency',
  ALL: 'all',
};

// 데모 계정 설정
const demoAccounts = [
  {
    id: USER_ROLES.INDIVIDUAL,
    icon: Edit,
    label: '개인(작가) 계정으로 체험',
    email: 'demo@artist.com',
    borderColor: '#e9d5ff',
    bgColor: 'transparent',
    hoverBgColor: '#faf5ff',
    hoverBorderColor: '#d8b4fe',
  },
  {
    id: USER_ROLES.MANAGER,
    icon: Building,
    label: '담당자 계정으로 체험',
    email: 'demo@manager.com',
    borderColor: '#bfdbfe',
    bgColor: 'transparent',
    hoverBgColor: '#eff6ff',
    hoverBorderColor: '#93c5fd',
  },
  {
    id: USER_ROLES.AGENCY,
    icon: Users,
    label: '에이전시 계정으로 체험',
    email: 'demo@agency.com',
    borderColor: '#bbf7d0',
    bgColor: 'transparent',
    hoverBgColor: '#f0fdf4',
    hoverBorderColor: '#86efac',
  },
];

export function LoginPage({ onLogin, onShowSignup, onShowForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 호출로 인증 처리
    // Mock login - 실제 앱에서는 자격 증명 검증
    onLogin(USER_ROLES.INDIVIDUAL);
  };

  const handleDemoLogin = (role) => {
    onLogin(role);
  };

  const handleNoAgencyLogin = () => {
    onLogin(USER_ROLES.INDIVIDUAL, false);
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="kim.artist@example.com"
                        required
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
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
                  <Button type="submit" style={{ width: '100%', padding: '24px', fontSize: '16px', fontWeight: 600 }}>
                    로그인
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
                    borderColor: '#d1d5db',
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

                {/* Divider */}
                <Divider>
                  <DividerText>데모 계정</DividerText>
                </Divider>

                {/* Demo Login */}
                <DemoAccountGroup>
                  {demoAccounts.map((account) => {
                    const AccountIcon = account.icon;
                    return (
                      <DemoAccountButton
                        key={account.id}
                        type="button"
                        $borderColor={account.borderColor}
                        $bgColor={account.bgColor}
                        $hoverBgColor={account.hoverBgColor}
                        $hoverBorderColor={account.hoverBorderColor}
                        onClick={() => handleDemoLogin(account.id)}
                      >
                        <AccountIcon size={16} />
                        <DemoAccountTextArea>
                          <span style={{ fontWeight: 500 }}>{account.label}</span>
                          <DemoAccountEmail>{account.email}</DemoAccountEmail>
                        </DemoAccountTextArea>
                      </DemoAccountButton>
                    );
                  })}
                </DemoAccountGroup>

                {/* Divider */}
                <Divider>
                  <DividerText>소속이 없으신가요?</DividerText>
                </Divider>

                {/* No Agency Button */}
                <DemoAccountButton
                  type="button"
                  $borderColor="#fed7aa"
                  $bgColor="transparent"
                  $hoverBgColor="#fff7ed"
                  $hoverBorderColor="#fdba74"
                  onClick={handleNoAgencyLogin}
                  style={{ fontWeight: 500, padding: '16px' }}
                >
                  <UserPlus size={20} />
                  <span>소속 없는 계정으로 시작하기</span>
                </DemoAccountButton>
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
    </LoginRoot>
  );
}
