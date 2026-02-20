// 브라우저 콘솔에서 복사해서 실행하세요
console.log('🔄 채팅 캐시 무효화 및 새로고침 시작...');

// chatService 캐시 무효화
if (window.chatService) {
  window.chatService.clearCache();
  console.log('✅ chatService 캐시 삭제');
}

// chatStore 강제 새로고침
if (window.useChatStore) {
  const chatStore = window.useChatStore.getState();
  if (chatStore.forceClearAndRefresh) {
    chatStore.forceClearAndRefresh();
    console.log('✅ chatStore 강제 새로고침 실행');
  } else {
    // 구버전 대응
    chatStore.clearCache && chatStore.clearCache();
    chatStore.refreshChatRooms && chatStore.refreshChatRooms(true);
    console.log('✅ 구버전 방식으로 새로고침');
  }
} else {
  console.log('❌ useChatStore를 찾을 수 없습니다. 페이지를 새로고침하세요.');
  setTimeout(() => window.location.reload(), 2000);
}

console.log('✅ 완료! 채팅방 목록을 확인해보세요.');