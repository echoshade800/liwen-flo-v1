require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: "vsa-db-dev.cb462qmg6ec1.us-east-1.rds.amazonaws.com",
  port: 3306,
  user: "miniapp1",
  password: "miniapp@20251",
  database: "flo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

const initDatabase = async () => {
  let pool;
  
  try {
    // 输出数据库连接信息
    console.log('🔌 Database Connection Info:');
    console.log(`  Host: ${process.env.DB_HOST || '100.28.58.186'}`);
    console.log(`  Port: ${process.env.DB_PORT || '3306'}`);
    console.log(`  User: ${process.env.DB_USER || 'root'}`);
    console.log(`  Database: ${process.env.DB_NAME || 'flo'}`);
    console.log('🚀 Initializing database...');

    // Create connection pool
    pool = mysql.createPool(dbConfig);
    console.log('✅ Database connection pool created');

    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        uid VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        name VARCHAR(255),
        age INT,
        goal VARCHAR(50),
        height DECIMAL(5,2),
        has_completed_onboarding BOOLEAN DEFAULT FALSE,
        questionnaire_answers JSON,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create user preferences table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        avg_cycle INT DEFAULT 28,
        avg_period INT DEFAULT 5,
        reminders BOOLEAN DEFAULT TRUE,
        health_sync BOOLEAN DEFAULT FALSE,
        last_menstrual_period DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
      )
    `);
    console.log('✅ User preferences table created/verified');

    // Create period entries table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS period_entries (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
      )
    `);
    console.log('✅ Period entries table created/verified');

    // Create period logs table (user manually selected period dates)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS period_logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        log_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE,
        UNIQUE KEY unique_user_date (user_id, log_date)
      )
    `);
    console.log('✅ Period logs table created/verified');

    // Create daily logs table for symptoms, mood, activities
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS daily_logs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        log_date DATE NOT NULL,
        feeling JSON,
        flow ENUM('light', 'medium', 'heavy', 'clots'),
        sex_activity ENUM('none', 'protected', 'unprotected'),
        libido ENUM('low', 'medium', 'high'),
        mood JSON,
        symptoms JSON,
        discharge ENUM('dry', 'watery', 'eggwhite', 'thick', 'abnormal'),
        digestion ENUM('normal', 'bloat', 'diarrhea', 'constipation'),
        pregnancy_test ENUM('not_tested', 'negative', 'positive'),
        steps INT,
        distance_km DECIMAL(6,2),
        sleep_hours DECIMAL(4,2),
        sleep_quality ENUM('good', 'ok', 'poor'),
        intake_water_cups INT,
        intake_water_liters DECIMAL(4,2),
        medication JSON,
        custom_tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE,
        UNIQUE KEY unique_user_date (user_id, log_date)
      )
    `);
    console.log('✅ Daily logs table created/verified');

    // Create alarms table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS alarms (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        time_iso VARCHAR(255) NOT NULL,
        repeat_mask INT NOT NULL DEFAULT 0,
        sound_type ENUM('system', 'calm', 'cheerful', 'loud', 'silent') NOT NULL DEFAULT 'system',
        sound_uri TEXT,
        volume INT NOT NULL DEFAULT 95,
        soft_wake TINYINT(1) NOT NULL DEFAULT 1,
        vibrate TINYINT(1) NOT NULL DEFAULT 1,
        difficulty ENUM('very_easy', 'easy', 'normal', 'hard', 'very_hard', 'hell') NOT NULL DEFAULT 'normal',
        snooze_count ENUM('unlimited', '1', '2', '3', '5', '10') NOT NULL DEFAULT '3',
        snooze_interval_min INT NOT NULL DEFAULT 5,
        notes TEXT,
        penalty_enabled TINYINT(1) NOT NULL DEFAULT 0,
        penalty_amount INT,
        enabled TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
      )
    `);
    console.log('✅ Alarms table created/verified');

    // Create indexes for better performance
    try {
      await pool.execute(`
        CREATE INDEX idx_period_entries_user_date 
        ON period_entries(user_id, start_date)
      `);
      
      await pool.execute(`
        CREATE INDEX idx_period_logs_user_date 
        ON period_logs(user_id, log_date)
      `);
      
      await pool.execute(`
        CREATE INDEX idx_daily_logs_user_date 
        ON daily_logs(user_id, log_date)
      `);
      
      await pool.execute(`
        CREATE INDEX idx_users_email 
        ON users(email)
      `);
      
      await pool.execute(`
        CREATE INDEX idx_alarms_user_enabled 
        ON alarms(user_id, enabled)
      `);
      console.log('✅ Database indexes created');
    } catch (error) {
      // Ignore index already exists errors
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⚠️  Some indexes already exist, skipping creation');
      } else {
        throw error;
      }
    }
    
    console.log('✅ Database indexes verified');

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Database connection closed');
    }
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✅ Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };