"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowLeft, Search, Shield, ShieldOff } from "lucide-react";
import { blockService } from "@/services/blockService";
import { userService } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/user";

import { formatMediaUrl } from "@/services/api";

interface RestrictedUser extends User {
  blockId: number;
  blockedDate?: string;
}

interface RestrictedAccountsViewProps {
  onBackToChat?: () => void;
}

export function RestrictedAccountsView({
  onBackToChat,
}: RestrictedAccountsViewProps) {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [restrictedUsers, setRestrictedUsers] = useState<RestrictedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRestricted = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const [allUsers, blockList] = await Promise.all([
        userService.getAllUsers(),
        blockService.getBlockList(),
      ]);

      const myBlocks = blockList.filter((b) => b.blocker === currentUser.id);

      const mapped: RestrictedUser[] = [];
      for (const block of myBlocks) {
        const matchedUser = allUsers.find((u) => u.id === block.blocked);
        if (matchedUser) {
          mapped.push({
            ...matchedUser,
            blockId: block.id,
            blockedDate: block.blockedDate,
          });
        }
      }

      setRestrictedUsers(mapped);
    } catch (err) {
      console.error("Error loading blocked users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchRestricted();
  }, [fetchRestricted]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return restrictedUsers;
    return restrictedUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [restrictedUsers, searchQuery]);

  const handleUnblock = async (blockId: number) => {
    try {
      setActionLoading(true);
      await blockService.unblock(blockId);
      setRestrictedUsers((prev) => prev.filter((b) => b.blockId !== blockId));
    } catch (err) {
      console.error("Failed to unblock user:", err);
      alert("Lỗi khi bỏ chặn người dùng.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--chat-bg)] text-[var(--text-color)] overflow-hidden">
      {/* Header */}
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
            <div className="flex items-center gap-2">
              <Shield size={22} className="text-red-500" />
              <h1 className="text-2xl font-bold text-[var(--text-color)]">
                Tài khoản hạn chế
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài khoản đã chặn..."
              className="w-full rounded-full bg-[var(--chat-bg)] py-2 pl-10 pr-4 text-xs text-[var(--text-color)] placeholder-[var(--text-muted)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Những người trong danh sách này sẽ không thể gửi tin nhắn hoặc gọi điện cho bạn.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-4 animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-[var(--border-color)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-[var(--border-color)]" />
                  <div className="h-3 w-1/2 rounded bg-[var(--border-color)]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => {
              const avatarUrl = formatMediaUrl(user.avatarUrl);

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-4 shadow-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full overflow-hidden bg-gradient-to-tr from-red-500 to-orange-500 text-white font-bold text-base shadow-xs">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={user.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="truncate text-sm font-semibold text-[var(--text-color)]">
                        {user.name}
                      </h3>
                      <p className="truncate text-xs text-[var(--text-muted)]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnblock(user.blockId)}
                    disabled={actionLoading}
                    className="flex-shrink-0 rounded-xl bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-500/20 active:scale-95 transition-all shadow-xs"
                  >
                    Bỏ chặn
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-72 flex-col items-center justify-center text-center text-[var(--text-muted)]">
            <ShieldOff size={48} className="mb-3 opacity-40 text-emerald-500" />
            <h3 className="text-base font-semibold text-[var(--text-color)] mb-1">
              {searchQuery
                ? "Không tìm thấy tài khoản phù hợp"
                : "Không có tài khoản bị hạn chế"}
            </h3>
            <p className="text-xs max-w-xs">
              {searchQuery
                ? "Thử tìm kiếm với tên hoặc email khác."
                : "Bạn chưa chặn bất kỳ ai."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
