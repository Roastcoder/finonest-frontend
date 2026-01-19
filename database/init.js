const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'finonest'
};

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    
    // Read and execute schema
    const fs = require('fs');
    const schema = fs.readFileSync('./database/banker_schema.sql', 'utf8');
    
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('✅ Database initialized successfully');
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };