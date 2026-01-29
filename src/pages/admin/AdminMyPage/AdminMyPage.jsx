import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit, ArrowLeft, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
  AttendanceStatsSection,
  AttendanceStatsHeader,
  AttendanceStatsTitleRow,
  TitleIndicator,
  AttendanceStatsTitle,
  AttendanceStatsMonth,
  ChartContainer,
  PieChartWrapper,
  ChartCenterText,
  ChartCenterValue,
  ChartCenterLabel,
  LegendContainer,
  LegendItem,
  LegendColor,
  LegendText,
  LegendValue,
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
  FormHelperText,
  ModalActions,
  ImageSelectGrid,
  ImageSelectButton,
  ImageSelectIcon,
  ImageSelectLabel,
  BasicInfoContent,
  DeleteModalContent,
  DeleteModalText,
  DeleteWarningBox,
  DeleteWarningText,
  MotionWrapper,
} from './AdminMyPage.styled';

// 근태 타입 정의
const ATTENDANCE_TYPE = {
  OFFICE: '출근',
  LEAVE: '휴가',
  REMOTE: '재택근무',
  WORKATION: '워케이션',
};

// 근태 통계 데이터 (이번 달 기준)
const getAttendanceData = () => [
  { name: ATTENDANCE_TYPE.OFFICE, value: 12, color: '#00ACC1' },
  { name: ATTENDANCE_TYPE.LEAVE, value: 3, color: '#757575' },
  { name: ATTENDANCE_TYPE.REMOTE, value: 8, color: '#FF9800' },
  { name: ATTENDANCE_TYPE.WORKATION, value: 2, color: '#9C27B0' },
];

// Custom tooltip for the pie chart
/**
 * @param {Object} props
 * @param {boolean} props.active
 * @param {Array} props.payload
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-[#DADDE1]">
        <p className="text-sm font-semibold text-[#1F2328]">{payload[0].name}</p>
        <p className="text-sm text-[#6E8FB3]">{payload[0].value}일</p>
      </div>
    );
  }
  return null;
};

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

  // 근태 통계 데이터
  const attendanceData = getAttendanceData();
  const totalDays = attendanceData.reduce((sum, item) => sum + item.value, 0);
  const currentMonth = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

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
      <MotionWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <AdminMyPageContainer>
          {/* Header */}
          <HeaderBackground $backgroundImage={backgroundImage}>
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
                      <img src={profileImage} alt="Profile" />
                    ) : (
                      <User className="w-16 h-16" />
                    )}
                  </ProfilePhotoContainer>
                  <ProfilePhotoOverlay>
                    <CameraIconContainer>
                      <Camera className="w-6 h-6" />
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

              {/* Center: Name, Role, and Stats */}
              <ProfileCenter>
                <ProfileName>{userName}</ProfileName>
                <ProfileRole>담당자</ProfileRole>

                {/* Attendance Stats */}
                <AttendanceStatsSection>
                  <AttendanceStatsHeader>
                    <AttendanceStatsTitleRow>
                      <TitleIndicator />
                      <AttendanceStatsTitle>근태 통계</AttendanceStatsTitle>
                    </AttendanceStatsTitleRow>
                    <AttendanceStatsMonth>{currentMonth}</AttendanceStatsMonth>
                  </AttendanceStatsHeader>

                  <ChartContainer>
                    <PieChartWrapper>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {attendanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <ChartCenterText>
                        <ChartCenterValue>{totalDays}</ChartCenterValue>
                        <ChartCenterLabel>일</ChartCenterLabel>
                      </ChartCenterText>
                    </PieChartWrapper>

                    <LegendContainer>
                      {attendanceData.map((item, index) => (
                        <LegendItem key={index}>
                          <LegendColor $color={item.color} />
                          <LegendText>{item.name}</LegendText>
                          <LegendValue>{item.value}일</LegendValue>
                        </LegendItem>
                      ))}
                    </LegendContainer>
                  </ChartContainer>
                </AttendanceStatsSection>
              </ProfileCenter>

              {/* Right: Basic Info */}
              <ProfileRight>
                <BasicInfoSection>
                  <BasicInfoHeader>
                    <User className="w-5 h-5" />
                    <BasicInfoTitle>기본 정보</BasicInfoTitle>
                  </BasicInfoHeader>

                  <BasicInfoContent>
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
                  </BasicInfoContent>
                </BasicInfoSection>
              </ProfileRight>
            </ProfileSection>
          </MainContent>
        </AdminMyPageContainer>
      </MotionWrapper>

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
              />
              <FormHelperText>소속은 변경할 수 없습니다.</FormHelperText>
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
          <DeleteModalContent>
            <DeleteModalText>
              탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.
            </DeleteModalText>
            <DeleteWarningBox>
              <DeleteWarningText>
                ⚠️ 진행 중인 프로젝트와 모든 기록이 영구적으로 삭제됩니다.
              </DeleteWarningText>
            </DeleteWarningBox>
          </DeleteModalContent>
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
              <ImageSelectIcon $bgColor="#3F4A5A">
                <Camera className="w-8 h-8" />
              </ImageSelectIcon>
              <ImageSelectLabel>배경 이미지</ImageSelectLabel>
            </ImageSelectButton>
            
            <ImageSelectButton onClick={() => handleImageTypeSelect('profile')}>
              <ImageSelectIcon $bgColor="#6E8FB3" $rounded>
                <User className="w-8 h-8" />
              </ImageSelectIcon>
              <ImageSelectLabel>프로필 사진</ImageSelectLabel>
            </ImageSelectButton>
          </ImageSelectGrid>
        </DialogContent>
      </Dialog>
    </AdminMyPageOverlay>
  );
}
