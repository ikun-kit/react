# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概述

这是 **ikun-kit React workspace**，一个包含 **Granule** React 状态管理库的 monorepo。Granule 是一个专注于性能的库，用于管理作用域列表/集合，具备事件驱动更新、命令式 API 和 DOM 操作能力。

### 仓库结构

- `packages/granule/` - 主要的 Granule React 库 (`@ikun-kit/react-granule`)
- `apps/demo/` - 展示 Granule 功能的演示应用 (使用 Vite + React + Tailwind)
- 根工作空间使用 pnpm 管理包和应用

## 开发命令

### 构建和开发

- `pnpm dev` - 并行启动包和应用的开发模式
- `pnpm dev:pkgs` - 仅启动包的开发模式 (granule 库)
- `pnpm dev:apps` - 仅启动演示应用的开发模式
- `pnpm build` - 构建包和应用
- `pnpm build:pkgs` - 仅构建 granule 包
- `pnpm build:apps` - 仅构建演示应用

### 代码质量

- `pnpm lint` - 运行 oxlint 和 TypeScript 类型检查
- `pnpm lint:fix` - 使用 oxlint 自动修复 lint 问题
- `pnpm format` - 使用 prettier 格式化代码
- `pnpm format:check` - 检查代码格式化
- `pnpm test` - 运行包和应用的测试
- `pnpm test:pkgs` - 仅运行 granule 包的测试

### 包特定命令

- 在 `packages/granule/` 中：`pnpm dev` 运行 `tsc --watch`，`pnpm build` 运行 `tsc`，`pnpm test` 运行 `vitest`
- 在 `apps/demo/` 中：`pnpm dev` 运行 `vite`，`pnpm build` 运行 `vite build`

## Granule 库架构

Granule 是一个 React 状态管理库，具有以下核心概念：

### 核心组件

- **useGranuleScope**: 主要的组合式 hook，返回 Provider、controller、subscriber、upwardSubscriber、domRef 和 getItemRef
- **useGranuleScopeItem**: 子组件用于与其作用域项交互的 hook
- **GranuleScopeProvider**: 内部上下文提供者组件
- **Observable 系统**: 用于状态变更通知的自定义事件系统

### 核心 API

- **Controller API**: `insert()`、`delete()`、`move()`、`update()`、`getState()`、`getItem()`、`hasItem()`
- **Subscriber API**: `onInsert()`、`onDelete()`、`onMove()`、`onItemUpdate()` - 返回取消订阅函数
- **Upward Subscriber**: `on(eventName, callback)` 用于子组件到父组件的通信
- **Item References**: `getItemRef(id)` 返回 DOM 引用和命令式 API 访问

### 架构模式

- **Provider 模式**: 使用 React context 进行依赖注入
- **事件驱动**: 使用 Observable 模式进行状态变更通知
- **作用域状态**: 每个作用域管理自己的具有唯一 ID 的项目列表
- **命令式 API**: 组件可以通过引用暴露自定义的命令式方法
- **性能优先**: 设计时考虑了性能优化和缓存

### granule/src/ 目录结构

- `components/` - 内部提供者组件
- `contexts/` - React 上下文定义
- `hooks/` - 公共和内部 hook 实现
- `types/` - 类型定义，分为外部（公共）和内部
- `utils/` - Observable 系统和性能日志工具

## TypeScript 配置

- 使用 TypeScript 复合构建的项目引用
- 基础配置目标为 ES2021，使用 bundler 模块解析
- Granule 包输出 ESM 格式，声明文件到 `dist/`
- 项目启用严格的 TypeScript 设置

## 代码风格标准

### Prettier 配置

- 2 个空格缩进，不使用 tab
- 单引号，尾随逗号，分号
- 80 字符行宽
- 导入排序，外部、内部和样式导入分离

### Linting

- 使用 oxlint，correctness、suspicious 和 performance 规则设置为 "warn"
- React 全局可用，无需导入

## 重要开发说明

### 代码语言

- **源代码中的所有注释和文档都使用中文编写**
- JSDoc 注释、类型定义和内部文档使用中文字符
- 变量名和函数名使用英文，但其文档使用中文
- 在代码库中工作时，您可能会遇到解释功能的中文注释

### Monorepo 设置

- 使用 pnpm 工作空间和 `workspace:*` 依赖
- 演示应用从 Vite 的依赖预打包中排除 `@ikun-kit/react-granule`
- TypeScript 项目引用启用高效的增量构建

### 性能考虑

- 该库设计时将性能作为主要关注点
- 状态查找应该优化（参见 TODO.md 中计划的 ID 到索引映射）
- 事件监听器有计划的去重和清理机制

### 未来改进

- 参见 `TODO.md` 了解包括批量操作、性能优化、插件系统、持久化适配器和调试工具在内的全面路线图
- 优先关注位置插入、批量 API 和状态查找优化

## 测试

- Granule 包使用 Vitest 进行测试
- 对等依赖：React >=18.2.0，react-dom >=18.2.0
