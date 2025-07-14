// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');

// ルーターのインポート
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(helmet());
app.use(cors({
  origin: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// データベース接続テスト
testConnection();

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0'
  });
});

// APIルート
app.get('/api', (req, res) => {
  res.json({
    message: 'LazyChillRoom v3 API Server',
    version: '3.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/health'
    }
  });
});

// APIルーター設定
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404エラーハンドリング
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource ${req.originalUrl} was not found`,
    timestamp: new Date().toISOString()
  });
});

// グローバルエラーハンドリング
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  // JWTエラー
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token expired',
      timestamp: new Date().toISOString()
    });
  }
  
  // バリデーションエラー
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
  
  // データベースエラー
  if (error.code === '23505') { // PostgreSQL unique constraint violation
    return res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists',
      timestamp: new Date().toISOString()
    });
  }
  
  if (error.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Referenced resource does not exist',
      timestamp: new Date().toISOString()
    });
  }
  
  // デフォルトエラーレスポンス
  res.status(error.status || 500).json({
    error: error.status >= 400 && error.status < 500 ? 'Client Error' : 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred while processing your request'
      : error.message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// サーバー起動
async function startServer() {
  try {
    // データベース接続テスト
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ データベースに接続できません。サーバーを起動できません。');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log('🚀 LazyChillRoom v3 Backend Server');
      console.log(`📍 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: Connected`);
      console.log('');
      console.log('Available endpoints:');
      console.log(`  • Health Check: http://localhost:${PORT}/health`);
      console.log(`  • API Info: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ サーバー起動エラー:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// サーバー起動
if (require.main === module) {
  startServer();
}

module.exports = app;
