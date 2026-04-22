'use strict';

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

const start = async () => {
  await connectDB();
  const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
