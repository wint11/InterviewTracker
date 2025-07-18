# 面试管理系统

一个基于Vue 3的现代化面试管理桌面应用，帮助您高效管理面试安排，智能提醒不错过任何机会。

## ✨ 功能特性

### 📅 面试管理
- **添加面试**：支持添加公司名称、职位、时间、地点、面试方式等详细信息
- **编辑面试**：随时修改面试信息
- **删除面试**：删除不需要的面试安排
- **状态管理**：待面试、已完成、已取消状态管理

### 🔍 智能筛选
- **搜索功能**：按公司名称或职位快速搜索
- **状态筛选**：按面试状态筛选
- **方式筛选**：按面试方式（线上/现场/电话）筛选

### 📊 数据统计
- **总面试数**：显示所有面试总数
- **待面试**：显示待进行的面试数量
- **已完成**：显示已完成的面试数量
- **今日面试**：显示今天的面试安排

### 📱 智能提醒
- **短信提醒**：支持发送短信提醒（模拟功能）
- **即时提醒**：24小时内的面试自动提醒
- **状态更新**：一键标记面试完成

### 💾 数据持久化
- **本地存储**：使用localStorage保存数据
- **自动保存**：操作后自动保存到本地

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 🛠️ 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Element Plus** - Vue 3组件库
- **Vite** - 现代化构建工具
- **Day.js** - 轻量级日期处理库
- **VueUse** - Vue组合式API工具集

## 📱 面试方式支持

- **线上面试** - 视频会议、在线面试平台
- **现场面试** - 公司现场面试
- **电话面试** - 电话沟通面试

## 🎨 界面特色

- **现代化设计** - 采用渐变色彩和毛玻璃效果
- **响应式布局** - 适配不同屏幕尺寸
- **直观操作** - 简洁明了的用户界面
- **动画效果** - 流畅的交互动画

## 📋 使用说明

1. **添加面试**：点击右下角的"+"按钮或顶部的"添加面试"按钮
2. **填写信息**：输入公司名称、职位、时间、地点等必要信息
3. **管理面试**：在列表中查看、编辑、删除面试安排
4. **状态更新**：点击"标记完成"更新面试状态
5. **发送提醒**：点击"发送提醒"发送短信提醒

## 🔮 未来规划

- [ ] 集成真实短信API
- [ ] 添加邮件提醒功能
- [ ] 支持面试结果记录
- [ ] 添加面试准备清单
- [ ] 支持导出面试数据
- [ ] 添加面试统计图表
- [ ] 支持多用户管理

## 📄 许可证

MIT License