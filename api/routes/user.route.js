import express from "express";
import { test } from "../controllers/user.controller.js";

const router = express.Router();

//http://localhost:3000/api/user/test
router.get("/test", test);

export default router; 