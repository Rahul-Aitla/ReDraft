import { Sequelize } from 'sequelize';

export let sequelize: Sequelize;

export async function initializeDatabase(): Promise<Sequelize> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error);
    throw error;
  }

  return sequelize;
}

export function getSequelize(): Sequelize {
  if (!sequelize) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return sequelize;
}
