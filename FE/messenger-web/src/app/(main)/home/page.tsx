"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatList } from "@/components/chat/ChatList";
import { ChatArea } from "@/components/chat/ChatArea";
import { ResizablePanel } from "@/components/layout/ResizablePanel";
import { FriendsView } from "@/components/friends/FriendsView";
import { ProfileView } from "@/components/profile/ProfileView";
import { RestrictedAccountsView } from "@/components/restricted/RestrictedAccountsView";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { useAuth } from "@/contexts/AuthContext";
import { chatService } from "@/services/chatService";
import { friendService } from "@/services/friendService";
import { blockService } from "@/services/blockService";
import { ChatRoom, SidebarMessageDTO } from "@/types/chat";

export default function HomePage() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<string>("chat");
  const [friendsTab, setFriendsTab] = useState<"friends" | "requests" | "discover">("friends");
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // Authentication guard
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace("/login");
    }
  }, [authLoading, currentUser, router]);

  // Load chat rooms
  const loadChatRooms = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoadingRooms(true);
      const rooms = await chatService.getChatRooms();
      setChatRooms(rooms || []);
    } catch (err) {
      console.error("Failed to load chat rooms:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  // Real-time sidebar updates from STOMP
  const handleSidebarUpdate = useCallback(
    (sidebarDto: SidebarMessageDTO) => {
      const targetRoomId = sidebarDto.chatroomId ?? sidebarDto.chatRoomId;
      const messageContent = sidebarDto.lastMessage ?? sidebarDto.content;
      const messageTime = sidebarDto.time ?? sidebarDto.dateSend;

      setChatRooms((prevRooms) => {
        const idx = prevRooms.findIndex(
          (r) => Number(r.idChatroom) === Number(targetRoomId)
        );

        if (idx === -1) {
          // If room is new or not found, refresh chat rooms
          chatService.getChatRooms().then(setChatRooms).catch(console.error);
          return prevRooms;
        }

        const currentRoom = prevRooms[idx];
        const isCurrentRoom =
          selectedChat &&
          Number(selectedChat.idChatroom) === Number(targetRoomId);

        const updatedRoom: ChatRoom = {
          ...currentRoom,
          content: messageContent,
          dateSend: messageTime,
          isUnread: isCurrentRoom ? 0 : 1,
          unreadCount: isCurrentRoom ? 0 : (currentRoom.unreadCount || 0) + 1,
        };

        const newRooms = [...prevRooms];
        newRooms.splice(idx, 1);
        newRooms.unshift(updatedRoom);

        if (isCurrentRoom) {
          setSelectedChat(updatedRoom);
        }

        return newRooms;
      });
    },
    [selectedChat]
  );

  // Select a chat room
  const handleSelectChat = (conv: ChatRoom) => {
    setSelectedChat(conv);
    setChatRooms((prev) =>
      prev.map((r) =>
        Number(r.idChatroom) === Number(conv.idChatroom)
          ? { ...r, isUnread: 0, unreadCount: 0 }
          : r
      )
    );
    chatService.markAsRead(conv.idChatroom).catch(console.error);
  };

  // Start chat with user from Friends or Profile
  const handleStartChatWithUser = (targetUser: any) => {
    const existing = chatRooms.find((r) =>
      r.name?.toLowerCase().trim() === targetUser.name?.toLowerCase().trim()
    );

    if (existing) {
      handleSelectChat(existing);
    }
    setSelectedProfile(null);
    setActiveTab("chat");
  };

  // Header Dropdown Navigation
  const handleHeaderNavigate = (
    view: "friends" | "requests" | "discover" | "restricted"
  ) => {
    if (view === "restricted") {
      setActiveTab("restricted");
    } else {
      setFriendsTab(view);
      setActiveTab("friends");
    }
  };

  // Chat Item Actions
  const handleDeleteConversation = (conv: ChatRoom) => {
    if (!confirm(`Bạn có chắc muốn ẩn cuộc trò chuyện với "${conv.name}"?`)) return;
    setChatRooms((prev) => prev.filter((r) => r.idChatroom !== conv.idChatroom));
    if (selectedChat?.idChatroom === conv.idChatroom) {
      setSelectedChat(null);
    }
  };

  const handleUnfriend = async (conv: ChatRoom) => {
    if (!confirm(`Bạn có chắc muốn hủy kết bạn với "${conv.name}"?`)) return;
    try {
      // Find friend by name
      const friends = await friendService.getFriends();
      const match = friends.find((f) => f.name === conv.name);
      if (match) {
        await friendService.removeFriend(match.userId);
        alert("Đã hủy kết bạn thành công.");
      }
    } catch (err) {
      console.error("Error unfriending:", err);
    }
  };

  const handleBlock = async (conv: ChatRoom) => {
    if (!confirm(`Bạn có chắc muốn chặn "${conv.name}"?`)) return;
    try {
      const friends = await friendService.getFriends();
      const match = friends.find((f) => f.name === conv.name);
      if (match) {
        await blockService.blockUser(match.userId);
        alert("Đã chặn người dùng thành công.");
        loadChatRooms();
      }
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--bg-color)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary-color)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-color)] overflow-hidden">
      {/* Slim Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedProfile(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* If viewing another user's profile */}
        {selectedProfile ? (
          <ProfileView
            userData={selectedProfile}
            isOtherProfile={true}
            onBack={() => setSelectedProfile(null)}
            onStartChat={handleStartChatWithUser}
          />
        ) : activeTab === "chat" ? (
          <div className="flex-1 overflow-hidden">
            <ResizablePanel
              defaultWidth={28}
              minWidth={20}
              maxWidth={50}
              rightPanel={
                <ChatArea
                  selectedChat={selectedChat}
                  myUserId={currentUser.id}
                  onViewUserProfile={() => {
                    if (selectedChat) {
                      setSelectedProfile({
                        name: selectedChat.name,
                        avatarUrl: selectedChat.logo,
                      });
                    }
                  }}
                  onSidebarUpdate={handleSidebarUpdate}
                />
              }
            >
              <div className="flex h-full flex-col">
                <Header onNavigate={handleHeaderNavigate} />
                <ChatList
                  chatRooms={chatRooms}
                  selectedChatId={selectedChat?.idChatroom}
                  onSelectChat={handleSelectChat}
                  onDeleteConversation={handleDeleteConversation}
                  onUnfriend={handleUnfriend}
                  onBlock={handleBlock}
                  isLoading={isLoadingRooms}
                />
              </div>
            </ResizablePanel>
          </div>
        ) : activeTab === "friends" ? (
          <FriendsView
            defaultTab={friendsTab}
            onBackToChat={() => setActiveTab("chat")}
            onSelectProfile={(userObj) => setSelectedProfile(userObj)}
            onStartChat={handleStartChatWithUser}
          />
        ) : activeTab === "profile" ? (
          <ProfileView
            isOtherProfile={false}
            onBack={() => setActiveTab("chat")}
            onProfileUpdated={(updated) => {
              // Update local state if needed
            }}
          />
        ) : activeTab === "restricted" ? (
          <RestrictedAccountsView onBackToChat={() => setActiveTab("chat")} />
        ) : activeTab === "settings" ? (
          <SettingsPage />
        ) : (
          <div className="flex flex-1 items-center justify-center text-[var(--text-muted)]">
            <p className="text-lg font-medium">Đang tải...</p>
          </div>
        )}
      </div>
    </div>
  );
}
