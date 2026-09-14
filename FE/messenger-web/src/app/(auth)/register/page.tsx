"use client";

import { useState } from "react";
import { MessageCircle, Bell, Lock, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không đúng định dạng.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        name: fullName,
        email: email,
        pass: password,
      });

      setSuccess("Tạo tài khoản thành công! Đang chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message ||
          "Đăng ký thất bại. Email có thể đã được sử dụng."
      );
    } finally {
      setIsLoading(false);
    }
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
                  className="flex items-center gap-3 bg-[var(--chat-bg)] rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow"
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

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 bg-[var(--chat-bg)] flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-4xl font-bold text-[var(--text-color)] mb-2">
            Tạo Tài Khoản
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            Tham gia ChatHub ngay hôm nay
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-500 text-sm text-center">
                {success}
              </div>
            )}

            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">
                Họ Tên
              </label>
              <input
                type="text"
                placeholder="Tên của bạn"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border-2 border-[var(--border-color)] bg-[var(--sidebar-bg)] px-4 py-3 text-[var(--text-color)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary-color)]"
                required
              />
            </div>

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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-[var(--border-color)] bg-[var(--sidebar-bg)] px-4 py-3 text-[var(--text-color)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary-color)]"
                required
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-full bg-gradient-to-r from-[var(--primary-color)] to-orange-500 py-3 font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-xl hover:brightness-110 active:scale-95"
              }`}
            >
              <Lock className="h-5 w-5" />
              {isLoading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-2 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-bold text-[var(--primary-color)] transition-colors hover:opacity-80"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
