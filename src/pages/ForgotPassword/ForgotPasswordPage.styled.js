import styled from 'styled-components';

export const ForgotPasswordRoot = styled.div`
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

export const ForgotPasswordContainer = styled.div`
  width: 100%;
  max-width: 480px;
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

export const LogoTitleSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const LogoIconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: transparent;
  border-radius: 16px;
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

export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
`;

export const StepCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  background-color: ${props => props.$isActive ? 'var(--primary)' : props.$isCompleted ? 'color-mix(in srgb, var(--primary) 20%, transparent)' : 'var(--muted)'};
  color: ${props => props.$isActive ? 'var(--primary-foreground)' : props.$isCompleted ? 'var(--primary)' : 'var(--muted-foreground)'};
`;

export const StepLine = styled.div`
  width: 48px;
  height: 2px;
  transition: all 0.2s;
  background-color: ${props => props.$isCompleted ? 'var(--primary)' : 'var(--muted)'};
`;

export const ForgotPasswordCard = styled.div`
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

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-left: ${props => props.$hasIcon ? '44px' : '16px'};
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--foreground);
  font-size: ${props => props.$large ? '24px' : '14px'};
  text-align: ${props => props.$center ? 'center' : 'left'};
  letter-spacing: ${props => props.$large ? '0.1em' : 'normal'};
  font-family: ${props => props.$large ? 'monospace' : 'inherit'};
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

export const VerificationCodeInput = styled(InputField)`
  padding-left: 16px;
`;

export const SuccessSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
`;

export const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: color-mix(in srgb, #22c55e 20%, transparent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  
  & > div {
    width: 64px;
    height: 64px;
    background-color: #22c55e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
