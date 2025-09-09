const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/connection');

const router = express.Router();

// 简化的注册功能 - 不生成token
router.post('/register', async (req, res) => {
  try {
    // 解构请求体，并为所有可能为undefined的字段提供默认值
    const { email = '', password = '', name = '' } = req.body;

    // 验证必要的参数
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await executeQuery(
      'SELECT uid FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create user
    await executeQuery(
      'INSERT INTO users (uid, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [userId, email, passwordHash, name]
    );

    // Create default preferences
    await executeQuery(
      'INSERT INTO user_preferences (id, user_id) VALUES (?, ?)',
      [uuidv4(), userId]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: { uid: userId, email, name }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 简化的登录功能 - 不生成token
router.post('/login', async (req, res) => {
  try {
    // 解构请求体，并为所有可能为undefined的字段提供默认值
    const { email = '', password = '' } = req.body;

    // 验证必要的参数
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const users = await executeQuery(
      'SELECT uid, email, password_hash, name, has_completed_onboarding FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: user.has_completed_onboarding
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 根据uid检查用户是否存在，如果不存在则创建新用户
router.post('/create-user-if-not-exists', async (req, res) => {
  try {
    console.log('create-user-if-not-exists', req.body);
    // 解构请求体，并为所有可能为undefined的字段提供默认值
    const { uid, email = '', name = 'New User' } = req.body;

    // 验证必要的参数
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // 使用INSERT ... ON DUPLICATE KEY UPDATE来处理并发情况
    // 这样即使多个请求同时尝试创建同一个用户，也不会抛出重复键错误
    const passwordHash = '';
    
    // 先尝试插入用户，如果用户已存在则更新信息
    await executeQuery(
      'INSERT INTO users (uid, email, password_hash, name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = VALUES(email), name = VALUES(name)',
      [uid, email || '', passwordHash, name || 'New User']
    );
    
    // 检查用户偏好设置是否存在
    const existingPreferences = await executeQuery(
      'SELECT id FROM user_preferences WHERE user_id = ?',
      [uid]
    );
    
    // 如果偏好设置不存在，则创建
    if (existingPreferences.length === 0) {
      await executeQuery(
        'INSERT INTO user_preferences (id, user_id) VALUES (?, ?)',
        [uuidv4(), uid]
      );
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        uid,
        email: email || '',
        name: name || 'New User'
      }
    });
  } catch (error) {
    console.error('Create user if not exists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;