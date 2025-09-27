# Granule 性能优化方案

## 问题分析

**性能瓶颈**: Granule 为每个 item 创建独立的 React Root，导致：

- React Native: 1个 Root + 1000个组件
- Granule: 1000个 Root + 1000个组件

每个 `createRoot()` 都有显著开销（fiber tree、调度器、事件处理等初始化）。

## 优化方案

### 1. 🎯 Root 池化模式 (推荐)

```typescript
class ReactRootPool {
  private availableRoots: Root[] = [];
  private usedRoots = new Map<K, Root>();

  getRoot(id: K): Root {
    const root =
      this.availableRoots.pop() || createRoot(document.createElement('div'));
    this.usedRoots.set(id, root);
    return root;
  }

  releaseRoot(id: K): void {
    const root = this.usedRoots.get(id);
    if (root) {
      this.availableRoots.push(root);
      this.usedRoots.delete(id);
    }
  }
}
```

### 2. 🔄 单 Root 架构重构

将 Granule 重构为单 Root + 虚拟 DOM 管理：

```typescript
// 不再为每个 item 创建 Root，而是在单个 Root 中管理所有 item
const renderAllItems = () => {
  singleRoot.render(
    createElement(
      'div',
      {},
      state.map(({ id, data }) =>
        createElement(GranuleItem, { key: id, id, data }),
      ),
    ),
  );
};
```

### 3. ⚡ 懒加载 Root 创建

只为可见的 item 创建 Root：

```typescript
const lazyCreateRoot = (id: K) => {
  // 使用 Intersection Observer 检测可见性
  // 只为进入视口的 item 创建 Root
};
```

### 4. 📦 批量 Root 创建

使用 `requestIdleCallback` 分批创建：

```typescript
const batchCreateRoots = (items: Array<{ id: K; element: Element }>) => {
  const processBatch = (idleDeadline: IdleDeadline) => {
    while (idleDeadline.timeRemaining() > 0 && items.length > 0) {
      const item = items.shift()!;
      const root = createRoot(item.element);
      // ... render
    }
    if (items.length > 0) {
      requestIdleCallback(processBatch);
    }
  };
  requestIdleCallback(processBatch);
};
```

## 推荐实施顺序

1. **短期**: Root 池化模式 - 最小改动，立即收益
2. **中期**: 批量 Root 创建 - 改善用户体验
3. **长期**: 单 Root 架构重构 - 根本性解决方案

## 预期效果

- Root 池化: 减少 60-80% 的 Root 创建开销
- 单 Root 架构: 接近 React Native 的性能水平
- 批量创建: 改善首屏渲染体验
