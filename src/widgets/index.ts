import type { WidgetMeta } from '../types/widget';
import { WeekWidget } from './WeekWidget';
import { AboutWidget } from './AboutWidget';

export const WIDGET_REGISTRY: WidgetMeta[] = [
  {
    id: 'week-info',
    name: '周数信息',
    description: '显示本年第几天、本年第几周、本月第几周',
    component: WeekWidget,
    defaultSize: { width: 280, height: 310 },
  },
  {
    id: 'about',
    name: '关于',
    description: '关于 WeekDesktop 小部件',
    component: AboutWidget,
    defaultSize: { width: 280, height: 320 },
  },
];
