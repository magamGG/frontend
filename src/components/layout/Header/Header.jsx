import { motion, AnimatePresence } from "motion/react";
import { Bell, Plus, User, X, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/app/components/ui/badge";
import {
  HeaderContainer,
  HeaderContent,
  LogoSection,
  LogoIcon,
  LogoText,
  LogoTitle,
  LogoSubtitle,
  CurrentPageTitle,
  ActionsSection,
  AttendanceButton,
  NotificationButton,
  NotificationBadge,
  NotificationPanel,
  NotificationArrow,
  NotificationHeader,
  NotificationHeaderTop,
  NotificationHeaderTitle,
  MarkAllReadButton,
  NotificationHeaderSubtitle,
  NotificationList,
  EmptyNotification,
  NotificationItem,
  NotificationItemContent,
  NotificationItemMain,
  NotificationItemHeader,
  NotificationItemTitle,
  UnreadDot,
  NotificationItemMessage,
  NotificationItemFooter,
  NotificationItemTime,
  DeleteButton,
  ProfileButton,
  ProfileAvatar,
  ProfileInfo,
  ProfileName,
  ProfileRole,
  ProfileChevron,
} from './Header.styled';

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} title
 * @property {import('react').ReactNode} content
 */

/**
 * @typedef {Object} Notification
 * @property {number} id
 * @property {string} title
 * @property {string} message
 * @property {string} time
 * @property {boolean} isRead
 * @property {'info' | 'warning' | 'success' | 'error'} type
 * @property {string} linkedPage
 */

/**
 * @typedef {Object} HeaderProps
 * @property {string} currentPage
 * @property {() => void} [onProfileClick]
 * @property {(index: number) => void} onNavigateToSection
 * @property {Section[]} sections
 * @property {() => void} [onAttendanceClick]
 * @property {'individual' | 'manager' | 'agency' | null} [userRole]
 */

/**
 * @param {HeaderProps} props
 */
export function Header({
  currentPage,
  onProfileClick,
  onNavigateToSection,
  sections,
  onAttendanceClick,
  userRole,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "마감 알림",
      message: "에피소드 42 마감이 오늘입니다.",
      time: "방금 전",
      isRead: false,
      type: "warning",
      linkedPage: "calendar",
    },
    {
      id: 2,
      title: "일정 알림",
      message: "내일 편집자 미팅이 예정되어 있습니다.",
      time: "30분 전",
      isRead: false,
      type: "info",
      linkedPage: "calendar",
    },
    {
      id: 3,
      title: "승인 완료",
      message: "워케이션 신청이 승인되었습니다.",
      time: "2시간 전",
      isRead: false,
      type: "success",
      linkedPage: "attendance",
    },
    {
      id: 4,
      title: "건강 체크",
      message: "오늘 건강 설문을 완료하지 않았습니다.",
      time: "3시간 전",
      isRead: true,
      type: "info",
      linkedPage: "dashboard",
    },
    {
      id: 5,
      title: "작품 업데이트",
      message: "새로운 에피소드가 업로드되었습니다.",
      time: "어제",
      isRead: true,
      type: "info",
      linkedPage: "projects",
    },
  ]);

  const unreadCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [showNotifications]);

  const handleNotificationClick = (notification) => {
    // 읽음 처리
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n,
      ),
    );

    // 페이지 이동
    const sectionIndex = sections.findIndex(
      (s) => s.id === notification.linkedPage,
    );
    if (sectionIndex !== -1) {
      onNavigateToSection(sectionIndex);
      setShowNotifications(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, isRead: true })),
    );
  };

  const deleteNotification = (id, event) => {
    event.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationBadgeVariant = (type) => {
    switch (type) {
      case "warning":
        return "destructive";
      case "success":
        return "default";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <HeaderContainer
      as={motion.header}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      <HeaderContent>
        {/* Left - Logo */}
        <LogoSection>
          <LogoIcon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="8"
                r="3"
                fill="currentColor"
                style={{ color: 'white' }}
              />
              <path
                d="M12 12C8 12 6 14 6 14V18C6 18 8 20 12 20C16 20 18 18 18 18V14C18 14 16 12 12 12Z"
                fill="currentColor"
                style={{ color: 'white' }}
              />
              <path
                d="M8 6C8 6 9 4 12 4C15 4 16 6 16 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ color: 'white' }}
              />
            </svg>
          </LogoIcon>
          <LogoText>
            <LogoTitle>마감지기</LogoTitle>
            <LogoSubtitle>Webtoon Dashboard</LogoSubtitle>
          </LogoText>
        </LogoSection>

        {/* Center - Current Page */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}
        >
          <CurrentPageTitle>
            {currentPage}
          </CurrentPageTitle>
        </motion.div>

        {/* Right - User Profile & Actions */}
        <ActionsSection>
          {/* Attendance Button - For Individual/Artist and Manager */}
          {(userRole === "individual" || userRole === "manager") && onAttendanceClick && (
            <AttendanceButton
              onClick={onAttendanceClick}
            >
              <span style={{ fontSize: '14px', fontWeight: '500' }}>근태신청</span>
            </AttendanceButton>
          )}

          {/* Notifications - 프로필 왼쪽에 배치 */}
          <div style={{ position: 'relative' }} ref={notificationRef}>
            <NotificationButton
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
            >
              <Bell style={{ width: '24px', height: '24px' }} />
              {unreadCount > 0 && <NotificationBadge />}
            </NotificationButton>

            {/* Notification Panel */}
            <AnimatePresence>
              {showNotifications && (
                <NotificationPanel
                  as={motion.div}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Arrow - 말풍선 꼬리 */}
                  <NotificationArrow />

                  {/* Header */}
                  <NotificationHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <NotificationHeaderTitle>
                        알림
                      </NotificationHeaderTitle>
                      {unreadCount > 0 && (
                        <MarkAllReadButton
                          onClick={markAllAsRead}
                        >
                          모두 읽음
                        </MarkAllReadButton>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <NotificationHeaderSubtitle>
                        {unreadCount}개의 읽지 않은 알림
                      </NotificationHeaderSubtitle>
                    )}
                  </NotificationHeader>

                  {/* Notification List */}
                  <NotificationList>
                    {notifications.length === 0 ? (
                      <EmptyNotification>
                        알림이 없습니다
                      </EmptyNotification>
                    ) : (
                      notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          $isUnread={!notification.isRead}
                          onClick={() =>
                            handleNotificationClick(
                              notification,
                            )
                          }
                        >
                          <NotificationItemContent>
                            <NotificationItemMain>
                              <NotificationItemHeader>
                                <NotificationItemTitle>
                                  {notification.title}
                                </NotificationItemTitle>
                                {!notification.isRead && (
                                  <UnreadDot />
                                )}
                              </NotificationItemHeader>
                              <NotificationItemMessage>
                                {notification.message}
                              </NotificationItemMessage>
                              <NotificationItemFooter>
                                <NotificationItemTime>
                                  {notification.time}
                                </NotificationItemTime>
                                <span
                                  style={{
                                    background: notification.type === 'warning' ? 'rgb(254, 226, 226)' : notification.type === 'error' ? 'rgb(254, 226, 226)' : notification.type === 'success' ? '#dcfce7' : '#dbeafe',
                                    color: notification.type === 'warning' ? 'rgb(239, 68, 68)' : notification.type === 'error' ? 'rgb(239, 68, 68)' : notification.type === 'success' ? '#16a34a' : '#3b82f6',
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 700, /* font-bold */
                                  }}
                                >
                                  {notification.type ===
                                  "warning"
                                    ? "경고"
                                    : notification.type ===
                                        "success"
                                      ? "성공"
                                      : notification.type ===
                                          "error"
                                        ? "오류"
                                        : "정보"}
                                </span>
                              </NotificationItemFooter>
                            </NotificationItemMain>
                            <DeleteButton
                              onClick={(e) =>
                                deleteNotification(
                                  notification.id,
                                  e,
                                )
                              }
                            >
                              <X style={{ width: '14px', height: '14px' }} />
                            </DeleteButton>
                          </NotificationItemContent>
                        </NotificationItem>
                      ))
                    )}
                  </NotificationList>
                </NotificationPanel>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile - 오른쪽 끝에 배치 */}
          <ProfileButton
            onClick={onProfileClick}
          >
            <ProfileAvatar>
              <User style={{ width: '16px', height: '16px', color: 'var(--primary-foreground)' }} />
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileName>
                김작가
              </ProfileName>
              <ProfileRole>
                에이전시 대표
              </ProfileRole>
            </ProfileInfo>
            <ProfileChevron as={ChevronRight} />
          </ProfileButton>
        </ActionsSection>
      </HeaderContent>
    </HeaderContainer>
  );
}
