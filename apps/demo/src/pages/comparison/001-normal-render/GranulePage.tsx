import { GranuleScope } from './granule/Scope';
import { create001DefaultData } from './pipeline/default-data';

export function GranulePage() {
  return <GranuleScope data={create001DefaultData()} />;
}
