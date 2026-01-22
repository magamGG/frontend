import styled from 'styled-components';

// 전체 오버레이 (모달 배경)
export const AgencyMyPageOverlay = styled.div`
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

// 메인 컨테이너 (데스크탑 레이아웃 기준)
export const AgencyMyPageContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

// 헤더 배경
export const HeaderBackground = styled.div`
  height: 128px;
  background-color: var(--primary);
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  padding: 8px 16px;
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

// 메인 콘텐츠
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

// 프로필 왼쪽 (사진 및 액션 버튼)
export const ProfileLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
`;

export const ProfilePhotoContainer = styled.div`
  position: relative;
  width: 128px;
  height: 128px;
`;

export const ProfilePhotoWrapper = styled.div`
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
`;

export const CameraButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background-color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-foreground);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

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
  font-size: 2rem;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const ProfileRole = styled.p`
  font-size: 1rem;
  color: var(--accent);
  margin: 0 0 32px 0;
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

export const BasicInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const BasicInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const BasicInfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const InfoIcon = styled.div`
  margin-top: 2px;
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoLabel = styled.p`
  font-size: 0.75rem;
  color: var(--accent);
  margin: 0 0 4px 0;
`;

export const InfoValue = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
`;

export const CompanyCodeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

export const CompanyCodeButton = styled.button`
  padding: 4px 12px;
  background-color: var(--status-workation);
  color: white;
  font-size: 0.75rem;
  border-radius: 9999px;
  transition: all 0.2s;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
