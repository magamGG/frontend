// Common Types for Webtoon Management System
// Type definitions are provided as JSDoc comments for JavaScript files

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {'writer' | 'admin' | 'manager'} role
 * @property {string} [avatar]
 * @property {string} email
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string} thumbnail
 * @property {'naver' | 'kakao' | 'both'} platform
 * @property {string} serializationDay
 * @property {'ongoing' | 'hiatus' | 'completed'} status
 * @property {TeamMember[]} teamMembers
 * @property {string} [nextDeadline]
 * @property {number} episodeCount
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} userId
 * @property {string} name
 * @property {'story' | 'line' | 'coloring' | 'background'} role
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} projectId
 * @property {string} projectName
 * @property {string} deadline
 * @property {number} progress
 * @property {boolean} completed
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} LeaveRequest
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} projectId
 * @property {string} projectName
 * @property {string} startDate
 * @property {string} endDate
 * @property {'regular' | 'health' | 'emergency' | 'workcation'} type
 * @property {string} reason
 * @property {'pending' | 'approved' | 'rejected'} status
 * @property {number} affectedEpisodes
 * @property {string} createdAt
 */

/**
 * @typedef {Object} HealthData
 * @property {string} userId
 * @property {string} date
 * @property {number} wristPain - 1-10
 * @property {number} sleepHours
 * @property {'sad' | 'neutral' | 'happy'} mood
 * @property {number} motivation - 1-10
 */

/**
 * @typedef {Object} WorkSession
 * @property {string} id
 * @property {string} userId
 * @property {string} date
 * @property {string} checkInTime
 * @property {string} [checkOutTime]
 * @property {string} [location]
 * @property {number} workHours
 * @property {boolean} isWorkcation
 * @property {Object} [dailyReport]
 * @property {number} dailyReport.progress
 * @property {string[]} dailyReport.tasksCompleted
 * @property {string} dailyReport.planForTomorrow
 */

/**
 * @typedef {Object} CalendarEvent
 * @property {string} id
 * @property {'serialization' | 'deadline' | 'hiatus' | 'workcation'} type
 * @property {string} [projectId]
 * @property {string} [projectName]
 * @property {string} date
 * @property {string} title
 * @property {string} color
 */

/**
 * @typedef {Object} WorkcationMember
 * @property {string} id
 * @property {string} userId
 * @property {string} name
 * @property {string} avatar
 * @property {'story' | 'line' | 'coloring' | 'background' | 'assist'} role
 * @property {string} [customRole]
 * @property {string} location
 * @property {string} startDate
 * @property {string} endDate
 * @property {string[]} projectIds
 * @property {string[]} projectNames
 * @property {Object[]} tasks
 * @property {string} tasks[].id
 * @property {string} tasks[].title
 * @property {string} tasks[].projectName
 * @property {string} tasks[].deadline
 * @property {number} tasks[].progress
 * @property {'high' | 'medium' | 'low'} tasks[].priority
 * @property {Object} [dailyReport]
 * @property {string} dailyReport.lastUpdated
 * @property {number} dailyReport.progress
 * @property {string[]} dailyReport.tasksCompleted
 * @property {string} dailyReport.planForTomorrow
 * @property {string} [dailyReport.notes]
 * @property {Object} contact
 * @property {string} [contact.phone]
 * @property {string} contact.email
 */
