import styled from 'styled-components';

// LoginPage와 유사한 구조 재사용
export const SignupRoot = styled.div`
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

export const SignupContainer = styled.div`
  width: 100%;
  max-width: 1024px;
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
  margin-bottom: 16px;
`;

export const LogoIconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: var(--primary);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin-bottom: 12px;
`;

export const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const SubTitle = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const SignupCard = styled.div`
  padding: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  background-color: var(--card);
`;

export const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InputLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 8px 12px 8px 40px;
  font-size: 14px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--foreground);
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

export const RoleSelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const RoleButton = styled.button`
  position: relative;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid ${props => props.$isSelected ? 'var(--primary)' : 'var(--border)'};
  background-color: ${props => props.$isSelected ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)'};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.$isSelected ? 'var(--primary)' : 'color-mix(in srgb, var(--primary) 50%, transparent)'};
    background-color: ${props => props.$isSelected ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'color-mix(in srgb, var(--primary) 5%, transparent)'};
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Divider = styled.div`
  border-top: 1px solid var(--border);
`;

export const Footer = styled.p`
  text-align: center;
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 16px;
`;
