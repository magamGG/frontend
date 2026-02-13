import { motion, AnimatePresence } from "motion/react";
import { Bell, Plus, User, X, ChevronRight, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import useNotificationSource from "@/hooks/useNotificationSource";
import { Badge } from "@/app/components/ui/badge";
import { memberService } from '@/api/services';
import { getMemberProfileUrl } from '@/api/config';
import useAuthStore from '@/store/authStore';
import { notificationService } from "@/api/services";
import { toast } from "sonner";
import useChatStore from '@/store/chatStore';
import {
  HeaderContainer,
  HeaderContent,
  LogoSection,
  LogoIcon,
  LogoDomain,
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

// 알림 타입 → UI 타입 (컴포넌트 외부: SSE 콜백에서 사용)
const getNotificationType = (type) => {
  switch (type) {
    case 'JOIN_REQ': return 'info';
    case 'LEAVE_REQ': return 'warning';
    case 'LEAVE_APP':
    case 'APPROVED': return 'success';
    case 'LEAVE_REJ':
    case 'REJECTED': return 'error';
    case 'ASSIGNMENT': return 'info';
    case 'HEALTH_WARN':
    case 'HEALTH_REM': return 'warning';
    case 'PROJ_HIATUS':
    case 'PROJ_ADD':
    case 'PROJ_REM': return 'info';
    case 'LEAVE_ADJ': return 'success';
    default: return 'info';
  }
};

const getLinkedPage = (type) => {
  switch (type) {
    case 'JOIN_REQ': return 'approvals';
    case 'LEAVE_REQ': return 'approvals';
    case 'APPROVED':
    case 'REJECTED':
    case 'LEAVE_APP':
    case 'LEAVE_REJ': return 'dashboard';
    case 'ASSIGNMENT': return 'assignment';
    case 'HEALTH_WARN':
    case 'HEALTH_REM': return 'health';
    case 'PROJ_HIATUS':
    case 'PROJ_ADD':
    case 'PROJ_REM': return 'projects';
    case 'LEAVE_ADJ': return 'dashboard';
    default: return 'dashboard';
  }
};

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
  const { user } = useAuthStore();
  const memberNo = user?.memberNo;
  const { openChatList, openChatDetail, getTotalUnreadCount, chatRooms } = useChatStore();

  // chatStore 상태 변경을 강제로 감지하기 위한 추가 구독
  const [forceUpdate, setForceUpdate] = useState(0);
  
  useEffect(() => {
    // chatStore 변경사항을 감지하기 위한 interval (임시 해결책)
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 1000); // 1초마다 체크
    
    return () => clearInterval(interval);
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [showMessenger, setShowMessenger] = useState(false);
  const messengerRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "김철수 편집자",
      content: "작가님, 에피소드 42 콘티 확인 부탁드립니다!",
      time: "10분 전",
      isRead: false,
      avatar: null // 이미지가 없을 경우 기본 아이콘 표시
    }
  ]);

  // 사용자 정보 state
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [profileImage, setProfileImage] = useState(null);

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
      title: "캘린더 알림",
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
      linkedPage: "approvals",
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
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // 알림 목록 조회
  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const response = await notificationService.getNotifications();

      // DB notificationStatus: Y = 안 읽음(false), N = 읽음(true)
      const formattedNotifications = response.map((n) => ({
        id: n.notificationNo,
        title: n.notificationName || '알림',
        message: n.notificationText || '',
        time: formatTimeAgo(n.notificationCreatedAt),
        isRead: n.notificationStatus === 'N',
        type: getNotificationType(n.notificationType),
        linkedPage: getLinkedPage(n.notificationType),
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
      // 에러 시 빈 배열 유지
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // 시간 포맷팅 (몇 분 전, 몇 시간 전 등)
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString();
  };

  // SSE 실시간 알림 수신 콜백
  const onNewNotification = useCallback((data) => {
    const formatted = {
      id: data.notificationNo,
      title: data.notificationName || '알림',
      message: data.notificationText || '',
      time: '방금 전',
      isRead: data.notificationStatus === 'N',
      type: getNotificationType(data.notificationType),
      linkedPage: getLinkedPage(data.notificationType),
    };
    setNotifications((prev) => [formatted, ...prev]);
    toast.success(formatted.title);
  }, []);

  // SSE 구독 (로그인 시 자동 연결)
  useNotificationSource(onNewNotification);

  // 컴포넌트 마운트 시 알림 목록 조회
  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  // 채팅 읽지 않은 메시지 개수
  const chatUnreadCount = getTotalUnreadCount();

  // 디버깅: chatUnreadCount 값 확인 (한 번만 로그)
  useEffect(() => {
    console.log('🔍 [헤더] chatUnreadCount 업데이트:', chatUnreadCount);
    if (chatRooms.length > 0) {
      console.log('🔍 [헤더] chatRooms 개별 unreadCount:', chatRooms.map(room => ({ 
        chatRoomNo: room.chatRoomNo, 
        chatRoomName: room.chatRoomName, 
        unreadCount: room.unreadCount 
      })));
    }
  }, [chatUnreadCount]); // chatUnreadCount가 실제로 변경될 때만 로그

  // 사용자 정보 로드
  const loadUserInfo = async () => {
    if (!memberNo) return;
    try {
      const myPageData = await memberService.getMyPageInfo(memberNo);
      setMemberName(myPageData.memberName || '');
      setMemberRole(myPageData.memberRole || '');
      setProfileImage(getMemberProfileUrl(myPageData.memberProfileImage));
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      setMemberName(user?.memberName || '');
      setMemberRole(user?.memberRole || '');
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, [memberNo, user]);

  // 마이페이지에서 프로필 사진 업로드 후 헤더 갱신
  useEffect(() => {
    const handleProfileUpdated = () => loadUserInfo();
    window.addEventListener('profile-image-updated', handleProfileUpdated);
    return () => window.removeEventListener('profile-image-updated', handleProfileUpdated);
  }, [memberNo]);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 알림창 닫기 로직
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      // 메신저창 닫기 로직 추가
      if (messengerRef.current && !messengerRef.current.contains(event.target)) {
        setShowMessenger(false);
      }
    };

    if (showNotifications || showMessenger) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showMessenger]);

  const handleNotificationClick = async (notification) => {
    // 읽지 않은 알림인 경우 API 호출 후 목록에서 제거(읽은 알림은 창에 안 보이게)
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id),
        );
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
      }
    }

    // 페이지 이동
    const sectionIndex = sections.findIndex(
      (s) => s.id === notification.linkedPage,
    );
    if (sectionIndex !== -1) {
      onNavigateToSection(sectionIndex);
    }
    setShowNotifications(false);
  };

  const handleMessageClick = (msg) => {
    // 1. 'chat' 또는 'messenger'라는 ID를 가진 섹션의 인덱스를 찾습니다.
    const chatSectionIndex = sections.findIndex(s => s.id === 'chat' || s.id === 'messenger');

    if (chatSectionIndex !== -1) {
      onNavigateToSection(chatSectionIndex); // 해당 페이지로 이동
      setShowMessenger(false);               // 드롭다운 닫기
    } else {
      // 만약 섹션이 없다면 토스트 알림이라도 띄워줍니다.
      toast.info(`${msg.sender}님과의 채팅 페이지를 준비 중입니다.`);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // 읽은 알림은 창에 더 이상 안 보이게 목록에서 제거
      setNotifications((prev) => prev.filter((n) => n.isRead));
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
      toast.error('알림 읽음 처리에 실패했습니다.');
    }
  };

  const deleteNotification = async (id, event) => {
    event.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      toast.error('알림 삭제에 실패했습니다.');
    }
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
            <img 
              src="/images/hourglass.png" 
              alt="마감지기 로고" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </LogoIcon>
          <LogoDomain>magam.gg</LogoDomain>
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

          {/* Messenger Button */}
          <div style={{ position: 'relative' }} ref={messengerRef}>
            <NotificationButton
              onClick={() => {
                openChatList(); // 직접 호출 (getState 빼기)
                if (showNotifications) setShowNotifications(false);
              }}
            >
              <MessageSquare style={{ width: '24px', height: '24px' }} />
              {chatUnreadCount > 0 && <NotificationBadge />}
            </NotificationButton>

            <AnimatePresence>
              {showMessenger && (
                <NotificationPanel
                  as={motion.div}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationArrow />
                  <NotificationHeader>
                    <NotificationHeaderTitle>메시지</NotificationHeaderTitle>
                  </NotificationHeader>
                  <NotificationList>
                    {messages.length === 0 ? (
                      <EmptyNotification>새로운 메시지가 없습니다</EmptyNotification>
                    ) : (
                      messages.map((msg) => (
                        <NotificationItem
                          key={msg.id}
                          $isUnread={!msg.isRead}
                          onClick={() => {
                            openChatDetail(msg); // 직접 호출
                            setShowMessenger(false);
                          }}
                        >
                          <NotificationItemContent>
                            {/* 발신자 프로필 이미지 (없으면 기본 아이콘) */}
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'var(--secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '12px',
                              flexShrink: 0
                            }}>
                              <User style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }} />
                            </div>

                            <NotificationItemMain>
                              <NotificationItemHeader>
                                <NotificationItemTitle style={{ fontWeight: 700 }}>
                                  {msg.sender}
                                </NotificationItemTitle>
                                {!msg.isRead && <UnreadDot />}
                              </NotificationItemHeader>
                              <NotificationItemMessage>
                                {msg.content}
                              </NotificationItemMessage>
                              <NotificationItemFooter>
                                <NotificationItemTime>{msg.time}</NotificationItemTime>
                              </NotificationItemFooter>
                            </NotificationItemMain>
                          </NotificationItemContent>
                        </NotificationItem>
                      ))
                    )}
                  </NotificationList>
                </NotificationPanel>
              )}
            </AnimatePresence>
          </div>

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

                  {/* Notification List - 읽지 않은 알림만 표시 */}
                  <NotificationList>
                    {unreadNotifications.length === 0 ? (
                      <EmptyNotification>
                        알림이 없습니다
                      </EmptyNotification>
                    ) : (
                      unreadNotifications.map((notification) => (
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
                                    background: notification.type === 'warning' ? 'color-mix(in srgb, var(--destructive) 10%, transparent)' : notification.type === 'error' ? 'color-mix(in srgb, var(--destructive) 10%, transparent)' : notification.type === 'success' ? 'color-mix(in srgb, var(--chart-2) 10%, transparent)' : 'color-mix(in srgb, var(--chart-2) 10%, transparent)',
                                    color: notification.type === 'warning' ? 'var(--destructive)' : notification.type === 'error' ? 'var(--destructive)' : notification.type === 'success' ? 'var(--chart-2)' : 'var(--chart-2)',
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
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling?.style?.setProperty('display', 'block');
                  }}
                />
              ) : null}
              <User style={{
                width: '16px',
                height: '16px',
                color: 'var(--primary-foreground)',
                display: profileImage ? 'none' : 'block'
              }} />
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileName>
                {memberName || user?.memberName || '사용자'}
              </ProfileName>
              <ProfileRole>
                {memberRole || user?.memberRole || ''}
              </ProfileRole>
            </ProfileInfo>
            <ProfileChevron as={ChevronRight} />
          </ProfileButton>
        </ActionsSection>
      </HeaderContent>
    </HeaderContainer>
  );
}
