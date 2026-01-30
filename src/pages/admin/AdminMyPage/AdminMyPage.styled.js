import styled from 'styled-components';
import { motion } from 'framer-motion';

// 전체 페이지 래퍼 (오버레이 모달)
export const AdminMyPageOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  overflow: auto;
`;

// 메인 컨테이너 (데스크탑 기준)
export const AdminMyPageContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

// 헤더 배경 영역
export const HeaderBackground = styled.div`
  height: 128px;
  background-color: #3F4A5A;
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'none'};
`;

// 뒤로가기 버튼
export const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

// 메인 콘텐츠 영역
export const MainContent = styled.div`
  position: relative;
  padding: 48px;
  padding-bottom: 48px;
`;

// 프로필 섹션 (가로 레이아웃)
export const ProfileSection = styled.div`
  display: flex;
  gap: 32px;
  margin-top: -64px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
`;

// 프로필 왼쪽 (사진 및 버튼)
export const ProfileLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
`;

// 프로필 사진 버튼
export const ProfilePhotoButton = styled.button`
  position: relative;
  width: 128px;
  height: 128px;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  border-radius: 50%;
  transition: all 0.2s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.3);
  }
`;

export const ProfilePhotoContainer = styled.div`
  width: 128px;
  height: 128px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  overflow: hidden;
  transition: all 0.2s;

  ${ProfilePhotoButton}:hover & {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    width: 64px;
    height: 64px;
    color: #9CA3AF;
  }
`;

export const ProfilePhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  ${ProfilePhotoButton}:hover & {
    opacity: 1;
  }
`;

export const CameraIconContainer = styled.div`
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  svg {
    width: 24px;
    height: 24px;
    color: #3F4A5A;
  }
`;

// 액션 버튼 그룹
export const ActionButtonsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 208px;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid;
  cursor: pointer;

  ${props => {
    if (props.variant === 'primary') {
      return `
        border-color: #F97316;
        color: #F97316;
        background-color: transparent;
        
        &:hover {
          background-color: rgba(249, 115, 22, 0.05);
        }
      `;
    }
    if (props.variant === 'danger') {
      return `
        border-color: #DC2626;
        color: #DC2626;
        background-color: transparent;
        
        &:hover {
          background-color: rgba(220, 38, 38, 0.05);
        }
      `;
    }
    return `
      border-color: #DADDE1;
      color: #1F2328;
      background-color: transparent;
      
      &:hover {
        background-color: #F9FAFB;
      }
    `;
  }}
`;

// 프로필 중앙 (이름 및 역할)
export const ProfileCenter = styled.div`
  flex: 1;
  padding-top: 80px;

  @media (max-width: 1024px) {
    padding-top: 0;
    text-align: center;
  }
`;

export const ProfileName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1F2328;
  margin: 0 0 8px 0;
`;

export const ProfileRole = styled.p`
  font-size: 16px;
  color: #6E8FB3;
  margin: 0 0 32px 0;
`;

// 근태 통계 섹션
export const AttendanceStatsSection = styled.div`
  margin-bottom: 32px;
`;

export const AttendanceStatsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const AttendanceStatsTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TitleIndicator = styled.div`
  width: 4px;
  height: 20px;
  background-color: #6366F1;
  border-radius: 2px;
`;

export const AttendanceStatsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1F2328;
  margin: 0;
`;

export const AttendanceStatsMonth = styled.p`
  font-size: 14px;
  color: #6E8FB3;
  margin: 0;
`;

// 파이 차트 및 범례 컨테이너
export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const PieChartWrapper = styled.div`
  width: 160px;
  height: 160px;
  position: relative;
`;

export const ChartCenterText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const ChartCenterValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #1F2328;
  margin: 0;
`;

export const ChartCenterLabel = styled.p`
  font-size: 12px;
  color: #6E8FB3;
  margin: 0;
`;

// 범례 (가로)
export const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$color};
`;

export const LegendText = styled.span`
  font-size: 12px;
  color: #6E8FB3;
`;

export const LegendValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #1F2328;
`;

// 프로필 오른쪽 (기본 정보)
export const ProfileRight = styled.div`
  flex-shrink: 0;
  width: 320px;
  padding-top: 80px;

  @media (max-width: 1024px) {
    width: 100%;
    padding-top: 0;
  }
`;

// 기본 정보 섹션
export const BasicInfoSection = styled.div`
  width: 100%;
`;

export const BasicInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  
  svg {
    width: 20px;
    height: 20px;
    color: #6366F1;
  }
`;

export const BasicInfoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1F2328;
  margin: 0;
`;

// 정보 아이템
export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const InfoIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  color: #6E8FB3;
`;

export const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const InfoLabel = styled.p`
  font-size: 12px;
  color: #6E8FB3;
  margin: 0 0 4px 0;
`;

export const InfoValue = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #1F2328;
  margin: 0;
`;

// 모달 폼
export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  color: #1F2328;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #DADDE1;
  border-radius: 8px;
  font-size: 14px;
  color: #1F2328;
  background-color: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6E8FB3;
    box-shadow: 0 0 0 2px rgba(110, 143, 179, 0.1);
  }

  &:disabled {
    background-color: #F3F4F6;
    cursor: not-allowed;
    color: #6E8FB3;
  }
`;

export const FormHelperText = styled.p`
  font-size: 12px;
  color: #6E8FB3;
  margin-top: 4px;
  margin-bottom: 0;
`;

export const BasicInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DeleteModalContent = styled.div`
  padding: 16px 0;
`;

export const DeleteModalText = styled.p`
  font-size: 14px;
  color: #1F2328;
  margin-bottom: 16px;
`;

export const DeleteWarningBox = styled.div`
  background-color: #FEF2F2;
  border: 1px solid #FCA5A5;
  border-radius: 8px;
  padding: 12px;
`;

export const DeleteWarningText = styled.p`
  font-size: 12px;
  color: #DC2626;
  margin: 0;
`;

export const MotionWrapper = styled(motion.div)`
  width: 100%;
  max-width: 1280px;
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #DADDE1;
  border-radius: 8px;
  font-size: 14px;
  color: #1F2328;
  background-color: white;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6E8FB3;
    box-shadow: 0 0 0 2px rgba(110, 143, 179, 0.1);
  }
`;

// 모달 액션 버튼
export const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #DADDE1;
`;

// 이미지 선택 그리드
export const ImageSelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 24px 0;
`;

export const ImageSelectButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  border: 2px solid #DADDE1;
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #6E8FB3;
    background-color: rgba(110, 143, 179, 0.05);
  }
`;

export const ImageSelectIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  background-color: ${props => props.$bgColor || '#3F4A5A'};
  border-radius: ${props => props.$rounded ? '50%' : '0'};

  ${ImageSelectButton}:hover & {
    transform: scale(1.1);
  }
  
  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

export const ImageSelectLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1F2328;
`;
