const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();

// Tạo một HTTP server để phục vụ ứng dụng Express
const server = http.createServer(app);

// Tạo một WebSocket server và liên kết nó đến HTTP server
const wss = new WebSocket.Server({ server });

// Khai báo biến đếm
let count = 0;

// Mỗi giây tăng biến đếm lên 1 giá trị
setInterval(() => {
    count++;
    // console.log(count);
  // Gửi giá trị đếm tới tất cả các kết nối WebSocket đang mở
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(count.toString());
    }
  });
}, 2000);

// Khởi động HTTP server
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
