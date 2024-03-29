const User = require("../models/User");
const { generateAuthToken } = require("../lib/token");

const collegeDegrees = {
  BSCS: {
    name: "Bachelor of Science in Computer Science",
  },
  BAE: {
    name: "Bachelor of Arts in English",
  },
  BBA: {
    name: "Bachelor of Business Administration",
  },
  BSN: {
    name: "Bachelor of Science in Nursing",
  },
  BAP: {
    name: "Bachelor of Arts in Psychology",
  },
  BSIT: {
    name: "Bachelor of Science in Information Technology",
  },
};

const UserController = {};

UserController.registerUser = async (req, res) => {
  const {
    degreeCode,
    email,
    confirm,
    firstName,
    lastName,
    gender,
    type,
    countryCode,
    phone,
  } = req.body;

  let password = confirm;
  let dCode = type == "professor" ? "PROF" : degreeCode;

  let degreeName;
  if (type == "professor") {
    degreeName = "College Professor";
  } else if (collegeDegrees && collegeDegrees[degreeCode]) {
    degreeName = collegeDegrees[degreeCode].name;
  } else {
    degreeName = "Unknown Degree";
  }

  const status = "active";

  try {
    // Check if the email is already taken in the database
    const user = await User.findUserByEmail(email);

    // check if the email is already exists
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "This email is already in use." });
    }

    let studentId = null;
    if (type !== "professor") {
      const getMaxId = await User.findMaxUserId();
      const currentYear = new Date().getFullYear();

      // Ensure getMaxId is a number, default to 0 if it's null
      const maxIdAsNumber = getMaxId ? parseInt(getMaxId, 10) : 0;

      // Concatenate the current year to the student ID
      studentId = maxIdAsNumber ? maxIdAsNumber + 1000 : 1000;
      studentId = studentId.toString() + currentYear;
    }

    const newUser = await User.createUserAccount(
      studentId,
      dCode,
      degreeName,
      email,
      password,
      firstName,
      lastName,
      gender,
      status,
      type,
      countryCode,
      phone
    );

    if (newUser) {
      res.status(200).json({
        success: true,
        message: "Registered successfully",
        studentId: studentId,
      });
    }
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

UserController.getUsers = async (req, res) => {
  try {
    const result = await User.getAllUsers();

    if (result) {
      res.status(200).json({ success: true, result });
    }
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login User
UserController.loginUser = async (req, res) => {
  const { studentId, password } = req.body;
  try {
    const user = await User.findByStudentIDAndPassword(studentId, password);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateAuthToken(user.id);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = UserController;
