import styled from 'styled-components';

// 전체 페이지 래퍼 (오버레이 모달)
export const MyPageOverlay = styled.div`
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
export const MyPageContainer = styled.div`
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
  background: transparent;
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
`;

// 왼쪽: 프로필 사진 및 액션 버튼
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
  background: transparent;
  padding: 0;
  outline: none;
  transition: all 0.2s;

  &:focus {
    outline: 4px solid #F97316;
    outline-offset: 2px;
  }
`;

export const ProfilePhotoContainer = styled.div`
  width: 128px;
  height: 128px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
    } else if (props.variant === 'danger') {
      return `
        border-color: #DC2626;
        color: #DC2626;
        background-color: transparent;
        &:hover {
          background-color: rgba(220, 38, 38, 0.05);
        }
      `;
    } else {
      return `
        border-color: #DADDE1;
        color: #1F2328;
        background-color: transparent;
        &:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
      `;
    }
  }}
`;

// 중앙: 이름, 역할, 통계
export const ProfileCenter = styled.div`
  flex: 1;
  padding-top: 80px;
`;

export const ProfileName = styled.h1`
  font-size: 30px;
  font-weight: bold;
  color: #1F2328;
  margin: 0 0 8px 0;
`;

export const ProfileRole = styled.p`
  color: #6E8FB3;
  font-size: 16px;
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

// 오른쪽: 기본 정보
export const ProfileRight = styled.div`
  flex-shrink: 0;
  width: 320px;
  padding-top: 80px;
`;

export const BasicInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const BasicInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

export const BasicInfoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1F2328;
  margin: 0;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const InfoIcon = styled.div`
  margin-top: 2px;
  color: #6E8FB3;
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  flex: 1;
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
