import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mariadb',
  host: process.env.DB_HOST || 'mariadb',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'psychcare',
  password: process.env.DB_PASSWORD || 'psychcarepassword',
  database: process.env.DB_NAME || 'psychcare',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

export default sequelize;