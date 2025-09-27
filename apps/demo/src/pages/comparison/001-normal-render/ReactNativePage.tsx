import { create001DefaultData } from './pipeline/default-data';
import { ReactNativeScope } from './react-native/Scope';

export function ReactNativePage() {
  // 转换数据格式从 granule 格式到 react-native 格式
  const reactNativeData = create001DefaultData().map(item => ({
    id: item.id,
    state: item.state,
  }));

  return <ReactNativeScope data={reactNativeData} />;
}
