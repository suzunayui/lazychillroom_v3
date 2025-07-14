// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const router = express.Router();

/**
 * ユーザー登録
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // バリデーション
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'すべてのフィールドが必要です'
      });
    }

    // ユーザーの重複チェック
    const existingUser = await db('users')
      .where('email', email)
      .orWhere('username', username)
      .first();

    if (existingUser) {
      return res.status(409).json({
        error: 'ユーザー名またはメールアドレスが既に使用されています'
      });
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // ユーザー作成
    const [user] = await db('users')
      .insert({
        username,
        email,
        password_hash: hashedPassword,
        status: 'offline'
      })
      .returning(['id', 'username', 'email', 'status', 'created_at']);

    // JWTトークン生成
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'ユーザー登録成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status
      },
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'サーバーエラーが発生しました'
    });
  }
});

/**
 * ユーザーログイン
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // バリデーション
    if (!email || !password) {
      return res.status(400).json({
        error: 'メールアドレスとパスワードが必要です'
      });
    }

    // ユーザー検索
    const user = await db('users')
      .where('email', email)
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'メールアドレスまたはパスワードが間違っています'
      });
    }

    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'メールアドレスまたはパスワードが間違っています'
      });
    }

    // ユーザーステータスをオンラインに更新
    await db('users')
      .where('id', user.id)
      .update({ status: 'online' });

    // JWTトークン生成
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'ログイン成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: 'online',
        avatar_url: user.avatar_url
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'サーバーエラーが発生しました'
    });
  }
});

/**
 * ユーザーログアウト
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (userId) {
      // ユーザーステータスをオフラインに更新
      await db('users')
        .where('id', userId)
        .update({ status: 'offline' });
    }

    res.json({
      message: 'ログアウト成功'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'サーバーエラーが発生しました'
    });
  }
});

module.exports = router;
