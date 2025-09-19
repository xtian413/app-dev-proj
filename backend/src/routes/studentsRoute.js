import express from "express";
import { getAllStudents, getStudentByRfid } from "../controllers/studentsController.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:rfid", getStudentByRfid);

export default router;
