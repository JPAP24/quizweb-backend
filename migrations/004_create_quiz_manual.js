const db = require("../db");

const createUserQuizManual = async () => {
  await db.execute(`
    CREATE TABLE quizm (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      type VARCHAR(40) DEFAULT NULL,
      questionType VARCHAR(200) DEFAULT NULL,
      q1 VARCHAR(255) DEFAULT NULL,
      q2 VARCHAR(255) DEFAULT NULL,
      q3 VARCHAR(255) DEFAULT NULL,
      q4 VARCHAR(255) DEFAULT NULL,
      correctAns VARCHAR(255) DEFAULT NULL
    )
  `);
};

const runMigration = async () => {
  try {
    console.log("Running migration: Creating quizM Table");
    await createUserQuizManual();
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error running migration:", error.message);
  } finally {
    process.exit(); // Exit the script
  }
};

runMigration();
