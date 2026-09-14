import http from "http";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
});

// Bắt lỗi kết nối để server không bị crash nếu backend hoặc Next.js khởi động chậm
proxy.on("error", (err, req, res) => {
  console.error(`[Proxy Error] ${req.url}:`, err.message);
  if (res && res.writeHead && !res.headersSent) {
    res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("502 Bad Gateway: Không thể kết nối tới dịch vụ nội bộ.");
  }
});

// Điều chỉnh header CORS trong phản hồi từ backend để client (ngrok, điện thoại) nhận đúng origin của mình
proxy.on("proxyRes", (proxyRes, req, res) => {
  const originalOrigin = req.headers["x-original-origin"];
  if (originalOrigin) {
    proxyRes.headers["access-control-allow-origin"] = originalOrigin;
    proxyRes.headers["access-control-allow-credentials"] = "true";
  }
});

// Toàn bộ các tiền tố API & tài nguyên của Backend Spring Boot
const BACKEND_ROUTES = [
  "/users",
  "/chatRooms",
  "/chatRoomUsers",
  "/messages",
  "/friends",
  "/friendRequests",
  "/files",
  "/api",
  "/ws",
  "/swagger-ui",
  "/v3/api-docs",
  "/img_user",
];

const server = http.createServer((req, res) => {
  const url = req.url || "";

  // Kiểm tra xem request có thuộc về Spring Boot Backend không
  const isBackend = BACKEND_ROUTES.some((route) => url.startsWith(route));

  if (isBackend) {
    // Nếu client gửi Origin (ví dụ từ ngrok hoặc domain di động),
    // ta lưu lại để trả về trong response, và giả lập Origin localhost:3000
    // để vượt qua CORS filter của Spring Security.
    if (req.headers.origin) {
      req.headers["x-original-origin"] = req.headers.origin;
      req.headers.origin = "http://localhost:3000";
    }
    req.headers.host = "localhost:8080";

    proxy.web(req, res, {
      target: "http://localhost:8080",
    });
    return;
  }

  // Next.js (HTML, CSS, JS chunks)
  // Xử lý origin cho Next.js dev server để tránh Next.js HMR cảnh báo
  if (req.headers.origin) {
    req.headers["x-original-origin"] = req.headers.origin;
  }

  proxy.web(req, res, {
    target: "http://localhost:3000",
  });
});

// Xử lý kết nối WebSocket (STOMP SockJS & Next.js HMR)
server.on("upgrade", (req, socket, head) => {
  const url = req.url || "";

  if (url.startsWith("/ws")) {
    req.headers.host = "localhost:8080";
    if (req.headers.origin) {
      req.headers["x-original-origin"] = req.headers.origin;
      req.headers.origin = "http://localhost:3000";
    }
    proxy.ws(req, socket, head, {
      target: "http://localhost:8080",
      changeOrigin: true,
    });
    return;
  }

  // Next.js Hot Module Replacement (HMR)
  req.headers.host = "localhost:3000";
  req.headers.origin = "http://localhost:3000";
  proxy.ws(req, socket, head, {
    target: "http://localhost:3000",
    changeOrigin: true,
  });
});

// Cổng của Gateway (Dùng 8888 để KHÔNG trùng với MinIO ở cổng 9000)
const GATEWAY_PORT = 8888;

server.listen(GATEWAY_PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Gateway Reverse Proxy đang chạy tại: http://localhost:${GATEWAY_PORT}`);
  console.log(`   - Frontend Next.js:    http://localhost:3000`);
  console.log(`   - Backend Spring Boot: http://localhost:8080`);
  console.log(`   - Đã bật CORS bypass cho ngrok & thiết bị ngoại vi`);
  console.log(`-------------------------------------------------------`);
  console.log(`👉 BÂY GIỜ HÃY MỞ TERMINAL MỚI VÀ CHẠY:`);
  console.log(`   ngrok http ${GATEWAY_PORT}`);
  console.log(`=======================================================`);
});
