import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import multer from "multer";
const router = express.Router();
const storage = multer.diskStorage({
    destination: './uploads', // Specify your desired folder
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original filename
    },
});
const upload = multer({ storage: storage });
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id",protectRoute,upload.single("file"),  sendMessage);

export default router;