import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { QuestionnaireItem } from '../lib/types';
import EmojiOption from './EmojiOption';
import ReassuranceCard from './ReassuranceCard';
import InfoCard from './InfoCard';
import WheelNumberPicker from './WheelNumberPicker';

interface QuestionCardProps {
  question: QuestionnaireItem;
  answer: any;
  onAnswer: (answer: any) => void;
  onNext?: () => void;
}

// 占位符替换函数
const interpolate = (text?: string, vars: Record<string, string> = {}) => {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
};

export default function QuestionCard({ question, answer, onAnswer, onNext }: QuestionCardProps) {

  // 处理 info 类型
  if (question.type === 'info') {
    const predictedDate = dayjs().add(28, 'day').format('M月D日'); // 示例预测日期
    const vars = { date: predictedDate };

    return (
      <InfoCard
        title={interpolate(question.title, vars)}
        body={interpolate(question.body, vars)}
        image={question.image}
        actions={question.actions}
        onActionPress={(id) => {
          if (id === 'record_past_periods') {
            // 预留：打开记录弹窗或跳转
            console.log('记录过去的经期');
          }
          if (id === 'import_from_apple_health') {
            // 预留：Apple Health 导入
            console.log('从 Apple 健康导入');
          }
        }}
        onNext={() => {
          if (onNext) {
            onNext();
          }
        }}
      />
    );
  }

  const handleSingleSelect = (optionId: string) => {
    onAnswer(optionId);
  };

  const handleMultiSelect = (optionId: string) => {
    const currentAnswers = Array.isArray(answer) ? answer : [];
    
    // 特殊处理健康状况题的互斥逻辑
    if (question.id === 'q_health_conditions') {
      const exclusiveOptions = ['unsure', 'none'];
      const diseaseOptions = ['candida', 'uti', 'bv', 'pcos', 'endometriosis', 'fibroids'];
      
      let newAnswers: string[];
      
      if (exclusiveOptions.includes(optionId)) {
        // 选择了 unsure 或 none
        if (currentAnswers.includes(optionId)) {
          // 取消选择
          newAnswers = [];
        } else {
          // 选择该项，清除所有其他选项
          newAnswers = [optionId];
        }
      } else {
        // 选择了疾病项
        if (currentAnswers.includes(optionId)) {
          // 取消选择该疾病项
          newAnswers = currentAnswers.filter(id => id !== optionId);
        } else {
          // 添加该疾病项，同时移除 unsure 和 none
          newAnswers = [...currentAnswers.filter(id => !exclusiveOptions.includes(id)), optionId];
        }
      }
      
      onAnswer(newAnswers);
    } else if (question.id === 'q_today_symptoms') {
      // 特殊处理今日症状题的互斥逻辑
      const exclusiveOption = 'none'; // "都不是"
      const symptomOptions = ['cramps', 'fatigue', 'bloating', 'breast_tenderness', 'back_pain'];
      
      let newAnswers: string[];
      
      if (optionId === exclusiveOption) {
        // 选择了"都不是"
        if (currentAnswers.includes(optionId)) {
          // 取消选择
          newAnswers = [];
        } else {
          // 选择"都不是"，清除所有其他选项
          newAnswers = [optionId];
        }
      } else {
        // 选择了症状项
        if (currentAnswers.includes(optionId)) {
          // 取消选择该症状项
          newAnswers = currentAnswers.filter(id => id !== optionId);
        } else {
          // 添加该症状项，同时移除"都不是"
          newAnswers = [...currentAnswers.filter(id => id !== exclusiveOption), optionId];
        }
      }
      
      onAnswer(newAnswers);
    } else if (question.id === 'q_mental_health_impact') {
      // 特殊处理心理健康影响题的互斥逻辑
      const exclusiveOption = 'none'; // "不，我没有想到什么"
      const emotionOptions = ['mood_swings', 'anxiety', 'fatigue', 'irritability', 'low_mood', 'pmdd'];
      
      let newAnswers: string[];
      
      if (optionId === exclusiveOption) {
        // 选择了"不，我没有想到什么"
        if (currentAnswers.includes(optionId)) {
          // 取消选择
          newAnswers = [];
        } else {
          // 选择"不，我没有想到什么"，清除所有其他选项
          newAnswers = [optionId];
        }
      } else {
        // 选择了情绪项
        if (currentAnswers.includes(optionId)) {
          // 取消选择该情绪项
          newAnswers = currentAnswers.filter(id => id !== optionId);
        } else {
          // 添加该情绪项，同时移除"不，我没有想到什么"
          newAnswers = [...currentAnswers.filter(id => id !== exclusiveOption), optionId];
        }
      }
      
      onAnswer(newAnswers);
    } else {
      // 其他多选题的正常逻辑
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId)
        : [...currentAnswers, optionId];
      
      onAnswer(newAnswers);
    }
  };

  const handleDateSelect = (dateString: string) => {
    onAnswer(dateString);
  };

  const handleNumberChange = (value: string | number) => {
    if (typeof value === 'number') {
      // 来自 WheelNumberPicker 的数字值
      onAnswer(value);
    } else {
      // 来自 TextInput 的字符串值
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        onAnswer(numValue);
      }
    }
  };

  const renderContent = () => {
    switch (question.type) {
      case 'single':
        // 检查是否应该隐藏小贴士的特殊题目
        const shouldHideReassurance = ['q_health_conditions', 'q_cycle_related_symptoms'].includes(question.id);
        
        return (
          <View>
            <View style={styles.optionsContainer}>
              {question.options && question.options.map((option) => (
          <React.Fragment key={option.id}>
            <EmojiOption
              emoji={option.emoji || ''}
              text={option.label}
              selected={answer === option.id}
              onPress={() => handleSingleSelect(option.id)}
            />
                  {!shouldHideReassurance && answer === option.id && question.reassurance && question.reassurance[option.id] && (
            <ReassuranceCard
              title="💡 Tip"
              content={question.reassurance[option.id]}
            />
          )}
                </React.Fragment>
              ))}
            </View>
          </View>
        );

      case 'multi':
        // 检查是否应该隐藏小贴士的特殊题目
        const shouldHideMultiReassurance = ['q_health_conditions', 'q_cycle_related_symptoms', 'q_mental_health_impact'].includes(question.id);
        
        return (
          <View>
            <View style={styles.optionsContainer}>
              {question.options && question.options.map((option) => (
          <React.Fragment key={option.id}>
            <EmojiOption
              emoji={option.emoji || ''}
              text={option.label}
              selected={Array.isArray(answer) && answer.includes(option.id)}
              onPress={() => handleMultiSelect(option.id)}
              multiSelect
            />
                  {!shouldHideMultiReassurance && Array.isArray(answer) && answer.includes(option.id) && question.reassurance && question.reassurance[option.id] && (
            <ReassuranceCard
              title="💡 Tip"
              content={question.reassurance[option.id]}
            />
          )}
                </React.Fragment>
              ))}
            </View>
          </View>
        );

      case 'date':
        // 为 LMP 题目生成标记日期
        const generateLMPMarkedDates = () => {
          if (question.id !== 'q_lmp' || !answer) return {};
          
          const markedDates: Record<string, any> = {};
          const startDate = dayjs(answer);
          
          // 标记选中日期及后续4天（共5天）
          for (let i = 0; i < 5; i++) {
            const date = startDate.add(i, 'day');
            const dateString = date.format('YYYY-MM-DD');
            markedDates[dateString] = {
              selected: i === 0, // 只有第一天显示为选中状态
              selectedColor: colors.primary,
              marked: true,
              dotColor: colors.period,
              customStyles: {
                container: {
                  backgroundColor: i === 0 ? colors.primary : colors.period + '40',
                  borderRadius: 16,
                },
                text: {
                  color: colors.white,
                  fontWeight: '600',
                }
              }
            };
          }
          
          return markedDates;
        };
        
        return (
          <View style={styles.dateContainer}>
            <Calendar
              current={dayjs().format('YYYY-MM-DD')}
              maxDate={dayjs().format('YYYY-MM-DD')}
              minDate={dayjs().subtract(2, 'year').format('YYYY-MM-DD')}
              onDayPress={(day) => handleDateSelect(day.dateString)}
              markedDates={question.id === 'q_lmp' ? generateLMPMarkedDates() : (answer ? {
                [answer]: {
                  selected: true,
                  selectedColor: colors.primary,
                }
              } : {})}
              theme={{
                backgroundColor: colors.white,
                calendarBackground: colors.white,
                textSectionTitleColor: colors.textSecondary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary,
                dayTextColor: colors.text,
                textDisabledColor: colors.gray300,
                arrowColor: colors.primary,
                monthTextColor: colors.text,
                textDayFontSize: 16,
                textMonthFontSize: 18,
              }}
            />
          </View>
        );

      case 'number':
        // 特殊处理周期和经期长度问题，使用滚轮选择器
        if (question.id === 'q_avg_cycle') {
          return (
            <WheelNumberPicker
              value={answer || question.default || 28}
              onChange={handleNumberChange}
              min={question.min || 15}
              max={Math.min(question.max || 365)} // 限制滚轮选择器最大值为45天，更实用
              unit="days"
            />
          );
        }
        
        if (question.id === 'q_avg_period') {
          return (
            <WheelNumberPicker
              value={answer || question.default || 6}
              onChange={handleNumberChange}
              min={question.min || 3}
              max={question.max || 10}
              unit="days"
            />
          );
        }
        
        // 其他数字输入保持原样
        return (
          <View style={styles.numberContainer}>
            <TextInput
              style={styles.numberInput}
              value={(answer ? answer.toString() : '') || (question.default ? question.default.toString() : '')}
              onChangeText={handleNumberChange}
              keyboardType="numeric"
              placeholder={question.default ? question.default.toString() : ''}
            />
            {question.unit && (
              <Text style={styles.unit}>{question.unit}</Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.title}</Text>
      {question.subtitle && (
        <Text style={styles.subtitle}>{question.subtitle}</Text>
      )}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(3),
    marginBottom: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing(1),
    lineHeight: 28,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing(2),
    lineHeight: 18,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing(0.5),
  },
  dateContainer: {
    marginTop: spacing(1),
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing(1),
  },
  numberInput: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: radii.medium,
    padding: spacing(2),
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  unit: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing(1),
  },
});