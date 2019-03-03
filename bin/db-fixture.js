const fixtures = require('minimist')(process.argv.slice(2))._;
const AppService = require('../service/app');
const { loadFixtures } = require('../lib');

const app = new AppService();

app
  .dbConnect()
  .then(() => loadFixtures.call(app, fixtures))
  .then(() => app.dbDisconnect());
