import { createMagiciaApp } from '.';
import { sampleConfig } from './constants';

const app = createMagiciaApp(sampleConfig);
app.listen(8123, () => {
  console.log('app started');
});
