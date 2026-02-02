import { createContext, useContext, useState, useMemo } from 'react';

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
  const [projects, setProjects] = useState([]);

  const [schedules, setSchedules] = useState([]);

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

  const contextValue = useMemo(() => ({
    projects,
    schedules,
    updateProjectColor,
    addSchedule,
    deleteSchedule,
    getProjectById,
    getSchedulesByProject,
    getSchedulesByDate
  }), [projects, schedules]);

  return (
    <ProjectContext.Provider value={contextValue}>
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
