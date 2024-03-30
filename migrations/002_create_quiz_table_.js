const db = require("../db");

const createQuizTable = async () => {
  await db.execute(`
  CREATE TABLE quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) DEFAULT NULL,
    content LONGTEXT DEFAULT NULL,
    userType VARCHAR(255) DEFAULT NULL,
    dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `);
};

const runMigration = async () => {
  try {
    console.log("Running migration: Creating quiz table");
    await createQuizTable();
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error running migration:", error.message);
  } finally {
    process.exit(); // Exit the script
  }
};

runMigration();
