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
  MyPageOverlay,
  MyPageContainer,
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
} from './MyPage.styled';

/**
 * MyPage 컴포넌트의 Props
 * @param {Object} props
 * @param {Function} props.onClose - 페이지 닫기 핸들러
 * @param {Function} props.onLogout - 로그아웃 핸들러
 */

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

export function MyPage({ onClose, onLogout }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageSelectModalOpen, setIsImageSelectModalOpen] = useState(false);
  const [userName, setUserName] = useState('김작가');
  const [email, setEmail] = useState('kim.artist@example.com');
  const [phone, setPhone] = useState('010-1234-5678');
  const [location, setLocation] = useState('서울특별시 강남구');
  const [studio, setStudio] = useState('스튜디오 아방가르');
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const attendanceData = getAttendanceData();
  const totalDays = attendanceData.reduce((sum, item) => sum + item.value, 0);
  const currentMonth = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  // Load user data from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('artistUserData');
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      setUserName(userData.name || '김작가');
      setEmail(userData.email || 'kim.artist@example.com');
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
      backgroundImage,
    };
    localStorage.setItem('artistUserData', JSON.stringify(userData));
    toast.success('프로필이 성공적으로 업데이트되었습니다.');
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('artistUserData');
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
          const savedUserData = localStorage.getItem('artistUserData');
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

          localStorage.setItem('artistUserData', JSON.stringify(userData));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <MyPageOverlay>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '1280px' }}
      >
        <MyPageContainer>
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
                      <User className="w-16 h-16 text-[#9CA3AF]" />
                    )}
                  </ProfilePhotoContainer>
                  <ProfilePhotoOverlay>
                    <CameraIconContainer>
                      <Camera className="w-6 h-6 text-[#3F4A5A]" />
                    </CameraIconContainer>
                  </ProfilePhotoOverlay>
                </ProfilePhotoButton>

                <ActionButtonsGroup>
                  <ActionButton variant="primary" onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="w-4 h-4" />
                    프로필 수정
                  </ActionButton>
                  <ActionButton onClick={handleLogout}>로그아웃</ActionButton>
                  <ActionButton variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                    회원탈퇴
                  </ActionButton>
                </ActionButtonsGroup>
              </ProfileLeft>

              {/* Center: Name, Role, and Stats */}
              <ProfileCenter>
                <ProfileName>{userName}</ProfileName>
                <ProfileRole>에이전시 대표</ProfileRole>

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
                    <User className="w-5 h-5 text-[#6366F1]" />
                    <BasicInfoTitle>기본 정보</BasicInfoTitle>
                  </BasicInfoHeader>

                  <InfoItem>
                    <InfoIcon>
                      <Mail className="w-5 h-5" />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>이메일</InfoLabel>
                      <InfoValue>{email}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <Phone className="w-5 h-5" />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>연락처</InfoLabel>
                      <InfoValue>{phone}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <MapPin className="w-5 h-5" />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>주소</InfoLabel>
                      <InfoValue>{location}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <Briefcase className="w-5 h-5" />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>소속</InfoLabel>
                      <InfoValue>{studio}</InfoValue>
                    </InfoContent>
                  </InfoItem>
                </BasicInfoSection>
              </ProfileRight>
            </ProfileSection>
          </MainContent>
        </MyPageContainer>
      </motion.div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">프로필 수정</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">프로필 정보를 수정하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm text-[#1F2328]">
                이름
              </Label>
              <Input
                id="edit-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-sm text-[#1F2328]">
                이메일
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-sm text-[#1F2328]">
                연락처
              </Label>
              <Input
                id="edit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location" className="text-sm text-[#1F2328]">
                주소
              </Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code" className="text-sm text-[#1F2328]">
                소속
              </Label>
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

      {/* Image Select Modal */}
      <Dialog open={isImageSelectModalOpen} onOpenChange={setIsImageSelectModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">이미지 변경</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">변경할 이미지를 선택하세요.</DialogDescription>
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

      {/* Delete Account Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">회원 탈퇴</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">정말로 회원 탈퇴를 하시겠습니까?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-[#1F2328] mb-4">탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.</p>
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-3">
              <p className="text-xs text-[#DC2626]">⚠️ 진행 중인 프로젝트와 모든 기록이 영구적으로 삭제됩니다.</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              취소
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteAccount}>
              탈퇴하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MyPageOverlay>
  );
}
