# WeekDesktop 周桌面小部件

一款简洁优雅的 macOS 桌面小部件，显示当前日期、本周信息及年度进度。

![macOS](https://img.shields.io/badge/macOS-10.15+-orange)
![Tauri](https://img.shields.io/badge/Tauri-2.0-rust)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

## 功能特点

- 📅 **日期显示** — 清晰展示当前日期和星期
- 📊 **本周信息** — 本年第几周、本月第几周、本年第几天
- 📈 **年度进度** — 可视化展示年度目标完成百分比
- ⏱️ **倒计时** — 距离年底剩余天数和周数
- 🎨 **玻璃质感** — 现代透明设计，融入桌面

## 界面预览

```
┌─────────────────────────────┐
│  ⠿ WeekDesktop         ✕   │  ← 拖动条 + 关闭按钮
├─────────────────────────────┤
│                             │
│  2026年3月25日    周三       │  ← 当前日期
│                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                             │
│   12W    │   84D    │   4W  │  ← 本年第12周 / 第84天 / 本月第4周
│   本年第几周│本年第几天│本月第几周│
│                             │
│  2026 年度进度     23%       │
│  ████████░░░░░░░░░░░░░░░░  │
│                             │
│       251天        35周      │
│      距年底        距年底     │
│                             │
└─────────────────────────────┘
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 桌面框架 | [Tauri 2.0](https://tauri.app/) |
| 前端框架 | React 19 |
| 开发语言 | TypeScript 5.8 |
| 构建工具 | Vite 7 |
| 样式方案 | CSS Modules |

## 安装使用

### 环境要求

- macOS 10.15 (Catalina) 或更高版本
- Node.js 18+
- Rust 1.70+

### 开发调试

```bash
# 克隆项目
git clone https://github.com/qianyan0303/mac-app-weekdesktop.git
cd mac-app-weekdesktop

# 安装依赖
npm install

# 启动开发服务器
npm run tauri dev
```

### 构建安装

```bash
# 构建 macOS 应用
npm run tauri build

# 构建完成后，应用位于
# src-tauri/target/release/bundle/macos/
```

## 项目结构

```
mac-app-weekdesktop/
├── src/                        # React 前端源码
│   ├── App.tsx                 # 主应用组件
│   ├── App.css                 # 全局样式
│   ├── main.tsx                # 入口文件
│   ├── hooks/                  # 自定义 Hooks
│   │   └── useDateInfo.ts      # 日期信息 Hook
│   ├── widgets/                # 小部件组件
│   │   └── WeekWidget/         # 周信息小部件
│   │       ├── index.tsx       # 组件实现
│   │       └── style.module.css # 组件样式
│   └── types/                  # TypeScript 类型
│       └── widget.ts           # 小部件类型定义
│
├── src-tauri/                  # Rust 后端源码
│   ├── src/
│   │   ├── main.rs             # 主入口
│   │   └── lib.rs              # 库文件
│   ├── Cargo.toml              # Rust 依赖配置
│   └── tauri.conf.json         # Tauri 配置
│
├── public/                     # 静态资源
├── index.html                  # HTML 入口
├── package.json                # Node 依赖配置
├── vite.config.ts              # Vite 配置
└── tsconfig.json               # TypeScript 配置
```

## 配置说明

### 窗口配置

窗口默认为透明无边框模式，可在 `src-tauri/tauri.conf.json` 中调整：

```json
{
  "app": {
    "windows": [{
      "title": "WeekDesktop",
      "width": 280,
      "height": 320,
      "decorations": false,    // 无边框
      "transparent": true,     // 透明背景
      "alwaysOnTop": false,    // 是否置顶
      "skipTaskbar": true      // 不显示在任务栏
    }]
  }
}
```

### 窗口尺寸建议

| 用途 | 宽度 | 高度 |
|------|------|------|
| 周信息 + 年度进度 | 280 | 320 |
| 仅周信息 | 280 | 220 |

## 快捷操作

- **拖动窗口** — 拖动顶部标题栏
- **隐藏窗口** — 点击 ✕ 按钮
- **切换小部件** — 点击底部工具栏按钮

## License

MIT License
