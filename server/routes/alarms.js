const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/connection');

const router = express.Router();

// Get all alarms for user
router.get('/', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const alarms = await executeQuery(
      'SELECT * FROM alarms WHERE user_id = ? ORDER BY time_iso',
      [userId]
    );

    res.json({ alarms });
  } catch (error) {
    console.error('Get alarms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new alarm
router.post('/', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const {
      timeIso,
      repeatMask = 0,
      soundType = 'system',
      soundUri,
      volume = 95,
      softWake = 1,
      vibrate = 1,
      difficulty = 'normal',
      snoozeCount = '3',
      snoozeIntervalMin = 5,
      notes,
      penaltyEnabled = 0,
      penaltyAmount,
      enabled = 0
    } = req.body;

    const alarmId = uuidv4();
    
    await executeQuery(
      `INSERT INTO alarms (
        id, user_id, time_iso, repeat_mask, sound_type, sound_uri, 
        volume, soft_wake, vibrate, difficulty, snooze_count, 
        snooze_interval_min, notes, penalty_enabled, penalty_amount, enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        alarmId, userId, timeIso, repeatMask, soundType, soundUri,
        volume, softWake, vibrate, difficulty, snoozeCount,
        snoozeIntervalMin, notes, penaltyEnabled, penaltyAmount, enabled
      ]
    );

    res.status(201).json({ 
      message: 'Alarm created successfully', 
      id: alarmId 
    });
  } catch (error) {
    console.error('Create alarm error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update alarm
router.put('/:id', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    const alarmId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const updateData = req.body;

    // Verify alarm belongs to user
    const existing = await executeQuery(
      'SELECT id FROM alarms WHERE id = ? AND user_id = ?',
      [alarmId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Alarm not found' });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    
    const allowedFields = [
      'time_iso', 'repeat_mask', 'sound_type', 'sound_uri', 'volume',
      'soft_wake', 'vibrate', 'difficulty', 'snooze_count', 
      'snooze_interval_min', 'notes', 'penalty_enabled', 'penalty_amount', 'enabled'
    ];

    Object.keys(updateData).forEach(key => {
      const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(dbField)) {
        updateFields.push(`${dbField} = ?`);
        updateValues.push(updateData[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    await executeQuery(
      `UPDATE alarms SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
      [...updateValues, alarmId, userId]
    );

    res.json({ message: 'Alarm updated successfully' });
  } catch (error) {
    console.error('Update alarm error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete alarm
router.delete('/:id', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    const alarmId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const result = await executeQuery(
      'DELETE FROM alarms WHERE id = ? AND user_id = ?',
      [alarmId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alarm not found' });
    }

    res.json({ message: 'Alarm deleted successfully' });
  } catch (error) {
    console.error('Delete alarm error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;