import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import ConnectToMongoDB from "./db/connectToMongoDB.js";
import bodyParser from "body-parser";
import { app, server } from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT;

app.use(bodyParser.json({ limit: "50mb" }));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(PORT, () => {
	ConnectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});