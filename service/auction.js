const { Op } = require('sequelize');
const { pick } = require('lodash');

class AuctionService {
  constructor(app) {
    this.app = app;
  }

  async getAll({ customerId, ext = {}, includeDeleted = false }) {
    const { customerShopAccountId = null, fields = [] } = ext;
    const fetchFields = ['auctionId', 'title', 'path', ...fields];
    const list = await this.app.sequelize.models.Auctions.findAll({
      attributes: fetchFields,
      where: {
        ...includeDeleted ? {} : { isDeleted: false },
        customerId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
      },
    });

    this.app.logger.info('AuctionService (getAll): %s', list.length);

    return {
      success: true,
      data: list.map(item => pick(item, fetchFields)),
    };
  }

  async getOne({ customerId, auctionId, ext = {} }) {
    const { customerShopAccountId = null, fields = [] } = ext;
    const fetchFields = ['auctionId', 'title', 'path', ...fields];
    const auction = await this.app.sequelize.models.Auctions.findOne({
      attributes: fetchFields,
      where: {
        isDeleted: false,
        customerId,
        auctionId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
      },
    });

    if (!auction) {
      return { success: false, message: 'Auction Not Found' };
    }

    this.app.logger.info('AuctionService (getOne): %s', auctionId);

    return {
      success: true,
      data: pick(auction, fetchFields),
    };
  }

  async add({
    customerId,
    title,
    path,
    ext = {},
  }) {
    const { customerShopAccountId = null } = ext;
    const sameTitle = await this.app.sequelize.models.Auctions.count({
      where: {
        isDeleted: false,
        customerId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
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
        ...customerShopAccountId ? { customerShopAccountId } : {},
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
      ...customerShopAccountId ? { customerShopAccountId } : {},
    });

    const { auctionId } = auction;

    if (customerShopAccountId) {
      try {
        await this.app.service.ShopService.syncPages({
          customerId,
          customerShopAccountId,
        });
      } catch (e) {
        return {
          success: false,
          message: 'Auction sync error',
        };
      }
    }

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
    oid,
    ext = {},
    noSync = false,
  }) {
    const { customerShopAccountId = null } = ext;
    if (!auctionId) {
      return {
        success: false,
        message: 'Auction ID Not Set',
      };
    }

    await this.getOne({ customerId, auctionId, ext });

    const data = {};

    if (title) {
      const sameTitle = await this.app.sequelize.models.Auctions.count({
        where: {
          isDeleted: false,
          customerId,
          ...customerShopAccountId ? { customerShopAccountId } : {},
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
          ...customerShopAccountId ? { customerShopAccountId } : {},
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

    if (oid) {
      data.oid = oid;
    }

    await this.app.sequelize.models.Auctions.update(data, {
      fields: Object.keys(data),
      where: {
        auctionId,
      },
    });

    if (!noSync) {
      try {
        await this.app.service.ShopService.syncPages({
          customerId,
          customerShopAccountId,
        });
      } catch (e) {
        return {
          success: false,
          message: 'Auction sync error',
        };
      }
    }

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
    ext = {},
  }) {
    const { customerShopAccountId = null } = ext;

    if (!auctionId) {
      return {
        success: false,
        message: 'Auction ID Not Set',
      };
    }

    await this.getOne({ customerId, auctionId, ext });

    await this.app.sequelize.models.Auctions.destroy({
      where: {
        auctionId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
      },
    });

    try {
      await this.app.service.ShopService.syncPages({
        customerId,
        customerShopAccountId,
      });
    } catch (e) {
      return {
        success: false,
        message: 'Auction sync error',
      };
    }

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
