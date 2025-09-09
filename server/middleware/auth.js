// 简化的身份验证中间件，始终通过验证
const authenticateToken = (req, res, next) => {
  // 模拟用户ID，可以根据需要修改
  req.user = { userId: 'mock-user-id-123' };
  next();
};

module.exports = { authenticateToken };