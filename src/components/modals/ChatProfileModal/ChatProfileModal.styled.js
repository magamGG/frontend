import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15000;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

export const Content = styled.div`
  padding: 24px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: #6b7280;
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: #ef4444;
`;

export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

export const ProfileImageContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

export const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e5e7eb;
`;

export const DefaultProfileLarge = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: 600;
  border: 3px solid #e5e7eb;
`;

export const ProfileName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  text-align: center;
`;

export const ProfileRole = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  text-align: center;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
`;

export const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  flex-shrink: 0;
`;

export const InfoText = styled.span`
  font-size: 14px;
  color: #374151;
  flex: 1;
`;
export const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProjectLabel = styled.span`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

export const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const ProjectTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #bfdbfe;
  transition: all 0.2s;

  &:hover {
    background: #bfdbfe;
    transform: translateY(-1px);
  }
`;