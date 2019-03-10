const { ApolloError } = require('apollo-server');

class AuctionDS {
  constructor(app) {
    this.app = app;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getAll({ customerId = this.context.customerId } = {}) {
    const resultAuction = await this.app.service.AuctionService.getAll({ customerId });

    if (!resultAuction.success) {
      throw new ApolloError(resultAuction.message, 500, resultAuction);
    }

    return resultAuction.data;
  }

  async getOne({ customerId = this.context.customerId, auctionId }) {
    const resultAuction = await this.app.service.AuctionService.getOne({ customerId, auctionId });

    if (!resultAuction.success) {
      throw new ApolloError(resultAuction.message, 500, resultAuction);
    }

    const {
      auctionId: theAuctionId,
      title,
      path,
    } = resultAuction.data;

    return { auctionId: theAuctionId, title, path };
  }

  async add({
    title,
    path,
    customerId = this.context.customerId,
  }) {
    const resultAdd = await this.app.service.AuctionService.add({
      title,
      path,
      customerId,
    });

    if (!resultAdd.success) {
      throw new ApolloError(resultAdd.message, 500, resultAdd);
    }

    const { auctionId } = resultAdd.data;

    return { auctionId };
  }

  async update({
    auctionId,
    title,
    path,
    customerId = this.context.customerId,
  }) {
    const resultUpdate = await this.app.service.AuctionService.update({
      auctionId,
      title,
      path,
      customerId,
    });

    if (!resultUpdate.success) {
      throw new ApolloError(resultUpdate.message, 500, resultUpdate);
    }

    const { auctionId: theAuctionId } = resultUpdate.data;

    return { auctionId: theAuctionId };
  }

  async remove({
    auctionId,
    customerId = this.context.customerId,
  }) {
    const resultRemove = await this.app.service.AuctionService.remove({
      auctionId,
      customerId,
    });

    if (!resultRemove.success) {
      throw new ApolloError(resultRemove.message, 500, resultRemove);
    }

    return { success: true };
  }
}

module.exports = AuctionDS;
