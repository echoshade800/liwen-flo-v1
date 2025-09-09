import AsyncStorage from '@react-native-async-storage/async-storage';

// 用户数据类型定义
interface UserData {
  id: number;
  uid: string; // 从number改为string，以支持long值数据
  userName: string;
  email: string;
  avatar: string;
  vipLevel: number;
  passId: string;
  availableAmount: number;
  country: string;
  city: string;
  createTime: number;
}

/**
 * 存储工具类
 * 提供AsyncStorage相关的操作方法
 */
class StorageUtils {
  /**
   * 获取用户数据
   * @returns {Promise<UserData|null>} 用户数据对象，如果不存在则返回null
   */
  static async getUserData(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
      //20250905-调试内容
      // return {
      //   "vipLevel": 0,
      //   "passId": "ijacQFlIUOQFnfwZQtSaL0bpvk6bzf/zSu2l/WtGxOo=",
      //   "availableAmount": 0,
      //   "clientIp": "103.229.54.21",
      //   "id": 9,
      //   "uid": "10000000000000462",
      //   "userName": "USER0IGL9PHYS",
      //   "avatar": "",
      //   "inviteCode": "",
      //   "invitedCode": "-1",
      //   "inviterId": -1,
      //   "thirdSource": "GOOGLE",
      //   "thirdAccount": "",
      //   "thirdId": "",
      //   "deviceId": "",
      //   "deviceToken": "",
      //   "email": "fan462@gmail.com",
      //   "password": "",
      //   "country": "Hong Kong/HK",
      //   "city": "unknow",
      //   "fromChannel": "",
      //   "timeZone": "",
      //   "createTime": 1757042933014,
      //   "canSetPassword": false
      // }
    } catch (error) {
      console.error('本地获取用户数据失败:', error);
      return null;
    }
  }

  /**
   * 获取访问密钥（从用户数据的passId字段获取）
   * @returns {Promise<string|null>} 访问密钥，如果不存在则返回null
   */
  static async getAccessKey(): Promise<string | null> {
    try {
      const userData = await this.getUserData();
      return userData && userData.passId ? userData.passId : null;
    } catch (error) {
      console.error('获取访问密钥失败:', error);
      return null;
    }
  }

  /**
   * 同时获取用户数据和访问密钥
   * @returns {Promise<{userData: UserData | null, accessKey: string | null}>} 包含userData和accessKey的对象
   */
  static async getUserDataAndAccessKey(): Promise<{userData: UserData | null, accessKey: string | null}> {
    try {
      const userData = await this.getUserData();
      const accessKey = userData && userData.passId ? userData.passId : null;

      return {
        userData,
        accessKey
      };
    } catch (error) {
      console.error('获取用户数据和访问密钥失败:', error);
      return {
        userData: null,
        accessKey: null
      };
    }
  }

  /**
   * 保存用户数据
   * @param {UserData} userData - 用户数据对象
   * @returns {Promise<boolean>} 保存是否成功
   */
  static async saveUserData(userData: UserData): Promise<boolean> {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('保存用户数据失败:', error);
      return false;
    }
  }

  /**
   * 保存访问密钥（通过更新用户数据的passId字段）
   * @param {string} accessKey - 访问密钥
   * @returns {Promise<boolean>} 保存是否成功
   */
  static async saveAccessKey(accessKey: string): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      if (userData) {
        userData.passId = accessKey;
        return await this.saveUserData(userData);
      }
      return false;
    } catch (error) {
      console.error('保存访问密钥失败:', error);
      return false;
    }
  }
  
  /**
   * 清除所有用户相关数据
   * @returns {Promise<boolean>} 清除是否成功
   */
  // static async clearAllUserData(): Promise<boolean> {
  //   try {
  //     await this.clearUserData();
  //     return true;
  //   } catch (error) {
  //     console.error('清除所有用户数据失败:', error);
  //     return false;
  //   }
  // }

  /**
   * 获取用户UID
   * @returns {Promise<string|null>} 用户UID，如果不存在则返回null
   */
  static async getUserId(): Promise<string | null> {
    try {
      const userData = await this.getUserData();
      return userData && userData.uid ? userData.uid : null;
    } catch (error) {
      console.error('获取用户UID失败:', error);
      return null;
    }
  }

  /**
   * 保存用户信息
   * @param {string} uid - 用户UID
   * @param {Partial<UserData>} userInfo - 用户基本信息
   * @returns {Promise<boolean>} 保存是否成功
   */
  static async saveUserInfo(uid: string, userInfo: Partial<UserData> = {}): Promise<boolean> {
    return true;
    //20250905-不需要保存信息到本地
    try {
      const userData: UserData = {
        id: userInfo.id || 0,
        uid,
        userName: userInfo.userName || '',
        email: userInfo.email || '',
        avatar: userInfo.avatar || '',
        vipLevel: userInfo.vipLevel || 0,
        passId: userInfo.passId || '',
        availableAmount: userInfo.availableAmount || 0,
        country: userInfo.country || '',
        city: userInfo.city || '',
        createTime: userInfo.createTime || Date.now(),
      };
      return await this.saveUserData(userData);
    } catch (error) {
      console.error('保存用户信息失败:', error);
      return false;
    }
  }

  /**
   * 检查用户是否已登录
   * @returns {Promise<boolean>} 是否已登录
   */
  static async isLoggedIn(): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      return !!(userData && userData.uid && userData.passId);
    } catch (error) {
      console.error('检查登录状态失败:', error);
      return false;
    }
  }

  /**
   * 获取用户基本信息
   * @returns {Promise<{uid: string, userName: string, email: string} | null>} 用户基本信息
   */
  static async getUserBasicInfo(): Promise<{uid: string, userName: string, email: string} | null> {
    try {
      const userData = await this.getUserData();
      if (userData) {
        return {
          uid: userData.uid,
          userName: userData.userName,
          email: userData.email
        };
      }
      return null;
    } catch (error) {
      console.error('获取用户基本信息失败:', error);
      return null;
    }
  }
}

export default StorageUtils;