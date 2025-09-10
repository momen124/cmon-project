import dataSource from './data-source';

async function testDataSource() {
  try {
    await dataSource.initialize();
    console.log('Data source initialized successfully');
    await dataSource.destroy();
  } catch (error) {
    console.error('Data source initialization failed:', error.message);
  }
}

testDataSource();