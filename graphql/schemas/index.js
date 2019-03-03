const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    me: Customer
  }

  type Mutation {
    customerLogin(login: String, password: String): TokenResponse
    customerAdd(email: String, password: String, firstName: String, lastName: String): TokenResponse
  }

  type Customer {
    customerId: ID!
    firstName: String
    lastName: String
    email: String
  }

  type TokenResponse {
    customer: Customer!
    token: String!
  }

  type Subscription {
    messageAdded: Message
  }

  type Message {
    customerId: ID!
    type: String!
    title: String
    message: String
  }
`;

module.exports = typeDefs;
