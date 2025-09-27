# React 大列表性能优化方案

## 1. 🚀 虚拟滚动 (Virtual Scrolling)

只渲染可见区域的项目，是最有效的方案：

```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={80}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <Item data={items[index]} />
      </div>
    )}
  </List>
);
```

## 2. ⚡ 懒加载 + 分页

分批渲染，避免一次性渲染大量组件：

```typescript
const LazyList = ({ data }) => {
  const [visibleCount, setVisibleCount] = useState(50);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 50, data.length));
  }, [data.length]);

  return (
    <>
      {data.slice(0, visibleCount).map(item => (
        <Item key={item.id} data={item} />
      ))}
      {visibleCount < data.length && (
        <button onClick={loadMore}>加载更多</button>
      )}
    </>
  );
};
```

## 3. 🎯 React.memo + useMemo 优化

防止不必要的重渲染：

```typescript
const OptimizedItem = React.memo(({ item }) => {
  const computedValue = useMemo(() =>
    expensiveCalculation(item), [item]
  );

  return <div>{computedValue}</div>;
});

const OptimizedList = ({ items }) => {
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <>
      {memoizedItems.map(item => (
        <OptimizedItem key={item.id} item={item} />
      ))}
    </>
  );
};
```

## 4. 🔄 Intersection Observer 懒渲染

只渲染进入视口的元素：

```typescript
const LazyRenderItem = ({ item, onInView }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: '80px' }}>
      {isVisible ? <Item data={item} /> : <div>Loading...</div>}
    </div>
  );
};
```

## 5. ⏱️ requestIdleCallback 分批渲染

利用浏览器空闲时间分批渲染：

```typescript
const BatchRenderList = ({ items }) => {
  const [renderedItems, setRenderedItems] = useState([]);
  const remainingItems = useRef([...items]);

  useEffect(() => {
    const renderBatch = (deadline) => {
      while (deadline.timeRemaining() > 0 && remainingItems.current.length > 0) {
        const item = remainingItems.current.shift();
        setRenderedItems(prev => [...prev, item]);
      }

      if (remainingItems.current.length > 0) {
        requestIdleCallback(renderBatch);
      }
    };

    requestIdleCallback(renderBatch);
  }, []);

  return (
    <>
      {renderedItems.map(item => (
        <Item key={item.id} data={item} />
      ))}
    </>
  );
};
```

## 6. 🧵 React 18 并发特性

使用 startTransition 降低渲染优先级：

```typescript
import { startTransition } from 'react';

const ConcurrentList = ({ items }) => {
  const [visibleItems, setVisibleItems] = useState([]);

  const loadItems = (newItems) => {
    startTransition(() => {
      setVisibleItems(newItems);
    });
  };

  return (
    <>
      {visibleItems.map(item => (
        <Item key={item.id} data={item} />
      ))}
    </>
  );
};
```

## 性能对比（1000项）

| 方案     | 首次渲染时间 | 内存占用 | 滚动性能 | 适用场景   |
| -------- | ------------ | -------- | -------- | ---------- |
| 原生渲染 | ~500ms       | 高       | 差       | <100项     |
| 虚拟滚动 | ~50ms        | 低       | 优秀     | 大列表首选 |
| 懒加载   | ~100ms       | 中       | 良好     | 内容丰富   |
| 分批渲染 | ~200ms       | 中       | 良好     | 复杂计算   |

## 推荐方案选择

1. **超大列表 (>1000项)**: 虚拟滚动
2. **中等列表 (100-1000项)**: memo + 懒加载
3. **复杂组件**: 分批渲染 + startTransition
4. **动态加载**: Intersection Observer

对于当前 Granule vs React Native 对比，建议先实现虚拟滚动版本进行公平对比。
