const { Op } = require('sequelize');

class AuctionService {
  constructor(app) {
    this.app = app;
  }

  async getAll({ customerId }) {
    const list = await this.app.sequelize.models.Auctions.findAll({
      attributes: ['auctionId', 'title', 'path'],
      where: {
        isDeleted: false,
        customerId,
      },
    });

    this.app.logger.info('AuctionService (getAll): %s', list.length);

    return {
      success: true,
      data: list.map(item => ({
        auctionId: item.auctionId,
        title: item.title,
        path: item.path,
      })),
    };
  }

  async getOne({ customerId, auctionId }) {
    const auction = await this.app.sequelize.models.Auctions.findOne({
      attributes: ['auctionId', 'title', 'path'],
      where: {
        isDeleted: false,
        customerId,
        auctionId,
      },
    });

    if (!auction) {
      return { success: false, message: 'Auction Not Found' };
    }

    this.app.logger.info('AuctionService (getOne): %s', auctionId);

    return {
      success: true,
      data: {
        auctionId: auction.auctionId,
        title: auction.title,
        path: auction.path,
      },
    };
  }

  async add({ customerId, title, path }) {
    const sameTitle = await this.app.sequelize.models.Auctions.count({
      where: {
        isDeleted: false,
        customerId,
        title,
      },
    });

    if (sameTitle) {
      return {
        success: false,
        message: 'Auction with the same title already exists',
        form: {
          title: 'same',
        },
      };
    }

    const samePath = await this.app.sequelize.models.Auctions.count({
      where: {
        isDeleted: false,
        customerId,
        path,
      },
    });

    if (samePath) {
      return {
        success: false,
        message: 'Auction with the same URL already exists',
        form: {
          path: 'same',
        },
      };
    }

    const auction = await this.app.sequelize.models.Auctions.create({
      customerId,
      title,
      path,
    });

    const { auctionId } = auction;

    this.app.logger.info('AuctionService (add): %s', auctionId);

    return {
      success: true,
      data: {
        auctionId,
      },
    };
  }

  async update({
    customerId,
    auctionId,
    title,
    path,
  }) {
    if (!auctionId) {
      return {
        success: false,
        message: 'Auction ID Not Set',
      };
    }

    await this.getOne({ customerId, auctionId });

    const data = {};

    if (title) {
      const sameTitle = await this.app.sequelize.models.Auctions.count({
        where: {
          isDeleted: false,
          customerId,
          title,
          auctionId: {
            [Op.ne]: auctionId,
          },
        },
      });

      if (sameTitle) {
        return {
          success: false,
          message: 'Auction with the same title already exists',
          form: {
            title: 'same',
          },
        };
      }

      data.title = title;
    }

    if (path) {
      const samePath = await this.app.sequelize.models.Auctions.count({
        where: {
          isDeleted: false,
          customerId,
          path,
          auctionId: {
            [Op.ne]: auctionId,
          },
        },
      });

      if (samePath) {
        return {
          success: false,
          message: 'Auction with the same URL already exists',
          form: {
            path: 'same',
          },
        };
      }

      data.path = path;
    }

    await this.app.sequelize.models.Auctions.update(data, {
      fields: Object.keys(data),
      where: {
        auctionId,
      },
    });

    this.app.logger.info('AuctionService (update): %s', auctionId);

    return {
      success: true,
      data: {
        auctionId,
      },
    };
  }

  async remove({
    customerId,
    auctionId,
  }) {
    if (!auctionId) {
      return {
        success: false,
        message: 'Auction ID Not Set',
      };
    }

    await this.getOne({ customerId, auctionId });

    await this.app.sequelize.models.Auctions.destroy({
      where: {
        auctionId,
      },
    });

    this.app.logger.info('AuctionService (remove): %s', auctionId);

    return {
      success: true,
      data: {
        auctionId,
      },
    };
  }
}

module.exports = AuctionService;
