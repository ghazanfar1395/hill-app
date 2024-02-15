import dotenv from "dotenv";
import fs from "fs";
import http from "http";
//import https from "https";
//import { Server as SocketIOServer } from "socket.io"; // Import the Server class
// import { io } from "./socket";

dotenv.config();
import app from "./hill-server";

const PORT = process.env.SERVER_PORT;

const server = http.createServer(app);

//const io = new SocketIOServer(server);

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   io.emit("message", "Connected to server");

//   // Handle events here
//   socket.on("chat message", (message) => {
//     console.log(`Received message: ${message}`);
//     // Broadcast the message to all connected clients
//     io.emit("chat message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });
