const AppService = require('../service/app');
const { createDbStructure } = require('../lib');

const app = new AppService();

app
  .dbConnect()
  .then(() => createDbStructure.call(app))
  .then(() => app.dbDisconnect());
