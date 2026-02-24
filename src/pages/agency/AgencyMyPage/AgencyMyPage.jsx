import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Edit, KeyRound, Camera, ArrowLeft, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { memberService } from '@/api/services';
import { API_BASE_URL } from '@/api/config';
import useAuthStore from '@/store/authStore';
import { InquiryModal } from '@/components/modals/InquiryModal';
import { MapPickerModal } from '@/components/modals/MapPickerModal';



/**
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {Function} props.onLogout
 */
export function AgencyMyPage({ onClose, onLogout }) {
  console.log('🎯 AgencyMyPage 컴포넌트 렌더링');
  
  const { user } = useAuthStore();
  const memberNo = user?.memberNo;
  const agencyNo = user?.agencyNo;
  
  console.log('🔍 AgencyMyPage - user 정보:', { user, memberNo, agencyNo });
  
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
  const [showCode, setShowCode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [companyCode, setCompanyCode] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [memberRole, setMemberRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-[#DADDE1]">
          <p className="text-sm font-semibold text-[#1F2328]">{payload[0].name}</p>
          <p className="text-sm text-[#6E8FB3]">{payload[0].value}명</p>
        </div>
      );
    }
    return null;
  };

  // Load user data from API
  useEffect(() => {
    console.log('🚀 useEffect 실행:', { memberNo, agencyNo });
    
    if (!memberNo) {
      console.log('❌ memberNo가 없어서 종료');
      return;
    }
    
    const loadMyPageData = async () => {
      try {
        setIsLoading(true);
        
        // 마이페이지 정보 조회
        const myPageData = await memberService.getMyPageInfo(memberNo);
        setUserName(myPageData.memberName || '');
        setEmail(myPageData.memberEmail || '');
        setPhone(myPageData.memberPhone || '');
        setLocation(myPageData.memberAddress || '');
        setStudio(myPageData.agencyName || '');
        setMemberRole(myPageData.memberRole || '');
        setCompanyCode(myPageData.agencyCode || '');
        
        // 이미지 URL 설정
        const imageBaseUrl = API_BASE_URL || 'http://localhost:8888';
        if (myPageData.memberProfileImage) {
          setProfileImage(`${imageBaseUrl}/uploads/${myPageData.memberProfileImage}`);
        }
        if (myPageData.memberProfileBannerImage) {
          setBackgroundImage(`${imageBaseUrl}/uploads/${myPageData.memberProfileBannerImage}`);
        }
        
        // 직원 통계 조회 (에이전시 관리자인 경우)
        if (agencyNo && myPageData.memberRole === '에이전시 관리자') {
          try {
            const statistics = await memberService.getEmployeeStatistics(agencyNo);
            
            // 직급별 색상 매핑
            const roleColorMap = {
              '담당자': '#00ACC1',
              '작가': '#9C27B0',
              '어시스트': '#FF9800',
              '어시스턴트': '#FF9800',
              '매니저': '#4CAF50',
              '디렉터': '#E91E63',
            };
            
            // 에이전시 관리자를 제외한 데이터 필터링
            const filteredRoleCounts = statistics.roleCounts.filter(
              item => item.role !== '에이전시 관리자'
            );
            
            console.log('📊 필터링 전 roleCounts:', statistics.roleCounts);
            console.log('📊 필터링 후 roleCounts:', filteredRoleCounts);
            
            const formattedData = filteredRoleCounts.map((item, index) => {
              // roleColorMap에서 색상 찾기 (대소문자 구분 없이)
              const roleKey = Object.keys(roleColorMap).find(
                key => key === item.role || key.toLowerCase() === item.role?.toLowerCase()
              );
              const color = roleKey ? roleColorMap[roleKey] : 
                           ['#00ACC1', '#9C27B0', '#FF9800', '#4CAF50', '#E91E63', '#9C27B0'][index % 6];
              
              console.log('🎨 색상 매핑:', { 
                role: item.role, 
                roleKey, 
                color,
                index 
              });
              
              return {
                name: item.role,
                value: Number(item.count), // Long을 Number로 변환
                color: color,
              };
            });
            
            console.log('📊 최종 포맷팅된 데이터:', formattedData);
            
            // 필터링된 데이터의 총합 계산
            const filteredTotalCount = formattedData.reduce(
              (sum, item) => sum + item.value, 
              0
            );
            
            setEmployeeData(formattedData);
            setTotalEmployees(filteredTotalCount);
          } catch (error) {
            console.error('직원 통계 조회 실패:', error);
            setEmployeeData([]);
            setTotalEmployees(0);
          }
        }
      } catch (error) {
        console.error('마이페이지 데이터 로드 실패:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMyPageData();
  }, [memberNo, agencyNo]);

  const handleSaveProfile = async () => {
    if (!memberNo) return;
    
    if (password && password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      const updateData = {
        memberName: userName,
        memberPhone: phone,
        memberAddress: location,
        agencyName: studio, // 에이전시 관리자만 수정 가능
        memberPassword: password || undefined, // 비밀번호가 있으면 전송
      };
      
      await memberService.updateProfile(memberNo, updateData);
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
      setIsEditModalOpen(false);
      setPassword('');
      setConfirmPassword('');
      
      // 데이터 다시 로드
      const myPageData = await memberService.getMyPageInfo(memberNo);
      setUserName(myPageData.memberName || '');
      setEmail(myPageData.memberEmail || '');
      setPhone(myPageData.memberPhone || '');
      setLocation(myPageData.memberAddress || '');
      setStudio(myPageData.agencyName || '');
      setMemberRole(myPageData.memberRole || '');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      toast.error('프로필 수정에 실패했습니다.');
    }
  };

  const handleLogout = () => {
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

  const handleCopyCode = (code) => {
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

  const fallbackCopyCode = (code) => {
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-8 overflow-auto">
        <div className="text-center">
          <p className="text-[#6E8FB3]">로딩 중...</p>
        </div>
      </div>
    );
  }

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
                  onClick={() => setIsImageSelectModalOpen(true)}
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
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#DADDE1] text-[#1F2328] rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  문의하기
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

            {/* Center: Name, Role, and Employee Stats */}
            <div className="flex-1 pt-20">
              <h1 className="text-3xl font-bold text-[#1F2328] mb-2">{userName}</h1>
              <p className="text-[#6E8FB3] text-base mb-8">{memberRole || '에이전시 관리자'}</p>

              {/* Employee Stats - 에이전시 관리자인 경우에만 표시 */}
              {memberRole === '에이전시 관리자' && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-[#6366F1] rounded-full"></div>
                      <h3 className="text-lg font-semibold text-[#1F2328]">직원 인원수</h3>
                    </div>
                  </div>
                  
                  {employeeData.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[#6E8FB3]">등록된 직원이 없습니다.</p>
                    </div>
                  ) : (
                    /* Pie Chart and Legend */
                    <div className="flex flex-col items-center gap-4">
                      {/* Pie Chart */}
                      <div className="w-40 h-40 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={employeeData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={60}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {employeeData.map((entry, index) => {
                                console.log('🎨 Cell 색상:', { index, name: entry.name, color: entry.color });
                                return (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color || '#6E8FB3'}
                                    stroke={entry.color || '#6E8FB3'}
                                    strokeWidth={1}
                                  />
                                );
                              })}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-2xl font-bold text-[#1F2328]">{totalEmployees}</p>
                          <p className="text-xs text-[#6E8FB3]">명</p>
                        </div>
                      </div>

                      {/* Legend - Horizontal */}
                      <div className="flex items-center justify-center gap-6 flex-wrap">
                        {employeeData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-xs text-[#6E8FB3]">{item.name}</span>
                            <span className="text-xs font-semibold text-[#1F2328]">{item.value}명</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                <Label htmlFor="edit-location" className="text-sm text-[#1F2328]">위치(주소)</Label>
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
                <Label htmlFor="edit-password" className="text-sm text-[#1F2328]">비밀번호 변경</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="변경할 비밀번호 (변경하지 않으려면 비워두세요)"
                  className="bg-white border-[#DADDE1] text-[#1F2328]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-confirm-password" className="text-sm text-[#1F2328]">비밀번호 확인</Label>
                <Input
                  id="edit-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 확인"
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
                <p className="text-xs text-[#DC2626]">
                  ⚠️ 진행 중인 프로젝트와 모든 기록이 영구적으로 삭제됩니다.
                </p>
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
                onClick={() => {
                  setIsImageSelectModalOpen(false);
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !memberNo) return;
                    
                    try {
                      const imageBaseUrl = API_BASE_URL || 'http://localhost:8888';
                      const fileName = await memberService.uploadBackgroundImage(memberNo, file);
                      setBackgroundImage(`${imageBaseUrl}/uploads/${fileName}`);
                      toast.success('배경 이미지가 변경되었습니다.');
                    } catch (error) {
                      console.error('이미지 업로드 실패:', error);
                      toast.error('이미지 업로드에 실패했습니다.');
                    }
                  };
                  input.click();
                }}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-[#DADDE1] rounded-xl hover:border-[#6E8FB3] hover:bg-[#6E8FB3]/5 transition-all group"
              >
                <div className="w-16 h-16 bg-[#3F4A5A] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <span className="text-sm font-medium text-[#1F2328]">배경 이미지</span>
              </button>
              
              <button
                onClick={() => {
                  setIsImageSelectModalOpen(false);
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !memberNo) return;
                    
                    try {
                      const imageBaseUrl = API_BASE_URL || 'http://localhost:8888';
                      const fileName = await memberService.uploadProfileImage(memberNo, file);
                      setProfileImage(`${imageBaseUrl}/uploads/${fileName}`);
                      toast.success('프로필 사진이 변경되었습니다.');
                      window.dispatchEvent(new CustomEvent('profile-image-updated'));
                    } catch (error) {
                      console.error('이미지 업로드 실패:', error);
                      toast.error('이미지 업로드에 실패했습니다.');
                    }
                  };
                  input.click();
                }}
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

        {/* Inquiry Modal */}
        <InquiryModal 
          open={isInquiryModalOpen} 
          onOpenChange={setIsInquiryModalOpen} 
        />
      </motion.div>
    </div>
  );
}
