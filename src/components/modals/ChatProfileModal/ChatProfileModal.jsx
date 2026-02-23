import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Mail, Phone, MapPin, User, Briefcase, BookOpen, ChevronRight } from 'lucide-react';
import { getMemberProfileUrl } from '@/api/config';
import { memberService } from '@/api/services';
import * as S from './ChatProfileModal.styled';

export function ChatProfileModal({ isOpen, onClose, memberNo, memberInfo: initialMemberInfo }) {
  const [memberDetails, setMemberDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. useMemo를 이용한 데이터 병합: initialMemberInfo + memberDetails + MemberResponse(member)
  const mergedMemberInfo = useMemo(() => ({
    ...initialMemberInfo,
    ...memberDetails,
    ...(memberDetails?.member || {}), // MemberResponse의 memberEmail, memberPhone 등 상위로 펼침
  }), [initialMemberInfo, memberDetails]);

  useEffect(() => {
    if (isOpen && memberNo) {
      loadMemberDetails();
    } else if (!isOpen) {
      // 2. 메모리 누수 방지: 모달이 닫힐 때 상태 초기화
      setMemberDetails(null);
      setLoading(false);
    }
  }, [isOpen, memberNo]);

  const loadMemberDetails = async () => {
    setLoading(true);
    try {
      const response = await memberService.getMemberDetails(memberNo);
      setMemberDetails(response.data || response);
    } catch (error) {
      console.error('멤버 상세 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 3. 조건부 렌더링 최적화: useMemo로 정보 존재 여부 체크 최적화
  const infoFlags = useMemo(() => {
    const hasContactInfo = mergedMemberInfo.memberEmail || mergedMemberInfo.memberPhone;
    const hasWorkInfo = mergedMemberInfo.memberPosition || mergedMemberInfo.memberDepartment;
    const hasProjectInfo = memberDetails?.currentProjects?.length > 0;
    const hasAnyInfo = hasContactInfo || hasWorkInfo || hasProjectInfo;
    
    return { hasContactInfo, hasWorkInfo, hasProjectInfo, hasAnyInfo };
  }, [mergedMemberInfo, memberDetails]);

  const { hasContactInfo, hasWorkInfo, hasProjectInfo, hasAnyInfo } = infoFlags;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <S.ModalOverlay
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <S.ModalContainer
          as={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <S.Header>
            <S.Title>프로필</S.Title>
            <S.CloseButton onClick={onClose}>
              <X size={20} />
            </S.CloseButton>
          </S.Header>

          <S.Content>
            <S.ProfileSection>
              <S.ProfileImageContainer>
                {mergedMemberInfo.profileImage ? (
                  <S.ProfileImage
                    src={getMemberProfileUrl(mergedMemberInfo.profileImage)}
                    alt={mergedMemberInfo.memberName}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <S.DefaultProfileLarge
                  style={{
                    display: mergedMemberInfo.profileImage ? 'none' : 'flex'
                  }}
                >
                  {(mergedMemberInfo.memberName || '?')[0]?.toUpperCase()}
                </S.DefaultProfileLarge>
              </S.ProfileImageContainer>

              <S.ProfileName>
                {mergedMemberInfo.memberRole && (
                <S.ProfileRole>{mergedMemberInfo.memberRole}</S.ProfileRole>
                )}
                {mergedMemberInfo.memberName || '사용자'}</S.ProfileName>
             </S.ProfileSection>

            <S.InfoSection>
              {loading && (
                <S.InfoItem>
                  <S.InfoIcon>
                    <Briefcase size={16} />
                  </S.InfoIcon>
                  <S.InfoText>추가 정보 로딩 중...</S.InfoText>
                </S.InfoItem>
              )}

              {!loading && !hasAnyInfo && (
                <S.InfoItem>
                  <S.InfoIcon>
                    <User size={16} />
                  </S.InfoIcon>
                  <S.InfoText>등록된 정보가 없습니다</S.InfoText>
                </S.InfoItem>
              )}
                <S.InfoItem>
                  <S.InfoIcon>
                    <Mail size={16} />
                  </S.InfoIcon>
                  <S.InfoText>{mergedMemberInfo.memberEmail}</S.InfoText>  
                <S.InfoIcon>
                  <Phone size={16} />
                </S.InfoIcon>
                <S.InfoText>{mergedMemberInfo.memberPhone}</S.InfoText>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoIcon>
                    <BookOpen size={16} />
                  </S.InfoIcon>
                  <S.InfoText>포트폴리오</S.InfoText>
                  <ChevronRight size={18} style={{ color: '#9ca3af', flexShrink: 0 }} />
                </S.InfoItem>
            </S.InfoSection>
          </S.Content>
        </S.ModalContainer>
      </S.ModalOverlay>
    </AnimatePresence>
  );
}
