"use client";

import { useState } from "react";
import { MessageCircle, Bell, Lock, Globe, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login
  };

  const handleGoogleLogin = () => {
    // Handle Google login
  };

  const features = [
    { icon: Bell, text: "Nhắn tin tức thời với bạn bè" },
    { icon: Lock, text: "Bảo mật hàng đầu cho tin nhắn của bạn" },
    { icon: Globe, text: "Truy cập mọi lúc mọi nơi" },
    { icon: Sparkles, text: "Giao diện hiện đại và dễ sử dụng" },
  ];

  return (
    <div className="flex min-h-[600px] md:min-h-[700px]">
      {/* Left Panel - Features */}
      <div className="hidden lg:flex w-1/2 bg-[var(--slim-sidebar-bg)] flex-col justify-center px-12 py-12">
        <div className="space-y-12">
          {/* Logo & Title */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-color)] shadow-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">ChatHub</h1>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              Kết nối ngay, trò chuyện vui. Nơi những cuộc hội thoại trở nên ý
              nghĩa và thú vị.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-[var(--chat-bg)] rounded-[20px] px-6 py-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Icon className="h-5 w-5 text-[var(--primary-color)] flex-shrink-0" />
                  <span className="text-[var(--feature-text-color)] font-medium">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-[var(--chat-bg)] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-4xl font-bold text-[var(--text-color)] mb-2">
            Đăng Nhập
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            Chào mừng quay lại ChatHub
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">
                Email hoặc số điện thoại
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-[var(--border-color)] bg-[var(--sidebar-bg)] px-4 py-3 text-[var(--text-color)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary-color)]"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-[var(--border-color)] bg-[var(--sidebar-bg)] px-4 py-3 text-[var(--text-color)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary-color)]"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[var(--primary-color)] to-orange-500 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
            >
              <Lock className="h-5 w-5" />
              Đăng Nhập
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 border-t border-[var(--border-color)]" />
            <span className="text-xs text-[var(--text-muted)] font-medium">
              hoặc tiếp tục với
            </span>
            <div className="flex-1 border-t border-[var(--border-color)]" />
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--chat-bg)] px-4 py-3 font-semibold text-[var(--text-color)] transition-all hover:bg-[var(--sidebar-bg)] hover:border-[var(--primary-color)]"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: "20px", height: "20px" }}
            />
            Đăng nhập bằng Google
          </button>

          {/* Links */}
          <div className="mt-8 space-y-2 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-bold text-[var(--primary-color)] transition-colors hover:opacity-80"
              >
                Tạo tài khoản mới
              </Link>
            </p>
            <p>
              <a
                href="#"
                className="text-sm font-bold text-[var(--primary-color)] transition-colors hover:opacity-80"
              >
                Quên mật khẩu?
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
