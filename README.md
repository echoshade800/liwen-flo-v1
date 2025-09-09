# 🌸 女性健康伴侣 - 经期跟踪应用

一款专为女性设计的智能经期跟踪和健康管理应用，帮助用户了解自己的生理周期，预测经期和排卵期，并提供个性化的健康洞察。

## ✨ 核心功能

### 📅 智能日历
- 直观显示月经周期、排卵日和受孕窗口期
- 个性化周期预测和提醒
- 历史周期数据可视化

### 💡 每日洞察
- 记录症状、情绪和身体状况
- 了解身体模式和变化
- 智能健康建议

### 🔮 精准预测
- 基于个人数据预测下次经期
- 最佳受孕时机推荐
- 个性化健康提醒

### 📈 趋势分析
- 查看周期趋势图表
- 及时发现身体变化
- 长期健康数据跟踪

## 🏗️ 技术架构

### 前端技术栈
- **React Native** - 跨平台移动应用开发
- **Expo** - 开发工具链和平台
- **TypeScript** - 类型安全的 JavaScript
- **Expo Router** - 基于文件的导航系统
- **Zustand** - 轻量级状态管理
- **React Native Calendars** - 日历组件
- **Chart Kit** - 数据可视化图表

### 后端技术栈
- **Node.js + Express** - 服务器框架
- **MySQL** - 关系型数据库
- **JWT** - 用户认证
- **bcryptjs** - 密码加密
- **CORS** - 跨域资源共享

### 开发工具
- **TypeScript** - 静态类型检查
- **ESLint** - 代码质量检查
- **Expo CLI** - 开发和构建工具

## 📱 应用截图

### 主要界面
- **登录注册** - 安全的用户认证系统
- **引导流程** - 个性化设置和问卷调查
- **主页** - 周期概览和快速操作
- **日历视图** - 直观的周期可视化
- **每日记录** - 症状和情绪跟踪
- **趋势分析** - 健康数据图表

## 🚀 快速开始

### 环境要求
- Node.js 16.x 或更高版本
- npm 或 yarn
- Expo CLI
- iOS 模拟器或 Android 模拟器（可选）
- MySQL 数据库

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd github_mini_app_flo-v1
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
创建 `.env` 文件：
```env
# 数据库配置
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=period_tracker

# 服务器配置
BACKEND_PORT=3007
FRONTEND_PORT=8081

# JWT 密钥
JWT_SECRET=your_jwt_secret_key
```

4. **初始化数据库**
```bash
# 启动 MySQL 服务
# 创建数据库（会自动运行初始化脚本）
npm run server
```

5. **启动应用**

启动后端服务器：
```bash
npm run server
```

启动前端应用（新终端窗口）：
```bash
npm run dev
```

或者同时启动前后端：
```bash
npm run dev:full
```

6. **在设备上运行**
- 安装 Expo Go 应用
- 扫描终端中显示的二维码
- 或在模拟器中运行

## 📋 可用脚本

```bash
# 开发模式启动前端
npm run dev

# 启动后端服务器
npm run server

# 同时启动前后端
npm run dev:full

# 构建 Web 版本
npm run build:web

# 代码检查
npm run lint
```

## 📁 项目结构

```
├── app/                    # 主应用代码
│   ├── (tabs)/            # 标签页导航
│   │   ├── index.tsx      # 主页
│   │   ├── cycles-hub.tsx # 周期中心
│   │   ├── daily-insights.tsx # 每日洞察
│   │   └── trends.tsx     # 趋势分析
│   ├── auth/              # 认证相关页面
│   │   ├── login.tsx      # 登录页面
│   │   └── register.tsx   # 注册页面
│   ├── onboarding/        # 引导流程
│   │   ├── index.tsx      # 权限和条款
│   │   ├── goal-selection.tsx # 目标选择
│   │   ├── age-gate.tsx   # 年龄验证
│   │   ├── questions.tsx  # 问卷调查
│   │   └── done.tsx       # 完成页面
│   ├── components/        # 可复用组件
│   │   ├── MonthCalendar.tsx # 月历组件
│   │   ├── DayInfoCard.tsx   # 日期信息卡片
│   │   ├── QuestionCard.tsx  # 问题卡片
│   │   └── ...
│   ├── lib/               # 工具库
│   │   ├── api.ts         # API 接口
│   │   ├── cycle.ts       # 周期计算逻辑
│   │   ├── types.ts       # 类型定义
│   │   └── StorageUtils.ts # 本地存储工具
│   ├── store/             # 状态管理
│   │   └── useCycleStore.ts # 周期状态管理
│   └── theme/             # 主题配置
│       └── tokens.ts      # 设计令牌
├── server/                # 后端服务器
│   ├── routes/           # API 路由
│   │   ├── auth.js       # 认证路由
│   │   ├── cycle.js      # 周期数据路由
│   │   ├── user.js       # 用户路由
│   │   └── alarms.js     # 提醒路由
│   ├── database/         # 数据库配置
│   │   ├── connection.js # 数据库连接
│   │   └── init-db.js    # 数据库初始化
│   ├── middleware/       # 中间件
│   │   └── auth.js       # 认证中间件
│   └── index.js          # 服务器入口
├── assets/               # 静态资源
│   └── images/          # 图片资源
├── package.json          # 项目配置
├── app.json             # Expo 配置
├── tsconfig.json        # TypeScript 配置
└── README.md            # 项目文档
```

## 🎯 主要功能模块

### 用户认证系统
- 安全的注册和登录流程
- JWT token 认证
- 密码加密存储

### 引导流程
- **权限请求** - 通知和健康数据权限
- **目标设置** - 用户使用目标选择
- **年龄验证** - 确保用户年龄适宜
- **个性化问卷** - 收集用户健康信息

### 周期管理
- **智能预测** - 基于历史数据预测周期
- **日历视图** - 可视化周期状态
- **数据记录** - 经期开始/结束记录
- **症状跟踪** - 多维度健康数据记录

### 数据分析
- **趋势图表** - 周期长度和变化趋势
- **健康洞察** - 基于数据的个性化建议
- **模式识别** - 识别身体变化模式

## 🔧 配置说明

### 数据库配置
应用使用 MySQL 数据库，主要数据表包括：
- `users` - 用户信息
- `cycles` - 周期数据
- `daily_logs` - 每日记录
- `questionnaire_answers` - 问卷答案

### API 接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/cycle/data` - 获取周期数据
- `POST /api/cycle/period` - 记录经期
- `GET /api/user/profile` - 获取用户资料

### 本地存储
使用 AsyncStorage 存储：
- 用户认证 token
- 用户基本信息
- 应用设置

## 🚀 部署指南

### 开发环境部署
1. 按照快速开始步骤设置本地环境
2. 确保数据库服务正常运行
3. 启动后端和前端服务

### 生产环境部署
1. **后端部署**
   - 配置生产数据库
   - 设置环境变量
   - 使用 PM2 或类似工具管理进程

2. **移动应用发布**
   - 使用 `expo build` 构建应用
   - 发布到 App Store 或 Google Play

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范
- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 编写清晰的注释
- 确保代码测试通过

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持与反馈

如果您在使用过程中遇到问题或有建议，请：
- 创建 [Issue](../../issues)
- 发送邮件至 support@example.com
- 查看 [常见问题解答](docs/FAQ.md)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户。

特别感谢：
- React Native 社区
- Expo 团队
- 所有测试用户的反馈

---

💖 **为女性健康而构建，用爱心和科学守护每一个周期。**
