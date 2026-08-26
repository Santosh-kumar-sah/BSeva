const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Bihar Sahayak (BSeva) Backend API running`);
  console.log(`📡 URL: http://localhost:${config.port}/api/v1`);
  console.log(`🩺 Health: http://localhost:${config.port}/api/v1/health`);
  console.log(`⚙️  Environment: ${config.nodeEnv}`);
  console.log(`=======================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
