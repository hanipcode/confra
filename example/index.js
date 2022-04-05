const { createMagiciaApp } = require('../dist/index');
const { sampleConfig } = require('../dist/constants.js');

const app = createMagiciaApp(sampleConfig);

app.listen(8123, () => {
  console.log('app is running');
});

/* BRB downloading postman */
