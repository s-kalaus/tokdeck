const { allow, deny, shield } = require('graphql-shield');
const { graphql } = require('../../lib');

const pg = graphql.permissionsGroups();

const permissionsDef = shield({
  Query: {
    me: pg.c,
    token: pg.c,
  },
  TokenResponse: pg.c,
  Customer: pg.c,
  Message: pg.c,
  Subscription: pg.c,
  Mutation: {
    customerLogin: allow,
    customerAdd: allow,
  },
}, {
  fallbackRule: deny,
});

module.exports = permissionsDef;
