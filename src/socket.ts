import { Server as SocketIOServer } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new SocketIOServer(server);

// Set up event handlers or custom logic here, if needed

export { io }; // Export the `io` instance as a named export
