import express from "express";
import { getAllStudents, getStudentByRfid, registerStudent } from "../controllers/studentsController.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:rfid", getStudentByRfid);
router.post("/", registerStudent);

export default router;
