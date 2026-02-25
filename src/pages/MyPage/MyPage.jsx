import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit, ArrowLeft, Camera, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { memberService, attendanceService } from '@/api/services';
import { API_BASE_URL } from '@/api/config';
import { formatPhoneNumber } from '@/utils/phoneFormatter';
import useAuthStore from '@/store/authStore';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { MapPickerModal } from '@/components/modals/MapPickerModal';
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

// 근태 타입 정의 및 색상 매핑
const ATTENDANCE_TYPE_COLORS = {
  '출근': '#00ACC1',
  '휴가': '#757575',
  '재택근무': '#FF9800',
  '워케이션': '#9C27B0',
};

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
  const { user } = useAuthStore();
  const memberNo = user?.memberNo;
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageSelectModalOpen, setIsImageSelectModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [studio, setStudio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [memberRole, setMemberRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isComposing, setIsComposing] = useState({ name: false, phone: false }); // IME 조합 상태 추적
  
  const currentMonth = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  // Load user data from API
  useEffect(() => {
    if (!memberNo) return;
    
    const loadMyPageData = async () => {
      try {
        setIsLoading(true);
        const myPageData = await memberService.getMyPageInfo(memberNo);
        
        setUserName(myPageData.memberName || '');
        setEmail(myPageData.memberEmail || '');
        setPhone(myPageData.memberPhone || '');
        setLocation(myPageData.memberAddress || '');
        setStudio(myPageData.agencyName || '');
        setMemberRole(myPageData.memberRole || '');
        
        // 이미지 URL 설정
        const imageBaseUrl = API_BASE_URL || 'http://localhost:8888';
        if (myPageData.memberProfileImage) {
          setProfileImage(`${imageBaseUrl}/uploads/${myPageData.memberProfileImage}`);
        }
        if (myPageData.memberProfileBannerImage) {
          setBackgroundImage(`${imageBaseUrl}/uploads/${myPageData.memberProfileBannerImage}`);
        }
        
        // 근태 통계 조회
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        
        try {
          const statistics = await attendanceService.getStatistics(memberNo, year, month);
          const formattedData = statistics.typeCounts.map(item => ({
            name: item.type,
            value: Number(item.count), // Long을 Number로 변환
            color: ATTENDANCE_TYPE_COLORS[item.type] || '#6E8FB3',
          }));
          
          setAttendanceData(formattedData);
          setTotalDays(statistics.totalCount || 0);
        } catch (error) {
          console.error('근태 통계 조회 실패:', error);
          setAttendanceData([]);
          setTotalDays(0);
        }
      } catch (error) {
        console.error('마이페이지 데이터 로드 실패:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMyPageData();
  }, [memberNo]);

  // IME 조합 시작
  const handleCompositionStart = (e) => {
    const field = e.target.id === 'edit-name' ? 'name' : e.target.id === 'edit-phone' ? 'phone' : null;
    if (field) {
      setIsComposing(prev => ({ ...prev, [field]: true }));
    }
  };

  // IME 조합 종료
  const handleCompositionEnd = (e) => {
    const field = e.target.id === 'edit-name' ? 'name' : e.target.id === 'edit-phone' ? 'phone' : null;
    if (field) {
      setIsComposing(prev => ({ ...prev, [field]: false }));
      // 조합 종료 후 필터링 적용
      if (field === 'name') {
        const filtered = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]/g, '');
        setUserName(filtered);
      } else if (field === 'phone') {
        const numericOnly = e.target.value.replace(/[^0-9]/g, '');
        const formatted = formatPhoneNumber(numericOnly);
        setPhone(formatted);
      }
    }
  };

  // 초성이 포함되어 있는지 검증
  const hasHangulJamo = (text) => {
    if (!text) return false;
    return /[ㄱ-ㅎㅏ-ㅣ]/.test(text);
  };

  const handleSaveProfile = async () => {
    if (!memberNo) {
      console.error('❌ memberNo가 없습니다.');
      return;
    }
    
    // 이름에 초성이 포함되어 있는지 검증
    if (hasHangulJamo(userName)) {
      toast.error('이름을 완성해주세요. 초성을 포함할 수 없습니다.');
      return;
    }
    
    if (password && password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      const updateData = {
        memberName: userName,
        memberPhone: phone,
        memberAddress: location,
        memberPassword: password || undefined,
      };
      
      await memberService.updateProfile(memberNo, updateData);
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
      setIsEditModalOpen(false);
      setPassword('');
      setConfirmPassword('');
      
      const myPageData = await memberService.getMyPageInfo(memberNo);
      
      setUserName(myPageData.memberName || '');
      setEmail(myPageData.memberEmail || '');
      setPhone(myPageData.memberPhone || '');
      setLocation(myPageData.memberAddress || '');
      setStudio(myPageData.agencyName || '');
      setMemberRole(myPageData.memberRole || '');
    } catch (error) {
      console.error('❌ 프로필 수정 실패:', error);
      console.error('에러 상세:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      toast.error('프로필 수정에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('artistUserData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('hasAgency');
    toast.success('로그아웃되었습니다.');
    onLogout();
  };

  const handleDeleteAccount = async () => {
    if (!memberNo) return;
    
    // 에러 메시지 초기화
    setDeleteError('');
    
    if (!deletePassword || deletePassword.trim() === '') {
      setDeleteError('비밀번호를 입력해주세요.');
      return;
    }
    
    try {
      await memberService.deleteMember(memberNo, deletePassword);
      toast.success('회원 탈퇴가 완료되었습니다.');
      setIsDeleteModalOpen(false);
      setDeletePassword('');
      setDeleteError('');
      onLogout();
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '회원 탈퇴에 실패했습니다.';
      setDeleteError(errorMessage);
    }
  };

  const handleImageTypeSelect = (type) => {
    if (!memberNo) return;
    
    setIsImageSelectModalOpen(false);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      try {
        const imageBaseUrl = API_BASE_URL || 'http://localhost:8888';
        let fileName;
        if (type === 'background') {
          fileName = await memberService.uploadBackgroundImage(memberNo, file);
          setBackgroundImage(`${imageBaseUrl}/uploads/${fileName}`);
          toast.success('배경 이미지가 변경되었습니다.');
        } else {
          fileName = await memberService.uploadProfileImage(memberNo, file);
          setProfileImage(`${imageBaseUrl}/uploads/${fileName}`);
          toast.success('프로필 사진이 변경되었습니다.');
          window.dispatchEvent(new CustomEvent('profile-image-updated'));
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        toast.error('이미지 업로드에 실패했습니다.');
      }
    };
    input.click();
  };

  if (isLoading) {
    return (
      <MyPageOverlay>
        <div className="text-center">
          <p className="text-[#6E8FB3]">로딩 중...</p>
        </div>
      </MyPageOverlay>
    );
  }

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
                  <ActionButton $variant="primary" onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="w-4 h-4" />
                    프로필 수정
                  </ActionButton>
                  <ActionButton onClick={() => setIsInquiryModalOpen(true)}>
                    <MessageCircle className="w-4 h-4" />
                    문의하기
                  </ActionButton>
                  <ActionButton onClick={handleLogout}>로그아웃</ActionButton>
                  <ActionButton $variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                    회원탈퇴
                  </ActionButton>
                </ActionButtonsGroup>
              </ProfileLeft>

              {/* Center: Name, Role, and Stats */}
              <ProfileCenter>
                <ProfileName>{userName}</ProfileName>
                <ProfileRole>{memberRole}</ProfileRole>

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
                      <InfoValue>{studio || '비소속'}</InfoValue>
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
                onChange={(e) => {
                  // IME 조합 중일 때는 필터링하지 않음
                  if (isComposing.name) {
                    setUserName(e.target.value);
                    return;
                  }
                  // 이름은 한글(완성형 + 자모), 영문만 허용 (공백 제외)
                  const filtered = e.target.value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]/g, '');
                  setUserName(filtered);
                }}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onKeyDown={(e) => {
                  // 스페이스바 입력 차단
                  if (e.key === ' ' || e.key === 'Space') {
                    e.preventDefault();
                  }
                }}
                maxLength={20}
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password" className="text-sm text-[#1F2328]">
                비밀번호 변경
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={password}
                onChange={(e) => {
                  // 비밀번호는 띄어쓰기 제거
                  const filtered = e.target.value.replace(/\s/g, '');
                  setPassword(filtered);
                }}
                placeholder="변경할 비밀번호 (변경하지 않으려면 비워두세요)"
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-confirm-password" className="text-sm text-[#1F2328]">
                비밀번호 확인
              </Label>
              <Input
                id="edit-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  // 비밀번호는 띄어쓰기 제거
                  const filtered = e.target.value.replace(/\s/g, '');
                  setConfirmPassword(filtered);
                }}
                placeholder="비밀번호 확인"
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
                onChange={(e) => {
                  // IME 조합 중일 때는 필터링하지 않음
                  if (isComposing.phone) {
                    setPhone(e.target.value);
                    return;
                  }
                  // 숫자만 허용
                  const numericOnly = e.target.value.replace(/[^0-9]/g, '');
                  const formatted = formatPhoneNumber(numericOnly);
                  setPhone(formatted);
                }}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onKeyDown={(e) => {
                  // 숫자, 백스페이스, Delete, 화살표 키만 허용
                  if (!/[0-9]/.test(e.key) && 
                      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'].includes(e.key) &&
                      !(e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                  }
                }}
                maxLength={13}
                className="bg-white border-[#DADDE1] text-[#1F2328]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location" className="text-sm text-[#1F2328]">
                주소
              </Label>
              <div className="flex gap-2">
                <Input
                  id="edit-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="주소를 입력하거나 지도에서 선택하세요"
                  className="bg-white border-[#DADDE1] text-[#1F2328] flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMapPicker(true)}
                  className="shrink-0"
                >
                  <MapPin size={16} className="mr-1" />
                  지도에서 선택
                </Button>
              </div>
              <MapPickerModal
                open={showMapPicker}
                onOpenChange={setShowMapPicker}
                onSelect={(addr) => setLocation(addr)}
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
      <Dialog open={isDeleteModalOpen} onOpenChange={(open) => {
        setIsDeleteModalOpen(open);
        if (!open) {
          setDeletePassword('');
          setDeleteError('');
        }
      }}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg text-[#1F2328] font-bold">회원 탈퇴</DialogTitle>
            <DialogDescription className="text-sm text-[#6E8FB3]">정말로 회원 탈퇴를 하시겠습니까?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-[#1F2328] mb-4">탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.</p>
            <div className="space-y-2 mb-4">
              <Label htmlFor="delete-password" className="text-sm text-[#1F2328]">
                비밀번호 확인
              </Label>
              <Input
                id="delete-password"
                type="password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  setDeleteError('');
                }}
                placeholder="비밀번호를 입력하세요"
                className={`bg-white border-[#DADDE1] text-[#1F2328] ${
                  deleteError ? 'border-red-500' : ''
                }`}
              />
              {deleteError && (
                <p className="text-xs text-red-600 mt-1">{deleteError}</p>
              )}
            </div>
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-3">
              <p className="text-xs text-[#DC2626]">⚠️ 진행 중인 프로젝트와 모든 기록이 영구적으로 삭제됩니다.</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-[#DADDE1]">
            <Button variant="outline" onClick={() => {
              setIsDeleteModalOpen(false);
              setDeletePassword('');
              setDeleteError('');
            }}>
              취소
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteAccount}>
              탈퇴하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inquiry Modal */}
      <InquiryModal 
        open={isInquiryModalOpen} 
        onOpenChange={setIsInquiryModalOpen} 
      />
    </MyPageOverlay>
  );
}
