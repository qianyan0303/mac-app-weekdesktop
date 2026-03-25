import type { FC } from 'react';

export interface WidgetMeta {
  id: string;
  name: string;
  description: string;
  component: FC;
  defaultSize: {
    width: number;
    height: number;
  };
}

export interface DateInfo {
  dayOfYear: number;
  weekOfYear: number;
  weekOfMonth: number;
  daysLeftInYear: number;
  weeksLeftInYear: number;
  date: string;
  weekday: string;
  year: number;
  month: number;
  day: number;
}
