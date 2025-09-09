import { create } from 'zustand';
import { apiClient } from '../lib/api';
import StorageUtils from '../lib/StorageUtils';
import { PredictionHistory, calculatePredictionHistory } from '../lib/cycle';

export type PeriodEntry = {
  startDate: string;
  endDate?: string;
};

export type CycleSummary = {
  cycleLength: number;
  periodLength: number;
  status: 'green' | 'yellow' | 'red';
};

export type DailyLog = {
  date: string;
  feeling?: string[];
  flow?: 'light' | 'medium' | 'heavy' | 'clots';
  sexActivity?: 'none' | 'protected' | 'unprotected';
  libido?: 'low' | 'medium' | 'high';
  mood?: string[];
  symptoms?: string[];
  discharge?: 'dry' | 'watery' | 'eggwhite' | 'thick' | 'abnormal';
  digestion?: 'normal' | 'bloat' | 'diarrhea' | 'constipation';
  pregnancyTest?: 'not_tested' | 'negative' | 'positive';
  steps?: number;
  distanceKm?: number;
  sleepHours?: number;
  sleepQuality?: 'good' | 'ok' | 'poor';
  intakeWaterCups?: number;
  intakeWaterLiters?: number;
  medication?: string[];
  customTags?: string[];
};

export type Preferences = {
  avgCycle: number;
  avgPeriod: number;
  reminders?: boolean;
  healthSync?: boolean;
  lastMenstrualPeriod?: string;
};

export type UserProfile = {
  age?: number;
  goal?: string;
  hasCompletedOnboarding: boolean;
  questionnaireAnswers?: Record<string, any>;
  height?: number;
};

interface CycleStore {
  profile: UserProfile;
  periods: PeriodEntry[];
  periodLogs: string[];
  dailyLogs: DailyLog[];
  preferences: Preferences;
  predictionHistory: PredictionHistory | null; // 新增：预测历史
  isLoading: boolean;
  error: string | null;
  
  setProfile: (profile: Partial<UserProfile>) => void;
  addPeriod: (period: PeriodEntry) => void;
  setPeriodLogs: (dates: string[]) => void;
  updateDailyLog: (log: DailyLog) => void;
  setPreferences: (prefs: Partial<Preferences>) => void;
  completeOnboarding: () => void;
  loadFromServer: () => Promise<void>;
  syncUserData: () => Promise<void>;
  syncToServer: () => Promise<void>;
  clearData: () => Promise<void>;
  generateHistoricalCycles: (periodLogs: string[]) => any[];
  updatePredictionHistory: () => void; // 新增：更新预测历史
  getCurrentUserId: () => Promise<string | null>;
  initializeUser: () => Promise<void>;
}

export const useCycleStore = create<CycleStore>((set, get) => ({
  profile: {
    hasCompletedOnboarding: false
  },
  periods: [],
  periodLogs: [],
  dailyLogs: [],
  preferences: {
    avgCycle: 28,
    avgPeriod: 5,
    reminders: true,
    healthSync: false
  },
  predictionHistory: null, // 新增：预测历史初始值
  isLoading: false,
  error: null,

  setProfile: function(profile: Partial<UserProfile>) {
    set(function(state) {
      return {
        profile: Object.assign({}, state.profile, profile),
        error: null
      };
    });
    get().syncUserData();
  },

  addPeriod: function(period: PeriodEntry) {
    set(function(state) {
      return {
        periods: state.periods.concat(period),
        error: null
      };
    });
    get().syncToServer();
  },

  setPeriodLogs: function(dates: string[]) {
    console.log('=== setPeriodLogs Debug ===');
    console.log('接收到的新 dates:', dates);
    console.log('当前 store 中的 periodLogs:', get().periodLogs);
    
    set(function(state) {
      return {
        periodLogs: dates,
        error: null
      };
    });
    
    console.log('更新后 store 中的 periodLogs:', get().periodLogs);
    
    // 更新预测历史
    get().updatePredictionHistory();
    
    console.log('触发 syncToServer...');
    get().syncToServer();
  },
  
  // 更新每日日志，包括症状数据
  updateDailyLog: function(log: DailyLog) {
    try {
      // 验证输入参数
      if (!log || typeof log !== 'object') {
        throw new Error('Invalid log data: must be an object');
      }
      
      if (!log.date) {
        throw new Error('Log data missing required field: date');
      }
      
      console.log('Updating daily log for date:', log.date);
      
      set(function(state) {
        var newLogs = [...state.dailyLogs];
        var existingIndex = newLogs.findIndex(d => d.date === log.date);
        var updatedLog = Object.assign({}, log);
        
        // 确保symptoms字段是数组类型
        if (updatedLog.symptoms && !Array.isArray(updatedLog.symptoms)) {
          console.warn('Symptoms should be an array, converting:', updatedLog.symptoms);
          updatedLog.symptoms = [updatedLog.symptoms];
        }
        
        // 为所有可能为undefined的字段提供默认值（使用undefined而非null，因为TypeScript类型定义不允许null）
      if (updatedLog.feeling === undefined) updatedLog.feeling = undefined;
      if (updatedLog.flow === undefined) updatedLog.flow = undefined;
      if (updatedLog.sexActivity === undefined) updatedLog.sexActivity = undefined;
      if (updatedLog.libido === undefined) updatedLog.libido = undefined;
      if (updatedLog.mood === undefined) updatedLog.mood = undefined;
      if (updatedLog.symptoms === undefined) updatedLog.symptoms = undefined;
      if (updatedLog.discharge === undefined) updatedLog.discharge = undefined;
        
        if (existingIndex >= 0) {
          // 更新现有日志，合并数据以保留未修改的字段
          newLogs[existingIndex] = { ...newLogs[existingIndex], ...updatedLog };
        } else {
          // 添加新日志
          newLogs.push(updatedLog);
        }
        
        return {
          dailyLogs: newLogs,
          error: null
        };
      });
      
      // 立即同步到服务器，但使用setTimeout避免频繁调用
      setTimeout(() => {
        get().syncToServer();
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Failed to update daily log:', error);
      // 设置错误状态
      set({
        error: error instanceof Error ? error.message : 'Failed to update daily log'
      });
      return false;
    }
  },
  
  // 专门处理症状跟踪的方法
  trackSymptoms: function(date: string, symptoms: string[]) {
    try {
      // 验证输入参数
      if (!date) {
        throw new Error('Date is required for tracking symptoms');
      }
      
      if (!symptoms || !Array.isArray(symptoms)) {
        throw new Error('Symptoms must be an array');
      }
      
      console.log('Tracking symptoms for date:', date, 'symptoms count:', symptoms.length);
      
      // 创建或更新包含症状数据的每日日志
      const currentState = get();
      const existingLog = currentState.dailyLogs.find(d => d.date === date);
      
      const logEntry: DailyLog = {
        date: date,
        symptoms: symptoms
      };
      
      // 如果有现有日志，合并症状数据
      if (existingLog) {
        const existingSymptoms = existingLog.symptoms || [];
        // 合并症状数组，避免重复
        const uniqueSymptoms = [...new Set([...existingSymptoms, ...symptoms])];
        logEntry.symptoms = uniqueSymptoms;
        // 保留其他字段 - 使用类型断言避免索引签名错误
        Object.keys(existingLog).forEach((key) => {
          if (key !== 'symptoms' && key !== 'date') {
            // 使用类型断言告诉TypeScript这是安全的
            (logEntry as any)[key] = (existingLog as any)[key];
          }
        });
      }
      
      // updateDailyLog没有返回值，所以不需要检查success
      this.updateDailyLog(logEntry);
      
      // 安全地访问symptoms属性
      if (logEntry.symptoms) {
        console.log('Symptoms tracked successfully for date:', date, 'total unique symptoms:', logEntry.symptoms.length);
      } else {
        console.log('Symptoms tracked successfully for date:', date);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to track symptoms:', error);
      // 设置错误状态
      set({
        error: error instanceof Error ? error.message : 'Failed to track symptoms'
      });
      return false;
    }
  },

  setPreferences: function(prefs: Partial<Preferences>) {
    set(function(state) {
      return {
        preferences: Object.assign({}, state.preferences, prefs),
        error: null
      };
    });
    get().syncToServer();
  },

  completeOnboarding: function() {
    set(function(state) {
      return {
        profile: Object.assign({}, state.profile, { hasCompletedOnboarding: true }),
        error: null
      };
    });
    get().syncToServer();
  },

  loadFromServer: async function() {
    set({
      isLoading: true,
      error: null
    });
    try {
      // 获取用户ID，确保我们知道要加载谁的数据
      const userId = await StorageUtils.getUserId();
      console.log('Loading data from server for user:', userId);
      
      // 根据新需求，我们不再检查本地存储的登录状态
      // 而是直接尝试从服务器获取数据，让服务器通过URL参数中的uid来识别用户
      try {
        var userResponse = await apiClient.getUserProfile();
        console.log('User profile loaded successfully');
        
        var cycleResponse = await apiClient.getCycleData();
        console.log(`Cycle data loaded: ${cycleResponse.periods.length} periods, ${cycleResponse.periodLogs.length} period logs, ${cycleResponse.dailyLogs.length} daily logs`);
        
        set({
          profile: userResponse.profile,
          preferences: userResponse.preferences,
          periods: cycleResponse.periods,
          periodLogs: cycleResponse.periodLogs,
          dailyLogs: cycleResponse.dailyLogs,
          isLoading: false,
          error: null
        });
      } catch (serverError) {
        console.warn('Failed to load data from server (might be unauthenticated):', serverError);
        // 可选：先重置到初始状态，随后将错误抛给调用方
        set({
          profile: {
            hasCompletedOnboarding: false
          },
          periods: [],
          periodLogs: [],
          dailyLogs: [],
          preferences: {
            avgCycle: 28,
            avgPeriod: 5,
            reminders: true,
            healthSync: false
          },
          isLoading: false,
          error: null
        });
        // 关键：向上抛出错误，让调用处的 catch 能触发
        throw serverError;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      });
      // 关键：继续抛出错误，让外层使用方（如 initializeUser）进入它们的 catch 分支
      throw error;
    }
  },

  syncUserData: async function() {
    try {
      var state = get();
      await apiClient.updateUserProfile(state.profile);
      console.log('User profile synced ', state.profile);
      await apiClient.updateUserPreferences(state.preferences);
      console.log('User preferences synced ', state.preferences);
    } catch (serverError) {
      console.warn('Failed to sync user data to server (might be unauthenticated):', serverError);
    }
  },

  syncToServer: async function() {
    try {
      // 根据新需求，我们不再检查本地存储的登录状态
      // 而是直接尝试同步数据，让服务器通过URL参数中的uid来识别用户
      var state = get();
      
      // 检查是否有数据需要同步
      if (!state.dailyLogs || state.dailyLogs.length === 0 && state.periodLogs.length === 0) {
        console.log('No data to sync');
        return;
      }
      
      console.log(`Starting data sync: ${state.dailyLogs.length} daily logs, ${state.periodLogs.length} period logs`);
      
      try {
        // Update user profile and preferences
        await get().syncUserData();
        
        // Update period logs
        console.log('=== Syncing Period Logs to Server ===');
        console.log('发送到服务器的 periodLogs:', state.periodLogs);
        await apiClient.updatePeriodLogs(state.periodLogs);
        console.log('Period logs synced successfully:', state.periodLogs.length, 'dates');
        
        // 同步每日日志数据到服务器
        if (state.dailyLogs && state.dailyLogs.length > 0) {
          // 为了避免一次发送过多请求，我们可以分批次同步
          const batchSize = 10;
          let successCount = 0;
          let failCount = 0;
          
          for (let i = 0; i < state.dailyLogs.length; i += batchSize) {
            const batch = state.dailyLogs.slice(i, i + batchSize);
            for (const log of batch) {
              try {
                await apiClient.updateDailyLog(log);
                successCount++;
                // 添加短暂延迟避免请求过多过快
                await new Promise(resolve => setTimeout(resolve, 50));
              } catch (logError) {
                failCount++;
                console.error('Failed to sync daily log for date', log.date, ':', logError);
              }
            }
          }
          
          console.log(`Daily logs sync completed: ${successCount} successful, ${failCount} failed`);
        }
        
        set({
          error: null
        });
        
        // 同步成功后，重新从服务器加载数据以确保数据一致性
        try {
          console.log('=== Reloading Data After Sync ===');
          console.log('同步前的本地 periodLogs:', state.periodLogs);
          
          await get().loadFromServer();
          
          // 验证重新加载的数据是否包含我们同步的数据
          const reloadedState = get();
          console.log('=== Server Data After Reload ===');
          console.log('从服务器加载的 periodLogs:', reloadedState.periodLogs);
          console.log(`Period logs count: ${reloadedState.periodLogs.length}`);
          console.log(`Daily logs count: ${reloadedState.dailyLogs.length}`);
          
          // 检查数据一致性
          const originalSorted = [...state.periodLogs].sort();
          const reloadedSorted = [...reloadedState.periodLogs].sort();
          const isConsistent = JSON.stringify(originalSorted) === JSON.stringify(reloadedSorted);
          console.log('数据一致性检查:', isConsistent ? '✅ 一致' : '❌ 不一致');
          
          if (!isConsistent) {
            console.log('期望的数据:', originalSorted);
            console.log('实际的数据:', reloadedSorted);
          }
          
          // 如果重新加载后仍然没有数据，尝试再次加载
          if (reloadedState.periodLogs.length === 0 && reloadedState.dailyLogs.length === 0) {
            console.log('No data found after reload, trying again...');
            await new Promise(resolve => setTimeout(resolve, 300));
            await get().loadFromServer();
          }
        } catch (reloadError) {
          console.warn('Failed to reload data after sync:', reloadError);
          // 即使重新加载失败，我们也尝试再次加载一次
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            await get().loadFromServer();
          } catch (secondReloadError) {
            console.warn('Failed to reload data second time:', secondReloadError);
          }
        }
      } catch (serverError) {
        console.warn('Failed to sync data to server (might be unauthenticated):', serverError);
        // 如果同步失败，我们不设置错误状态，因为可能是未认证状态
      }
    } catch (error) {
      console.error('Failed to sync data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to sync data'
      });
    }
  },

  clearData: async function() {
    try {
      // 根据新需求，我们不再检查本地存储的登录状态
      // 而是直接尝试清除服务器数据，让服务器通过URL参数中的uid来识别用户
      try {
        await apiClient.clearAllData();
      } catch (serverError) {
        console.warn('Failed to clear server data:', serverError);
        // 即使服务器清除失败，我们仍然清除本地状态
      }
      console.log('clear all miniapp data');
      
      // 清除内存中的用户数据
      // await StorageUtils.clearAllUserData();
      // 20250905-不需要清除信息到本地
      
      set({
        profile: {
          hasCompletedOnboarding: false
        },
        periods: [],
        periodLogs: [],
        dailyLogs: [],
        preferences: {
          avgCycle: 28,
          avgPeriod: 5,
          reminders: true,
          healthSync: false
        },
        error: null
      });
    } catch (error) {
      console.error('Failed to clear data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to clear data'
      });
    }
  },


  generateHistoricalCycles: function(periodLogs: string[]) {
    var preferences = get().preferences;
    
    // 优先使用用户手动记录的 periodLogs，不混合 LMP 数据
    var allPeriodDates: string[] = [];
    
    if (periodLogs.length === 0) {
      // 如果没有手动记录，尝试使用 LMP 数据
      if (preferences.lastMenstrualPeriod && preferences.avgPeriod) {
        var lmpStart = new Date(preferences.lastMenstrualPeriod);
        // 添加LMP开始日期及后续几天（根据平均经期长度）
        for (var i = 0; i < preferences.avgPeriod; i++) {
          var lmpDate = new Date(lmpStart);
          lmpDate.setDate(lmpStart.getDate() + i);
          var dateString = lmpDate.toISOString().split('T')[0];
          allPeriodDates.push(dateString);
        }
        
        if (allPeriodDates.length === 0) {
          return [];
        }
      } else {
        return [];
      }
    } else {
      // 直接使用 periodLogs，不添加 LMP 数据
      allPeriodDates = periodLogs.slice();
    }
    
    // 将连续的日期分组，每组代表一个经期
    var groupConsecutiveDates = function(dates: string[]) {
      if (dates.length === 0) {
        return [];
      }
      
      var sortedDates = dates.slice().sort();
      var groups: string[][] = [];
      var currentGroup: string[] = [sortedDates[0]];
      
      for (var i = 1; i < sortedDates.length; i++) {
        var prevDate = new Date(sortedDates[i - 1]);
        var currentDate = new Date(sortedDates[i]);
        var diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentGroup.push(sortedDates[i]);
        } else {
          groups.push(currentGroup);
          currentGroup = [sortedDates[i]];
        }
      }
      groups.push(currentGroup);
      
      return groups.reverse(); // 最新的在前
    };
    
    var periodGroups = groupConsecutiveDates(allPeriodDates);
    var cycles = [];
    
    // 判断状态的辅助函数
    var calculateStatus = function(cycleLen: number, periodLen: number) {
      // 周期长度判断 (21-35天正常)
      if (cycleLen < 21 || cycleLen > 35) {
        return 'red';
      }
      if (cycleLen < 25 || cycleLen > 32) {
        return 'yellow';
      }
      
      // 经期长度判断 (3-7天正常)
      if (periodLen < 3 || periodLen > 7) {
        return 'red';
      }
      if (periodLen < 4 || periodLen > 6) {
        return 'yellow';
      }
      
      return 'green';
    };
    
    // 首先添加最新的经期作为当前经期（如果存在）
    if (periodGroups.length > 0) {
      var latestPeriod = periodGroups[0];
      var latestPeriodLength = latestPeriod.length;
      
      // 如果有多个经期组，可以计算当前周期长度
      var currentCycleLength = 0;
      if (periodGroups.length > 1) {
        var latestStart = new Date(latestPeriod[0]);
        var previousStart = new Date(periodGroups[1][0]);
        currentCycleLength = Math.round((latestStart.getTime() - previousStart.getTime()) / (1000 * 60 * 60 * 24));
      }
      
      cycles.push({
        startDate: latestPeriod[0],
        endDate: latestPeriod[latestPeriod.length - 1],
        cycleLength: currentCycleLength,
        periodLength: latestPeriodLength,
        status: calculateStatus(currentCycleLength, latestPeriodLength)
      });
    }
    
    // 然后添加历史周期数据
    for (var i = 1; i < periodGroups.length; i++) {
      var currentPeriod = periodGroups[i - 1]; // 较新的经期
      var previousPeriod = periodGroups[i]; // 较旧的经期
      
      var currentStart = new Date(currentPeriod[0]);
      var previousStart = new Date(previousPeriod[0]);
      
      // 计算周期长度（两次经期开始日期之间的天数）
      var cycleLength = Math.round((currentStart.getTime() - previousStart.getTime()) / (1000 * 60 * 60 * 24));
      
      // 计算经期长度
      var periodLength = previousPeriod.length;
      
      cycles.push({
        startDate: previousPeriod[0],
        endDate: previousPeriod[previousPeriod.length - 1],
        cycleLength: cycleLength,
        periodLength: periodLength,
        status: calculateStatus(cycleLength, periodLength)
      });
    }
    
    return cycles;
  },

  updatePredictionHistory: function() {
    const state = get();
    console.log('=== 更新预测历史 ===');
    
    try {
      const newPredictionHistory = calculatePredictionHistory(state.periodLogs, state.preferences);
      
      set({
        predictionHistory: newPredictionHistory
      });
      
      console.log('预测历史已更新:', {
        latestPrediction: newPredictionHistory.latestPrediction?.id,
        totalPredictions: newPredictionHistory.historicalPredictions.length,
        lastUpdated: newPredictionHistory.lastUpdated
      });
    } catch (error) {
      console.error('更新预测历史失败:', error);
    }
  },

  getCurrentUserId: async function() {
    // 由于uid已经是string类型，不需要额外转换
    var userId = await StorageUtils.getUserId();
    return userId;
  },
  
  initializeUser: async function() {
    try {
      // 获取本地存储的用户信息
      const userData = await StorageUtils.getUserData();
      if (userData && userData.uid) {
        try {
          // 尝试通过uid从服务器获取用户数据
          // const userResponse = await apiClient.getUserProfile();
          // 如果能成功获取到数据，说明用户已存在，正常加载数据
          await get().loadFromServer();
        } catch (serverError) {
          console.warn('User not found on server, creating new user:', serverError);
          // 用户不存在，创建新用户
          try {
            // 准备创建用户的数据
            const createUserData = {
              uid: userData.uid,
              email: userData.email || '',
              name: userData.userName || 'New User'
            };
            console.log('prepare to create user', createUserData);
            // 调用服务器API创建新用户
            await apiClient.createUserIfNotExists(createUserData);
            // 创建成功后，加载用户数据
            await get().loadFromServer();
            console.log('New user created successfully');
          } catch (createError) {
            console.error('Failed to create new user:', createError);
            throw createError;
          }
        }
      } else {
        // 如果本地没有用户信息，尝试直接从服务器加载数据
        await get().loadFromServer();
      }
    } catch (error) {
      console.error('Failed to initialize user:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize user'
      });
    }
  }
}));