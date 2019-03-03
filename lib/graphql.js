const { capitalize } = require('lodash');
const { rule } = require('graphql-shield');
const { AmqpPubSub } = require('graphql-rabbitmq-subscriptions');
const { ConsoleLogger } = require('@cdm-logger/server');

const permissions = {
  hasRole: role => rule()(async (_, __, context) => context.roleName.includes(role)),
};

function createPubSub() {
  const config = this.config.get('rabbitmq');
  return new AmqpPubSub({
    config,
    logger: ConsoleLogger.create('tokdeck', {
      level: 'info',
      mode: 'short',
    }),
  });
}

function validator(schema) {
  return async (resolve, root, args, context, info) => {
    let { path } = info;
    const arr = [];

    do {
      arr.push(path.key);
      path = path.prev;
    } while (path);

    arr.push(capitalize(info.operation.operation));
    arr.reverse();

    const validators = arr.reduce((prev, key) => prev && (prev[key] || null), schema);

    if (validators) {
      await validators.validate(args);
    }

    return resolve(root, args, context, info);
  };
}

function permissionsGroups() {
  return {
    c: permissions.hasRole('customer'),
  };
}

module.exports = {
  permissions,
  createPubSub,
  validator,
  permissionsGroups,
};
