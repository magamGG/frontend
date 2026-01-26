import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/api';
import {
  ForgotPasswordRoot,
  BackgroundPattern,
  ForgotPasswordContainer,
  BackButton,
  LogoTitleSection,
  LogoIconWrapper,
  MainTitle,
  SubTitle,
  StepIndicator,
  StepCircle,
  StepLine,
  ForgotPasswordCard,
  FormSection,
  InputGroup,
  InputLabel,
  InputWrapper,
  InputField,
  VerificationCodeInput,
  SuccessSection,
  SuccessIcon,
} from './ForgotPasswordPage.styled';

const PASSWORD_RESET_STEPS = {
  EMAIL: 'email',
  VERIFY: 'verify',
  RESET: 'reset',
  SUCCESS: 'success',
};

const stepList = ['email', 'verify', 'reset'];

export function ForgotPasswordPage({ onBackToLogin }) {
  const [step, setStep] = useState(PASSWORD_RESET_STEPS.EMAIL);
  const [emailInput, setEmailInput] = useState('');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailInput) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(emailInput);
      toast.success('인증 코드가 이메일로 전송되었습니다.');
      setStep(PASSWORD_RESET_STEPS.VERIFY);
    } catch (error) {
      const errorMessage = error?.message || '이메일 전송에 실패했습니다. 다시 시도해주세요.';
      toast.error(errorMessage);
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCodeInput) {
      toast.error('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyCode(emailInput, verificationCodeInput);
      toast.success('인증 코드가 확인되었습니다.');
      setStep(PASSWORD_RESET_STEPS.RESET);
    } catch (error) {
      const errorMessage = error?.message || '인증 코드 확인에 실패했습니다. 다시 시도해주세요.';
      toast.error(errorMessage);
      console.error('Verify code error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPasswordInput !== confirmPasswordInput) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!newPasswordInput || newPasswordInput.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(emailInput, verificationCodeInput, newPasswordInput);
      toast.success('비밀번호가 재설정되었습니다.');
      setStep(PASSWORD_RESET_STEPS.SUCCESS);
    } catch (error) {
      const errorMessage = error?.message || '비밀번호 재설정에 실패했습니다. 다시 시도해주세요.';
      toast.error(errorMessage);
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case PASSWORD_RESET_STEPS.EMAIL:
        return '가입하신 이메일 주소를 입력해주세요';
      case PASSWORD_RESET_STEPS.VERIFY:
        return '이메일로 전송된 인증 코드를 입력해주세요';
      case PASSWORD_RESET_STEPS.RESET:
        return '새로운 비밀번호를 설정해주세요';
      case PASSWORD_RESET_STEPS.SUCCESS:
        return '비밀번호가 성공적으로 변경되었습니다';
      default:
        return '';
    }
  };

  const isStepCompleted = (stepIndex) => {
    const currentIndex = stepList.indexOf(step);
    return stepIndex < currentIndex;
  };

  const isStepActive = (stepIndex) => {
    const currentIndex = stepList.indexOf(step);
    return stepIndex === currentIndex;
  };

  return (
    <ForgotPasswordRoot>
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
        <ForgotPasswordContainer>
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
              <MainTitle>비밀번호 찾기</MainTitle>
              <SubTitle>{getStepDescription()}</SubTitle>
            </motion.div>
          </LogoTitleSection>

          {step !== PASSWORD_RESET_STEPS.SUCCESS && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <StepIndicator>
                {stepList.map((s, index) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StepCircle
                      $isActive={isStepActive(index)}
                      $isCompleted={isStepCompleted(index)}
                    >
                      {index + 1}
                    </StepCircle>
                    {index < stepList.length - 1 && (
                      <StepLine $isCompleted={isStepCompleted(index)} />
                    )}
                  </div>
                ))}
              </StepIndicator>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <ForgotPasswordCard>
                {step === PASSWORD_RESET_STEPS.EMAIL && (
                  <FormSection onSubmit={handleSendEmail}>
                    <InputGroup>
                      <InputLabel>이메일</InputLabel>
                      <InputWrapper>
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                        <InputField
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          disabled={isLoading}
                          placeholder="kim.artist@example.com"
                          required
                        />
                      </InputWrapper>
                    </InputGroup>

                    <Button type="submit" style={{ width: '100%', padding: '24px', fontSize: '16px', fontWeight: 600 }} disabled={isLoading}>
                      {isLoading ? '전송 중...' : '인증 코드 전송'}
                    </Button>
                  </FormSection>
                )}

                {step === PASSWORD_RESET_STEPS.VERIFY && (
                  <FormSection onSubmit={handleVerifyCode}>
                    <InputGroup>
                      <InputLabel>인증 코드</InputLabel>
                      <VerificationCodeInput
                        type="text"
                        value={verificationCodeInput}
                        onChange={(e) => setVerificationCodeInput(e.target.value)}
                        disabled={isLoading}
                        placeholder="6자리 인증 코드"
                        maxLength={6}
                        large
                        center
                        required
                      />
                      <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', textAlign: 'center', margin: 0 }}>
                        {emailInput}로 전송된 인증 코드를 입력해주세요
                      </p>
                    </InputGroup>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Button type="submit" style={{ width: '100%', padding: '24px', fontSize: '16px', fontWeight: 600 }} disabled={isLoading}>
                        {isLoading ? '확인 중...' : '인증 확인'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        style={{ width: '100%', padding: '12px' }}
                        onClick={handleSendEmail}
                        disabled={isLoading}
                      >
                        인증 코드 재전송
                      </Button>
                    </div>
                  </FormSection>
                )}

                {step === PASSWORD_RESET_STEPS.RESET && (
                  <FormSection onSubmit={handleResetPassword}>
                    <InputGroup>
                      <InputLabel>새 비밀번호</InputLabel>
                      <InputWrapper>
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                        <InputField
                          type="password"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          disabled={isLoading}
                          placeholder="••••••••"
                          required
                        />
                      </InputWrapper>
                    </InputGroup>

                    <InputGroup>
                      <InputLabel>비밀번호 확인</InputLabel>
                      <InputWrapper>
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                        <InputField
                          type="password"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          disabled={isLoading}
                          placeholder="••••••••"
                          required
                        />
                      </InputWrapper>
                    </InputGroup>

                    <Button type="submit" style={{ width: '100%', padding: '24px', fontSize: '16px', fontWeight: 600 }} disabled={isLoading}>
                      {isLoading ? '변경 중...' : '비밀번호 변경'}
                    </Button>
                  </FormSection>
                )}

                {step === PASSWORD_RESET_STEPS.SUCCESS && (
                  <SuccessSection>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <SuccessIcon>
                        <div>
                          <Check size={40} style={{ color: 'white' }} />
                        </div>
                      </SuccessIcon>
                    </motion.div>

                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--foreground)', margin: '0 0 8px 0' }}>
                        비밀번호 변경 완료
                      </h3>
                      <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
                        새로운 비밀번호로 로그인해주세요
                      </p>
                    </div>

                    <Button
                      type="button"
                      style={{ width: '100%', padding: '24px', fontSize: '16px', fontWeight: 600 }}
                      onClick={onBackToLogin}
                    >
                      로그인 페이지로 이동
                    </Button>
                  </SuccessSection>
                )}
              </ForgotPasswordCard>
            </Card>
          </motion.div>
        </ForgotPasswordContainer>
      </motion.div>
    </ForgotPasswordRoot>
  );
}
