import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {};

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

const MAX_ROOMS = 1000;
const usedRooms = new Set();

const allocateRoom = () => {
  for (let i = 1; i <= MAX_ROOMS; i++) {
    if (!usedRooms.has(i)) {
      usedRooms.add(i);
      return i;
    }
  }
  return null;
};

const releaseRoom = (room) => {
  usedRooms.delete(room);
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  //create a room where call will happen
  socket.on("room:join", (data) => {
    let { name, room,id } = data;
    const receiverId =id;
    if (!room) {
      room = allocateRoom();
      if (!room) {
        // No rooms available
        socket.emit("room:error", { message: "No rooms available" });
        return;
      }
    }
    emailToSocketIdMap.set(name, socket.id);
    socketidToEmailMap.set(socket.id, name);
    io.to(room).emit("user:joined", { name, id: socket.id });
    socket.join(room);
    const callerData = {
      ...data,
      room: room,
    };
    io.to(socket.id).emit("room:join", callerData);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("callIncoming", callerData);
    }
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

export { app, server, io };
