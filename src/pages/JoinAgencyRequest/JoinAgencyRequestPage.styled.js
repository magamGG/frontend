import styled from 'styled-components';

export const JoinAgencyRequestRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow-y: auto;
  padding: 32px;
`;

export const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.05;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 35px,
      currentColor 35px,
      currentColor 36px
    );
  }
`;

export const JoinAgencyRequestContainer = styled.div`
  width: 100%;
  max-width: 768px;
  padding: 0 24px;
  position: relative;
  z-index: 10;
`;

export const BackButton = styled.button`
  position: fixed;
  top: 32px;
  left: 32px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary);
  }
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const LogoIconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: var(--primary);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin-bottom: 24px;
`;

export const MainTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 8px 0;
`;

export const SubTitle = styled.p`
  color: var(--muted-foreground);
  margin: 0;
`;

export const RequestCard = styled.div`
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  background-color: var(--card);
`;

export const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InfoBox = styled.div`
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

export const InfoLabel = styled.span`
  color: var(--muted-foreground);
`;

export const InfoValue = styled.span`
  font-weight: 500;
  color: var(--foreground);
`;

export const Divider = styled.div`
  border-top: 1px solid var(--border);
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--foreground);
  font-size: 14px;
  font-family: ${props => props.$mono ? 'monospace' : 'inherit'};
  letter-spacing: ${props => props.$mono ? '0.05em' : 'normal'};
  transition: all 0.2s;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: var(--primary);
    border-color: transparent;
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const InfoAlert = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: #dbeafe;
  border: 1px solid #93c5fd;
  border-radius: 8px;
`;

export const SuccessCard = styled.div`
  padding: 32px;
  text-align: center;
`;

export const SuccessIconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: #dcfce7;
  border-radius: 50%;
  margin-bottom: 24px;
  
  & > div {
    width: 48px;
    height: 48px;
    color: #16a34a;
  }
`;

export const SuccessTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

export const SuccessDescription = styled.p`
  color: var(--muted-foreground);
  margin: 0 0 24px 0;
`;

export const SuccessInfoBox = styled.div`
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
  font-size: 14px;
`;
