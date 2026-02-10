import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Mail, Lock, Edit, Building, Eye, Users, UserPlus } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Function} props.onLogin
 * @param {Function} props.onShowSignup
 * @param {Function} props.onShowForgotPassword
 */
export function LoginPage({ onLogin, onShowSignup, onShowForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login - in real app, validate credentials
    // Default to individual role for manual login
    onLogin('individual');
  };

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center relative overflow-y-auto py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)`,
        }} />
      </div>

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
            마감지기
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            웹툰 제작사를 위한 B2B SaaS 대시보드
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity, y: 20 }}
          animate={{ opacity, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
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
                    onKeyDown={(e) => {
                      // 스페이스바 입력 자체를 막기
                      if (e.key === ' ') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="kim.artist@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      // 비밀번호는 띄어쓰기 제거
                      const filtered = e.target.value.replace(/\s/g, '');
                      setPassword(filtered);
                    }}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-muted-foreground">로그인 상태 유지</span>
                </label>
                <button type="button" className="text-primary hover:underline" onClick={onShowForgotPassword}>
                  비밀번호 찾기
                </button>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full py-6 text-base font-semibold">
                로그인
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">또는</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full py-3 border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              onClick={() => {
                // Google login logic here
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
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">데모 계정</span>
              </div>
            </div>

            {/* Demo Login */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                onClick={() => onLogin('individual')}
              >
                <Edit className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">개인(작가) 계정으로 체험</span>
                <span className="text-xs text-muted-foreground">demo@artist.com</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
                onClick={() => onLogin('manager')}
              >
                <Building className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">담당자 계정으로 체험</span>
                <span className="text-xs text-muted-foreground">demo@manager.com</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all"
                onClick={() => onLogin('agency')}
              >
                <Users className="w-4 h-4 mr-2" />
                <span className="flex-1 text-left">에이전시 계정으로 체험</span>
                <span className="text-xs text-muted-foreground">demo@agency.com</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">소속이 없으신가요?</span>
              </div>
            </div>

            {/* No Agency Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full py-4 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all font-medium"
              onClick={() => onLogin('individual', false)}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              소속 없는 계정으로 시작하기
            </Button>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          계정이 없으신가요?{' '}
          <button className="text-primary hover:underline font-medium" onClick={onShowSignup}>
            회원가입
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}