const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    me: Customer!
    auction(auctionId: ID!): Auction!
    auctions: [Auction]!
    token: String!
  }

  type Mutation {
    customerLogin(login: String!, password: String!): TokenPayload!
    customerAdd(email: String!, password: String!, firstName: String, lastName: String): TokenPayload!
    auctionAdd(title: String!, path: String!): AuctionPayload!
    auctionUpdate(auctionId: ID!, title: String, path: String): AuctionPayload!
    auctionRemove(auctionId: ID!): Result!
  }

  type Customer {
    customerId: ID!
    firstName: String
    lastName: String
    email: String
  }

  type Auction {
    auctionId: ID!
    title: String
    path: String
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
  
  type AuctionPayload {
    auction: Auction!
  }

  type TokenPayload {
    customer: Customer!
    token: String!
  }

  type Result {
    success: Boolean!
  }
`;

module.exports = typeDefs;
