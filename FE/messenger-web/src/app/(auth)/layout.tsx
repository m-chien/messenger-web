export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-4 md:p-10">
      <div className="max-w-[1200px] w-full shadow-2xl rounded-3xl overflow-hidden bg-[var(--chat-bg)]">
        {children}
      </div>
    </div>
  );
}
