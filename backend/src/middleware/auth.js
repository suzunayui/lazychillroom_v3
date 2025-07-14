// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

/**
 * JWT認証ミドルウェア
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'アクセストークンが必要です'
      });
    }

    // JWTトークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ユーザー情報を取得
    const user = await db('users')
      .where('id', decoded.userId)
      .select('id', 'username', 'email', 'status', 'avatar_url')
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'ユーザーが見つかりません'
      });
    }

    // リクエストオブジェクトにユーザー情報を追加
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: '無効なトークンです'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'トークンの有効期限が切れています'
      });
    }

    return res.status(500).json({
      error: 'サーバーエラーが発生しました'
    });
  }
};

/**
 * オプショナル認証ミドルウェア
 * トークンがある場合は認証、ない場合はスキップ
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db('users')
        .where('id', decoded.userId)
        .select('id', 'username', 'email', 'status', 'avatar_url')
        .first();

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // オプショナル認証なのでエラーは無視
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
