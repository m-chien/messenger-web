"use client";

import { useState } from "react";
import { Camera, Eye, EyeOff, UserPlus, Search, MoreHorizontal } from "lucide-react";

export function UserSettings() {
  const [activeSubTab, setActiveSubTab] = useState("password");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tabs = [
    "Profile",
    "Password",
    "Friends",
    "Notifications",
    "Privacy",
  ];

  const mockFriends = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "A", status: "Online" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "B", status: "Offline" },
    { id: 3, name: "Carol White", email: "carol@example.com", avatar: "C", status: "Away" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--chat-bg)] text-[var(--text-color)]">
      {/* Banner */}
      <div className="h-48 w-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 relative">
        {/* Profile Picture (Overlapping) */}
        <div className="absolute -bottom-16 left-12">
          <div className="relative group">
            <div className="h-32 w-32 rounded-full border-4 border-[var(--chat-bg)] overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div className="pt-20 px-12 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-[var(--text-muted)]">olivia@untitledui.com</p>
        </div>
        <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-[var(--sidebar-bg)] transition-colors">
          View profile
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 px-12 border-b border-[var(--border-color)] overflow-x-auto">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab.toLowerCase())}
              className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                activeSubTab === tab.toLowerCase()
                  ? "text-[var(--primary-color)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-color)]"
              }`}
            >
              {tab}
              {activeSubTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-color)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl px-12 py-10">
        
        {activeSubTab === "password" && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold">Password</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Please enter your current password to change your password.
              </p>
            </div>

            <div className="space-y-6">
              {/* Current Password */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Current password</label>
                <div className="md:col-span-2 relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    defaultValue="password123"
                    className="w-full px-4 py-2 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="border-t border-[var(--border-color)] pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium pt-2">New password</label>
                  <div className="md:col-span-2">
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      Your new password must be more than 8 characters.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-color)] pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-sm font-medium">Confirm new password</label>
                  <div className="md:col-span-2 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-12 flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
              <button className="px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-lg hover:bg-[var(--sidebar-bg)] transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-[#101828] text-white rounded-lg hover:bg-black transition-colors shadow-sm">
                Update password
              </button>
            </div>
          </div>
        )}

        {activeSubTab === "friends" && (
          <div>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Friends</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Manage your friends list and find new connections.
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-sm">
                <UserPlus className="h-4 w-4" />
                Add friend
              </button>
            </div>

            {/* Search Friends */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full pl-10 pr-4 py-2 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
              />
            </div>

            {/* Friends List */}
            <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--chat-bg)]">
              {mockFriends.map((friend, idx) => (
                <div 
                  key={friend.id} 
                  className={`flex items-center justify-between p-4 ${
                    idx !== mockFriends.length - 1 ? "border-b border-[var(--border-color)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {friend.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium">{friend.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{friend.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      friend.status === "Online" ? "bg-green-100 text-green-700" :
                      friend.status === "Offline" ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {friend.status}
                    </span>
                    <button className="p-2 text-[var(--text-muted)] hover:bg-[var(--sidebar-bg)] rounded-lg transition-colors">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === "profile" && (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Update your personal details and how others see you.
              </p>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <label className="text-sm font-medium pt-2">Full name</label>
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    defaultValue="Olivia"
                    placeholder="First name"
                    className="w-full px-4 py-2 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                  />
                  <input
                    type="text"
                    defaultValue="Rhye"
                    placeholder="Last name"
                    className="w-full px-4 py-2 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="border-t border-[var(--border-color)] pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium">Email address</label>
                <div className="md:col-span-2">
                  <input
                    type="email"
                    defaultValue="olivia@untitledui.com"
                    className="w-full px-4 py-2 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="border-t border-[var(--border-color)] pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="text-sm font-medium block">Bio</label>
                  <span className="text-xs text-[var(--text-muted)]">Write a short introduction.</span>
                </div>
                <div className="md:col-span-2">
                  <textarea
                    rows={4}
                    defaultValue="Product Designer based in Melbourne, Australia. I specialize in UX/UI design, brand identity, and typography."
                    className="w-full px-4 py-2 bg-[var(--chat-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-12 flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
              <button className="px-4 py-2 text-sm font-medium border border-[var(--border-color)] rounded-lg hover:bg-[var(--sidebar-bg)] transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-[#101828] text-white rounded-lg hover:bg-black transition-colors shadow-sm">
                Save changes
              </button>
            </div>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {(activeSubTab === "notifications" || activeSubTab === "privacy") && (
          <div className="py-20 text-center text-[var(--text-muted)]">
            <p className="text-lg font-medium capitalize">{activeSubTab} settings</p>
            <p className="text-sm mt-2">This section is currently under development.</p>
          </div>
        )}

      </div>
    </div>
  );
}
