const db = require("../db");

const createUserTable = async () => {
  await db.execute(`
    CREATE TABLE user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      studentId VARCHAR(255) UNIQUE NOT NULL,
      degreeCode VARCHAR(10) NOT NULL,
      degreeName VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) DEFAULT NULL,
      lastName VARCHAR(255) DEFAULT NULL,
      gender VARCHAR(10) DEFAULT NULL,
      status VARCHAR(50) DEFAULT NULL,
      type VARCHAR(50) DEFAULT NULL,
      countryCode TINYINT DEFAULT NULL,  
      phone BIGINT DEFAULT NULL,
      dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const runMigration = async () => {
  try {
    console.log("Running migration: Creating user table");
    await createUserTable();
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error running migration:", error.message);
  } finally {
    process.exit(); // Exit the script
  }
};

runMigration();
