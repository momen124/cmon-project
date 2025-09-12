import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

console.log('Setting up test database...');
console.log('Database:', process.env.DB_DATABASE);
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_DATABASE || 'cmon-project-test',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
});

async function setupTestDatabase() {
  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    
    console.log('Dropping existing schema...');
    await dataSource.dropDatabase();
    
    console.log('Creating fresh schema...');
    await dataSource.synchronize();
    
    console.log('Test database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

if (require.main === module) {
  setupTestDatabase()
    .then(() => {
      console.log('Database setup finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}