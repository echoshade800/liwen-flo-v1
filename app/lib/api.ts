import StorageUtils from './StorageUtils';
import Constants from 'expo-constants';

// 根据公网IP自动识别服务器地址
// 使用expo-constants获取运行时信息
// 如果是开发环境，使用localhost
// 如果是生产环境，尝试自动识别或使用默认值
const API_BASE_URL = (() => {
  // 检查是否有自定义的环境配置，使用传统方式替代可选链
  if (Constants.manifest && Constants.manifest.extra && Constants.manifest.extra.API_BASE_URL) {
    return Constants.manifest.extra.API_BASE_URL;
  }
  
  // 检查是否在开发模式下
  if (__DEV__) {
    return 'http://100.28.58.186:3007/api';
  }
  console.log('go local server url');
  
  // 生产环境下，可以使用以下几种方式之一:
  // 1. 使用当前设备连接的网络IP（需要额外的库来获取）
  // 2. 使用动态DNS域名
  // 3. 使用默认的公共IP地址
  
  // 这里我们使用一个简单的默认值，实际项目中可能需要更复杂的逻辑
  return 'http://' + (Constants.deviceId || '127.0.0.1') + ':3007/api';
})();

class ApiClient {
  private async getUserId(): Promise<string | null> {
    try {
      const userId = await StorageUtils.getUserId();
      console.log('userId', userId);
      // 确保返回的uid始终是字符串类型，避免大数字精度丢失
      return userId !== null ? String(userId) : null;
    } catch (error) {
      console.error('Failed to get user ID:', error);
      return null;
    }
  }

  private async request(endpoint: string, options: any = {}): Promise<any> {
    const config: any = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    // 根据需求，我们不再添加认证头，服务器无需验证，只通过URL参数中的uid来识别用户
    console.log('request to', API_BASE_URL + endpoint);
    const response = await fetch(API_BASE_URL + endpoint, config);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        throw new Error('Request failed with status: ' + response.status);
      }
      throw new Error(errorData.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password, name: name })
    });
    
    // 根据新需求，我们不再本地保存token和用户信息
    // 所有数据都通过API请求直接存储在数据库中
    // 我们只在内存中临时保存用户信息用于当前会话
    if (response.user) {
      await StorageUtils.saveUserInfo(response.user.uid, {
        email: response.user.email,
        userName: response.user.name
        // 注意：不再保存token，因为已经没有JWT认证了
      });
    }
    
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password })
    });
    
    // 根据新需求，我们不再本地保存token和用户信息
    // 所有数据都通过API请求直接存储在数据库中
    // 我们只在内存中临时保存用户信息用于当前会话
    if (response.user) {
      await StorageUtils.saveUserInfo(response.user.uid, {
        email: response.user.email,
        userName: response.user.name
        // 注意：不再保存token，因为已经没有JWT认证了
      });
    }
    
    return response;
  }

  async logout() {
    // 清除内存中的用户数据，而不是本地存储
    // await StorageUtils.clearAllUserData();
    // 20250905-不需要清除信息到本地
  }

  // 当用户不存在时，通过uid创建新用户
  async createUserIfNotExists(userData: { uid: string, email: string, name: string }) {
    try {
      // 调用服务器API创建新用户，传递uid等信息
      const response = await this.request('/auth/create-user-if-not-exists', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      // 如果需要，保存返回的用户信息
      if (response.user) {
        await StorageUtils.saveUserInfo(response.user.uid, {
          email: response.user.email,
          userName: response.user.name
        });
      }
      
      return response;
    } catch (error) {
      console.error('Failed to create user if not exists:', error);
      throw error;
    }
  }

  // User endpoints
  async getUserProfile() {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/user/profile' + (userId ? '?uid=' + userId : '');
    console.log('getUserProfile url', url);
    return this.request(url);
  }

  async updateUserProfile(profile: any) {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/user/profile' + (userId ? '?uid=' + userId : '');
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }

  async updateUserPreferences(preferences: any) {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/user/preferences' + (userId ? '?uid=' + userId : '');
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  // Cycle endpoints
  async getCycleData() {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/cycle/data' + (userId ? '?uid=' + userId : '');
    return this.request(url);
  }

  async addPeriodEntry(period: { startDate: string; endDate?: string }) {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/cycle/periods' + (userId ? '?uid=' + userId : '');
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(period)
    });
  }

  async updatePeriodLogs(dates: string[]) {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/cycle/period-logs' + (userId ? '?uid=' + userId : '');
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify({ dates: dates })
    });
  }

  async updateDailyLog(log: any) {
    try {
      // 获取用户ID
      const userId = await this.getUserId();
      
      // 验证日志数据
      if (!log || typeof log !== 'object') {
        throw new Error('Invalid log data: must be an object');
      }
      
      // 验证日期字段
      if (!log.date) {
        throw new Error('Log data missing required field: date');
      }
      
      // 确保symptoms是数组类型
      if (log.symptoms && !Array.isArray(log.symptoms)) {
        console.warn('Symptoms should be an array, converting:', log.symptoms);
        // 创建一个副本并转换symptoms为数组
        const logCopy = { ...log };
        logCopy.symptoms = [logCopy.symptoms];
        log = logCopy;
      }
      
      // 直接通过URL参数传递uid，而不是依赖服务器认证
      // 确保userId作为字符串传递，避免大数字精度丢失
      const url = '/cycle/daily-logs' + (userId ? '?uid=' + String(userId) : '');
      
      console.log('Updating daily log for user:', userId, 'date:', log.date);
      return this.request(url, {
        method: 'POST',
        body: JSON.stringify(log)
      });
    } catch (error) {
      console.error('Failed to prepare daily log update:', error);
      throw error;
    }
  }

  async clearAllData() {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/cycle/data' + (userId ? '?uid=' + userId : '');
    return this.request(url, {
      method: 'DELETE'
    });
  }

  // Alarm endpoints
  async getAlarms() {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/alarms' + (userId ? '?uid=' + userId : '');
    return this.request(url);
  }

  async createAlarm(alarm: any) {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/alarms' + (userId ? '?uid=' + userId : '');
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(alarm)
    });
  }

  async updateAlarm(id: string, alarm: any) {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/alarms/' + id + (userId ? '?uid=' + userId : '');
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(alarm)
    });
  }

  async deleteAlarm(id: string) {
    // 获取用户ID
    const userId = await this.getUserId();
    // 直接通过URL参数传递uid，而不是依赖服务器认证
    const url = '/alarms/' + id + (userId ? '?uid=' + userId : '');
    return this.request(url, {
      method: 'DELETE'
    });
  }
}

export const apiClient = new ApiClient();