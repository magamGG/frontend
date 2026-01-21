import { createContext, useContext, useState } from 'react';

/**
 * @typedef {Object} ProjectSchedule
 * @property {string} id
 * @property {number} projectId
 * @property {string} projectName
 * @property {'정기 연재' | '휴재' | '마감일' | '기획 회의' | '계약 논의'} type
 * @property {Date} date
 * @property {string} [description]
 */

/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {string} name
 * @property {string} artist
 * @property {string} status
 * @property {string} platform
 * @property {string} startDate
 * @property {number} episodes
 * @property {number} avgViews
 * @property {number} rating
 * @property {string} color - Tailwind color class (e.g., 'bg-pink-500')
 * @property {number} managerId
 * @property {string} managerName
 */

/**
 * @typedef {Object} ProjectContextType
 * @property {Project[]} projects
 * @property {ProjectSchedule[]} schedules
 * @property {(projectId: number, color: string) => void} updateProjectColor
 * @property {(schedule: Omit<ProjectSchedule, 'id'>) => void} addSchedule
 * @property {(scheduleId: string) => void} deleteSchedule
 * @property {(projectId: number) => Project | undefined} getProjectById
 * @property {(projectId: number) => ProjectSchedule[]} getSchedulesByProject
 * @property {(date: Date) => ProjectSchedule[]} getSchedulesByDate
 */

const ProjectContext = createContext(undefined);

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([
    // Manager 1: 김담당자
    {
      id: 1,
      name: '로맨스 판타지',
      artist: '박작가',
      status: '연재중',
      platform: '네이버',
      startDate: '2024-01-15',
      episodes: 45,
      avgViews: 150000,
      rating: 9.2,
      color: 'bg-pink-500',
      managerId: 1,
      managerName: '김담당자'
    },
    {
      id: 2,
      name: '액션 웹툰',
      artist: '이작가',
      status: '연재중',
      platform: '카카오',
      startDate: '2023-11-20',
      episodes: 62,
      avgViews: 120000,
      rating: 8.8,
      color: 'bg-red-500',
      managerId: 1,
      managerName: '김담당자'
    },
    {
      id: 3,
      name: '일상 코미디',
      artist: '최작가',
      status: '휴재중',
      platform: '네이버',
      startDate: '2024-03-01',
      episodes: 28,
      avgViews: 85000,
      rating: 9.0,
      color: 'bg-yellow-500',
      managerId: 1,
      managerName: '김담당자'
    },
    {
      id: 4,
      name: 'SF 드라마',
      artist: '정작가',
      status: '연재중',
      platform: '카카오',
      startDate: '2024-02-10',
      episodes: 35,
      avgViews: 98000,
      rating: 8.5,
      color: 'bg-blue-500',
      managerId: 1,
      managerName: '김담당자'
    },
    // Manager 2: 이담당자
    {
      id: 5,
      name: '스릴러 미스터리',
      artist: '강작가',
      status: '연재중',
      platform: '네이버',
      startDate: '2023-12-05',
      episodes: 52,
      avgViews: 110000,
      rating: 9.1,
      color: 'bg-purple-500',
      managerId: 2,
      managerName: '이담당자'
    },
    {
      id: 6,
      name: '판타지 액션',
      artist: '윤작가',
      status: '연재중',
      platform: '카카오',
      startDate: '2024-01-20',
      episodes: 40,
      avgViews: 95000,
      rating: 8.7,
      color: 'bg-indigo-500',
      managerId: 2,
      managerName: '이담당자'
    },
    {
      id: 7,
      name: '로맨스 드라마',
      artist: '송작가',
      status: '완결',
      platform: '네이버',
      startDate: '2023-06-15',
      episodes: 120,
      avgViews: 140000,
      rating: 9.5,
      color: 'bg-rose-500',
      managerId: 2,
      managerName: '이담당자'
    },
    // Manager 3: 박담당자
    {
      id: 8,
      name: '학원 로맨스',
      artist: '한작가',
      status: '연재중',
      platform: '카카오',
      startDate: '2024-04-01',
      episodes: 20,
      avgViews: 75000,
      rating: 8.9,
      color: 'bg-green-500',
      managerId: 3,
      managerName: '박담당자'
    },
    {
      id: 9,
      name: '무협 판타지',
      artist: '오작가',
      status: '연재중',
      platform: '네이버',
      startDate: '2024-03-15',
      episodes: 25,
      avgViews: 82000,
      rating: 8.6,
      color: 'bg-amber-600',
      managerId: 3,
      managerName: '박담당자'
    },
  ]);

  const [schedules, setSchedules] = useState([
    // 로맨스 판타지 (매주 목요일)
    {
      id: 's1',
      projectId: 1,
      projectName: '로맨스 판타지',
      type: '정기 연재',
      date: new Date(2026, 0, 16), // Jan 16 (Thu)
      description: '46화 업로드'
    },
    {
      id: 's2',
      projectId: 1,
      projectName: '로맨스 판타지',
      type: '정기 연재',
      date: new Date(2026, 0, 23), // Jan 23 (Thu)
      description: '47화 업로드'
    },
    {
      id: 's3',
      projectId: 1,
      projectName: '로맨스 판타지',
      type: '정기 연재',
      date: new Date(2026, 0, 30), // Jan 30 (Thu)
      description: '48화 업로드'
    },
    // 액션 웹툰 (매주 금요일)
    {
      id: 's4',
      projectId: 2,
      projectName: '액션 웹툰',
      type: '정기 연재',
      date: new Date(2026, 0, 17), // Jan 17 (Fri)
      description: '63화 업로드'
    },
    {
      id: 's5',
      projectId: 2,
      projectName: '액션 웹툰',
      type: '정기 연재',
      date: new Date(2026, 0, 24), // Jan 24 (Fri)
      description: '64화 업로드'
    },
    // 일상 코미디 (휴재)
    {
      id: 's6',
      projectId: 3,
      projectName: '일상 코미디',
      type: '휴재',
      date: new Date(2026, 0, 17), // Jan 17
      description: '작가 건강상 이유로 휴재'
    },
    // SF 드라마 (매주 토요일)
    {
      id: 's7',
      projectId: 4,
      projectName: 'SF 드라마',
      type: '정기 연재',
      date: new Date(2026, 0, 18), // Jan 18 (Sat)
      description: '36화 업로드'
    },
    {
      id: 's8',
      projectId: 4,
      projectName: 'SF 드라마',
      type: '정기 연재',
      date: new Date(2026, 0, 25), // Jan 25 (Sat)
      description: '37화 업로드'
    },
    // 스릴러 미스터리 (매주 일요일)
    {
      id: 's9',
      projectId: 5,
      projectName: '스릴러 미스터리',
      type: '정기 연재',
      date: new Date(2026, 0, 19), // Jan 19 (Sun)
      description: '53화 업로드'
    },
    {
      id: 's10',
      projectId: 5,
      projectName: '스릴러 미스터리',
      type: '정기 연재',
      date: new Date(2026, 0, 26), // Jan 26 (Sun)
      description: '54화 업로드'
    },
    // 판타지 액션 (매주 월요일)
    {
      id: 's11',
      projectId: 6,
      projectName: '판타지 액션',
      type: '정기 연재',
      date: new Date(2026, 0, 20), // Jan 20 (Mon)
      description: '41화 업로드'
    },
    {
      id: 's12',
      projectId: 6,
      projectName: '판타지 액션',
      type: '정기 연재',
      date: new Date(2026, 0, 27), // Jan 27 (Mon)
      description: '42화 업로드'
    },
    // 학원 로맨스 (매주 수요일)
    {
      id: 's13',
      projectId: 8,
      projectName: '학원 로맨스',
      type: '정기 연재',
      date: new Date(2026, 0, 22), // Jan 22 (Wed)
      description: '21화 업로드'
    },
    {
      id: 's14',
      projectId: 8,
      projectName: '학원 로맨스',
      type: '정기 연재',
      date: new Date(2026, 0, 29), // Jan 29 (Wed)
      description: '22화 업로드'
    },
    // 무협 판타지 (매주 목요일)
    {
      id: 's15',
      projectId: 9,
      projectName: '무협 판타지',
      type: '정기 연재',
      date: new Date(2026, 0, 16), // Jan 16 (Thu)
      description: '26화 업로드'
    },
    {
      id: 's16',
      projectId: 9,
      projectName: '무협 판타지',
      type: '정기 연재',
      date: new Date(2026, 0, 23), // Jan 23 (Thu)
      description: '27화 업로드'
    },
    // 기타 일정들
    {
      id: 's17',
      projectId: 1,
      projectName: '로맨스 판타지',
      type: '기획 회의',
      date: new Date(2026, 0, 20), // Jan 20
      description: '시즌 2 기획 논의'
    },
    {
      id: 's18',
      projectId: 5,
      projectName: '스릴러 미스터리',
      type: '마감일',
      date: new Date(2026, 0, 17), // Jan 17
      description: '53화 원고 마감'
    },
  ]);

  /**
   * @param {number} projectId
   * @param {string} color
   */
  const updateProjectColor = (projectId, color) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId ? { ...project, color } : project
      )
    );
  };

  /**
   * @param {Omit<ProjectSchedule, 'id'>} schedule
   */
  const addSchedule = (schedule) => {
    const newSchedule = {
      ...schedule,
      id: `s${Date.now()}`
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  /**
   * @param {string} scheduleId
   */
  const deleteSchedule = (scheduleId) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  /**
   * @param {number} projectId
   * @returns {Project | undefined}
   */
  const getProjectById = (projectId) => {
    return projects.find(p => p.id === projectId);
  };

  /**
   * @param {number} projectId
   * @returns {ProjectSchedule[]}
   */
  const getSchedulesByProject = (projectId) => {
    return schedules.filter(s => s.projectId === projectId);
  };

  /**
   * @param {Date} date
   * @returns {ProjectSchedule[]}
   */
  const getSchedulesByDate = (date) => {
    return schedules.filter(s => 
      s.date.getDate() === date.getDate() &&
      s.date.getMonth() === date.getMonth() &&
      s.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      schedules,
      updateProjectColor,
      addSchedule,
      deleteSchedule,
      getProjectById,
      getSchedulesByProject,
      getSchedulesByDate
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
