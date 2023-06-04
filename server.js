const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { WebcastPushConnection } = require("tiktok-live-connector");

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

// Username of someone who is currently live
let tiktokUsername = "embe2309_";

// Create a new wrapper object and pass the username
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

tiktokLiveConnection
  .connect()
  .then((state) => {
    console.info(`Connected to roomId ${state.roomId}`);
  })
  .catch((err) => {
    console.error("Failed to connect", err);
  });

  tiktokLiveConnection.on("chat", (data) => {
    console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
  });

// Khởi động HTTP server
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
