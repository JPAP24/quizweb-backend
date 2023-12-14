const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const generateAuthToken = (adminId) => {
  try {
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
      throw new Error("Missing secret key for JWT signing");
    }

    const expiresIn = "7d";

    const token = jwt.sign({adminId}, secretKey, {expiresIn});
    return token;
  } catch (error) {
    console.error("Error generating verification token:", error.message);
    throw error; // Rethrow the error for higher-level error handling
  }
};

module.exports = {generateAuthToken};
