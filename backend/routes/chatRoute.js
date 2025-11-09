import express from "express";
import { handleChat,handleClassify} from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", handleChat);
router.post("/classify", handleClassify);

export default router;