import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Building2, User, Mail, Phone, Key, Send, ArrowLeft, CheckCircle2, Edit, Building } from 'lucide-react';
import { toast } from 'sonner';



/**
 * @param {Object} props
 * @param {Function} props.onBack
 * @param {Function} props.onSuccess
 */
export function JoinAgencyRequestPage({ onBack, onSuccess }) {
  const [step, setStep] = useState('form');
  
  // Mock user data from signup (실제로는 회원가입 시 저장된 정보)
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
    // Validation
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
    
    // Validation
    if (!agencyCode) {
      toast.error('회사 전용 코드를 입력해주세요.');
      return;
    }

    // Mock API call - 회원가입 정보와 함께 에이전시로 전송
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
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity, scale: 0.9 }}
          animate={{ opacity, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type, stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-3">
              요청이 전송되었습니다!
            </h2>
            <p className="text-muted-foreground mb-6">
              에이전시 담당자가 검토 후 승인하면<br />
              알림을 받으실 수 있습니다.
            </p>

            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이름</span>
                  <span className="font-medium text-foreground">{userData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이메일</span>
                  <span className="font-medium text-foreground">{userData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">연락처</span>
                  <span className="font-medium text-foreground">{userData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">회사 코드</span>
                  <span className="font-medium text-foreground">{agencyCode}</span>
                </div>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full py-6">
              완료
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

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
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">뒤로가기</span>
      </motion.button>

      <motion.div
        initial={{ opacity, y: 20 }}
        animate={{ opacity, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl px-6 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type, stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-2xl mb-6"
          >
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            에이전시 가입 요청
          </h1>
          <p className="text-muted-foreground">
            소속 에이전시의 전용 코드를 입력하여 가입 요청을 보내세요
          </p>
        </div>

        {/* Request Form */}
        <Card className="p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  개인 정보
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditFormData({ ...userData });
                    setIsEditingProfile(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  수정
                </Button>
              </div>
              
              <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                {/* Name */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">이름</span>
                  <span className="text-sm font-medium text-foreground">{userData.name}</span>
                </div>

                {/* Email */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">이메일</span>
                  <span className="text-sm font-medium text-foreground">{userData.email}</span>
                </div>

                {/* Phone */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">연락처</span>
                  <span className="text-sm font-medium text-foreground">{userData.phone}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border"></div>

            {/* Agency Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-primary" />
                에이전시 정보
              </h3>
              
              <div className="space-y-4">
                {/* Agency Code */}
                <div className="space-y-2">
                  <Label htmlFor="agencyCode">회사 전용 코드 *</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="agencyCode"
                      type="text"
                      placeholder="예: AGENCY-2026-001"
                      value={agencyCode}
                      onChange={(e) => setAgencyCode(e.target.value)}
                      required
                      className="pl-11 h-12 font-mono tracking-wider"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    에이전시 담당자에게 전용 코드를 문의하세요
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full py-6 text-base font-semibold">
              <Send className="w-5 h-5 mr-2" />
              가입 요청 보내기
            </Button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 안내:</strong> 가입 요청 후 에이전시 담당자의 승인이 필요합니다. 
              승인 완료 시 등록하신 이메일로 알림이 전송됩니다.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* 개인 정보 수정 모달 */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">개인 정보 수정</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              회원가입 시 입력한 개인 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm text-[#1F2328]">이름 *</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => handleEditInputChange('name', e.target.value)}
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-sm text-[#1F2328]">이메일 *</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleEditInputChange('email', e.target.value)}
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-sm text-[#1F2328]">연락처 *</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) => handleEditInputChange('phone', e.target.value)}
                placeholder="010-0000-0000"
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
              <p className="text-xs text-muted-foreground">
                하이픈(-)을 포함하여 입력해주세요
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              취소
            </Button>
            <Button className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90" onClick={handleSaveProfile}>
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}