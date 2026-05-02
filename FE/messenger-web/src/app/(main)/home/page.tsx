"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatList } from "@/components/chat/ChatList";
import { ChatArea } from "@/components/chat/ChatArea";
import { ResizablePanel } from "@/components/layout/ResizablePanel";
import { UserSettings } from "@/components/user/UserSettings";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { AddFriendPage } from "@/components/friends/AddFriendPage";

const mockChats = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "A",
    onlineStatus: "online" as const,
  },
  { id: "2", name: "Bob Smith", avatar: "B", onlineStatus: "offline" as const },
  { id: "3", name: "Carol White", avatar: "C", onlineStatus: "away" as const },
  {
    id: "4",
    name: "David Brown",
    avatar: "D",
    onlineStatus: "online" as const,
  },
  { id: "5", name: "Emma Davis", avatar: "E", onlineStatus: "online" as const },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedChatId, setSelectedChatId] = useState("1");

  const selectedChat = mockChats.find((chat) => chat.id === selectedChatId);

  return (
    <div className="flex h-screen bg-[var(--bg-color)]">
      {/* Slim Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {activeTab === "chat" ? (
          <div className="flex-1 overflow-hidden">
            <ResizablePanel
              defaultWidth={30}
              minWidth={20}
              maxWidth={70}
              rightPanel={<ChatArea selectedChat={selectedChat} />}
            >
              <Header />
              <ChatList
                selectedChatId={selectedChatId}
                onSelectChat={setSelectedChatId}
              />
            </ResizablePanel>
          </div>
        ) : activeTab === "user" ? (
          <UserSettings />
        ) : activeTab === "settings" ? (
          <SettingsPage />
        ) : activeTab === "add-friend" ? (
          <AddFriendPage />
        ) : (
          <div className="flex flex-1 items-center justify-center text-[var(--text-muted)]">
            <p className="text-xl font-medium">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}
