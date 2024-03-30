const bcrypt = require("bcrypt");
const db = require("../db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Admin = {};

Admin.findByUsernameAndPassword = async (adminId, password) => {
  const [rows] = await db.execute(
    `
    SELECT id, username, password, 'admin' AS type
    FROM admin
    WHERE username = ?
    UNION ALL
    SELECT id, SUBSTRING_INDEX(email, '@', 1) AS username, password, type
    FROM user
    WHERE email LIKE ? AND type = 'professor'
  `,
    [adminId, adminId + "@%"]
  );

  if (rows.length === 0) {
    throw new Error("Admin not found");
  }

  const admin = rows[0];

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

  console.log("User:", admin);

  return admin;
};

Admin.findByEmail = async (adminEmail) => {
  const [rows] = await db.execute("SELECT * FROM admin WHERE email = ?", [
    adminEmail,
  ]);

  if (rows.length > 0) {
    const admin = rows[0];
    return admin;
  }

  // If no admin is found with the specified email
  return null;
};

Admin.findByAdminId = async (adminId) => {
  const [rows] = await db.execute(
    `SELECT username FROM admin WHERE id = ? 
    UNION ALL
    SELECT SUBSTRING_INDEX(email, '@', 1) AS username FROM user WHERE id = ?`,
    [adminId, adminId]
  );

  if (rows.length > 0) {
    const admin = rows[0];
    return admin;
  }

  // If no admin is found with the specified adminId
  return null;
};

Admin.createAdminAccount = async (
  username,
  email,
  type,
  firstName,
  lastName,
  password
) => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the user into the database with the current timestamp as created_at
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);
  const [result] = await db.execute(
    "INSERT INTO admin (username, email, password, type, firstName, lastName, dateCreated) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      username,
      email,
      hashedPassword,
      type,
      firstName,
      lastName,
      currentTimestamp,
    ]
  );

  // Get the inserted row's ID
  const insertedId = result.insertId;

  // Check if a user is found based on the inserted ID
  const insertedAdmin = await Admin.findByAdminId(insertedId); // Replace findById with your actual function

  // Return the inserted data only if a user is found
  return insertedAdmin || null;
};

Admin.findQuizById = async (insertedId) => {
  const [rows] = await db.execute(
    "SELECT id, topic, content FROM quiz WHERE id = ?",
    [insertedId]
  );

  if (rows.length > 0) {
    const quiz = rows[0];
    return quiz;
  }

  // If no admin is found with the specified adminId
  return null;
};

Admin.findQuestionById = async (insertedID) => {
  const [rows] = await db.execute(
    "SELECT id, type, questionType, q1, q2, q3, q4, correctAns FROM quizm WHERE id = ?",
    [insertedID]
  );

  if (rows.length > 0) {
    const quizM = rows[0];
    return quizM;
  }

  // If no questionType is found with the specified questionType
  return null;
};

Admin.findQuestion = async (questionType) => {
  const [rows] = await db.execute(
    "SELECT id, type, questionType, q1, q2, q3, q4, correctAns FROM quizm WHERE questionType = ?",
    [questionType]
  );

  if (rows.length > 0) {
    const quizM = rows[0];
    return quizM;
  }

  // If no questionType is found with the specified questionType
  return null;
};

Admin.getAllQuizzes = async () => {
  try {
    const [rows] = await db.execute(
      `SELECT id, topic, content, userType FROM quiz`
    );
    return rows;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

Admin.createQuiz = async (userType, topic, content) => {
  try {
    const currentTimestamp = new Date();
    // Modify the SQL query to include the subquery for userType
    const [result] = await db.execute(
      `
    INSERT INTO quiz (topic, content, userType, dateUpdated, dateCreated)
    VALUES (?, ?, ?, ?, ?)
  `,
      [topic, content, userType, currentTimestamp, currentTimestamp]
    );

    const insertedId = result.insertId;
    // Assuming Admin.findQuizById is implemented to fetch a quiz by ID
    const insertedQuiz = await Admin.findQuizById(insertedId);
    return insertedQuiz || null;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

Admin.createQuestion = async (
  type,
  questionType,
  q1,
  q2,
  q3,
  q4,
  correctAns
) => {
  const [result] = await db.execute(
    `INSERT INTO quizm (type, questionType, q1, q2, q3, q4, correctAns) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [type, questionType, q1, q2, q3, q4, correctAns]
  );

  // Get the inserted row's ID
  const insertedID = result.insertId;

  // Check if a Question is found based on the inserted ID
  const insertedQuestion = await Admin.findQuestionById(insertedID); // Replace findById with your actual function

  // Return the inserted data only if a Question is found
  return insertedQuestion || null;
};

Admin.getAllQuestion = async () => {
  const [rows] = await db.execute(
    "SELECT id, type, questionType, q1, q2, q3, q4, correctAns FROM quizm"
  );

  return rows;
};

module.exports = Admin;
