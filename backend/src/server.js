const app = require('./app');
const config = require('./config');

let server = null;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Bihar Sahayak (BSeva) Backend API running`);
    console.log(`📡 URL: http://localhost:${config.port}/api/v1`);
    console.log(`🩺 Health: http://localhost:${config.port}/api/v1/health`);
    console.log(`⚙️  Environment: ${config.nodeEnv}`);
    console.log(`=======================================================`);
  });
}

process.on('SIGTERM', () => {
  if (server) {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  }
});

module.exports = app;
