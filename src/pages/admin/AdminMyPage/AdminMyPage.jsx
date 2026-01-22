import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit, ArrowLeft, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import {
  AdminMyPageOverlay,
  AdminMyPageContainer,
  HeaderBackground,
  BackButton,
  MainContent,
  ProfileSection,
  ProfileLeft,
  ProfilePhotoButton,
  ProfilePhotoContainer,
  ProfilePhotoOverlay,
  CameraIconContainer,
  ActionButtonsGroup,
  ActionButton,
  ProfileCenter,
  ProfileName,
  ProfileRole,
  ProfileRight,
  BasicInfoSection,
  BasicInfoHeader,
  BasicInfoTitle,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoLabel,
  InfoValue,
  ModalForm,
  FormRow,
  FormLabel,
  FormInput,
  FormTextarea,
  ModalActions,
  ImageSelectGrid,
  ImageSelectButton,
  ImageSelectIcon,
  ImageSelectLabel,
} from './AdminMyPage.styled';

export function AdminMyPage({ onClose, onLogout }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageSelectModalOpen, setIsImageSelectModalOpen] = useState(false);
  const [userName, setUserName] = useState('김담당자');
  const [email, setEmail] = useState('kim.manager@example.com');
  const [phone, setPhone] = useState('010-1234-5678');
  const [location, setLocation] = useState('서울특별시 강남구');
  const [studio, setStudio] = useState('스튜디오 아방가르');
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  // TODO: Zustand store mapping - 사용자 데이터 로드
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
    localStorage.removeItem('managerUserData');
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

  const handleImageTypeSelect = (type) => {
    setIsImageSelectModalOpen(false);
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage = reader.result;
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
    <AdminMyPageOverlay>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '1280px' }}
      >
        <AdminMyPageContainer>
          {/* Header */}
          <HeaderBackground style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
            <BackButton onClick={onClose}>
              <ArrowLeft className="w-5 h-5" />
            </BackButton>
          </HeaderBackground>

          {/* Main Content */}
          <MainContent>
            {/* Profile Section - Horizontal Layout */}
            <ProfileSection>
              {/* Left: Profile Photo and Action Buttons */}
              <ProfileLeft>
                <ProfilePhotoButton onClick={() => setIsImageSelectModalOpen(true)} aria-label="프로필 사진 변경">
                  <ProfilePhotoContainer>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User className="w-16 h-16" style={{ color: '#9CA3AF' }} />
                    )}
                  </ProfilePhotoContainer>
                  <ProfilePhotoOverlay>
                    <CameraIconContainer>
                      <Camera className="w-6 h-6" style={{ color: '#3F4A5A' }} />
                    </CameraIconContainer>
                  </ProfilePhotoOverlay>
                </ProfilePhotoButton>

                <ActionButtonsGroup>
                  <ActionButton variant="primary" onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="w-4 h-4" />
                    프로필 수정
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={handleLogout}>
                    로그아웃
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                    회원탈퇴
                  </ActionButton>
                </ActionButtonsGroup>
              </ProfileLeft>

              {/* Center: Name and Role */}
              <ProfileCenter>
                <ProfileName>{userName}</ProfileName>
                <ProfileRole>담당자</ProfileRole>
              </ProfileCenter>

              {/* Right: Basic Info */}
              <ProfileRight>
                <BasicInfoSection>
                  <BasicInfoHeader>
                    <User className="w-5 h-5" style={{ color: '#6366F1' }} />
                    <BasicInfoTitle>기본 정보</BasicInfoTitle>
                  </BasicInfoHeader>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Email */}
                    <InfoItem>
                      <InfoIcon>
                        <Mail className="w-5 h-5" />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>이메일</InfoLabel>
                        <InfoValue>{email}</InfoValue>
                      </InfoContent>
                    </InfoItem>

                    {/* Phone */}
                    <InfoItem>
                      <InfoIcon>
                        <Phone className="w-5 h-5" />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>연락처</InfoLabel>
                        <InfoValue>{phone}</InfoValue>
                      </InfoContent>
                    </InfoItem>

                    {/* Location */}
                    <InfoItem>
                      <InfoIcon>
                        <MapPin className="w-5 h-5" />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>주소</InfoLabel>
                        <InfoValue>{location}</InfoValue>
                      </InfoContent>
                    </InfoItem>

                    {/* Studio */}
                    <InfoItem>
                      <InfoIcon>
                        <Briefcase className="w-5 h-5" />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>소속</InfoLabel>
                        <InfoValue>{studio}</InfoValue>
                      </InfoContent>
                    </InfoItem>
                  </div>
                </BasicInfoSection>
              </ProfileRight>
            </ProfileSection>
          </MainContent>
        </AdminMyPageContainer>
      </motion.div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">프로필 수정</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">
              프로필 정보를 수정하세요.
            </DialogDescription>
          </DialogHeader>
          <ModalForm>
            <FormRow>
              <FormLabel htmlFor="edit-name">이름</FormLabel>
              <FormInput
                id="edit-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="edit-email">이메일</FormLabel>
              <FormInput
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="edit-phone">연락처</FormLabel>
              <FormInput
                id="edit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="edit-location">주소</FormLabel>
              <FormInput
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="edit-code">소속</FormLabel>
              <FormInput
                id="edit-code"
                value={studio}
                disabled
                style={{ backgroundColor: '#F3F4F6', cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '12px', color: '#6E8FB3', marginTop: '4px' }}>소속은 변경할 수 없습니다.</p>
            </FormRow>
          </ModalForm>
          <ModalActions>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              취소
            </Button>
            <Button className="bg-[#3F4A5A] hover:bg-[#3F4A5A]/90" onClick={handleSaveProfile}>
              저장
            </Button>
          </ModalActions>
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
          <div style={{ padding: '16px 0' }}>
            <p style={{ fontSize: '14px', color: '#1F2328', marginBottom: '16px' }}>
              탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.
            </p>
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px' }}>
              <p style={{ fontSize: '12px', color: '#DC2626' }}>
                ⚠️ 진행 중인 프로젝트와 모든 기록이 영구적으로 삭제됩니다.
              </p>
            </div>
          </div>
          <ModalActions>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              취소
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={handleDeleteAccount}
            >
              탈퇴하기
            </Button>
          </ModalActions>
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
          <ImageSelectGrid>
            <ImageSelectButton onClick={() => handleImageTypeSelect('background')}>
              <ImageSelectIcon style={{ backgroundColor: '#3F4A5A' }}>
                <Camera className="w-8 h-8" style={{ color: 'white' }} />
              </ImageSelectIcon>
              <ImageSelectLabel>배경 이미지</ImageSelectLabel>
            </ImageSelectButton>
            
            <ImageSelectButton onClick={() => handleImageTypeSelect('profile')}>
              <ImageSelectIcon style={{ backgroundColor: '#6E8FB3', borderRadius: '50%' }}>
                <User className="w-8 h-8" style={{ color: 'white' }} />
              </ImageSelectIcon>
              <ImageSelectLabel>프로필 사진</ImageSelectLabel>
            </ImageSelectButton>
          </ImageSelectGrid>
        </DialogContent>
      </Dialog>
    </AdminMyPageOverlay>
  );
}
