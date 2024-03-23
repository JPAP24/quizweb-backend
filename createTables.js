// createTables.js
async function createTables(connection) {
  try {
    // Create users table if it doesn't exist
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255),
          email VARCHAR(255),
          password VARCHAR(255),
          is_confirmed TINYINT(1) DEFAULT 0,
          created_at BIGINT
        )
      `);

    console.log("Users table created");

    // Create refresh_tokens table if it doesn't exist
    await connection.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id INT AUTO_INCREMENT PRIMARY KEY,
          token VARCHAR(255) NOT NULL,
          user_id INT NOT NULL,
          expiration DATETIME NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

    console.log("Refresh tokens table created");

    // Create biz_company_description table if it doesn't exist
    await connection.query(`
        CREATE TABLE IF NOT EXISTS biz_company_description (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            project_id INT,
            company_name VARCHAR(255) NOT NULL,
            mission_statement TEXT,
            legal_structure VARCHAR(50),
            location VARCHAR(255),
            history TEXT,
            ownership_structure TEXT,
            products_or_services TEXT,
            unique_selling_proposition TEXT,
            current_status VARCHAR(50),
            objectives TEXT,
            industry VARCHAR(255),
            target_audience TEXT,
            team_members TEXT,
            strategic_relationships TEXT,
            created_at BIGINT,
            updated_at BIGINT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )   
    `);

    console.log("Company description table created");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

module.exports = { createTables };
