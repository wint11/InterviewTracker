# 面试管理系统 - 桌面版

这是一个基于 Vue 3 + Electron 的面试管理桌面应用程序，帮助您高效管理面试安排。

## 功能特性

- 📅 面试日程管理
- 🔍 智能搜索和筛选
- 📊 统计数据展示
- 💾 本地数据存储
- 🖥️ 跨平台桌面应用
- 🎨 现代化UI界面

## 开发环境要求

- Node.js 16+
- npm 或 yarn

## 安装依赖

```bash
npm install
```

## 开发模式

### 方式一：自动启动（推荐）
```bash
npm run electron-dev
```

### 方式二：手动启动
1. 启动 Vite 开发服务器：
```bash
npm run dev
```

2. 在新终端中启动 Electron：
```bash
# Windows PowerShell
$env:NODE_ENV="development"; npx electron .

# Windows CMD
set NODE_ENV=development && npx electron .

# macOS/Linux
NODE_ENV=development npx electron .
```

## 构建生产版本

### 构建 Web 资源
```bash
npm run build
```

### 打包桌面应用
```bash
# 构建并打包
npm run dist

# 仅打包（需要先运行 build）
npm run electron-pack
```

## 项目结构

```
calendar/
├── electron/           # Electron 主进程文件
│   └── main.js        # 主进程入口
├── src/               # Vue 应用源码
│   ├── App.vue        # 主组件
│   ├── main.js        # Vue 应用入口
│   └── ...
├── dist/              # 构建输出目录
├── release/           # 打包输出目录
├── package.json       # 项目配置
├── vite.config.js     # Vite 配置
└── start-electron.js  # Electron 启动脚本
```

## 可用脚本

- `npm run dev` - 启动 Vite 开发服务器
- `npm run build` - 构建生产版本
- `npm run electron-dev` - 启动 Electron 开发模式
- `npm run electron` - 启动 Electron（需要先启动 dev 服务器）
- `npm run electron-pack` - 打包 Electron 应用
- `npm run dist` - 构建并打包完整应用

## 打包配置

应用支持打包为以下格式：

- **Windows**: NSIS 安装包 (.exe)
- **macOS**: DMG 磁盘映像 (.dmg)
- **Linux**: AppImage (.AppImage)

打包配置在 `package.json` 的 `build` 字段中定义。

## 开发说明

### 端口配置
- Vite 开发服务器：`http://localhost:3001`
- Electron 在开发模式下会自动加载此地址

### 环境变量
- `NODE_ENV=development` - 开发模式
- `NODE_ENV=production` - 生产模式

### 数据存储
应用使用 localStorage 进行本地数据存储，数据会保存在用户的本地浏览器存储中。

## 故障排除

### 常见问题

1. **Electron 启动失败**
   - 确保 Vite 开发服务器已启动
   - 检查端口 3001 是否被占用
   - 尝试重新安装依赖：`npm install`

2. **构建失败**
   - 清理 node_modules：`rm -rf node_modules && npm install`
   - 检查 Node.js 版本是否符合要求

3. **打包失败**
   - 确保已成功构建：`npm run build`
   - 检查 electron-builder 配置

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **桌面框架**: Electron
- **UI 组件**: Element Plus
- **工具库**: Day.js, VueUse
- **打包工具**: electron-builder

## 许可证

本项目采用 MIT 许可证。