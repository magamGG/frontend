import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Calendar, CheckCircle2, Circle } from 'lucide-react';
import {
  ArtistWorkationRoot,
  ArtistWorkationBody,
  ArtistWorkationHeader,
  ArtistWorkationTitle,
  ArtistWorkationDescription,
  ArtistWorkationMainGrid,
  CurrentWorkationCard,
  CurrentWorkationTitle,
  CurrentWorkationContent,
  CurrentWorkationHeader,
  CurrentWorkationInfo,
  CurrentWorkationName,
  CurrentWorkationMeta,
  CurrentWorkationMetaItem,
  WorkationStatsGrid,
  WorkationStatCard,
  WorkationStatLabel,
  WorkationStatValue,
  WorkationStatValuePrimary,
  CurrentWorkationActions,
  AccommodationCard,
  AccommodationTitle,
  AccommodationInfoList,
  AccommodationInfoItem,
  AccommodationInfoLabel,
  AccommodationInfoValue,
  TasksCard,
  TasksTitle,
  TasksList,
  TaskItem,
  TaskIcon,
  TaskContent,
  TaskHeader,
  TaskTitle,
  TaskDescription,
  TaskDate,
} from './ArtistWorkationPage.styled';

// TODO: Zustand store mapping - 진행 중인 워케이션 데이터
const currentWorkation = {
  name: '제주도 워케이션',
  location: '제주특별자치도 서귀포시',
  startDate: '2026.01.20',
  endDate: '2026.01.27',
  elapsedDays: 2,
  remainingDays: 5,
  completedTasks: 3,
  status: '진행중',
};

// TODO: Zustand store mapping - 숙소 정보
const accommodationInfo = {
  name: '중문 리조트',
  address: '제주특별자치도 서귀포시 중문동 123-45',
  room: '303호',
  phone: '064-123-4567',
};

// TODO: Zustand store mapping - 워케이션 기간 할 일 목록
const workationTasks = [
  {
    id: 1,
    title: '신작 캐릭터 디자인 초안',
    description: '주인공 및 주요 캐릭터 3명 디자인 완료',
    deadline: '2026.01.21',
    completedDate: '2026.01.21',
    status: 'completed',
  },
  {
    id: 2,
    title: '스토리 개요 작성',
    description: '전체 스토리 아크 및 주요 에피소드 정리',
    deadline: '2026.01.22',
    completedDate: '2026.01.22',
    status: 'completed',
  },
  {
    id: 3,
    title: '세계관 설정',
    description: '배경 설정, 세계관 상세 기획',
    deadline: '2026.01.24',
    status: 'inProgress',
  },
  {
    id: 4,
    title: '에피소드 1-3 스케치',
    description: '첫 3개 에피소드 러프 스케치',
    deadline: '2026.01.26',
    status: 'pending',
  },
  {
    id: 5,
    title: '레퍼런스 수집',
    description: '배경 및 소품 레퍼런스 정리',
    deadline: '2026.01.27',
    status: 'pending',
  },
];

export function ArtistWorkationPage() {
  return (
    <ArtistWorkationRoot>
      <ArtistWorkationBody>
        {/* Header */}
        <ArtistWorkationHeader>
          <ArtistWorkationTitle>워케이션</ArtistWorkationTitle>
          <ArtistWorkationDescription>새로운 환경에서 창의력을 발휘하고 재충전하세요</ArtistWorkationDescription>
        </ArtistWorkationHeader>

        {/* Current Workation */}
        <ArtistWorkationMainGrid>
          <CurrentWorkationCard>
            <CurrentWorkationTitle>진행 중인 워케이션</CurrentWorkationTitle>
            <CurrentWorkationContent>
              <CurrentWorkationHeader>
                <CurrentWorkationInfo>
                  <CurrentWorkationName>{currentWorkation.name}</CurrentWorkationName>
                  <CurrentWorkationMeta>
                    <CurrentWorkationMetaItem>
                      <MapPin className="w-4 h-4" />
                      <span>{currentWorkation.location}</span>
                    </CurrentWorkationMetaItem>
                    <CurrentWorkationMetaItem>
                      <Calendar className="w-4 h-4" />
                      <span>
                        {currentWorkation.startDate} - {currentWorkation.endDate}
                      </span>
                    </CurrentWorkationMetaItem>
                  </CurrentWorkationMeta>
                </CurrentWorkationInfo>
                <Badge className="bg-purple-600">{currentWorkation.status}</Badge>
              </CurrentWorkationHeader>

              <WorkationStatsGrid>
                <WorkationStatCard>
                  <WorkationStatLabel>경과 일수</WorkationStatLabel>
                  <WorkationStatValue>{currentWorkation.elapsedDays}일</WorkationStatValue>
                </WorkationStatCard>
                <WorkationStatCard>
                  <WorkationStatLabel>남은 일수</WorkationStatLabel>
                  <WorkationStatValue>{currentWorkation.remainingDays}일</WorkationStatValue>
                </WorkationStatCard>
                <WorkationStatCard>
                  <WorkationStatLabel>완료 작업</WorkationStatLabel>
                  <WorkationStatValuePrimary>{currentWorkation.completedTasks}개</WorkationStatValuePrimary>
                </WorkationStatCard>
              </WorkationStatsGrid>

              <CurrentWorkationActions>
                <Button variant="outline" size="sm" className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-100">
                  일정 수정
                </Button>
                <Button variant="destructive" size="sm" className="flex-1">
                  조기 종료
                </Button>
              </CurrentWorkationActions>
            </CurrentWorkationContent>
          </CurrentWorkationCard>

          <AccommodationCard>
            <AccommodationTitle>숙소 정보</AccommodationTitle>
            <AccommodationInfoList>
              <AccommodationInfoItem>
                <AccommodationInfoLabel>숙소명</AccommodationInfoLabel>
                <AccommodationInfoValue>{accommodationInfo.name}</AccommodationInfoValue>
              </AccommodationInfoItem>
              <AccommodationInfoItem>
                <AccommodationInfoLabel>주소</AccommodationInfoLabel>
                <AccommodationInfoValue>{accommodationInfo.address}</AccommodationInfoValue>
              </AccommodationInfoItem>
              <AccommodationInfoItem>
                <AccommodationInfoLabel>객실</AccommodationInfoLabel>
                <AccommodationInfoValue>{accommodationInfo.room}</AccommodationInfoValue>
              </AccommodationInfoItem>
              <AccommodationInfoItem>
                <AccommodationInfoLabel>연락처</AccommodationInfoLabel>
                <AccommodationInfoValue>{accommodationInfo.phone}</AccommodationInfoValue>
              </AccommodationInfoItem>
            </AccommodationInfoList>
          </AccommodationCard>
        </ArtistWorkationMainGrid>

        {/* Tasks During Workation */}
        <TasksCard>
          <TasksTitle>워케이션 기간 할 일</TasksTitle>
          <TasksList>
            {workationTasks.map((task) => (
              <TaskItem key={task.id} status={task.status}>
                <TaskIcon>
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-blue-600" />
                  )}
                </TaskIcon>
                <TaskContent>
                  <TaskHeader>
                    <TaskTitle completed={task.status === 'completed'}>{task.title}</TaskTitle>
                    {task.status === 'inProgress' && (
                      <Badge className="bg-blue-600 text-xs">진행중</Badge>
                    )}
                  </TaskHeader>
                  <TaskDescription>{task.description}</TaskDescription>
                  <TaskDate status={task.status}>
                    {task.status === 'completed'
                      ? `완료일: ${task.completedDate}`
                      : `마감: ${task.deadline}`}
                  </TaskDate>
                </TaskContent>
              </TaskItem>
            ))}
          </TasksList>
        </TasksCard>
      </ArtistWorkationBody>
    </ArtistWorkationRoot>
  );
}
