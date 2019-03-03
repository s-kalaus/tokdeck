const AppService = require('../service/app');

const app = new AppService();

app
  .dbConnect()
  .then(() => app.graphqlStart());
