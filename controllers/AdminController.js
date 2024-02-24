const Admin = require("../models/Admin");
const { generateAuthToken } = require("../lib/token");

const AdminController = {};

AdminController.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findByUsernameAndPassword(username, password);

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateAuthToken(admin.id);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

AdminController.registerAdmin = async (req, res) => {
  const { username, email, type, firstName, lastName, password } = req.body;

  try {
    // Check if the email is already taken in the database
    const user = await Admin.findByEmail(email);

    // check if the email is already exists
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "This email is already in use." });
    }

    // // Validate email format using a regular expression
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   return res
    //     .status(400)
    //     .json({error: "Bad Request", message: "Invalid email format"});
    // }

    // // Validate password complexity (e.g., at least 8 characters, with at least one uppercase, one lowercase, and one number)
    // // Simplified regex for testing
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({
    //     error: "Bad Request",
    //     message:
    //       "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    //   });
    // }

    const newUser = await Admin.createAdminAccount(
      username,
      email,
      type,
      firstName,
      lastName,
      password
    );

    if (newUser) {
      res
        .status(201)
        .json({ success: true, message: "Registered successfully" });
    }
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

AdminController.getAdminDetails = async (req, res) => {
  const id = req.user.adminId;

  try {
    const user = await Admin.findByAdminId(id);

    console.log(user);

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user information:", error);

    res.status(500).json({ success: false, error: error.message });
  }
};

AdminController.setUpQuiz = async (req, res) => {
  const adminId = req.user.adminId;
  const { prompt, completionResult } = req.body;
  let topic = prompt;
  let content = completionResult;

  try {
    const quiz = await Admin.createQuiz(adminId, topic, content);

    if (quiz) {
      res.status(200).json({ success: true, quiz });
    }
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

AdminController.getQuizzes = async (req, res) => {
  try {
    const result = await Admin.getAllQuizzes();

    if (result) {
      res.status(200).json({ success: true, result });
    }
  } catch (error) {
    console.error("Error getting quizzes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

AdminController.setUpQuestion = async (req, res) => {
  const { type, questionType, q1, q2, q3, q4, correctAns } = req.body;

  try {
    // Check if the question is already taken in the database
    const existingQuestion = await Admin.findQuestion(questionType);

    // check if the question is already exists
    if (existingQuestion) {
      return res
        .status(409)
        .json({ success: false, message: "This question is already in use." });
    }

    const quizM = await Admin.createQuestion(
      type,
      questionType,
      q1,
      q2,
      q3,
      q4,
      correctAns
    );

    if (quizM) {
      res.status(200).json({ success: true, quizM });
    }
  } catch (error) {
    console.error("Error creating Quiz Manual:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

AdminController.getQuestion = async (req, res) => {
  try {
    const result = await Admin.getAllQuestion();

    if (result) {
      res.status(200).json({ success: true, result });
    }
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = AdminController;
