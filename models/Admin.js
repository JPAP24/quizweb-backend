const bcrypt = require("bcrypt");
const db = require("../db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const Admin = {};

Admin.findByUsernameAndPassword = async (adminId, password) => {
  const [rows] = await db.execute("SELECT * FROM admin WHERE username = ?", [
    adminId,
  ]);

  if (rows.length === 0) {
    throw new Error("Admin not found");
  }

  const admin = rows[0];

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    throw new Error("Invalid password");
  }

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
  const [rows] = await db.execute("SELECT username FROM admin WHERE id = ?", [
    adminId,
  ]);

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

Admin.getAllQuizzes = async () => {
  const [rows] = await db.execute(
    "SELECT q.id, topic, content, a.username FROM quiz q INNER JOIN admin a ON q.adminId = a.id"
  );

  return rows;
};

Admin.createQuiz = async (adminId, topic, content) => {
  // Insert the user into the database with the current timestamp as created_at
  const currentTimestamp = new Date();
  const [result] = await db.execute(
    "INSERT INTO quiz (topic, content, adminId, dateUpdated, dateCreated) VALUES (?, ?, ?, ?, ?)",
    [topic, content, adminId, currentTimestamp, currentTimestamp]
  );

  // Get the inserted row's ID
  const insertedId = result.insertId;

  // Check if a user is found based on the inserted ID
  const insertedQuiz = await Admin.findQuizById(insertedId); // Replace findById with your actual function

  // Return the inserted data only if a user is found
  return insertedQuiz || null;
};

module.exports = Admin;
