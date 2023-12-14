const db = require("../db");

const createTenantsTable = async () => {
  await db.execute(`
  CREATE TABLE tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) DEFAULT NULL,
    talentId VARCHAR(50) UNIQUE DEFAULT NULL,
    department VARCHAR(100) DEFAULT NULL,
    position VARCHAR(100) DEFAULT NULL,
    gender VARCHAR(10) DEFAULT NULL,
    workingArea VARCHAR(255) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    isAssigned VARCHAR(1) DEFAULT "N",
    arrivalDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adminId INT DEFAULT NULL,
    adminType VARCHAR(50) DEFAULT NULL,
    dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adminId) REFERENCES admin(id),
    INDEX admin_id_index (adminId)
  )
  `);
};

const runMigration = async () => {
  try {
    console.log("Running migration: Creating tenants table");
    await createTenantsTable();
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error running migration:", error.message);
  } finally {
    process.exit(); // Exit the script
  }
};

runMigration();
