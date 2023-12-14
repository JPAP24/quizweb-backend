const AdminController = require("../controllers/AdminController");
const UserController = require("../controllers/UserController");
const {verifyToken} = require("../middleware/adminMiddleware");

const express = require("express");
const router = express.Router();

// admin
router.post("/admin/login", AdminController.loginAdmin);
router.post("/admin/register", AdminController.registerAdmin);
router.get("/admin/user", verifyToken, AdminController.getAdminDetails);
router.post("/admin/create/quiz", verifyToken, AdminController.setUpQuiz);
router.get("/admin/quizzes", verifyToken, AdminController.getQuizzes);

// user
router.post("/user/add", verifyToken, UserController.registerUser);
router.get("/users/get", verifyToken, UserController.getUsers);

module.exports = router;
