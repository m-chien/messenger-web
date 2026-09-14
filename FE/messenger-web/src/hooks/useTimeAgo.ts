export function timeAgo(timestamp?: string | number | Date): string {
  if (!timestamp) return "";
  const now = new Date();
  const past = new Date(timestamp);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // in seconds

  if (diff < 60) return `${Math.max(0, diff)} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export default timeAgo;
