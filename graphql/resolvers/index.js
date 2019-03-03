const getCustomer = async (_, __, { dataSources }) => dataSources.customerDS.getOne();

module.exports = {
  Query: {
    me: getCustomer,
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
    token: async (_, __, { dataSources }) => dataSources.authDS.createToken(),
  },
};
