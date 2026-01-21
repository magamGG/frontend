import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit, ArrowLeft, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface AdminMyPageProps {
  onClose: () => void;
  onLogout: () => void;
}

export function AdminMyPage({ onClose, onLogout }: AdminMyPageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageSelectModalOpen, setIsImageSelectModalOpen] = useState(false);
  const [userName, setUserName] = useState('김담당자');
  const [email, setEmail] = useState('kim.manager@example.com');
  const [phone, setPhone] = useState('010-1234-5678');
  const [location, setLocation] = useState('서울특별시 강남구');
  const [studio, setStudio] = useState('스튜디오 아방가르');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Load user data from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('managerUserData');
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      setUserName(userData.name || '김담당자');
      setEmail(userData.email || 'kim.manager@example.com');
      setPhone(userData.phone || '010-1234-5678');
      setLocation(userData.location || '서울특별시 강남구');
      setStudio(userData.studio || '스튜디오 아방가르');
      setProfileImage(userData.profileImage || null);
      setBackgroundImage(userData.backgroundImage || null);
    }
  }, []);

  const handleSaveProfile = () => {
    const userData = {
      name: userName,
      email,
      phone,
      location,
      studio,
      profileImage,
      backgroundImage
    };
    localStorage.setItem('managerUserData', JSON.stringify(userData));
    toast.success('프로필이 성공적으로 업데이트되었습니다.');
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('managerUserData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('hasAgency');
    toast.success('로그아웃되었습니다.');
    onLogout();
  };

  const handleDeleteAccount = () => {
    // Clear all data and logout
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
      toast.info('코드: MANAGER-2024-1234');
    }
    document.body.removeChild(textArea);
  };

  const handleImageTypeSelect = (type: 'background' | 'profile') => {
    setIsImageSelectModalOpen(false);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage = reader.result as string;
          const savedUserData = localStorage.getItem('managerUserData');
          const userData = savedUserData ? JSON.parse(savedUserData) : {};
          
          if (type === 'background') {
            setBackgroundImage(newImage);
            userData.backgroundImage = newImage;
            toast.success('배경 이미지가 변경되었습니다.');
          } else {
            setProfileImage(newImage);
            userData.profileImage = newImage;
            toast.success('프로필 사진이 변경되었습니다.');
          }
          
          localStorage.setItem('managerUserData', JSON.stringify(userData));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
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
        <div 
          className="h-32 bg-[#3F4A5A] relative bg-cover bg-center"
          style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
        >
          {/* 메뉴로 돌아가기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="relative px-12 pb-12">
          {/* Profile Section - Horizontal Layout */}
          <div className="flex gap-8 -mt-16">
            {/* Left: Profile Photo and Action Buttons */}
            <div className="flex flex-col items-center gap-6 flex-shrink-0">
              {/* Profile Photo - 전체 영역 클릭 가능 */}
              <button
                onClick={() => setIsImageSelectModalOpen(true)}
                className="relative w-32 h-32 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F97316] focus:ring-offset-2 rounded-full"
                aria-label="프로필 사진 변경"
              >
                <div className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-white overflow-hidden transition-all group-hover:shadow-2xl">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <User className="w-16 h-16 text-[#9CA3AF] group-hover:text-[#F97316] transition-colors" />
                  )}
                </div>
                
                {/* Hover Overlay with Camera Icon */}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-6 h-6 text-[#3F4A5A]" />
                  </div>
                </div>
              </button>

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
              <p className="text-[#6E8FB3] text-base mb-8">담당자</p>
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
                    <p className="text-xs text-[#6E8FB3] mb-1">주소</p>
                    <p className="text-sm text-[#1F2328] font-medium">{location}</p>
                  </div>
                </div>

                {/* Studio */}
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-[#6E8FB3] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#6E8FB3] mb-1">소속</p>
                    <p className="text-sm text-[#1F2328] font-medium">{studio}</p>
                  </div>
                </div>
              </div>

              {/* 기본 정보 수정 버튼 제거 */}
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
                <Label htmlFor="edit-location" className="text-sm text-[#1F2328]">주소</Label>
                <Input
                  id="edit-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white border-[#DADDE1] text-[#1F2328]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code" className="text-sm text-[#1F2328]">소속</Label>
                <Input
                  id="edit-code"
                  value={studio}
                  disabled
                  className="bg-gray-100 border-[#DADDE1] text-[#6E8FB3] cursor-not-allowed"
                />
                <p className="text-xs text-[#6E8FB3]">소속은 변경할 수 없습니다.</p>
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

        {/* Image Select Modal */}
        <Dialog open={isImageSelectModalOpen} onOpenChange={setIsImageSelectModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg text-[#1F2328] font-bold">이미지 변경</DialogTitle>
              <DialogDescription className="text-sm text-[#6E8FB3]">
                변경할 이미지를 선택하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-6">
              <button
                onClick={() => handleImageTypeSelect('background')}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-[#DADDE1] rounded-xl hover:border-[#6E8FB3] hover:bg-[#6E8FB3]/5 transition-all group"
              >
                <div className="w-16 h-16 bg-[#3F4A5A] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-[#1F2328]">배경 이미지</span>
              </button>
              
              <button
                onClick={() => handleImageTypeSelect('profile')}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-[#DADDE1] rounded-xl hover:border-[#6E8FB3] hover:bg-[#6E8FB3]/5 transition-all group"
              >
                <div className="w-16 h-16 bg-[#6E8FB3] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-[#1F2328]">프로필 사진</span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}