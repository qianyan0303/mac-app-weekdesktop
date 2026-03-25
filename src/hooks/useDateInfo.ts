import { useState, useEffect } from 'react';
import type { DateInfo } from '../types/widget';

function calcDateInfo(): DateInfo {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // 本年第几天
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // 本年第几周 (ISO 8601: 周一为第一天，含该年第一个周四的周为第1周)
  const jan4 = new Date(year, 0, 4);
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
  const todayMidnight = new Date(year, now.getMonth(), day);
  const weekOfYear = Math.floor((todayMidnight.getTime() - startOfWeek1.getTime()) / (7 * 86400000)) + 1;

  // 本月第几周（月份第1天所在周为第1周，周一为开始）
  const firstOfMonth = new Date(year, now.getMonth(), 1);
  const firstDayWeekday = (firstOfMonth.getDay() + 6) % 7; // 0=Mon
  const weekOfMonth = Math.ceil((day + firstDayWeekday) / 7);

  // 距年底还有几天（不含今天）
  const endOfYear = new Date(year, 11, 31);
  const daysLeftInYear = Math.floor((endOfYear.getTime() - todayMidnight.getTime()) / 86400000);

  // 距年底还有几周（向上取整）
  const weeksLeftInYear = Math.ceil(daysLeftInYear / 7);

  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return { dayOfYear, weekOfYear, weekOfMonth, daysLeftInYear, weeksLeftInYear, date: dateStr, weekday, year, month, day };
}

export function useDateInfo(): DateInfo {
  const [info, setInfo] = useState<DateInfo>(calcDateInfo);

  useEffect(() => {
    // 每天零点刷新
    const scheduleNextRefresh = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      return setTimeout(() => {
        setInfo(calcDateInfo());
        scheduleNextRefresh();
      }, msUntilMidnight);
    };

    const timer = scheduleNextRefresh();
    return () => clearTimeout(timer);
  }, []);

  return info;
}
