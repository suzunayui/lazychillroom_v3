// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア設定
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// APIルート（後で追加）
app.get('/api', (req, res) => {
  res.json({
    message: 'LazyChillRoom v3 API Server',
    version: '3.0.0',
    docs: '/api/docs'
  });
});

// 404エラーハンドリング
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
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
