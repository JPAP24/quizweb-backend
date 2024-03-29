const AdminController = require("../controllers/AdminController");
const UserController = require("../controllers/UserController");
const { verifyToken } = require("../middleware/adminMiddleware");

const express = require("express");
const router = express.Router();

// admin routes
router.post("/admin/login", AdminController.loginAdmin);
router.post("/admin/register", AdminController.registerAdmin);
router.get("/admin/user", verifyToken, AdminController.getAdminDetails);
router.post("/admin/create/quiz", verifyToken, AdminController.setUpQuiz);
router.post(
  "/admin/create/question",
  verifyToken,
  AdminController.setUpQuestion
);
router.get("/admin/quizzes", verifyToken, AdminController.getQuizzes);
router.get("/admin/question", verifyToken, AdminController.getQuestion);

// user routes
router.post("/user/login", UserController.loginUser);
router.post("/user/register", UserController.registerUser);
router.post("/user/add", verifyToken, UserController.registerUser);
router.get("/users/get", verifyToken, UserController.getUsers);

module.exports = router;
