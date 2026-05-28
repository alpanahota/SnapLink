const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const { redirectUrl } = require('./controllers/urlController');

// Load env vars (if not already loaded by server.js)
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount API routers
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);

// Mount redirect route at root (e.g. GET /abc1234)
app.get('/:shortCode', redirectUrl);

// Error Handler Middleware
app.use(errorMiddleware);

module.exports = app;
