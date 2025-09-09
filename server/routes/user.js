const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/connection');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // 1) 获取并规范化 uid（字符串）
    const raw = Array.isArray(req.query.uid) ? req.query.uid[0] : req.query.uid;
    const userId = (raw ?? '')
      .toString()
      .replace(/\u200B/g, '')  // 去零宽空格
      .replace(/\u00A0/g, ' ') // 不间断空格 -> 普通空格
      .trim();

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // 调试日志（上线可移除）
    console.log('[profile] uid(raw):', raw, 'uid(norm):', userId, 'len:', userId.length);

    // 2) 查用户信息（uid 为字符串列）
    const users = await executeQuery(
      `SELECT uid, email, name, age, goal, height, has_completed_onboarding, questionnaire_answers
       FROM users
       WHERE BINARY uid = ?
       LIMIT 1`,
      [userId]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // 3) 查用户偏好设置
    const preferences = await executeQuery(
      'SELECT * FROM user_preferences WHERE BINARY user_id = ? LIMIT 1',
      [userId]
    );

    res.json({
      profile: {
        age: user.age,
        goal: user.goal,
        height: user.height,
        hasCompletedOnboarding: user.has_completed_onboarding,
        questionnaireAnswers: user.questionnaire_answers
          ? (typeof user.questionnaire_answers === 'string'
              ? (() => {
                  try {
                    return JSON.parse(user.questionnaire_answers);
                  } catch (e) {
                    console.error('Failed to parse questionnaire_answers:', e);
                    return null;
                  }
                })()
              : user.questionnaire_answers)
          : null,
      },
      preferences: preferences && preferences.length > 0
        ? {
            avgCycle: preferences[0].avg_cycle,
            avgPeriod: preferences[0].avg_period,
            reminders: preferences[0].reminders,
            healthSync: preferences[0].health_sync,
            lastMenstrualPeriod: preferences[0].last_menstrual_period,
          }
        : {
            avgCycle: 28,
            avgPeriod: 5,
            reminders: true,
            healthSync: false,
          },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update user profile
router.put('/profile', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    // 解构请求体，并为所有可能为undefined的字段提供默认值null
    const { age = null, goal = null, height = null, hasCompletedOnboarding = null, questionnaireAnswers } = req.body;
    
    // 确保questionnaireAnswers为null而不是undefined，避免JSON.stringify返回"undefined"字符串
    const questionnaireAnswersJSON = questionnaireAnswers === undefined ? null : JSON.stringify(questionnaireAnswers);
    
    // Log the data for debugging
    console.log(age, goal, height, hasCompletedOnboarding, questionnaireAnswersJSON, userId);
    
    // Execute the query with the properly formatted parameters array
    await executeQuery(
      'UPDATE users SET age = ?, goal = ?, height = ?, has_completed_onboarding = ?, questionnaire_answers = ? WHERE uid = ?',
      [age, goal, height, hasCompletedOnboarding, questionnaireAnswersJSON, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user preferences
router.put('/preferences', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    // 解构请求体，并为所有可能为undefined的字段提供默认值null
    const { avgCycle = null, avgPeriod = null, reminders = null, healthSync = null, lastMenstrualPeriod = null } = req.body;

    // Check if preferences exist
    const existing = await executeQuery(
      'SELECT id FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      // Update existing preferences
      await executeQuery(
        'UPDATE user_preferences SET avg_cycle = ?, avg_period = ?, reminders = ?, health_sync = ?, last_menstrual_period = ? WHERE user_id = ?',
        [avgCycle, avgPeriod, reminders, healthSync, lastMenstrualPeriod, userId]
      );
    } else {
      // Create new preferences
      await executeQuery(
        'INSERT INTO user_preferences (id, user_id, avg_cycle, avg_period, reminders, health_sync, last_menstrual_period) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [uuidv4(), userId, avgCycle, avgPeriod, reminders, healthSync, lastMenstrualPeriod]
      );
    }

    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;