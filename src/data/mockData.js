/**
 * @typedef {import('../types/index.js').User} User
 * @typedef {import('../types/index.js').Project} Project
 * @typedef {import('../types/index.js').Task} Task
 * @typedef {import('../types/index.js').LeaveRequest} LeaveRequest
 * @typedef {import('../types/index.js').HealthData} HealthData
 * @typedef {import('../types/index.js').WorkSession} WorkSession
 * @typedef {import('../types/index.js').TeamMember} TeamMember
 * @typedef {import('../types/index.js').WorkcationMember} WorkcationMember
 */

/** @type {User} */
export const currentUser = {
  id: 'user-1',
  name: '김작가',
  role: 'writer',
  email: 'writer@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
};

/** @type {Project[]} */
export const mockProjects = [
  {
    id: 'proj-1',
    title: '별빛의 전설',
    thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=300&h=400&fit=crop',
    platform: 'naver',
    serializationDay: 'Every Tuesday',
    status: 'ongoing',
    episodeCount: 54,
    nextDeadline: '2026-01-15',
    teamMembers: [
      { userId: 'user-1', name: '김작가', role: 'story', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
      { userId: 'user-2', name: '이작가', role: 'line', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
      { userId: 'user-3', name: '박작가', role: 'coloring', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    ],
  },
  {
    id: 'proj-2',
    title: '도시의 수호자',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=400&fit=crop',
    platform: 'kakao',
    serializationDay: 'Every Friday',
    status: 'ongoing',
    episodeCount: 32,
    nextDeadline: '2026-01-17',
    teamMembers: [
      { userId: 'user-4', name: '최작가', role: 'story', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
      { userId: 'user-5', name: '정작가', role: 'line', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
    ],
  },
  {
    id: 'proj-3',
    title: '사랑의 메아리',
    thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop',
    platform: 'both',
    serializationDay: 'Every Sunday',
    status: 'hiatus',
    episodeCount: 23,
    teamMembers: [
      { userId: 'user-6', name: '강작가', role: 'story' },
      { userId: 'user-7', name: '조작가', role: 'line' },
    ],
  },
];

/** @type {Task[]} */
export const mockTasks = [
  {
    id: 'task-1',
    title: 'Chapter 55 Sketch',
    projectId: 'proj-1',
    projectName: '별빛의 전설',
    deadline: '2026-01-15',
    progress: 75,
    completed: false,
    priority: 'high',
  },
  {
    id: 'task-2',
    title: 'Background Touch-up',
    projectId: 'proj-1',
    projectName: '별빛의 전설',
    deadline: '2026-01-14',
    progress: 45,
    completed: false,
    priority: 'medium',
  },
  {
    id: 'task-3',
    title: 'Coloring Scene 12-18',
    projectId: 'proj-2',
    projectName: '도시의 수호자',
    deadline: '2026-01-16',
    progress: 90,
    completed: false,
    priority: 'high',
  },
  {
    id: 'task-4',
    title: 'Character Design Review',
    projectId: 'proj-2',
    projectName: '도시의 수호자',
    deadline: '2026-01-17',
    progress: 100,
    completed: true,
    priority: 'low',
  },
];

/** @type {LeaveRequest[]} */
export const mockLeaveRequests = [
  {
    id: 'leave-1',
    userId: 'user-1',
    userName: '김작가',
    projectId: 'proj-1',
    projectName: '별빛의 전설',
    startDate: '2026-01-20',
    endDate: '2026-01-27',
    type: 'health',
    reason: '손목 통증 치료 및 회복',
    status: 'pending',
    affectedEpisodes: 2,
    createdAt: '2026-01-12',
  },
  {
    id: 'leave-2',
    userId: 'user-4',
    userName: '최작가',
    projectId: 'proj-2',
    projectName: '도시의 수호자',
    startDate: '2026-02-01',
    endDate: '2026-02-14',
    type: 'workcation',
    reason: '제주도 워케이션',
    status: 'approved',
    affectedEpisodes: 0,
    createdAt: '2026-01-10',
  },
];

/** @type {HealthData[]} */
export const mockHealthData = [
  {
    userId: 'user-1',
    date: '2026-01-12',
    wristPain: 6,
    sleepHours: 5,
    mood: 'neutral',
    motivation: 6,
  },
  {
    userId: 'user-1',
    date: '2026-01-11',
    wristPain: 7,
    sleepHours: 6,
    mood: 'sad',
    motivation: 5,
  },
  {
    userId: 'user-1',
    date: '2026-01-10',
    wristPain: 5,
    sleepHours: 7,
    mood: 'happy',
    motivation: 8,
  },
];

/** @type {WorkSession[]} */
export const mockWorkSessions = [
  {
    id: 'session-1',
    userId: 'user-1',
    date: '2026-01-12',
    checkInTime: '09:30',
    checkOutTime: '18:45',
    workHours: 9.25,
    isWorkcation: false,
  },
  {
    id: 'session-2',
    userId: 'user-4',
    date: '2026-01-12',
    checkInTime: '10:00',
    checkOutTime: '19:30',
    location: 'Jeju Island',
    workHours: 9.5,
    isWorkcation: true,
    dailyReport: {
      progress: 85,
      tasksCompleted: ['Episode 33 Sketch', 'Scene 5 Revisions'],
      planForTomorrow: 'Complete coloring for Episode 33',
    },
  },
];

/** @type {WorkcationMember[]} */
export const mockWorkcationMembers = [
  {
    id: 'wc-1',
    userId: 'user-4',
    name: '최작가',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    role: 'story',
    location: '제주도 서귀포',
    startDate: '2026-01-10',
    endDate: '2026-01-24',
    projectIds: ['proj-2'],
    projectNames: ['도시의 수호자'],
    tasks: [
      {
        id: 'task-wc-1',
        title: 'Episode 33 스토리보드',
        projectName: '도시의 수호자',
        deadline: '2026-01-18',
        progress: 85,
        priority: 'high',
      },
      {
        id: 'task-wc-2',
        title: 'Episode 34 스크립트 작성',
        projectName: '도시의 수호자',
        deadline: '2026-01-20',
        progress: 60,
        priority: 'medium',
      },
      {
        id: 'task-wc-3',
        title: 'Episode 35 콘티 구성',
        projectName: '도시의 수호자',
        deadline: '2026-01-23',
        progress: 30,
        priority: 'medium',
      },
    ],
    dailyReport: {
      lastUpdated: '2026-01-16 18:30',
      progress: 75,
      tasksCompleted: ['Episode 33 초고 완료', '캐릭터 대사 수정'],
      planForTomorrow: 'Episode 34 스크립트 완료 후 검토 요청',
      notes: '오늘 컨디션 좋아서 예상보다 빨리 진행되었습니다.',
    },
    contact: {
      phone: '010-1234-5678',
      email: 'choi.writer@example.com',
    },
  },
  {
    id: 'wc-2',
    userId: 'user-8',
    name: '한유진',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    role: 'coloring',
    location: '강릉 커피거리',
    startDate: '2026-01-13',
    endDate: '2026-01-19',
    projectIds: ['proj-1', 'proj-2'],
    projectNames: ['별빛의 전설', '도시의 수호자'],
    tasks: [
      {
        id: 'task-wc-4',
        title: 'Episode 55 컬러링',
        projectName: '별빛의 전설',
        deadline: '2026-01-17',
        progress: 90,
        priority: 'high',
      },
      {
        id: 'task-wc-5',
        title: 'Episode 32 배경 보정',
        projectName: '도시의 수호자',
        deadline: '2026-01-18',
        progress: 70,
        priority: 'medium',
      },
    ],
    dailyReport: {
      lastUpdated: '2026-01-16 17:00',
      progress: 80,
      tasksCompleted: ['별빛의 전설 55화 인물 컬러링 완료'],
      planForTomorrow: '배경 및 세부 보정 작업',
      notes: '강릉 카페에서 작업 환경이 좋습니다.',
    },
    contact: {
      phone: '010-2345-6789',
      email: 'han.coloring@example.com',
    },
  },
  {
    id: 'wc-3',
    userId: 'user-9',
    name: '박민수',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    role: 'line',
    location: '부산 해운대',
    startDate: '2026-01-14',
    endDate: '2026-01-21',
    projectIds: ['proj-1'],
    projectNames: ['별빛의 전설'],
    tasks: [
      {
        id: 'task-wc-6',
        title: 'Episode 56 라인 작업',
        projectName: '별빛의 전설',
        deadline: '2026-01-19',
        progress: 45,
        priority: 'high',
      },
      {
        id: 'task-wc-7',
        title: 'Episode 57 스케치',
        projectName: '별빛의 전설',
        deadline: '2026-01-21',
        progress: 20,
        priority: 'medium',
      },
    ],
    dailyReport: {
      lastUpdated: '2026-01-16 19:00',
      progress: 55,
      tasksCompleted: ['Episode 56 메인 캐릭터 라인 완료'],
      planForTomorrow: '서브 캐릭터 및 배경 라인 작업',
    },
    contact: {
      email: 'park.line@example.com',
    },
  },
  {
    id: 'wc-4',
    userId: 'user-10',
    name: '이서연',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: 'assist',
    customRole: '효과 작업',
    location: '경주 한옥마을',
    startDate: '2026-01-15',
    endDate: '2026-01-22',
    projectIds: ['proj-2'],
    projectNames: ['도시의 수호자'],
    tasks: [
      {
        id: 'task-wc-8',
        title: 'Episode 33 이펙트 작업',
        projectName: '도시의 수호자',
        deadline: '2026-01-19',
        progress: 50,
        priority: 'medium',
      },
      {
        id: 'task-wc-9',
        title: 'Episode 34 말풍선 배치',
        projectName: '도시의 수호자',
        deadline: '2026-01-21',
        progress: 0,
        priority: 'low',
      },
    ],
    dailyReport: {
      lastUpdated: '2026-01-16 16:30',
      progress: 40,
      tasksCompleted: ['전투 씬 이펙트 초안 작업'],
      planForTomorrow: '이펙트 수정 및 보완',
      notes: '한옥마을 분위기가 집중에 도움이 됩니다.',
    },
    contact: {
      phone: '010-3456-7890',
      email: 'lee.effect@example.com',
    },
  },
  {
    id: 'wc-5',
    userId: 'user-11',
    name: '정다은',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'background',
    location: '속초 바다뷰 카페',
    startDate: '2026-01-12',
    endDate: '2026-01-18',
    projectIds: ['proj-1'],
    projectNames: ['별빛의 전설'],
    tasks: [
      {
        id: 'task-wc-10',
        title: 'Episode 55 배경 작업',
        projectName: '별빛의 전설',
        deadline: '2026-01-17',
        progress: 95,
        priority: 'high',
      },
    ],
    dailyReport: {
      lastUpdated: '2026-01-16 20:00',
      progress: 95,
      tasksCompleted: ['에피소드 55 배경 작업 거의 완료'],
      planForTomorrow: '최종 검수 및 제출',
      notes: '내일 마무리 후 복귀 예정입니다.',
    },
    contact: {
      phone: '010-4567-8901',
      email: 'jung.background@example.com',
    },
  },
];

/**
 * Helper function to calculate D-Day
 * @param {string} deadline
 * @returns {string}
 */
export function calculateDDay(deadline) {
  const today = new Date('2026-01-12'); // Current date in the scenario
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
  if (diffDays === 0) return 'D-Day';
  return `D-${diffDays}`;
}

/**
 * Helper function to get project status badge color
 * @param {Project['status']} status
 * @returns {string}
 */
export function getStatusColor(status) {
  switch (status) {
    case 'ongoing':
      return 'bg-green-100 text-green-800';
    case 'hiatus':
      return 'bg-gray-100 text-gray-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Helper function to get platform icon
 * @param {Project['platform']} platform
 * @returns {string}
 */
export function getPlatformIcon(platform) {
  switch (platform) {
    case 'naver':
      return 'N';
    case 'kakao':
      return 'K';
    case 'both':
      return 'N+K';
    default:
      return '?';
  }
}
