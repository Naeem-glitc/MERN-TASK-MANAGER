import create_admin from "../auth/create_admin.js"
import express from "express"
import Varify_Admin from "../middleware/varify.js"
import {AuthorizeAdmin,FeatchAdmin} from "../auth/AdminData.js"
import create_Developer from "../auth/create_developer.js"
import getAllDeveloper from "../auth/DeveloperData.js"
import {assignTask, fetchTask,updateStatus,removeTask} from "../auth/AssignTask.js"
const router = express.Router();

router.post("/register", create_admin)
router.post("/Login", Varify_Admin, AuthorizeAdmin)
router.get("/admin/:id", FeatchAdmin)
router.post("/developer",create_Developer)
router.get("/getAldeveloper", getAllDeveloper)
router.post("/assigntask", assignTask)
router.get("/task/:userid",fetchTask)
router.put("/task/:taskid", updateStatus)
router.delete("/task/:taskid",removeTask)

export default router;