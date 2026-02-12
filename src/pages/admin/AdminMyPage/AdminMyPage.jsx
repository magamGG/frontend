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
import useAuthStore from '@/store/authStore';
import { InquiryModal } from '@/components/modals/InquiryModal';
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

// 근태 타입 정의 및 색상 매핑 (연차/병가는 '휴가'로 표시)
const ATTENDANCE_TYPE_COLORS = {
  '출근': '#00ACC1',
  '휴가': '#757575',
  '재택근무': '#FF9800',
  '워케이션': '#9C27B0',
  '휴재': '#6B7280',
};

// API typeCounts에서 반차/반반차 제외, 연차·병가 → '휴가'로 합쳐 표시
function formatAttendanceTypeCounts(typeCounts) {
  if (!Array.isArray(typeCounts)) return [];
  const filtered = typeCounts.filter(
    (item) => item.type !== '반차' && item.type !== '반반차' && item.type !== '휴재'
  );
  const leaveLabel = '휴가';
  const leaveTypes = ['연차', '병가'];
  const byDisplayName = {};
  filtered.forEach((item) => {
    const displayName = leaveTypes.includes(item.type) ? leaveLabel : item.type;
    if (!byDisplayName[displayName]) {
      byDisplayName[displayName] = {
        count: 0,
        color: ATTENDANCE_TYPE_COLORS[displayName] || '#6E8FB3',
      };
    }
    byDisplayName[displayName].count += Number(item.count ?? 0);
  });
  return Object.entries(byDisplayName).map(([name, { count, color }]) => ({
    name,
    value: count,
    color,
  }));
}

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
  const { user } = useAuthStore();
  const memberNo = user?.memberNo;
  
  console.log('🔍 AdminMyPage 컴포넌트 렌더링:', { 
    user, 
    memberNo, 
    userMemberName: user?.memberName 
  });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageSelectModalOpen, setIsImageSelectModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
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
  
  const currentMonth = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  // Load user data from API
  useEffect(() => {
    console.log('🚀 AdminMyPage useEffect 실행:', { memberNo, user });
    
    if (!memberNo) {
      console.log('❌ memberNo가 없어서 종료');
      return;
    }
    
    const loadMyPageData = async () => {
      try {
        setIsLoading(true);
        
        console.log('📡 API 호출 시작: getMyPageInfo', { memberNo });
        // 마이페이지 정보 조회
        const myPageData = await memberService.getMyPageInfo(memberNo);
        console.log('✅ API 응답 받음:', {
          memberName: myPageData.memberName,
          memberEmail: myPageData.memberEmail,
          memberPhone: myPageData.memberPhone,
          memberAddress: myPageData.memberAddress,
          agencyName: myPageData.agencyName,
          memberRole: myPageData.memberRole,
          전체데이터: myPageData
        });
        
        setUserName(myPageData.memberName || '');
        setEmail(myPageData.memberEmail || '');
        setPhone(myPageData.memberPhone || '');
        setLocation(myPageData.memberAddress || '');
        setStudio(myPageData.agencyName || '');
        setMemberRole(myPageData.memberRole || '');
        
        console.log('✅ State 업데이트 완료:', {
          userName: myPageData.memberName || '',
          email: myPageData.memberEmail || '',
          phone: myPageData.memberPhone || '',
          location: myPageData.memberAddress || '',
          studio: myPageData.agencyName || '',
          memberRole: myPageData.memberRole || ''
        });
        
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
          const formattedData = formatAttendanceTypeCounts(statistics.typeCounts ?? []);
          setAttendanceData(formattedData);
          const totalFromTypes = formattedData.reduce((sum, item) => sum + item.value, 0);
          setTotalDays(totalFromTypes > 0 ? totalFromTypes : (statistics.totalCount || 0));
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

  const handleSaveProfile = async () => {
    if (!memberNo) {
      console.error('❌ memberNo가 없습니다.');
      return;
    }
    
    if (password && password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    console.log('💾 프로필 저장 시작:', {
      memberNo,
      updateData: {
        memberName: userName,
        memberPhone: phone,
        memberAddress: location,
        memberPassword: password ? '***' : undefined
      }
    });
    
    try {
      const updateData = {
        memberName: userName,
        memberPhone: phone,
        memberAddress: location,
        memberPassword: password || undefined, // 비밀번호가 있으면 전송
        // 담당자는 소속 수정 불가 (agencyName 제외)
      };
      
      console.log('📤 API 호출: updateProfile', { memberNo, updateData });
      await memberService.updateProfile(memberNo, updateData);
      console.log('✅ 프로필 업데이트 성공');
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
      setIsEditModalOpen(false);
      setPassword('');
      setConfirmPassword('');
      
      // 데이터 다시 로드
      console.log('🔄 DB에서 최신 데이터 다시 조회:', { memberNo });
      const myPageData = await memberService.getMyPageInfo(memberNo);
      console.log('✅ 최신 데이터 조회 완료:', {
        memberName: myPageData.memberName,
        memberEmail: myPageData.memberEmail,
        memberPhone: myPageData.memberPhone,
        memberAddress: myPageData.memberAddress,
        agencyName: myPageData.agencyName,
        memberRole: myPageData.memberRole
      });
      
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
      <AdminMyPageOverlay>
        <div className="text-center">
          <p className="text-[#6E8FB3]">로딩 중...</p>
        </div>
      </AdminMyPageOverlay>
    );
  }

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
                  <ActionButton $variant="primary" onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="w-4 h-4" />
                    프로필 수정
                  </ActionButton>
                  <ActionButton $variant="secondary" onClick={() => setIsInquiryModalOpen(true)}>
                    <MessageCircle className="w-4 h-4" />
                    문의하기
                  </ActionButton>
                  <ActionButton $variant="secondary" onClick={handleLogout}>
                    로그아웃
                  </ActionButton>
                  <ActionButton $variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                    회원탈퇴
                  </ActionButton>
                </ActionButtonsGroup>
              </ProfileLeft>

              {/* Center: Name, Role, and Stats */}
              <ProfileCenter>
                <ProfileName>{userName}</ProfileName>
                <ProfileRole>{memberRole || '담당자'}</ProfileRole>

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
      <Dialog 
        open={isEditModalOpen} 
        onOpenChange={async (open) => {
          setIsEditModalOpen(open);
          if (open && memberNo) {
            // 모달이 열릴 때 DB에서 최신 데이터 조회
            console.log('📂 모달 열기 - DB에서 최신 데이터 조회 시작:', { memberNo });
            try {
              const myPageData = await memberService.getMyPageInfo(memberNo);
              console.log('✅ 모달 열기 - 최신 데이터 조회 완료:', {
                memberName: myPageData.memberName,
                memberPhone: myPageData.memberPhone,
                memberAddress: myPageData.memberAddress,
                agencyName: myPageData.agencyName,
                memberEmail: myPageData.memberEmail,
                memberRole: myPageData.memberRole
              });
              
              setUserName(myPageData.memberName || '');
              setPhone(myPageData.memberPhone || '');
              setLocation(myPageData.memberAddress || '');
              setStudio(myPageData.agencyName || '');
              setEmail(myPageData.memberEmail || '');
              setMemberRole(myPageData.memberRole || '');
              setPassword('');
              setConfirmPassword('');
            } catch (error) {
              console.error('❌ 모달 열기 시 데이터 조회 실패:', error);
              toast.error('데이터를 불러오는데 실패했습니다.');
            }
          }
        }}
      >
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
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <FormHelperText>이메일은 변경할 수 없습니다.</FormHelperText>
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="edit-password">비밀번호 변경</FormLabel>
              <FormInput
                id="edit-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="변경할 비밀번호 (변경하지 않으려면 비워두세요)"
              />
            </FormRow>
            <FormRow>
              <FormLabel htmlFor="edit-confirm-password">비밀번호 확인</FormLabel>
              <FormInput
                id="edit-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
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
            <DialogDescription className="text-sm text-[#6E8FB3]">
              정말로 회원 탈퇴를 하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DeleteModalContent>
            <DeleteModalText>
              탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.
            </DeleteModalText>
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
            <DeleteWarningBox>
              <DeleteWarningText>
                ⚠️ 진행 중인 프로젝트와 모든 기록이 영구적으로 삭제됩니다.
              </DeleteWarningText>
            </DeleteWarningBox>
          </DeleteModalContent>
          <ModalActions>
            <Button variant="outline" onClick={() => {
              setIsDeleteModalOpen(false);
              setDeletePassword('');
              setDeleteError('');
            }}>
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

      {/* Inquiry Modal */}
      <InquiryModal 
        open={isInquiryModalOpen} 
        onOpenChange={setIsInquiryModalOpen} 
      />
    </AdminMyPageOverlay>
  );
}
