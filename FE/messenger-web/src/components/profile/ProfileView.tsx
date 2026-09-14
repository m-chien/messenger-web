"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  LogOut,
  Mail,
  Phone,
  Camera,
  MessageSquare,
  MoreVertical,
  ShieldAlert,
  Users,
  Check,
  X,
} from "lucide-react";
import { FastAverageColor } from "fast-average-color";
import { userService } from "@/services/userService";
import { friendService } from "@/services/friendService";
import { blockService } from "@/services/blockService";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/user";

import { formatMediaUrl } from "@/services/api";

interface ProfileViewProps {
  userData?: any;
  isOtherProfile?: boolean;
  onBack?: () => void;
  onStartChat?: (user: any) => void;
  onProfileUpdated?: (updatedUser: User) => void;
}

export function ProfileView({
  userData: externalUserData,
  isOtherProfile = false,
  onBack,
  onStartChat,
  onProfileUpdated,
}: ProfileViewProps) {
  const { user: authUser, setUser: setAuthUser, logout } = useAuth();

  const user = isOtherProfile ? externalUserData : authUser;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(" ")[0] || "",
    lastName:
      user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const [headerGradient, setHeaderGradient] = useState(
    "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
  );
  const [mutualFriends, setMutualFriends] = useState<User[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = formatMediaUrl(user?.avatarUrl || user?.avatar);

  // Dynamic dominant color extraction
  useEffect(() => {
    if (avatarUrl) {
      const fac = new FastAverageColor();
      fac
        .getColorAsync(avatarUrl)
        .then((color) => {
          const [r, g, b] = color.value;
          setHeaderGradient(
            `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.85) 0%, rgba(${Math.max(
              0,
              r - 40
            )}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 0.4) 100%)`
          );
        })
        .catch(() => {
          // fallback
        });
    }
  }, [avatarUrl]);

  // Load mutual friends for other user's profile
  useEffect(() => {
    const targetId = user?.userId || user?.id;
    if (isOtherProfile && targetId) {
      friendService
        .getMutualFriends(targetId)
        .then((data) => setMutualFriends(data || []))
        .catch((err) => console.error("Error fetching mutual friends:", err));
    }
  }, [isOtherProfile, user]);

  // Update form data when user changes
  useEffect(() => {
    setFormData({
      firstName: user?.firstName || user?.name?.split(" ")[0] || "",
      lastName:
        user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    });
  }, [user]);

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setStatusMessage(null);
      const res = await userService.updateAvatar(file);
      const newAvatarUrl = res.result || res.data || "";

      if (authUser) {
        const updated = { ...authUser, avatarUrl: newAvatarUrl };
        setAuthUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        onProfileUpdated?.(updated);
      }
      setStatusMessage({
        type: "success",
        text: "Ảnh đại diện đã được cập nhật thành công!",
      });
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      setStatusMessage({
        type: "error",
        text: "Lỗi tải lên ảnh đại diện. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Save Profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setStatusMessage(null);

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const payload: Partial<User> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: fullName,
        phone: formData.phone,
        bio: formData.bio,
      };

      await userService.updateUser(user.id, payload);

      if (authUser) {
        const updated = { ...authUser, ...payload };
        setAuthUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        onProfileUpdated?.(updated);
      }

      setIsEditing(false);
      setStatusMessage({
        type: "success",
        text: "Thông tin cá nhân đã được cập nhật!",
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
      setStatusMessage({
        type: "error",
        text: "Cập nhật hồ sơ thất bại. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Block User
  const handleBlockUser = async () => {
    const targetId = user?.userId || user?.id;
    if (!targetId) return;

    if (!confirm(`Bạn có chắc muốn chặn ${user.name}?`)) return;

    try {
      setIsLoading(true);
      await blockService.blockUser(targetId);
      alert("Đã chặn người dùng này.");
      setShowMenu(false);
      onBack?.();
    } catch (err) {
      console.error("Error blocking user:", err);
      alert("Lỗi khi chặn người dùng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--chat-bg)] text-[var(--text-color)] overflow-y-auto">
      {/* Container */}
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--sidebar-bg)] shadow-lg">
          {/* Header Banner */}
          <div
            className="relative h-48 w-full p-6 transition-colors duration-500 flex items-start justify-between"
            style={{ background: headerGradient }}
          >
            {/* Back button */}
            {isOtherProfile && onBack && (
              <button
                onClick={onBack}
                className="rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors backdrop-blur-sm shadow-xs"
                title="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <div className="flex-1" />

            {/* Menu Options for other profile */}
            {isOtherProfile && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-colors backdrop-blur-sm shadow-xs"
                  title="Tùy chọn"
                >
                  <MoreVertical size={20} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-10 z-30 w-44 rounded-2xl bg-[var(--chat-bg)] border border-[var(--border-color)] p-1.5 shadow-xl animate-in fade-in zoom-in-95">
                    <button
                      onClick={handleBlockUser}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <ShieldAlert size={14} />
                      <span>Chặn người này</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Details Container */}
          <div className="relative px-8 pb-8">
            {/* Avatar - overlaps banner */}
            <div className="relative -mt-20 mb-4 flex items-end justify-between">
              <div className="relative group">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[var(--sidebar-bg)] overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-4xl shadow-xl">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                {!isOtherProfile && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="absolute bottom-1 right-1 rounded-full bg-[var(--primary-color)] p-2.5 text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                    title="Đổi ảnh đại diện"
                  >
                    <Camera size={16} />
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {isOtherProfile ? (
                  onStartChat && (
                    <button
                      onClick={() => onStartChat(user)}
                      className="flex items-center gap-2 rounded-2xl bg-[var(--primary-color)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
                    >
                      <MessageSquare size={16} />
                      <span>Nhắn tin</span>
                    </button>
                  )
                ) : !isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--chat-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors shadow-xs"
                  >
                    <Edit2 size={16} />
                    <span>Chỉnh sửa hồ sơ</span>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Name & Email */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[var(--text-color)]">
                {user?.name || "Người dùng"}
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Status alerts */}
            {statusMessage && (
              <div
                className={`mb-6 rounded-2xl p-4 text-xs font-semibold ${
                  statusMessage.type === "success"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-600 border border-red-500/20"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            {/* Editing Form vs View Mode */}
            {isEditing && !isOtherProfile ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)] px-4 py-2.5 text-sm text-[var(--text-color)] outline-none focus:border-[var(--primary-color)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                      Họ & tên đệm
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)] px-4 py-2.5 text-sm text-[var(--text-color)] outline-none focus:border-[var(--primary-color)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)] px-4 py-2.5 text-sm text-[var(--text-color)] outline-none focus:border-[var(--primary-color)]"
                    placeholder="Chưa có số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1">
                    Tiểu sử
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)] px-4 py-2.5 text-sm text-[var(--text-color)] outline-none focus:border-[var(--primary-color)] resize-none"
                    placeholder="Viết đôi dòng giới thiệu về bạn..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary-color)] py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Check size={16} />
                    <span>Lưu thay đổi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--chat-bg)] py-2.5 text-sm font-semibold text-[var(--text-color)] hover:bg-[var(--hover-color)] transition-colors"
                  >
                    <X size={16} />
                    <span>Hủy</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--chat-bg)] p-4 shadow-xs">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                      <Mail size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        Email
                      </span>
                      <p className="truncate text-xs font-semibold text-[var(--text-color)]">
                        {user?.email || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--chat-bg)] p-4 shadow-xs">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                      <Phone size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        Điện thoại
                      </span>
                      <p className="truncate text-xs font-semibold text-[var(--text-color)]">
                        {user?.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--border-color)] bg-[var(--chat-bg)] p-4 shadow-xs">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)]">
                      <Calendar size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        Ngày tham gia
                      </span>
                      <p className="truncate text-xs font-semibold text-[var(--text-color)]">
                        {new Date().toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {user?.bio && (
                  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--chat-bg)] p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      Tiểu sử
                    </h3>
                    <p className="text-sm text-[var(--text-color)] leading-relaxed">
                      {user.bio}
                    </p>
                  </div>
                )}

                {/* Mutual Friends (for other user profile) */}
                {isOtherProfile && mutualFriends.length > 0 && (
                  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--chat-bg)] p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={18} className="text-[var(--primary-color)]" />
                      <h3 className="text-sm font-bold text-[var(--text-color)]">
                        Bạn chung ({mutualFriends.length})
                      </h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {mutualFriends.map((mf) => (
                        <div
                          key={mf.id}
                          className="flex flex-col items-center gap-1 min-w-[64px]"
                        >
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                            {mf.avatarUrl ? (
                              <img
                                src={formatMediaUrl(mf.avatarUrl)}
                                alt={mf.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              mf.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="truncate max-w-[64px] text-[11px] text-[var(--text-color)] text-center">
                            {mf.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logout button for own profile */}
                {!isOtherProfile && (
                  <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
