// src/routes/users.js
const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * 自分のユーザー情報を取得
 * GET /api/users/me
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db('users')
      .where('id', req.user.id)
      .select('id', 'username', 'email', 'status', 'avatar_url', 'created_at')
      .first();

    res.json({ user });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      error: 'ユーザー情報の取得に失敗しました'
    });
  }
});

/**
 * ユーザー一覧を取得
 * GET /api/users
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let query = db('users')
      .select('id', 'username', 'status', 'avatar_url', 'created_at');

    // 検索機能
    if (search) {
      query = query.where('username', 'ilike', `%${search}%`);
    }

    const users = await query
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');

    // 総数を取得
    const totalQuery = db('users').count('* as count');
    if (search) {
      totalQuery.where('username', 'ilike', `%${search}%`);
    }
    const [{ count }] = await totalQuery;

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'ユーザー一覧の取得に失敗しました'
    });
  }
});

/**
 * ユーザー情報を更新
 * PUT /api/users/me
 */
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const { username, avatar_url, status } = req.body;
    const userId = req.user.id;

    // 更新データを準備
    const updateData = {};
    if (username) updateData.username = username;
    if (avatar_url) updateData.avatar_url = avatar_url;
    if (status && ['online', 'away', 'busy', 'offline'].includes(status)) {
      updateData.status = status;
    }

    // ユーザー名の重複チェック
    if (username) {
      const existingUser = await db('users')
        .where('username', username)
        .whereNot('id', userId)
        .first();

      if (existingUser) {
        return res.status(409).json({
          error: 'このユーザー名は既に使用されています'
        });
      }
    }

    // ユーザー情報を更新
    const [updatedUser] = await db('users')
      .where('id', userId)
      .update(updateData)
      .returning(['id', 'username', 'email', 'status', 'avatar_url']);

    res.json({
      message: 'ユーザー情報を更新しました',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'ユーザー情報の更新に失敗しました'
    });
  }
});

/**
 * 特定のユーザー情報を取得
 * GET /api/users/:id
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db('users')
      .where('id', id)
      .select('id', 'username', 'status', 'avatar_url', 'created_at')
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'ユーザーが見つかりません'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      error: 'ユーザー情報の取得に失敗しました'
    });
  }
});

module.exports = router;
