const fs = require('fs');
const { promisify } = require('util');
const { createLogger, format, transports } = require('winston');
const http = require('http');
const Sequelize = require('sequelize');
const express = require('express');
const { ApolloServer } = require('apollo-server');
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('graphql-tools');
const config = require('../config');
const typeDefs = require('../graphql/schemas');
const resolvers = require('../graphql/resolvers');
const permissions = require('../graphql/permissions');
const validators = require('../graphql/validators');
const { CustomerDS, AuthDS } = require('../graphql/datasources');
const { graphql } = require('../lib');

const CustomerService = require('../service/customer');
const AuthService = require('../service/auth');

class AppService {
  constructor() {
    this.config = config;
    this.logger = null;
    this.sequelize = null;
    this.sequelizeConnection = null;
    this.service = {
      CustomerService: new CustomerService(this),
      AuthService: new AuthService(this),
    };
    this.dataSource = {};

    this.loggerInitialize();
    this.dbInitialize();
  }

  loggerInitialize() {
    this.logger = createLogger({
      format: format.combine(
        format.splat(),
        format.colorize(),
        format.align(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info instanceof Error ? JSON.stringify(info.stack) : info.message}`),
      ),
      transports: [
        new transports.Console(),
      ],
    });

    this.logger.info('Logger initialized');
  }

  dbInitialize() {
    const cnf = this.config.get('db');
    this.sequelize = new Sequelize(cnf.database, cnf.user, cnf.password, {
      dialect: cnf.dialect,
      host: cnf.host,
      port: cnf.port,
      logging: cnf.loggingToConsole ? err => this.logger.info(err) : false,
      operatorsAliases: false,
      pool: {
        autostart: true,
        max: 100,
        min: 0,
        idle: 300000,
        acquire: 60000,
        evict: 60000,
      },
    });

    this.sequelize.models = {};

    fs
      .readdirSync(`${__dirname}/../model`)
      .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js')
      .forEach((file) => {
        const model = this.sequelize.import(`${__dirname}/../model/${file}`);
        this.sequelize.models[model.name] = model;
      });

    Object.keys(this.sequelize.models)
      .forEach(modelName => this.sequelize.models[modelName].associate
        && this.sequelize.models[modelName].associate(this.sequelize.models));

    this.logger.info('Database initialized: %s models', Object.keys(this.sequelize.models).length);
  }

  async dbConnect() {
    await this.sequelize.authenticate();
    this.logger.info('Database connected');
  }

  async dbDisconnect() {
    await this.sequelize.close();
    this.logger.info('Database disconnected');
  }

  async dbSync(force = false) {
    if (!force && !this.config.get('db.sync')) {
      return;
    }
    await this.sequelize.sync();
    this.logger.info('Database synchronized');
  }

  async expressStart() {
    const app = express();
    app.set('port', this.config.get('express.port'));
    app.get('/', (req, res) => {
      res.send('hello world');
    });
    const server = http.createServer(app);
    await promisify(server.listen)(app.get('port'));
    this.logger.info('Express statred: %s', app.get('port'));
  }

  async graphqlStart() {
    const port = this.config.get('graphql.port');
    const dataSources = () => {
      this.dataSource = {
        customerDS: new CustomerDS(this),
        authDS: new AuthDS(this),
      };
      return this.dataSource;
    };
    const contextData = {
      pubsub: graphql.createPubSub.call(this),
      app: this,
    };
    const context = async ({ req }) => {
      const token = ((req.headers && req.headers.authorization && req.headers.authorization) || '').replace(/^Bearer /, '');
      const resultAuth = token ? await this.service.AuthService.authorize({
        token,
      }) : { success: false };

      const { customerId, roleName } = resultAuth.success
        ? resultAuth.data
        : { roleName: null, customerId: null };

      contextData.roleName = roleName;
      contextData.customerId = customerId;

      return contextData;
    };

    const schema = applyMiddleware(
      makeExecutableSchema({
        typeDefs,
        resolvers,
      }),
      permissions,
      validators,
    );

    const server = new ApolloServer({
      schema,
      dataSources,
      context,
      introspection: true,
      playground: {
        settings: {
          'request.credentials': 'include',
          'editor.reuseHeaders': false,
        },
        endpoint: `${this.config.get('url')}/graphql`,
        subscriptionsEndpoint: `${this.config.get('url').replace('https:', 'wss:')}/subscriptions`,
      },
      subscriptions: {
        path: '/subscriptions',
        onConnect: async (connectionParams) => {
          const token = (connectionParams.authorization || '').replace(/^Bearer /, '');
          const resultAuth = token ? await this.service.AuthService.authorize({
            token,
          }) : { success: false };

          const { customerId, roleName } = resultAuth.success
            ? resultAuth.data
            : { roleName: null, customerId: null };

          contextData.roleName = roleName;
          contextData.customerId = customerId;

          return contextData;
        },
      },
    });

    const { url, subscriptionsUrl } = await server.listen({ port });

    this.logger.info(`httpservice/graphql is listenning on port: ${port}. GraphQL url: ${url}, Subscription: ${subscriptionsUrl}`);
  }
}

module.exports = AppService;
