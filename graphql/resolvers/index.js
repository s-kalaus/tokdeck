const { withFilter } = require('apollo-server');

const getCustomer = async (
  _,
  { customerId } = {},
  { dataSources },
) => dataSources.customerDS.getOne({ customerId });

const createToken = async (
  _,
  { customerId } = {},
  { dataSources },
) => dataSources.authDS.createToken({ customerId });

module.exports = {
  Query: {
    me: getCustomer,
    token: createToken,
  },
  Mutation: {
    customerLogin: async (
      _,
      { login, password },
      { dataSources },
    ) => dataSources.authDS.login({ login, password }),
    customerAdd: async (
      _,
      {
        email,
        password,
        firstName,
        lastName,
      },
      { dataSources },
    ) => dataSources.customerDS.add({
      email,
      password,
      firstName,
      lastName,
    }),
  },
  TokenResponse: {
    customer: getCustomer,
    token: createToken,
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (_, __, { app }) => app.pubsub.asyncIterator('newMessage'),
        (payload, variables, { customerId }) => customerId && `${payload.messageAdded.customerId}` === `${customerId}`,
      ),
    },
  },
};
