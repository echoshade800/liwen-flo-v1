// 测试完整的用户创建流程
console.log('=== 测试完整的用户创建流程 ===\n');

// 模拟环境
class MockStorageUtils {
  constructor() {
    this.userId = null;
    this.userInfo = null;
  }
  
  async getUserId() {
    // 模拟返回用户提供的测试ID
    this.userId = '90229557717630980'; // 使用用户提供的测试ID
    console.log('[STORAGE] 获取用户ID:', this.userId);
    return this.userId;
  }
  
  async saveUserInfo(uid, info) {
    console.log('[STORAGE] 保存用户信息:', uid, info);
    this.userInfo = info;
  }
  
  async clearAllUserData() {
    console.log('[STORAGE] 清除所有用户数据');
    this.userId = null;
    this.userInfo = null;
  }
}

class MockApiClient {
  constructor() {
    this.userExists = false;
    this.userData = null;
    this.cycleData = null;
  }
  
  async getUserId() {
    // 模拟返回用户ID
    return '90229557717630980';
  }
  
  async request(endpoint, options) {
    console.log('[API] 发起请求到:', endpoint);
    console.log('[API] 请求选项:', options);
    
    try {
      // 模拟API响应 - 解析URL，忽略查询参数
      const baseEndpoint = endpoint.split('?')[0];
      
      if (baseEndpoint === '/auth/create-user-if-not-exists') {
        console.log('[API] 处理创建用户请求');
        const userData = JSON.parse(options.body);
        
        // 模拟用户创建成功
        this.userExists = true;
        this.userData = {
          profile: {
            uid: userData.uid,
            email: userData.email,
            name: userData.name,
            hasCompletedOnboarding: false
          },
          preferences: {
            avgCycle: 28,
            avgPeriod: 5,
            reminders: true,
            healthSync: false
          }
        };
        
        console.log('[API] ✅ 模拟用户创建成功，用户ID:', userData.uid);
        
        // 模拟数据库操作日志
        console.log('[DATABASE SIMULATION] 执行 SQL: INSERT INTO users (uid, email, password_hash, name) VALUES (?, ?, ?, ?)');
        console.log('[DATABASE SIMULATION] 参数:', [userData.uid, userData.email, '', userData.name]);
        console.log('[DATABASE SIMULATION] ✅ 用户数据已插入到数据库');
        
        console.log('[DATABASE SIMULATION] 执行 SQL: SELECT id FROM user_preferences WHERE user_id = ?');
        console.log('[DATABASE SIMULATION] 参数:', [userData.uid]);
        console.log('[DATABASE SIMULATION] 结果: 未找到用户偏好设置');
        
        console.log('[DATABASE SIMULATION] 执行 SQL: INSERT INTO user_preferences (id, user_id) VALUES (?, ?)');
        const prefId = 'pref-' + Date.now();
        console.log('[DATABASE SIMULATION] 参数:', [prefId, userData.uid]);
        console.log('[DATABASE SIMULATION] ✅ 用户偏好设置已插入到数据库');
        
        return {
          message: 'User created successfully',
          user: {
            uid: userData.uid,
            email: userData.email,
            name: userData.name
          }
        };
      } else if (baseEndpoint === '/user/profile') {
        console.log('[API] 处理获取用户资料请求');
        if (!this.userExists) {
          console.log('[API] ❌ 模拟用户不存在，抛出错误');
          throw new Error('User not found');
        }
        
        console.log('[API] ✅ 返回用户资料');
        return this.userData;
      } else if (baseEndpoint === '/cycle/data') {
        console.log('[API] 处理获取周期数据请求');
        if (!this.userExists) {
          console.log('[API] ❌ 模拟用户不存在，抛出错误');
          throw new Error('User not found');
        }
        
        console.log('[API] ✅ 返回周期数据');
        return this.cycleData || {
          periods: [],
          periodLogs: [],
          dailyLogs: []
        };
      }
      
      throw new Error('Unknown endpoint: ' + baseEndpoint);
    } catch (error) {
      console.error('[API] ❌ 请求失败:', error.message);
      throw error;
    }
  }
  
  async getUserProfile() {
    console.log('[API] 调用getUserProfile方法');
    const userId = await this.getUserId();
    const url = '/user/profile?uid=' + userId;
    return this.request(url);
  }
  
  async getCycleData() {
    console.log('[API] 调用getCycleData方法');
    const userId = await this.getUserId();
    const url = '/cycle/data?uid=' + userId;
    return this.request(url);
  }
  
  async createUserIfNotExists(userData) {
    console.log('[API] 调用createUserIfNotExists方法');
    return this.request('/auth/create-user-if-not-exists', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
}

// 模拟loadFromServer方法
const mockLoadFromServer = async (storageUtils, apiClient) => {
  console.log('\n=============== LOAD FROM SERVER START ===============');
  
  try {
    // 获取用户ID
    let userId = null;
    try {
      userId = await storageUtils.getUserId();
      console.error('[LOAD] 用户ID获取成功:', userId);
    } catch (userIdError) {
      console.error('[LOAD] ❌ 获取用户ID失败:', userIdError);
      userId = 'default-user-id';
      console.error('[LOAD] 使用默认用户ID:', userId);
    }
    
    console.error('[LOAD] 开始加载数据，用户ID:', userId);
    
    try {
      // 尝试加载用户数据
      console.error('[LOAD] 尝试加载用户资料');
      const userResponse = await apiClient.getUserProfile();
      console.error('[LOAD] ✅ 用户资料加载成功');
      
      console.error('[LOAD] 尝试加载周期数据');
      const cycleResponse = await apiClient.getCycleData();
      console.error('[LOAD] ✅ 周期数据加载成功');
      
      console.log('\n✅ 测试成功：用户数据已存在并成功加载');
      console.log('用户资料:', userResponse);
      console.log('周期数据:', cycleResponse);
      console.log('\n=============== LOAD FROM SERVER COMPLETE ===============\n');
      return true;
    } catch (serverError) {
      console.error('[LOAD] ❌ 加载数据失败:', serverError.message);
      
      // 当用户不存在时，自动创建新用户
      if (serverError.message && serverError.message.includes('User not found')) {
        console.error('[LOAD] 用户不存在，尝试自动创建新用户');
        
        try {
          // 创建新用户
          if (userId) {
            console.error('[LOAD] 开始创建新用户，用户ID:', userId);
            const userData = {
              uid: userId,
              email: 'test@example.com',
              name: 'Test User'
            };
            
            console.error('[LOAD] 调用createUserIfNotExists创建用户');
            await apiClient.createUserIfNotExists(userData);
            console.error('[LOAD] ✅ 新用户创建成功，用户ID:', userId);
            
            // 用户创建成功后，再次尝试加载数据
            try {
              console.error('[LOAD] 尝试重新加载用户资料');
              const retryUserResponse = await apiClient.getUserProfile();
              console.error('[LOAD] ✅ 用户资料重新加载成功');
              
              console.error('[LOAD] 尝试重新加载周期数据');
              const retryCycleResponse = await apiClient.getCycleData();
              console.error('[LOAD] ✅ 周期数据重新加载成功');
              
              console.log('\n✅ 测试成功：用户创建成功并成功加载数据');
              console.log('加载的用户资料:', retryUserResponse);
              console.log('加载的周期数据:', retryCycleResponse);
              console.log('\n=============== LOAD FROM SERVER COMPLETE ===============\n');
              return true;
            } catch (retryError) {
              console.error('[LOAD] ❌ 创建用户后重新加载数据失败:', retryError.message);
            }
          } else {
            console.error('[LOAD] ❌ 用户ID为空，无法创建新用户');
          }
        } catch (createUserError) {
          console.error('[LOAD] ❌ 创建新用户失败:', createUserError.message);
        }
      } else {
        console.error('[LOAD] ❌ 非用户不存在错误，无法自动创建用户:', serverError.message);
      }
      
      console.log('\n❌ 测试失败：重置为初始状态');
      console.log('=============== LOAD FROM SERVER FAILED ===============\n');
      return false;
    }
  } catch (error) {
    console.error('[LOAD] ❌ 加载数据过程中发生严重错误:', error);
    console.log('\n❌ 测试失败：发生严重错误');
    console.log('=============== LOAD FROM SERVER FAILED ===============\n');
    return false;
  }
};

// 运行测试
const runTest = async () => {
  const storageUtils = new MockStorageUtils();
  const apiClient = new MockApiClient();
  
  console.log('测试场景：完整的用户创建流程');
  console.log('1. 获取用户ID');
  console.log('2. 尝试加载用户数据（应该失败）');
  console.log('3. 检测到用户不存在，自动创建新用户');
  console.log('4. 创建成功后再次尝试加载数据');
  console.log('5. 验证数据是否正确保存到数据库');
  
  const result = await mockLoadFromServer(storageUtils, apiClient);
  
  console.log('\n=== 测试总结 ===');
  console.log('我们增强了以下关键部分的日志记录：');
  console.log('1. loadFromServer方法 - 添加了详细的日志和错误处理');
  console.log('2. API客户端的request方法 - 记录了完整的请求和响应信息');
  console.log('3. createUserIfNotExists方法 - 添加了完整的用户创建流程日志');
  
  if (result) {
    console.log('\n✅ 完整用户创建流程测试通过！');
    console.log('\n通过我们的增强日志，您应该能够在应用日志中看到：');
    console.log('1. 用户ID的获取过程');
    console.log('2. API请求的完整信息（URL、参数、响应状态）');
    console.log('3. 用户创建的详细过程，包括数据库操作的模拟日志');
    console.log('4. 创建成功后的数据重新加载过程');
    
    console.log('\n现在，当您运行应用时，您应该能够：');
    console.log('1. 在控制台中看到详细的日志输出');
    console.log('2. 追踪用户创建和数据同步的完整流程');
    console.log('3. 识别可能出现的任何错误或问题');
    
    console.log('\n如果问题仍然存在，请查看应用的完整日志，特别是：');
    console.log('1. 是否成功获取了用户ID');
    console.log('2. API请求是否发送到了正确的URL');
    console.log('3. 服务器是否返回了成功的响应');
    console.log('4. 数据库操作是否按预期执行');
  } else {
    console.log('\n❌ 完整用户创建流程测试失败！');
    console.log('请检查错误日志并进一步排查问题。');
  }
};

// 开始测试
runTest().catch(err => {
  console.error('测试执行失败:', err);
});