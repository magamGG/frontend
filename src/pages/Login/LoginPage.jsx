import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Mail, Lock } from 'lucide-react';
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
} from './LoginPage.styled';

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
              <MainTitle>마감지기</MainTitle>
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
                        onChange={(e) => {
                          // 이메일은 띄어쓰기 제거
                          const filtered = e.target.value.replace(/\s/g, '');
                          setEmailInput(filtered);
                        }}
                        onKeyDown={(e) => {
                          // 스페이스바 입력 자체를 막기
                          if (e.key === ' ') {
                            e.preventDefault();
                          }
                        }}
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
                        onChange={(e) => {
                          // 비밀번호는 띄어쓰기 제거
                          const filtered = e.target.value.replace(/\s/g, '');
                          setPasswordInput(filtered);
                        }}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </InputWrapper>
                  </InputGroup>

                  {/* Remember */}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted-foreground)', marginTop: '24px' }}
          >
            <p style={{ margin: 0, marginBottom: '8px' }}>
              계정이 없으신가요?{' '}
              <LinkButton onClick={onShowSignup} style={{ fontWeight: 500 }}>
                회원가입
              </LinkButton>
            </p>
            <p style={{ margin: 0 }}>
              <LinkButton type="button" onClick={onShowForgotPassword} style={{ fontWeight: 500 }}>
                비밀번호 찾기
              </LinkButton>
            </p>
          </motion.div>
        </LoginContainer>
      </motion.div>
    </LoginRoot>
  );
}
