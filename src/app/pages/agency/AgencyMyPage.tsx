import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit, KeyRound, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface AgencyMyPageProps {
  onClose: () => void;
  onLogout: () => void;
}

export function AgencyMyPage({ onClose, onLogout }: AgencyMyPageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userName, setUserName] = useState('김에이전시');
  const [email, setEmail] = useState('kim.agency@example.com');
  const [phone, setPhone] = useState('010-5678-9012');
  const [location, setLocation] = useState('서울특별시 강남구');
  const [studio, setStudio] = useState('스튜디오 아방가르');
  const [showCode, setShowCode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const companyCode = '202490123456';

  // 에이전시 통계 데이터
  const agencyStats = [
    { label: '완료한 작업', value: 45, percentage: 45, color: 'bg-[#6366F1]' },
    { label: '완료된 에피소드', value: 80, percentage: 80, color: 'bg-[#8B5CF6]' },
    { label: '진행중인 작업', value: 65, percentage: 65, color: 'bg-[#A855F7]' },
    { label: '내일 마감', value: 25, percentage: 25, color: 'bg-[#F97316]' },
  ];

  // Load user data from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('agencyUserData');
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      setUserName(userData.name || '김에이전시');
      setEmail(userData.email || 'kim.agency@example.com');
      setPhone(userData.phone || '010-5678-9012');
      setLocation(userData.location || '서울특별시 강남구');
      setStudio(userData.studio || '스튜디오 아방가르');
      setProfileImage(userData.profileImage || null);
    }
  }, []);

  const handleSaveProfile = () => {
    const userData = {
      name: userName,
      email,
      phone,
      location,
      studio,
      profileImage
    };
    localStorage.setItem('agencyUserData', JSON.stringify(userData));
    toast.success('프로필이 성공적으로 업데이트되었습니다.');
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('agencyUserData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('hasAgency');
    toast.success('로그아웃되었습니다.');
    onLogout();
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    toast.success('회원 탈퇴가 완료되었습니다.');
    setIsDeleteModalOpen(false);
    onLogout();
  };

  const handleCopyCode = (code: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          toast.success('회사 코드가 복사되었습니다.');
        })
        .catch(() => {
          // Fallback to traditional method
          fallbackCopyCode(code);
        });
    } else {
      // Use fallback for browsers that don't support clipboard API
      fallbackCopyCode(code);
    }
  };

  const fallbackCopyCode = (code: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('회사 코드가 복사되었습니다.');
    } catch (err) {
      toast.info(`코드: ${code}`);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-8 overflow-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="h-32 bg-[#3F4A5A] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
          >
            닫기
          </button>
        </div>

        {/* Main Content */}
        <div className="relative px-12 pb-12">
          {/* Profile Section - Horizontal Layout */}
          <div className="flex gap-8 -mt-16">
            {/* Left: Profile Photo and Action Buttons */}
            <div className="flex flex-col items-center gap-6 flex-shrink-0">
              {/* Profile Photo */}
              <div className="relative w-32 h-32">
                <div className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-[#9CA3AF]" />
                  )}
                </div>
                {/* Camera Button */}
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e: Event) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const newImage = reader.result as string;
                          setProfileImage(newImage);
                          // Save to localStorage
                          const savedUserData = localStorage.getItem('agencyUserData');
                          const userData = savedUserData ? JSON.parse(savedUserData) : {};
                          userData.profileImage = newImage;
                          localStorage.setItem('agencyUserData', JSON.stringify(userData));
                          toast.success('프로필 사진이 변경되었습니다.');
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#3F4A5A] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#3F4A5A]/90 transition-all"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 w-52">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#F97316] text-[#F97316] rounded-lg hover:bg-[#F97316]/5 transition-all text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  프로필 수정
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 border border-[#DADDE1] text-[#1F2328] rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  로그아웃
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2.5 border border-[#DC2626] text-[#DC2626] rounded-lg hover:bg-red-50 transition-all text-sm font-medium"
                >
                  회원탈퇴
                </button>
              </div>
            </div>

            {/* Center: Name and Role */}
            <div className="flex-1 pt-20">
              <h1 className="text-3xl font-bold text-[#1F2328] mb-2">{userName}</h1>
              <p className="text-[#6E8FB3] text-base mb-8">에이전시 대표</p>
            </div>

            {/* Right: Basic Info */}
            <div className="flex-shrink-0 w-80 pt-20">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-[#6366F1]" />
                <h3 className="text-lg font-semibold text-[#1F2328]">기본 정보</h3>
              </div>

              <div className="space-y-5">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#6E8FB3] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6E8FB3] mb-1">이메일</p>
                    <p className="text-sm text-[#1F2328] font-medium">{email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#6E8FB3] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6E8FB3] mb-1">연락처</p>
                    <p className="text-sm text-[#1F2328] font-medium">{phone}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#6E8FB3] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6E8FB3] mb-1">위치</p>
                    <p className="text-sm text-[#1F2328] font-medium">{location}</p>
                  </div>
                </div>

                {/* Studio */}
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-[#6E8FB3] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6E8FB3] mb-1">회사명</p>
                    <p className="text-sm text-[#1F2328] font-medium">{studio}</p>
                  </div>
                </div>

                {/* Company Code */}
                <div className="flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-[#6E8FB3] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6E8FB3] mb-1">회사 코드</p>
                    <div className="flex items-center gap-2 mt-2">
                      {showCode && (
                        <p className="text-xs text-[#1F2328] font-mono">{companyCode}</p>
                      )}
                      <button
                        onClick={() => {
                          setShowCode(!showCode);
                          if (!showCode) {
                            handleCopyCode(companyCode);
                          }
                        }}
                        className="px-3 py-1 bg-[#7350a9] text-white text-xs rounded-full hover:bg-[#8B5CF6] transition-all font-medium whitespace-nowrap"
                      >
                        코드 확인
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg text-[#1F2328] font-bold">프로필 수정</DialogTitle>
              <DialogDescription className="text-sm text-[#6E8FB3]">
                프로필 정보를 수정하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm text-[#1F2328]">이름</Label>
                <Input
                  id="edit-name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-white border-[#DADDE1] text-[#1F2328]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm text-[#1F2328]">이메일</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-[#DADDE1] text-[#1F2328]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-sm text-[#1F2328]">연락처</Label>
                <Input
                  id="edit-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border-[#DADDE1] text-[#1F2328]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location" className="text-sm text-[#1F2328]">위치</Label>
                <Input
                  id="edit-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white border-[#DADDE1] text-[#1F2328]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code" className="text-sm text-[#1F2328]">스튜디오 마감기기</Label>
                <Input
                  id="edit-code"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  className="bg-white border-[#DADDE1] text-[#1F2328]"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                취소
              </Button>
              <Button className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90" onClick={handleSaveProfile}>
                저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Account Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg text-[#1F2328] font-bold">회원 탈퇴</DialogTitle>
              <DialogDescription className="text-sm text-[#6E8FB3]">
                정말로 회원 탈퇴를 하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-[#1F2328] mb-4">
                탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.
              </p>
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-3">
                <p className="text-xs text-[#DC2626]">
                  ⚠️ 진행 중인 프로젝트와 모든 기록이 영구적으로 삭제됩니다.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                취소
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white" 
                onClick={handleDeleteAccount}
              >
                탈퇴하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
