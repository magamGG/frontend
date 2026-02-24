import { Badge } from '@/app/components/ui/badge';
import { getProjectStatusBadgeClass } from '@/constants/projectSerialStatus';

/**
 * 프로젝트 연재 상태 배지 (연재/휴재/완결)
 * Admin / Agency / Artist 프로젝트 목록 등에서 공통 사용
 */
export function ProjectStatusBadge({ status, className = '', children, ...rest }) {
  const badgeClass = getProjectStatusBadgeClass(status);
  return (
    <Badge className={`${badgeClass} text-white border-none ${className}`.trim()} {...rest}>
      {children ?? status}
    </Badge>
  );
}
