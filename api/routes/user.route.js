import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//http://localhost:3000/api/user/test
router.get("/test", test);
router.post('/update/:id', verifyToken, updateUser);

export default router; 