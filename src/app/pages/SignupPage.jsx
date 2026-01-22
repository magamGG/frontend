import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Mail, Lock, User, Phone, Building, Briefcase, Users, Edit, Check, Palette, Pen, BookOpen, Paintbrush, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';






const roles = [
  {
    id,
    icon,
    title: '아티스트',
    description: '작가 및 어시스트',
    color: 'bg-purple-500',
  },
  {
    id,
    icon,
    title: '담당자',
    description: '프로젝트 매니저/편집자',
    color: 'bg-blue-500',
  },
  {
    id,
    icon,
    title: '에이전시',
    description: '제작사/에이전시 운영자',
    color: 'bg-green-500',
  },
];

const artistSpecializations = [
  {
    value: 'webtoon-writer',
    label: '웹툰 작가',
    icon,
  },
  {
    value: 'webnovel-writer',
    label: '웹소설 작가',
    icon,
  },
  {
    value: 'assistant-coloring',
    label: '어시스트 - 채색',
    icon,
  },
  {
    value: 'assistant-lighting',
    label: '어시스트 - 조명',
    icon,
  },
  {
    value: 'assistant-background',
    label: '어시스트 - 배경',
    icon,
  },
  {
    value: 'assistant-lineart',
    label: '어시스트 - 선화',
    icon,
  },
  {
    value: 'assistant-other',
    label: '어시스트 - 기타',
    icon,
  },
];

/**
 * @param {Object} props
 * @param {Function} props.onSignup
 * @param {Function} props.onBackToLogin
 */
export function SignupPage({ onSignup, onBackToLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [artistSpecialization, setArtistSpecialization] = useState(null);
  const [customSpecialization, setCustomSpecialization] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    organization: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    // Reset artist specialization when changing role
    if (role !== 'artist') {
      setArtistSpecialization(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      alert('역할을 선택해주세요.');
      return;
    }
    if (selectedRole === 'artist' && !artistSpecialization) {
      alert('세부 직무를 선택해주세요.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // Mock signup - in real app, send data to server
    onSignup();
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
        className="w-full max-w-4xl px-6 relative z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type, stiffness: 200 }}
            className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-2xl mb-3"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" fill="currentColor" className="text-primary-foreground"/>
              <path d="M12 12C8 12 6 14 6 14V18C6 18 8 20 12 20C16 20 18 18 18 18V14C18 14 16 12 12 12Z" fill="currentColor" className="text-primary-foreground"/>
              <path d="M8 6C8 6 9 4 12 4C15 4 16 6 16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary-foreground"/>
            </svg>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-foreground mb-1"
          >
            회원가입
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            마감지기와 함께 효율적인 웹툰 제작을 시작하세요
          </motion.p>
        </div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity, y: 20 }}
          animate={{ opacity, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-5 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">역할 선택 *</label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    
                    return (
                      <motion.button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleChange(role.id)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Selected Indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                        
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{role.title}</p>
                            <p className="text-xs text-muted-foreground leading-tight">{role.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Artist Specialization (only shown when artist role is selected) */}
              {selectedRole === 'artist' && (
                <motion.div
                  initial={{ opacity, height: 0 }}
                  animate={{ opacity, height: 'auto' }}
                  exit={{ opacity, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground">세부 직무 선택 *</label>
                  <Select 
                    value={artistSpecialization || ''} 
                    onValueChange={(value) => {
                      setArtistSpecialization(value);
                      if (value !== 'assistant-other') {
                        setCustomSpecialization('');
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="직무를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {artistSpecializations.map((spec) => {
                        const SpecIcon = spec.icon;
                        return (
                          <SelectItem key={spec.value} value={spec.value}>
                            <div className="flex items-center gap-2">
                              <SpecIcon className="w-4 h-4" />
                              <span>{spec.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {/* Custom Specialization Input (shown when "기타" is selected) */}
                  {artistSpecialization === 'assistant-other' && (
                    <motion.div
                      initial={{ opacity, height: 0 }}
                      animate={{ opacity, height: 'auto' }}
                      exit={{ opacity, height: 0 }}
                      className="space-y-1.5"
                    >
                      <label className="text-xs font-medium text-foreground">기타 직무 입력 *</label>
                      <div className="relative">
                        <Edit className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={customSpecialization}
                          onChange={(e) => setCustomSpecialization(e.target.value)}
                          placeholder="예: 스토리 작가, 3D 배경 등"
                          className="w-full pl-10 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">이름 *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="홍길동"
                      className="w-full pl-10 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">연락처 *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="010-1234-5678"
                      className="w-full pl-10 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">이메일 *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Organization (for agency and manager) */}
              {(selectedRole === 'agency' || selectedRole === 'manager') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    {selectedRole === 'agency' ? '에이전시명' : '소속 회사'}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder={selectedRole === 'agency' ? '스튜디오 마감지기' : '소속 회사/팀'}
                      className="w-full pl-10 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">비밀번호 *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">비밀번호 확인 *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    required
                  />
                  <span className="text-xs text-muted-foreground">
                    <span className="text-foreground">서비스 이용약관</span> 및{' '}
                    <span className="text-foreground">개인정보 처리방침</span>에 동의합니다
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="space-y-3">
                <Button type="submit" className="w-full py-4 text-sm font-semibold">
                  회원가입
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-muted-foreground mt-4"
        >
          이미 계정이 있으신가요?{' '}
          <button onClick={onBackToLogin} className="text-primary hover:underline font-medium">
            로그인
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}