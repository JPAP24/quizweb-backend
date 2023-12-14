const db = require("../db");
const bcrypt = require("bcrypt");

const generateRandomPassword = () => {
  const length = 12;
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const createAdminTable = async () => {
  await db.execute(`
    CREATE TABLE admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      type VARCHAR(15) NOT NULL,
      firstName VARCHAR(255) DEFAULT NULL,
      lastName VARCHAR(255) DEFAULT NULL,
      dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const sampleAdminPassword = generateRandomPassword();
  const hashedSampleAdminPassword = await bcrypt.hash(sampleAdminPassword, 10);
  await db.execute(`
    INSERT INTO admin (username, password, type)
    VALUES ('admin', '${hashedSampleAdminPassword}', 'admin')
  `);

  console.log(`Username: admin`);
  console.log(`Password: ${sampleAdminPassword}`);
  console.log(
    "Retrieve the password promptly, as it will be displayed only once."
  );
};

const runMigration = async () => {
  try {
    console.log("Running migration: Creating admin table");
    await createAdminTable();
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error running migration:", error.message);
  } finally {
    process.exit(); // Exit the script
  }
};

runMigration();
