import { BookOpen, Calendar } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { getProjectThumbnailUrl, PROJECT_THUMBNAIL_PLACEHOLDER } from '@/api/config';
import { getProjectStatusBadgeClass } from '@/constants/projectSerialStatus';
import {
  Card,
  CardContent,
  ThumbnailWrap,
  Info,
  InfoHeader,
  Title,
  Genre,
  Meta,
  MetaGroup,
  MetaItem,
  MetaDivider,
  StatusWrap,
  DeadlineText,
} from './ProjectSerialCard.styled';

/**
 * 담당자/에이전시 카드와 동일 스타일: 프로젝트명, 작가, 플랫폼, N일 연재, 마감.
 * Agency 목록과 Artist "다음 연재 프로젝트"에서 재사용.
 */
export function ProjectSerialCard({
  title,
  artistName = '',
  managerName,
  platform = '미정',
  schedule = '미정',
  deadline = '미정',
  genre = '',
  serialStatus = '연재',
  thumbnail = null,
  showThumbnail = true,
  onClick,
}) {
  const scheduleDisplay =
    schedule && typeof schedule === 'string' && schedule.endsWith('일')
      ? schedule
      : schedule && !isNaN(Number(schedule))
        ? `${schedule}일`
        : schedule || '미정';

  return (
    <Card $onClick={!!onClick} onClick={onClick}>
      <CardContent>
        {showThumbnail && (
          <ThumbnailWrap>
            <ImageWithFallback
              src={getProjectThumbnailUrl(thumbnail) || PROJECT_THUMBNAIL_PLACEHOLDER}
              alt={title}
              className="w-24 h-32 object-cover rounded-md border-2 border-border"
            />
          </ThumbnailWrap>
        )}
        <Info>
          <InfoHeader>
            <Title>{title}</Title>
            {artistName && (
              <Badge variant="outline" className="text-xs">
                {artistName}
              </Badge>
            )}
            {managerName != null && managerName !== '' && (
              <Badge variant="outline" className="text-xs bg-primary/10">
                {managerName}
              </Badge>
            )}
          </InfoHeader>
          {genre != null && genre !== '' && <Genre>{genre}</Genre>}
          <Meta>
            <MetaItem>
              <BookOpen className="w-3 h-3" />
              <span>{platform}</span>
            </MetaItem>
            <MetaGroup>
              <MetaDivider>•</MetaDivider>
              <MetaItem>
                <Calendar className="w-3 h-3" />
                <span>{scheduleDisplay}</span>
              </MetaItem>
            </MetaGroup>
          </Meta>
        </Info>
        <StatusWrap>
          <Badge className={`${getProjectStatusBadgeClass(serialStatus)} text-white text-xs`}>
            {serialStatus}
          </Badge>
          <DeadlineText>마감: {deadline}</DeadlineText>
        </StatusWrap>
      </CardContent>
    </Card>
  );
}
