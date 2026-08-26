const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const db = require('./database/db');

const app = express();

// Initialize in-memory / seed store
db.init().catch(err => console.error('[DB INIT ERROR]', err));

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (config.allowedOrigins.indexOf(origin) !== -1 || config.nodeEnv === 'development') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy violation'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logger for development
if (config.nodeEnv !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Master API Route Mount
app.use('/api/v1', routes);

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
