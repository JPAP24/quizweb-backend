const db = require("../db");

const createReasonColumn = async () => {
  await db.execute(`
    ALTER TABLE tenants
    ADD COLUMN reason LONGTEXT DEFAULT NULL
  `);

};

const runMigration = async () => {
  try {
    console.log("Running migration: adding reason column in tenants table");
    await createReasonColumn();
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error running migration:", error.message);
  } finally {
    process.exit(); // Exit the script
  }
};

runMigration();
