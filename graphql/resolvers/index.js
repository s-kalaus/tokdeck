const customerGetOne = require('./customer-get-one');
const customerLogin = require('./customer-login');
const customerAdd = require('./customer-add');
const auctionGetOne = require('./auction-get-one');
const auctionGetAll = require('./auction-get-all');
const auctionAdd = require('./auction-add');
const auctionUpdate = require('./auction-update');
const auctionRemove = require('./auction-remove');
const tokenGetOne = require('./token-get-one');
const messageAdded = require('./message-added');

module.exports = {
  Query: {
    me: customerGetOne,
    auction: auctionGetOne,
    auctions: auctionGetAll,
    token: tokenGetOne,
  },
  Mutation: {
    customerLogin,
    customerAdd,
    auctionAdd,
    auctionUpdate,
    auctionRemove,
  },
  Subscription: {
    messageAdded,
  },
  TokenPayload: {
    customer: customerGetOne,
    token: tokenGetOne,
  },
  AuctionPayload: {
    auction: auctionGetOne,
  },
};
