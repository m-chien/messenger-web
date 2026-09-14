"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  UserPlus,
  Globe,
  Search,
  UserCheck,
  UserX,
  ArrowLeft,
  MessageSquare,
  Clock,
} from "lucide-react";
import { friendService } from "@/services/friendService";
import { userService } from "@/services/userService";
import { blockService } from "@/services/blockService";
import { useAuth } from "@/contexts/AuthContext";
import { FriendDetailDTO, FriendRequestDetailDTO } from "@/types/friend";
import { User } from "@/types/user";
import { formatMediaUrl } from "@/services/api";

interface FriendsViewProps {
  defaultTab?: "friends" | "requests" | "discover";
  onBackToChat?: () => void;
  onSelectProfile?: (user: any) => void;
  onStartChat?: (user: any) => void;
}

export function FriendsView({
  defaultTab = "friends",
  onBackToChat,
  onSelectProfile,
  onStartChat,
}: FriendsViewProps) {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "discover">(
    defaultTab
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<FriendDetailDTO[]>([]);
  const [requests, setRequests] = useState<FriendRequestDetailDTO[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Load all initial data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [friendsData, requestsData, usersData] = await Promise.allSettled([
        friendService.getFriends(),
        friendService.getFriendRequests(),
        userService.getAllUsers(),
      ]);

      if (friendsData.status === "fulfilled") {
        setFriends(friendsData.value || []);
      }
      if (requestsData.status === "fulfilled") {
        setRequests(requestsData.value || []);
      }
      if (usersData.status === "fulfilled") {
        setAllUsers(usersData.value || []);
      }
    } catch (err) {
      console.error("Error loading friends data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter Friends
  const filteredFriends = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return friends;
    return friends.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q)
    );
  }, [friends, searchQuery]);

  // Filter Requests
  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        r.senderName?.toLowerCase().includes(q) ||
        r.senderEmail?.toLowerCase().includes(q)
    );
  }, [requests, searchQuery]);

  // Discover users (exclude self and current friends)
  const filteredDiscover = useMemo(() => {
    const friendUserIds = new Set(friends.map((f) => f.userId));
    const available = allUsers.filter(
      (u) => u.id !== currentUser?.id && !friendUserIds.has(u.id)
    );
    const q = searchQuery.toLowerCase().trim();
    if (!q) return available;
    return available.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [allUsers, currentUser?.id, friends, searchQuery]);

  // Handle Accept
  const handleAccept = async (requestId: number) => {
    try {
      setActionLoading(true);
      await friendService.acceptRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      const updatedFriends = await friendService.getFriends();
      setFriends(updatedFriends);
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject
  const handleReject = async (requestId: number) => {
    try {
      setActionLoading(true);
      await friendService.rejectRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } catch (err) {
      console.error("Failed to reject friend request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Remove Friend
  const handleRemoveFriend = async (friendId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa người bạn này?")) return;

    try {
      setActionLoading(true);
      await friendService.removeFriend(friendId);
      setFriends((prev) => prev.filter((f) => f.userId !== friendId));
    } catch (err) {
      console.error("Failed to remove friend:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Send Friend Request
  const handleSendRequest = async (receiverId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser?.id) return;
    try {
      setActionLoading(true);
      await friendService.sendFriendRequest(currentUser.id, receiverId);
      setSentRequests((prev) => new Set([...prev, receiverId]));
    } catch (err) {
      console.error("Failed to send friend request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Click on user to view profile
  const handleProfileClick = async (userObj: any) => {
    const targetUserId = userObj.userId || userObj.id;
    if (!targetUserId) return;

    try {
      const isBlocked = await blockService.checkBlock(targetUserId);
      if (isBlocked) {
        alert(
          "Bạn không thể xem trang cá nhân của người này vì đã bị hạn chế hoặc bạn đã chặn họ."
        );
        return;
      }
    } catch {
      // Continue anyway
    }

    onSelectProfile?.(userObj);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--chat-bg)] text-[var(--text-color)] overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-color)] px-8 py-5 bg-[var(--sidebar-bg)] shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToChat && (
              <button
                onClick={onBackToChat}
                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--hover-color)] hover:text-[var(--text-color)] transition-colors"
                title="Quay lại đoạn chat"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-2xl font-bold text-[var(--text-color)]">
              Bạn bè
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bạn bè, email..."
              className="w-full rounded-full bg-[var(--chat-bg)] py-2 pl-10 pr-4 text-xs text-[var(--text-color)] placeholder-[var(--text-muted)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
            />
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "friends"
                ? "bg-[var(--primary-color)] text-white shadow-sm"
                : "bg-[var(--chat-bg)] text-[var(--text-muted)] hover:text-[var(--text-color)] border border-[var(--border-color)]"
            }`}
          >
            <Users size={16} />
            <span>Danh sách bạn bè</span>
            {friends.length > 0 && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === "friends"
                    ? "bg-white/20 text-white"
                    : "bg-[var(--hover-color)] text-[var(--text-color)]"
                }`}
              >
                {friends.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "requests"
                ? "bg-[var(--primary-color)] text-white shadow-sm"
                : "bg-[var(--chat-bg)] text-[var(--text-muted)] hover:text-[var(--text-color)] border border-[var(--border-color)]"
            }`}
          >
            <UserPlus size={16} />
            <span>Yêu cầu kết bạn</span>
            {requests.length > 0 && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === "requests"
                    ? "bg-white/20 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {requests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("discover")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "discover"
                ? "bg-[var(--primary-color)] text-white shadow-sm"
                : "bg-[var(--chat-bg)] text-[var(--text-muted)] hover:text-[var(--text-color)] border border-[var(--border-color)]"
            }`}
          >
            <Globe size={16} />
            <span>Khám phá</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-4 animate-pulse"
              >
                <div className="h-14 w-14 rounded-full bg-[var(--border-color)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-[var(--border-color)]" />
                  <div className="h-3 w-1/2 rounded bg-[var(--border-color)]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* TAB 1: FRIENDS LIST */}
            {activeTab === "friends" && (
              <div>
                {filteredFriends.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredFriends.map((friend) => {
                      const avatarUrl = formatMediaUrl(friend.avatarUrl);

                      return (
                        <div
                          key={friend.userId}
                          onClick={() => handleProfileClick(friend)}
                          className="group relative flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-4 shadow-xs transition-all hover:border-[var(--primary-color)] hover:shadow-md cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 overflow-hidden">
                            <div className="relative flex-shrink-0">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-base shadow-xs">
                                {avatarUrl ? (
                                  <img
                                    src={avatarUrl}
                                    alt={friend.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  friend.name?.charAt(0).toUpperCase() || "U"
                                )}
                              </div>
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="truncate text-sm font-semibold text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors">
                                {friend.name}
                              </h3>
                              <p className="truncate text-xs text-[var(--text-muted)]">
                                {friend.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {onStartChat && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStartChat(friend);
                                }}
                                className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--primary-color)] hover:text-white transition-all shadow-xs"
                                title="Nhắn tin"
                              >
                                <MessageSquare size={16} />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleRemoveFriend(friend.userId, e)}
                              disabled={actionLoading}
                              className="rounded-full p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                              title="Hủy kết bạn"
                            >
                              <UserX size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-72 flex-col items-center justify-center text-center text-[var(--text-muted)]">
                    <Users size={48} className="mb-3 opacity-40" />
                    <h3 className="text-base font-semibold text-[var(--text-color)] mb-1">
                      {searchQuery
                        ? "Không tìm thấy bạn bè phù hợp"
                        : "Bạn chưa có bạn bè nào"}
                    </h3>
                    <p className="text-xs max-w-xs">
                      Hãy chuyển sang tab &quot;Khám phá&quot; để tìm và kết nối với mọi người!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FRIEND REQUESTS */}
            {activeTab === "requests" && (
              <div>
                {filteredRequests.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredRequests.map((req) => {
                      const avatarUrl = formatMediaUrl(req.senderAvatarUrl);

                      return (
                        <div
                          key={req.requestId}
                          className="flex flex-col gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-4 shadow-xs"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-base shadow-xs">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt={req.senderName}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                req.senderName?.charAt(0).toUpperCase() || "U"
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="truncate text-sm font-semibold text-[var(--text-color)]">
                                {req.senderName}
                              </h3>
                              <p className="truncate text-xs text-[var(--text-muted)]">
                                {req.senderEmail}
                              </p>
                              {req.dateSend && (
                                <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mt-0.5">
                                  <Clock size={10} />
                                  {new Date(req.dateSend).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                            <button
                              onClick={() => handleAccept(req.requestId)}
                              disabled={actionLoading}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--primary-color)] py-2 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-opacity"
                            >
                              <UserCheck size={14} />
                              <span>Chấp nhận</span>
                            </button>
                            <button
                              onClick={() => handleReject(req.requestId)}
                              disabled={actionLoading}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--chat-bg)] py-2 text-xs font-semibold text-[var(--text-color)] border border-[var(--border-color)] hover:bg-[var(--hover-color)] transition-colors"
                            >
                              <UserX size={14} />
                              <span>Từ chối</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-72 flex-col items-center justify-center text-center text-[var(--text-muted)]">
                    <UserPlus size={48} className="mb-3 opacity-40" />
                    <h3 className="text-base font-semibold text-[var(--text-color)] mb-1">
                      Không có lời mời kết bạn nào
                    </h3>
                    <p className="text-xs max-w-xs">
                      Khi có người gửi lời mời kết bạn cho bạn, yêu cầu sẽ hiển thị tại đây.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DISCOVER */}
            {activeTab === "discover" && (
              <div>
                {filteredDiscover.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredDiscover.map((u) => {
                      const avatarUrl = formatMediaUrl(u.avatarUrl);

                      const isSent = sentRequests.has(u.id);

                      return (
                        <div
                          key={u.id}
                          onClick={() => handleProfileClick(u)}
                          className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-4 shadow-xs transition-all hover:border-[var(--primary-color)] hover:shadow-md cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 overflow-hidden mb-3">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-base shadow-xs">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt={u.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                u.name?.charAt(0).toUpperCase() || "U"
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="truncate text-sm font-semibold text-[var(--text-color)] group-hover:text-[var(--primary-color)] transition-colors">
                                {u.name}
                              </h3>
                              <p className="truncate text-xs text-[var(--text-muted)]">
                                {u.email}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleSendRequest(u.id, e)}
                            disabled={actionLoading || isSent}
                            className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
                              isSent
                                ? "bg-[var(--chat-bg)] text-[var(--text-muted)] border border-[var(--border-color)] cursor-not-allowed"
                                : "bg-[var(--primary-color)] text-white shadow-xs hover:opacity-90"
                            }`}
                          >
                            <UserPlus size={14} />
                            <span>{isSent ? "Đã gửi lời mời" : "Kết bạn"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-72 flex-col items-center justify-center text-center text-[var(--text-muted)]">
                    <Globe size={48} className="mb-3 opacity-40" />
                    <h3 className="text-base font-semibold text-[var(--text-color)] mb-1">
                      {searchQuery
                        ? "Không tìm thấy người dùng phù hợp"
                        : "Không có người dùng mới"}
                    </h3>
                    <p className="text-xs max-w-xs">
                      Thử tìm kiếm với tên hoặc email khác.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
