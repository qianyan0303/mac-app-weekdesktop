# WeekDesktop - macOS Desktop Widget | 周桌面小部件

[中文](#中文介绍) | [English](#english-description)

<img width="1202" height="832" alt="WeekDesktop macOS Widget Screenshot" src="https://github.com/user-attachments/assets/6121841e-83f5-4234-a299-257b3839cb17" />

**一款简洁优雅的 macOS 桌面小部件 - 显示日期、周数、年度进度和倒计时**

A minimal and elegant macOS desktop widget that displays date, week number, year progress, and countdown.

![macOS](https://img.shields.io/badge/macOS-11.0+-orange)
![Tauri](https://img.shields.io/badge/Tauri-2.0-rust)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

---

## 中文介绍

**WeekDesktop** 是一款 macOS 桌面小组件，能够在桌面上持续显示日期、周数、年度进度等信息。采用玻璃拟态设计，支持桌面置底（不影响其他窗口操作）、跨 Space 显示。

### 关键词
`macOS 桌面小部件` `macOS widget` `周数显示` `week number` `日期显示` `年度进度` `year progress` `桌面工具` `desktop tool` `Tauri` `React`

---

## English Description

**WeekDesktop** is a beautiful macOS desktop widget that continuously displays date, week numbers, and year progress on your desktop. Features a glassmorphism design, stays below all application windows (non-intrusive), and persists across macOS Spaces.

### Keywords
`macOS widget` `desktop widget` `week counter` `date display` `year progress bar` `countdown widget` `glassmorphism` `desktop accessory` `Tauri app` `React widget`

## 功能特点

- 📅 **日期显示** — 清晰展示当前日期和星期
- 📊 **本周信息** — 本年第几周、本月第几周、本年第几天
- 📈 **年度进度** — 可视化展示年度目标完成百分比
- ⏱️ **倒计时** — 距离年底剩余天数和周数
- 🎨 **玻璃质感** — 现代透明设计，融入桌面
- 🖥️ **桌面置底** — 固定在普通应用窗口下方，不遮挡任何应用，鼠标可正常点击
- 🔀 **跨 Space** — 切换桌面空间仍保持显示

## 界面预览

```
┌─────────────────────────────┐
│  ⠿ WEEKDESKTOP          ✕  │  ← 拖动条 + 关闭按钮
├─────────────────────────────┤
│  2026-03-25       星期三    │  ← 当前日期
│  ─────────────────────────  │
│   13W    │   84D    │  4W   │  ← 本年第13周 / 第84天 / 本月第4周
│  本年第几周│本年第几天│本月第几周│
│  2026 年度进度         23%  │
│  ████████░░░░░░░░░░░░░░░░  │
│ ┌─────────────────────────┐ │
│ │ 281天 距年底 │ 41周 距年底│ │
│ └─────────────────────────┘ │
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
| 系统集成 | Rust + cocoa (macOS API) |

## 安装使用

### 环境要求

- macOS 11.0 (Big Sur) 或更高版本
- Node.js 18+
- Rust 1.77+

### 安装 Rust（首次需要）

```bash
# 安装 Rust 工具链
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装完成后激活环境变量
source ~/.cargo/env

# 验证安装
cargo --version
```

### 开发调试

```bash
# 克隆项目
git clone https://github.com/qianyan0303/mac-app-weekdesktop.git
cd mac-app-weekdesktop

# 安装 Node 依赖并启动
npm install && npm run tauri dev
```

### 构建安装

```bash
# 构建 macOS 应用
npm run tauri build

# 构建产物位于
# src-tauri/target/release/bundle/macos/WeekDesktop.app
# src-tauri/target/release/bundle/dmg/
```

## 项目结构

```
mac-app-weekdesktop/
├── src/                        # React 前端源码
│   ├── App.tsx                 # 主应用组件
│   ├── App.css                 # 全局样式
│   ├── main.tsx                # 入口文件
│   ├── hooks/
│   │   └── useDateInfo.ts      # 日期信息 Hook（含自动零点刷新）
│   ├── widgets/
│   │   ├── index.ts            # Widget 注册表
│   │   └── WeekWidget/
│   │       ├── index.tsx       # 周信息组件
│   │       └── style.module.css
│   └── types/
│       └── widget.ts           # Widget 接口类型定义
│
├── src-tauri/                  # Rust 后端
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs              # 窗口层级 & 跨 Space 配置
│   ├── capabilities/
│   │   └── default.json        # 前端权限声明
│   ├── Cargo.toml
│   └── tauri.conf.json         # 窗口 & Bundle 配置
│
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
└── TECH.md                     # 详细技术文档
```

## 配置说明

窗口参数可在 `src-tauri/tauri.conf.json` 中调整：

```json
{
  "app": {
    "macOSPrivateApi": true,
    "windows": [{
      "width": 280,
      "height": 290,
      "decorations": false,
      "transparent": true,
      "alwaysOnTop": false,
      "skipTaskbar": true,
      "visibleOnAllWorkspaces": true
    }]
  }
}
```

## 快捷操作

| 操作 | 方式 |
|------|------|
| 拖动窗口 | 拖动顶部标题栏 |
| 隐藏窗口 | 点击右上角 ✕ 按钮 |

## 扩展 Widget

在 `src/widgets/` 下新建目录，实现组件后在 `src/widgets/index.ts` 注册即可。详见 [TECH.md](./TECH.md)。

## 打赏支持

如果这个项目对你有帮助，欢迎请作者喝杯咖啡 ☕


<img width="1080"  alt="WeekDesktop macOS Widget Screenshot" src="https://github.com/user-attachments/assets/ae8b54be-bb27-454a-b203-c5f83a5c19c8" />



## License

MIT License
