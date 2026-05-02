"use client";

import { useState } from "react";
import { Bell, Shield, Palette, Globe, MessageSquare, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { isDark, toggleTheme } = useTheme();

  const settingsTabs = [
    { id: "general", label: "General", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Safety", icon: Shield },
    { id: "chat", label: "Chat Settings", icon: MessageSquare },
    { id: "language", label: "Language", icon: Globe },
  ];

  const ActiveIcon = settingsTabs.find(t => t.id === activeTab)?.icon;

  return (
    <div className="flex h-full w-full bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden">
      {/* Settings Sidebar */}
      <div className="w-72 border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] flex flex-col">
        <div className="p-6 border-b border-[var(--border-color)]">
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[var(--primary-color)] text-white"
                  : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-color)]"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-2xl">
          {activeTab === "general" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">General Settings</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Manage your general application preferences.</p>
              </div>

              <div className="space-y-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)]">
                  <div>
                    <h4 className="font-medium">Appearance</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Customize how Messenger looks on your device.</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--sidebar-bg)] rounded-lg hover:bg-opacity-80 transition-colors"
                  >
                    {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span className="text-sm font-medium">{isDark ? "Dark Mode" : "Light Mode"}</span>
                  </button>
                </div>
                
                {/* Other General Settings Placeholder */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)]">
                  <div>
                    <h4 className="font-medium">Launch on Startup</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Automatically start Messenger when you log in.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Notifications</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Choose how you want to be notified.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)]">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Receive notifications when you get new messages.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)]">
                  <div>
                    <h4 className="font-medium">Sound</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Play sound for incoming messages.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Privacy & Safety</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Manage who can see your activity and contact you.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)]">
                  <div>
                    <h4 className="font-medium">Active Status</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Show when you're active together.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)]">
                  <div>
                    <h4 className="font-medium">Read Receipts</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Let people know when you've seen their messages.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Chat Settings</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Customize your messaging experience.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)]">
                  <div>
                    <h4 className="font-medium">Enter to Send</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Pressing Enter will send the message.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary-color)]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "language" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Language</h3>
                <p className="text-[var(--text-muted)] text-sm mb-6">Choose your preferred language.</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--chat-bg)]">
                  <h4 className="font-medium mb-4">Application Language</h4>
                  <select className="w-full p-2.5 bg-[var(--sidebar-bg)] border border-[var(--border-color)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all">
                    <option value="en">English (US)</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
