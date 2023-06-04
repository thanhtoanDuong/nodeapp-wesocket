const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const { WebcastPushConnection } = require("tiktok-live-connector");

const app = express();

// Tạo một HTTP server để phục vụ ứng dụng Express
const server = http.createServer(app);

// Thiết lập middleware body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Xử lý yêu cầu HTTP POST
app.post("/api/users", (req, res) => {
  console.log(req.body);
  //   const { name, email } = req.body;
  //   // Xử lý dữ liệu được gửi lên trong yêu cầu POST
  //   console.log(`Received POST request with name=${name} and email=${email}`);
  //   // Trả về phản hồi HTTP với mã trạng thái 201 (Created)
  res.status(201).send("User created successfully");
});

// Tạo một WebSocket server và liên kết nó đến HTTP server
const wss = new WebSocket.Server({ server });

// Username of someone who is currently live
let tiktokUsername = "he200496";

// Create a new wrapper object and pass the username
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

const tiktokConnectionWrapper = (key) => {
  tiktokLiveConnection.on(key, (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ key: key, data }));
      }
    });
  });
};

tiktokLiveConnection
  .connect()
  .then((state) => {
    console.info(`Connected to roomId ${state.roomId}`);
  })
  .catch((err) => {
    console.error("Failed to connect", err);
  });

tiktokConnectionWrapper("chat");
tiktokConnectionWrapper("member");
tiktokConnectionWrapper("social");
tiktokConnectionWrapper("roomUser");
tiktokConnectionWrapper("gift");
tiktokConnectionWrapper("like");

// Khởi động HTTP server
server.listen(3698, () => {
  console.log("Server listening on port 3698");
});
