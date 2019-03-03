const convict = require('convict');

const config = convict({
  env: {
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV',
  },
  db: {
    database: {
      format: String,
      default: 'localhost',
    },
    user: {
      format: String,
      default: 'user',
    },
    password: {
      format: String,
      sensitive: true,
      env: 'TOKDECK_DB_PASSWORD',
      default: 'password',
    },
    dialect: {
      format: String,
      default: 'mysql',
    },
    host: {
      format: String,
      env: 'TOKDECK_DB_HOST',
      default: 'localhost',
    },
    port: {
      format: 'port',
      default: 3306,
    },
    loggingToConsole: {
      format: Boolean,
      default: true,
    },
    sync: {
      format: Boolean,
      default: false,
    },
  },
  rabbitmq: {
    port: {
      format: 'port',
      default: 5672,
    },
    host: {
      format: String,
      env: 'TOKDECK_RABBITMQ_HOST',
      default: 'localhost',
    },
  },
  express: {
    port: {
      format: 'port',
      default: 4300,
    },
  },
  graphql: {
    port: {
      format: 'port',
      default: 4000,
    },
  },
  url: {
    format: String,
    default: 'localhost',
  },
  token: {
    secret: {
      format: String,
      default: '',
    },
    ttl: {
      format: Number,
      default: 300,
    },
  },
});

const env = config.get('env');

config.loadFile(`${__dirname}/${env}.json`);
config.validate({ allowed: 'strict' });

module.exports = config;
