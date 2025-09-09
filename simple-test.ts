// 简单的测试文件，用于验证TypeScript能否正常工作
export interface TestInterface {
  id: string;
  name: string;
}

export function testFunction(param: TestInterface): string {
  // 使用传统方式检查属性，避免可选链操作符
  return param && param.name ? param.name : 'Unknown';
}

// 简单的类型检查测试
const testObject: TestInterface = {
  id: '123',
  name: 'Test'
};

console.log('Test result:', testFunction(testObject));