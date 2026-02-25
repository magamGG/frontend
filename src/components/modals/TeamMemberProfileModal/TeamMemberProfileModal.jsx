import { Modal } from '@/components/common/Modal';
import { Badge } from '@/app/components/ui/badge';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { MEMBER_AVATAR_PLACEHOLDER } from '@/api/config';
import { Briefcase, Mail, Phone } from 'lucide-react';

/**
 * 프로젝트 상세(ProjectDetail / AgencyProjectDetail)와 동일한 상태 표시·배지 색상
 * - 작업중/출근: 초록, 작업 종료: 파랑, 작업 시작 전: amber, 휴면: 회색, 워케이션: 빨강, 재택/휴가/병가/근무중: 파랑
 */
function getDisplayStatus(dbStatus) {
  if (dbStatus == null || String(dbStatus).trim() === '') return '작업 시작 전';
  const s = String(dbStatus).toUpperCase();
  if (s === 'ACTIVE') return '근무중';
  if (s === 'WORKCATION' || s === '워케이션') return '워케이션';
  if (s === 'REMOTE_WORK' || s === '재택근무') return '재택근무';
  if (s === 'ON_LEAVE' || s === '휴가') return '휴가';
  if (s === 'SICK_LEAVE' || s === '병가') return '병가';
  if (s === 'DORMANT' || s === '휴면') return '휴면';
  if (s === '작업중' || s === '출근' || s === '근무중') return dbStatus;
  if (s === '작업 종료' || s === '작업 시작 전') return dbStatus;
  return dbStatus;
}

function getStatusBadgeColor(status) {
  const display = getDisplayStatus(status);
  switch (display) {
    case '작업중':
    case '출근':
      return 'bg-green-500 hover:bg-green-600';
    case '작업 종료':
      return 'bg-blue-500 hover:bg-blue-600';
    case '작업 시작 전':
      return 'bg-amber-500 hover:bg-amber-600';
    case '휴면':
      return 'bg-gray-500 hover:bg-gray-600';
    case '워케이션':
      return 'bg-red-500 hover:bg-red-600';
    case '재택근무':
    case '휴가':
    case '병가':
    case '근무중':
      return 'bg-blue-500 hover:bg-blue-600';
    default:
      return 'bg-blue-500 hover:bg-blue-600';
  }
}

/**
 * 팀원 프로필 상세 모달
 * @param {Object} props
 * @param {Object | null} props.member - 선택된 팀원 { name, status, memberRole?, role?, email, phone, avatar? }
 * @param {() => void} props.onClose - 모달 닫기 콜백
 */
export function TeamMemberProfileModal({ member, onClose }) {
  const isOpen = member !== null;

  if (!member) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="팀원 프로필"
      maxWidth="md"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <ImageWithFallback
            src={member.avatar || MEMBER_AVATAR_PLACEHOLDER}
            alt={member.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-2">{member.name}</h3>
            <Badge className={getStatusBadgeColor(member.status)}>
              {getDisplayStatus(member.status)}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">직무</p>
              <p className="text-sm font-medium text-foreground">
                {member.memberRole || member.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">이메일</p>
              <p className="text-sm font-medium text-foreground">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">전화번호</p>
              <p className="text-sm font-medium text-foreground">{member.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
