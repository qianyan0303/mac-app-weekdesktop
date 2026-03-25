# WeekDesktop — 技术文档

> macOS 桌面悬浮 Widget 应用，基于 Tauri 2 + React 19 + TypeScript 构建。

---

## 目录

1. [项目概述](#项目概述)
2. [技术选型](#技术选型)
3. [架构设计](#架构设计)
4. [目录结构](#目录结构)
5. [Widget 系统设计](#widget-系统设计)
6. [核心模块说明](#核心模块说明)
7. [窗口配置](#窗口配置)
8. [开发指南](#开发指南)
9. [构建与发布](#构建与发布)
10. [后续规划](#后续规划)

---

## 项目概述

**WeekDesktop** 是一款运行在 macOS 桌面上的轻量级悬浮 Widget 应用。它以透明、无边框、始终置顶的方式悬浮在桌面上，提供各类实用的信息小部件。用户可按需添加、移除或排列 Widget。

**首个 Widget：周数信息**
- 本年第几天（Day of Year）
- 本年第几周（Week of Year，ISO 8601 标准）
- 本月第几周（Week of Month）

---

## 技术选型

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|---------|
| 桌面框架 | [Tauri](https://tauri.app) | 2.x | 轻量（~10MB），原生性能，Rust 后端安全可靠 |
| 前端框架 | React | 19.x | 生态成熟，组件化开发，适合 Widget 插槽系统 |
| 语言 | TypeScript | 5.8 | 类型安全，减少运行时错误 |
| 构建工具 | Vite | 7.x | 极速热更新，开发体验优秀 |
| 后端语言 | Rust | 1.94+ | 内存安全，系统级 API 访问 |
| 样式方案 | CSS Variables + CSS Modules | — | 零依赖，主题切换方便 |

**为什么选 Tauri 而非 Electron？**
- 安装包体积：Tauri ~10MB vs Electron ~150MB
- 内存占用：Tauri 使用系统 WebView，内存更低
- 安全性：Rust 后端 + 细粒度权限控制
- macOS 原生集成：可访问系统 API，实现真正的透明窗口

---

## 架构设计

```
┌─────────────────────────────────────────────────┐
│                   macOS Desktop                  │
│                                                  │
│   ┌──────────────────────────────────────────┐  │
│   │         WeekDesktop Window               │  │
│   │   (透明 · 无边框 · 始终置顶)              │  │
│   │                                          │  │
│   │  ┌────────────┐  ┌────────────┐          │  │
│   │  │ WeekWidget │  │ Widget N+1 │   [+]    │  │
│   │  └────────────┘  └────────────┘          │  │
│   │                                          │  │
│   └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘

Frontend (WebView)          Backend (Rust)
┌──────────────────┐        ┌──────────────────┐
│  React App       │◄──────►│  Tauri Commands  │
│  ├ WidgetSlot    │  IPC   │  ├ get_date_info  │
│  ├ WeekWidget    │        │  └ ...future cmds│
│  └ AddWidget     │        └──────────────────┘
└──────────────────┘
```

**数据流：**
1. React 前端启动时调用 Tauri IPC 命令获取日期信息
2. Rust 后端计算精确的周数数据并返回
3. 前端每分钟自动刷新（跨日零点自动更新）
4. Widget 状态持久化到本地存储（localStorage / 未来迁移到 Tauri Store）

---

## 目录结构

```
mac-app-weekdesktop/
├── src/                        # 前端 React 源码
│   ├── widgets/                # Widget 组件目录（核心扩展点）
│   │   ├── WeekWidget/         # 周数 Widget
│   │   │   ├── index.tsx       # 组件入口
│   │   │   └── style.module.css
│   │   └── index.ts            # Widget 注册表
│   ├── components/             # 通用组件
│   │   ├── WidgetSlot/         # Widget 插槽容器
│   │   └── AddWidgetButton/    # 添加 Widget 按钮
│   ├── hooks/                  # 自定义 Hooks
│   │   └── useDateInfo.ts      # 日期信息 Hook
│   ├── types/                  # TypeScript 类型定义
│   │   └── widget.ts
│   ├── App.tsx                 # 根组件
│   ├── App.css                 # 全局样式
│   └── main.tsx                # 入口文件
│
├── src-tauri/                  # Rust 后端源码
│   ├── src/
│   │   ├── main.rs             # 应用入口
│   │   └── lib.rs              # 命令注册 & 业务逻辑
│   ├── tauri.conf.json         # Tauri 核心配置（窗口、权限、Bundle）
│   ├── Cargo.toml              # Rust 依赖管理
│   └── capabilities/
│       └── default.json        # 前端权限声明
│
├── public/                     # 静态资源
├── index.html                  # HTML 入口
├── vite.config.ts              # Vite 配置
├── package.json                # Node 依赖
├── tsconfig.json               # TypeScript 配置
├── TECH.md                     # 本技术文档
└── README.md                   # 项目简介
```

---

## Widget 系统设计

### Widget 接口定义

每个 Widget 必须实现以下接口：

```typescript
// src/types/widget.ts
export interface WidgetMeta {
  id: string;           // 唯一标识符，如 'week-info'
  name: string;         // 显示名称，如 '周数信息'
  description: string;  // 简短描述
  component: React.FC;  // React 组件
  defaultSize: {
    width: number;      // 默认宽度（px）
    height: number;     // 默认高度（px）
  };
}
```

### Widget 注册机制

所有 Widget 在 `src/widgets/index.ts` 中统一注册：

```typescript
// src/widgets/index.ts
import { WeekWidget } from './WeekWidget';
import type { WidgetMeta } from '../types/widget';

export const WIDGET_REGISTRY: WidgetMeta[] = [
  {
    id: 'week-info',
    name: '周数信息',
    description: '显示本年第几天、本年第几周、本月第几周',
    component: WeekWidget,
    defaultSize: { width: 200, height: 160 },
  },
  // 未来在此处追加新 Widget
];
```

### 扩展新 Widget 的步骤

1. 在 `src/widgets/` 下创建新目录，如 `ClockWidget/`
2. 实现组件 `index.tsx` 和样式文件
3. 在 `src/widgets/index.ts` 注册表中追加一项
4. 如需 Rust 后端支持，在 `src-tauri/src/lib.rs` 添加对应 `#[tauri::command]`

---

## 核心模块说明

### WeekWidget — 周数信息组件

**计算规则：**

| 字段 | 计算方式 | 示例（2026-03-25）|
|------|----------|------------------|
| 本年第几天 | `Math.floor((今天 - 元旦) / 86400000) + 1` | 第 84 天 |
| 本年第几周 | ISO 8601：周一为一周开始，包含该年第一个周四的周为第 1 周 | 第 13 周 |
| 本月第几周 | 以自然月计算，月份第一天所在周为第 1 周 | 第 4 周 |

**数据来源：** 纯前端 JavaScript `Date` API 计算，无需网络请求，无需后端。

### useDateInfo Hook

```typescript
// src/hooks/useDateInfo.ts
// 返回格式化的日期信息，每天零点自动刷新
export function useDateInfo(): DateInfo

interface DateInfo {
  dayOfYear: number;    // 本年第几天
  weekOfYear: number;   // 本年第几周（ISO 8601）
  weekOfMonth: number;  // 本月第几周
  date: string;         // 格式化日期，如 "2026-03-25"
  weekday: string;      // 星期，如 "星期三"
}
```

---

## 窗口配置

在 `src-tauri/tauri.conf.json` 中配置桌面悬浮窗口的关键参数：

```jsonc
{
  "app": {
    "windows": [
      {
        "title": "WeekDesktop",
        "width": 240,
        "height": 200,
        "decorations": false,        // 无边框
        "transparent": true,         // 背景透明
        "alwaysOnTop": true,         // 始终置顶
        "resizable": false,          // 固定大小（可选）
        "skipTaskbar": true,         // 不出现在 Dock
        "shadow": false              // 无系统阴影（自绘阴影）
      }
    ]
  }
}
```

**macOS 专项处理：**
- 使用 `NSVisualEffectView` 实现毛玻璃背景效果（通过 Tauri macOS 特定配置）
- 窗口层级设置为 `floating`，悬浮于普通应用之上但不遮挡全屏应用
- 支持鼠标拖拽移动窗口（`data-tauri-drag-region` 属性）

---

## 开发指南

### 环境要求

| 工具 | 版本要求 |
|------|----------|
| macOS | 11.0+（Big Sur）|
| Rust | 1.77.2+ |
| Node.js | 18+ |
| npm | 9+ |

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（热更新）
npm run tauri dev
```

### 常用命令

```bash
npm run dev              # 仅启动 Vite 前端（调试样式用）
npm run tauri dev        # 启动完整 Tauri 开发模式
npm run tauri build      # 构建生产包
npm run build            # 仅构建前端
```

### 添加 Rust 命令示例

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn get_week_info() -> serde_json::Value {
    // 使用 chrono crate 做日期计算
    serde_json::json!({
        "dayOfYear": 84,
        "weekOfYear": 13,
        "weekOfMonth": 4
    })
}

// 在 Builder 中注册
.invoke_handler(tauri::generate_handler![get_week_info])
```

---

## 构建与发布

```bash
# 构建 macOS 应用包（.app + .dmg）
npm run tauri build

# 产物路径
src-tauri/target/release/bundle/macos/WeekDesktop.app
src-tauri/target/release/bundle/dmg/WeekDesktop_0.1.0_aarch64.dmg
```

**Bundle 配置要点（`tauri.conf.json`）：**
- `productName`: `WeekDesktop`
- `identifier`: `com.vibestone.weekdesktop`（需唯一，用于 macOS 沙箱）
- `targets`: `["app", "dmg"]`

---

## 后续规划

### Widget 路线图

| 优先级 | Widget | 描述 |
|--------|--------|------|
| P0 ✅ | 周数信息 | 本年第几天/周，本月第几周 |
| P1 | 模拟时钟 | 精美指针式时钟 |
| P1 | 倒计时 | 自定义目标日期倒计时 |
| P2 | 天气 | 接入天气 API 