const app = require('./app');
const config = require('./config');

let server = null;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 Bihar Sahayak (BSeva) Backend API running`);
    console.log(`📡 URL: http://0.0.0.0:${config.port}/api/v1`);
    console.log(`🩺 Health: http://0.0.0.0:${config.port}/api/v1/health`);
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
