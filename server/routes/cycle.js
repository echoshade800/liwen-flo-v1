const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../database/connection');

const router = express.Router();

// Get all cycle data for user
router.get('/data', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get period entries
    const periods = await executeQuery(
      'SELECT start_date, end_date FROM period_entries WHERE user_id = ? ORDER BY start_date DESC',
      [userId]
    );

    // Get period logs (manually selected dates)
    const periodLogsResult = await executeQuery(
      'SELECT log_date FROM period_logs WHERE user_id = ? ORDER BY log_date DESC',
      [userId]
    );
    const periodLogs = periodLogsResult.map(row => row.log_date);

    // Get daily logs
    const dailyLogs = await executeQuery(
      'SELECT * FROM daily_logs WHERE user_id = ? ORDER BY log_date DESC',
      [userId]
    );

    // Transform daily logs to match frontend format
    const transformedDailyLogs = dailyLogs.map(log => ({
      date: log.log_date,
      // 安全地解析JSON字段，添加类型检查
      feeling: log.feeling ? 
        (typeof log.feeling === 'string' ? 
          (() => {
            try {
              return JSON.parse(log.feeling);
            } catch (e) {
              console.error('Failed to parse feeling:', e);
              return undefined;
            }
          })() : 
          log.feeling
        ) : undefined,
      flow: log.flow,
      sexActivity: log.sex_activity,
      libido: log.libido,
      mood: log.mood ? 
        (typeof log.mood === 'string' ? 
          (() => {
            try {
              return JSON.parse(log.mood);
            } catch (e) {
              console.error('Failed to parse mood:', e);
              return undefined;
            }
          })() : 
          log.mood
        ) : undefined,
      symptoms: log.symptoms ? 
        (typeof log.symptoms === 'string' ? 
          (() => {
            try {
              return JSON.parse(log.symptoms);
            } catch (e) {
              console.error('Failed to parse symptoms:', e);
              return undefined;
            }
          })() : 
          log.symptoms
        ) : undefined,
      discharge: log.discharge,
      digestion: log.digestion,
      pregnancyTest: log.pregnancy_test,
      steps: log.steps,
      distanceKm: log.distance_km,
      sleepHours: log.sleep_hours,
      sleepQuality: log.sleep_quality,
      intakeWaterCups: log.intake_water_cups,
      intakeWaterLiters: log.intake_water_liters,
      medication: log.medication ? JSON.parse(log.medication) : undefined,
      customTags: log.custom_tags ? JSON.parse(log.custom_tags) : undefined,
    }));

    // Transform periods to match frontend format
    const transformedPeriods = periods.map(period => ({
      startDate: period.start_date,
      endDate: period.end_date,
    }));

    res.json({
      periods: transformedPeriods,
      periodLogs,
      dailyLogs: transformedDailyLogs,
    });
  } catch (error) {
    console.error('Get cycle data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add period entry
router.post('/periods', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const { startDate, endDate } = req.body;

    const periodId = uuidv4();
    await executeQuery(
      'INSERT INTO period_entries (id, user_id, start_date, end_date) VALUES (?, ?, ?, ?)',
      [periodId, userId, startDate, endDate]
    );

    res.status(201).json({ message: 'Period entry added successfully', id: periodId });
  } catch (error) {
    console.error('Add period error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update period logs (manually selected dates)
router.post('/period-logs', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const { dates } = req.body;

    // Delete existing period logs for this user
    await executeQuery('DELETE FROM period_logs WHERE user_id = ?', [userId]);

    // Insert new period logs
    if (dates && dates.length > 0) {
      const values = dates.map(date => [uuidv4(), userId, date]);
      const placeholders = values.map(() => '(?, ?, ?)').join(', ');
      const flatValues = values.flat();
      
      await executeQuery(
        `
        INSERT INTO period_logs (id, user_id, log_date)
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE
          user_id = VALUES(user_id),
          log_date = VALUES(log_date)
        `,
        flatValues
      );
    }

    res.json({ message: 'Period logs updated successfully' });
  } catch (error) {
    console.error('Update period logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update daily log
router.post('/daily-logs', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const logData = req.body;

    // Check if daily log exists for this date
    const existing = await executeQuery(
      'SELECT id FROM daily_logs WHERE user_id = ? AND log_date = ?',
      [userId, logData.date]
    );

    // 为所有可能为undefined的字段提供默认值null
    const dbData = {
      user_id: userId,
      log_date: logData.date,
      feeling: logData.feeling ? JSON.stringify(logData.feeling) : null,
      flow: logData.flow === undefined ? null : logData.flow,
      sex_activity: logData.sexActivity === undefined ? null : logData.sexActivity,
      libido: logData.libido === undefined ? null : logData.libido,
      mood: logData.mood ? JSON.stringify(logData.mood) : null,
      symptoms: logData.symptoms ? JSON.stringify(logData.symptoms) : null,
      discharge: logData.discharge === undefined ? null : logData.discharge,
      digestion: logData.digestion === undefined ? null : logData.digestion,
      pregnancy_test: logData.pregnancyTest === undefined ? null : logData.pregnancyTest,
      steps: logData.steps === undefined ? null : logData.steps,
      distance_km: logData.distanceKm === undefined ? null : logData.distanceKm,
      sleep_hours: logData.sleepHours === undefined ? null : logData.sleepHours,
      sleep_quality: logData.sleepQuality === undefined ? null : logData.sleepQuality,
      intake_water_cups: logData.intakeWaterCups === undefined ? null : logData.intakeWaterCups,
      intake_water_liters: logData.intakeWaterLiters === undefined ? null : logData.intakeWaterLiters,
      medication: logData.medication ? JSON.stringify(logData.medication) : null,
      custom_tags: logData.customTags ? JSON.stringify(logData.customTags) : null,
    };

    if (existing.length > 0) {
      // Update existing log
      const updateFields = Object.keys(dbData).filter(key => key !== 'user_id').map(key => `${key} = ?`).join(', ');
      const updateValues = Object.values(dbData).filter((_, index) => Object.keys(dbData)[index] !== 'user_id');
      
      await executeQuery(
        `UPDATE daily_logs SET ${updateFields} WHERE user_id = ? AND log_date = ?`,
        [...updateValues, userId, logData.date]
      );
    } else {
      // Create new log
      const logId = uuidv4();
      const fields = ['id', ...Object.keys(dbData)].join(', ');
      const placeholders = new Array(Object.keys(dbData).length + 1).fill('?').join(', ');
      
      await executeQuery(
        `INSERT INTO daily_logs (${fields}) VALUES (${placeholders})`,
        [logId, ...Object.values(dbData)]
      );
    }

    res.json({ message: 'Daily log updated successfully' });
  } catch (error) {
    console.error('Update daily log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear all user data
router.delete('/data', async (req, res) => {
  try {
    // 直接从URL查询参数中获取用户ID，不再依赖认证中间件
    const userId = req.query.uid;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Delete all user data
    await executeQuery('DELETE FROM daily_logs WHERE user_id = ?', [userId]);
    await executeQuery('DELETE FROM period_logs WHERE user_id = ?', [userId]);
    await executeQuery('DELETE FROM period_entries WHERE user_id = ?', [userId]);
    await executeQuery('DELETE FROM user_preferences WHERE user_id = ?', [userId]);
    await executeQuery('DELETE FROM alarms WHERE user_id = ?', [userId]);

    // Reset onboarding status
    await executeQuery(
      'UPDATE users SET has_completed_onboarding = FALSE, questionnaire_answers = NULL WHERE uid = ?',
      [userId]
    );

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    console.error('Clear data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;