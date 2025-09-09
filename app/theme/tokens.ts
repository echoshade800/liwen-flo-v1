export const colors = {
  primary: '#FF5A7A',        // 主题粉/主按钮
  period: '#FF6584',         // 经期
  fertileLight: '#9EDFE8',   // 受孕窗口
  ovulation: '#16A3A3',      // 排卵
  green: '#22C55E',
  yellow: '#F59E0B', 
  red: '#EF4444',
  gray600: '#6B7280',
  gray300: '#E5E7EB',
  gray100: '#F3F4F6',
  bg: '#F7F7F8',
  white: '#FFFFFF',
  black: '#000000',
  text: '#1F2937',
  textSecondary: '#6B7280',
};

export const radii = { 
  card: 16, 
  pill: 999,
  small: 8,
  medium: 12
};

export const spacing = (n: number) => n * 8;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '600' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
};