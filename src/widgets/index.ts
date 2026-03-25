import type { WidgetMeta } from '../types/widget';
import { WeekWidget } from './WeekWidget';

export const WIDGET_REGISTRY: WidgetMeta[] = [
  {
    id: 'week-info',
    name: '周数信息',
    description: '显示本年第几天、本年第几周、本月第几周',
    component: WeekWidget,
    defaultSize: { width: 280, height: 310 },
  },
  // 在此处追加新 Widget
];
