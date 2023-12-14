const bcrypt = require("bcrypt");
const db = require("../db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const User = {};

User.findUserByEmail = async (userEmail) => {
  const [rows] = await db.execute("SELECT email FROM user WHERE email = ?", [
    userEmail,
  ]);

  if (rows.length > 0) {
    const user = rows[0];
    return user;
  }

  // If no user is found with the specified userEmail
  return null;
};

User.findUserById = async (userId) => {
  const [rows] = await db.execute("SELECT email FROM user WHERE id = ?", [
    userId,
  ]);

  if (rows.length > 0) {
    const user = rows[0];
    return user;
  }

  // If no user is found with the specified userId
  return null;
};

User.findMaxUserId = async () => {
  const [rows] = await db.execute("SELECT MAX(id) AS maxUserId FROM user");

  if (rows.length > 0) {
    const maxUserId = rows[0].maxUserId;
    return maxUserId;
  }

  // If no user is found
  return null;
};

User.getLatestuser = async (userId) => {
  const [rows] = await db.execute("SELECT email FROM user WHERE id = ?", [
    userId,
  ]);

  if (rows.length > 0) {
    const user = rows[0];
    return user;
  }

  // If no user is found with the specified userId
  return null;
};

User.createUserAccount = async (
  studentId,
  degreeCode,
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
) => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const currentTimestamp = new Date();
  const [result] = await db.execute(
    `INSERT INTO user (studentId, degreeCode, degreeName, email, password, firstName, lastName, gender, status, type, countryCode, phone, dateUpdated, dateCreated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      degreeCode,
      degreeName,
      email,
      hashedPassword,
      firstName,
      lastName,
      gender,
      status,
      type,
      countryCode,
      phone,
      currentTimestamp,
      currentTimestamp,
    ]
  );

  // Get the inserted row's ID
  const insertedId = result.insertId;

  // Check if a user is found based on the inserted ID
  const insertedAdmin = await User.findUserById(insertedId); // Replace findById with your actual function

  // Return the inserted data only if a user is found
  return insertedAdmin || null;
};

User.getAllUsers = async () => {
  const [rows] = await db.execute(
    "SELECT studentId, degreeCode, degreeName, email, firstName, lastName, gender, status, type, countryCode, phone, dateUpdated, dateCreated FROM user"
  );

  return rows;
};

module.exports = User;
