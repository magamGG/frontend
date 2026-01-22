import styled from 'styled-components';

export const LeaveSettingsRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
`;

export const LeaveSettingsBody = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1f2328;
  margin-bottom: 8px;
`;

export const PageDescription = styled.p`
  font-size: 14px;
  color: #6e8fb3;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: #6e8fb3;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  margin-bottom: -1px;

  ${({ $isActive }) =>
    $isActive
      ? `
    color: #1f2328;
    border-bottom-color: #3b82f6;
    font-weight: 600;
  `
      : `
    &:hover {
      color: #1f2328;
    }
  `}
`;

export const TabContent = styled.div`
  margin-top: 24px;
`;

export const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dadde1;
  padding: 0 12px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #6e8fb3;
    box-shadow: 0 0 0 3px rgba(110, 143, 179, 0.1);
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  color: #9ca3af;
  margin-right: 8px;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 0;
  font-size: 14px;
  color: #1f2328;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const EmployeeListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmployeeCard = styled.div`
  padding: 20px;
  background: white;
  border: 1px solid #dadde1;
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #6e8fb3;
  }
`;

export const EmployeeCardContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

export const EmployeeAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const EmployeeInfo = styled.div`
  flex: 1;
`;

export const EmployeeNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const EmployeeName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
`;

export const EmployeeEmail = styled.p`
  font-size: 12px;
  color: #6e8fb3;
  margin-top: 4px;
  margin-bottom: 0;
`;

export const EmployeeRole = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #e0e7ff;
  color: #6366f1;
  font-weight: 500;
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  background: white;
  color: #2563eb;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eff6ff;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const EditButtonIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 4px;
`;

export const LeaveStats = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
`;

export const LeaveStatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const LeaveStatLabel = styled.span`
  font-size: 12px;
  color: #6e8fb3;
`;

export const LeaveStatValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1f2328;
`;

export const LeaveStatValueOrange = styled(LeaveStatValue)`
  color: #ea580c;
`;

export const LeaveStatValueGreen = styled(LeaveStatValue)`
  color: #16a34a;
  font-weight: 700;
`;

export const EmptyStateCard = styled.div`
  padding: 32px;
  background: white;
  border: 1px solid #dadde1;
  border-radius: 12px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.5;

  svg {
    width: 48px;
    height: 48px;
    margin: 0 auto;
  }
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  color: #6e8fb3;
  text-align: center;
`;

export const StyledDialogContent = styled.div`
  max-width: 500px;
  background: white;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 0;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
  display: block;
`;

export const FormLabelRequired = styled.span`
  color: #ef4444;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  background: white;
  border: 1px solid #dadde1;
  border-radius: 6px;
  color: #1f2328;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6e8fb3;
    box-shadow: 0 0 0 3px rgba(110, 143, 179, 0.1);
  }
`;

export const FormHelperText = styled.p`
  font-size: 12px;
  color: #6e8fb3;
`;

export const RemainingLeaveBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
`;

export const RemainingLeaveHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const RemainingLeaveIcon = styled.div`
  display: flex;
  align-items: center;
  color: #2563eb;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const RemainingLeaveLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1e40af;
`;

export const RemainingLeaveValue = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
  margin: 0;
`;

export const ErrorBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 2px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ErrorText = styled.p`
  font-size: 14px;
  color: #dc2626;
  margin: 0;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #dadde1;

  button {
    flex: 1;
  }
`;

export const PolicySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PolicyCard = styled.div`
  background: white;
  border: 1px solid #dadde1;
  border-radius: 12px;
  padding: 24px;
`;

export const PolicyCardHeader = styled.div`
  margin-bottom: 24px;
`;

export const PolicyCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2328;
  margin-bottom: 8px;
`;

export const PolicyCardDescription = styled.p`
  font-size: 14px;
  color: #6e8fb3;
  margin: 0;
`;

export const PolicyFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
`;

export const RolePolicyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RolePolicyLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
`;

export const RolePolicyInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  background: white;
  border: 1px solid #dadde1;
  border-radius: 6px;
  color: #1f2328;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6e8fb3;
    box-shadow: 0 0 0 3px rgba(110, 143, 179, 0.1);
  }
`;

export const PolicyStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const PolicyStatCard = styled.div`
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const PolicyStatLabel = styled.div`
  font-size: 12px;
  color: #6e8fb3;
  margin-bottom: 8px;
`;

export const PolicyStatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1f2328;
`;

export const ApplyPolicyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:active {
    transform: scale(0.98);
  }
`;
