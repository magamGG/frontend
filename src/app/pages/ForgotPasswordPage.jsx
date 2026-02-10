import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Mail, Lock, ArrowLeft, Check } from 'lucide-react';





/**
 * @param {Object} props
 * @param {Function} props.onBackToLogin
 */
export function ForgotPasswordPage({ onBackToLogin }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendEmail = (e) => {
    e.preventDefault();
    // Mock: Send verification email
    setStep('verify');
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    // Mock: Verify code
    setStep('reset');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // Mock: Reset password
    setStep('success');
  };

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center relative overflow-y-auto py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)`,
        }} />
      </div>

      {/* Back Button - Fixed Top Left */}
      <motion.button
        initial={{ opacity, x: -20 }}
        animate={{ opacity, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={onBackToLogin}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">로그인으로 돌아가기</span>
      </motion.button>

      <motion.div
        initial={{ opacity, y: 20 }}
        animate={{ opacity, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type, stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-2xl mb-6"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" fill="currentColor" className="text-primary-foreground"/>
              <path d="M12 12C8 12 6 14 6 14V18C6 18 8 20 12 20C16 20 18 18 18 18V14C18 14 16 12 12 12Z" fill="currentColor" className="text-primary-foreground"/>
              <path d="M8 6C8 6 9 4 12 4C15 4 16 6 16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary-foreground"/>
            </svg>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-foreground mb-2"
          >
            비밀번호 찾기
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            {step === 'email' && '가입하신 이메일 주소를 입력해주세요'}
            {step === 'verify' && '이메일로 전송된 인증 코드를 입력해주세요'}
            {step === 'reset' && '새로운 비밀번호를 설정해주세요'}
            {step === 'success' && '비밀번호가 성공적으로 변경되었습니다'}
          </motion.p>
        </div>

        {/* Step Indicator */}
        {step !== 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            {['email', 'verify', 'reset'].map((s, index) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step === s 
                    ? 'bg-primary text-primary-foreground' 
                    : ['verify', 'reset'].includes(step) && s === 'email'
                    ? 'bg-primary/20 text-primary'
                    : step === 'reset' && s === 'verify'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 transition-all ${
                    (step === 'verify' && s === 'email') || (step === 'reset' && ['email', 'verify'].includes(s))
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Forms */}
        <motion.div
          initial={{ opacity, y: 20 }}
          animate={{ opacity, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 shadow-2xl">
            {/* Step 1: Email Input */}
            {step === 'email' && (
              <form onSubmit={handleSendEmail} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">이메일</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        // 이메일은 띄어쓰기 제거
                        const filtered = e.target.value.replace(/\s/g, '');
                        setEmail(filtered);
                      }}
                      placeholder="kim.artist@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full py-6 text-base font-semibold">
                  인증 코드 전송
                </Button>
              </form>
            )}

            {/* Step 2: Verification Code */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">인증 코드</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6자리 인증 코드"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground text-center text-2xl tracking-widest font-mono"
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {email}로 전송된 인증 코드를 입력해주세요
                  </p>
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full py-6 text-base font-semibold">
                    인증 확인
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-3"
                    onClick={handleSendEmail}
                  >
                    인증 코드 재전송
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">새 비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        // 비밀번호는 띄어쓰기 제거
                        const filtered = e.target.value.replace(/\s/g, '');
                        setNewPassword(filtered);
                      }}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">비밀번호 확인</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        // 비밀번호는 띄어쓰기 제거
                        const filtered = e.target.value.replace(/\s/g, '');
                        setConfirmPassword(filtered);
                      }}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full py-6 text-base font-semibold">
                  비밀번호 변경
                </Button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <div className="space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type, stiffness: 200 }}
                  className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    비밀번호 변경 완료
                  </h3>
                  <p className="text-muted-foreground">
                    새로운 비밀번호로 로그인해주세요
                  </p>
                </div>

                <Button
                  type="button"
                  className="w-full py-6 text-base font-semibold"
                  onClick={onBackToLogin}
                >
                  로그인 페이지로 이동
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}