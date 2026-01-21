import styled from 'styled-components';

// 전체 페이지 루트 래퍼 (1920px 데스크탑 기준)
export const AbsenteeManagementRoot = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 32px 32px 96px;
  background-color: var(--background);
`;

// 중앙 정렬 및 최대 폭 설정 (데스크탑 레이아웃 기준)
export const AbsenteeManagementBody = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 개요 통계 그리드 (데스크탑: 4열)
export const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  flex-shrink: 0;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// 요청 버튼 영역
export const RequestButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// 현재 휴재 카드
export const CurrentAbsencesCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  flex: 1;
  overflow: hidden;
`;

export const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 12px 0;
`;

// 휴재 목록
export const AbsenceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 휴재 아이템 카드
export const AbsenceItem = styled.div`
  padding: 12px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: color-mix(in srgb, var(--muted) 50%, transparent);
  }
`;

export const AbsenceItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const AbsenceItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AvatarContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AvatarText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: var(--primary-foreground);
`;

export const AbsenceItemInfo = styled.div`
  flex: 1;
`;

export const AbsenceItemName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 2px 0;
`;

export const AbsenceItemRole = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 정보 그리드
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 8px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoLabel = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0 0 2px 0;
`;

export const InfoValue = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
`;

// 담당 작품 섹션
export const ProjectsSection = styled.div`
  margin-bottom: 8px;
`;

// 액션 버튼 그룹
export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

// 예정된 일정 카드
export const UpcomingScheduleCard = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  border: 1px solid var(--border);
  flex-shrink: 0;
`;

export const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ScheduleItem = styled.div`
  padding: 12px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

export const ScheduleItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ScheduleItemLeft = styled.div`
  flex: 1;
`;

export const ScheduleItemName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin: 0 0 2px 0;
`;

export const ScheduleItemDate = styled.p`
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 0;
`;

// 모달 폼 스타일
export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--background);
  color: var(--foreground);
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--background);
  color: var(--foreground);
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  background-color: var(--background);
  color: var(--foreground);
  resize: none;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }

  &::placeholder {
    color: var(--muted-foreground);
  }
`;

export const FormLabelWithIcon = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
`;

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
`;

// 상세 정보 모달 스타일
export const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DetailCard = styled.div`
  padding: 16px;
  background-color: color-mix(in srgb, var(--muted) 30%, transparent);
  border-radius: 8px;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const DetailAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const DetailAvatarText = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-foreground);
`;

export const DetailInfo = styled.div`
  flex: 1;
`;

export const DetailName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: var(--foreground);
  margin: 0 0 4px 0;
`;

export const DetailRole = styled.p`
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
`;

export const DetailInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
`;

export const DetailInfoItem = styled.div`
  display: flex;
  align-items: ${props => props.alignStart ? 'flex-start' : 'center'};
  justify-content: space-between;
`;

export const DetailInfoLabel = styled.span`
  color: var(--muted-foreground);
`;

export const DetailInfoValue = styled.span`
  font-weight: 500;
  color: var(--foreground);
  ${props => props.textRight && 'text-align: right;'}
`;

export const DetailDescription = styled.div`
  padding-top: 8px;
  border-top: 1px solid var(--border);
`;

export const DetailActions = styled.div`
  display: flex;
  gap: 8px;
`;
