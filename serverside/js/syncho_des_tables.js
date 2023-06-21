const { sync } = require('./db');

async function synchronizeTables() {
  try {
    await sync();
    console.log('Tables synchronized successfully.');
  } catch (error) {
    console.error('Unable to synchronize tables:', error);
  }
}

synchronizeTables();
