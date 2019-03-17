const { pick } = require('lodash');

class ProductService {
  constructor(app) {
    this.app = app;
  }

  async getAll({
    customerId,
    auctionId,
    ext = {},
    includeDeleted = false,
  }) {
    const { customerShopAccountId = null, fields = [] } = ext;
    const fetchFields = ['productId', 'auctionId', 'title', ...fields];
    const list = await this.app.sequelize.models.Products.findAll({
      attributes: fetchFields,
      where: {
        ...includeDeleted ? {} : { isDeleted: false },
        customerId,
        auctionId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
      },
    });

    this.app.logger.info('ProductService (getAll): %s', list.length);

    return {
      success: true,
      data: list.map(item => pick(item, fetchFields)),
    };
  }

  async getOne({ customerId, productId, ext = {} }) {
    const { customerShopAccountId = null, fields = [] } = ext;
    const fetchFields = ['productId', 'auctionId', 'title', ...fields];
    const product = await this.app.sequelize.models.Products.findOne({
      attributes: fetchFields,
      where: {
        isDeleted: false,
        customerId,
        productId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
      },
    });

    if (!product) {
      return { success: false, message: 'Product Not Found' };
    }

    this.app.logger.info('ProductService (getOne): %s', productId);

    return {
      success: true,
      data: pick(product, fetchFields),
    };
  }

  async add({
    customerId,
    auctionId,
    title,
    oid,
    ext = {},
  }) {
    const { customerShopAccountId = null } = ext;
    const sameTitle = await this.app.sequelize.models.Products.count({
      where: {
        isDeleted: false,
        customerId,
        auctionId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
        title,
      },
    });

    if (sameTitle) {
      return {
        success: false,
        message: 'Product with the same title already exists',
        form: {
          title: 'same',
        },
      };
    }

    const sameOid = await this.app.sequelize.models.Products.count({
      where: {
        isDeleted: false,
        customerId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
        oid,
      },
    });

    if (sameOid) {
      return {
        success: false,
        message: 'Product with the same remote ID already exists',
        form: {
          oid: 'same',
        },
      };
    }

    const product = await this.app.sequelize.models.Products.create({
      customerId,
      title,
      oid,
      ...customerShopAccountId ? { customerShopAccountId } : {},
    });

    const { productId } = product;

    if (customerShopAccountId) {
      try {
        await this.app.service.ShopService.syncProducts({
          customerId,
          customerShopAccountId,
        });
      } catch (e) {
        return {
          success: false,
          message: 'Products sync error',
        };
      }
    }

    this.app.logger.info('ProductService (add): %s', productId);

    return {
      success: true,
      data: {
        productId,
      },
    };
  }

  async update({
    customerId,
    productId,
    ext = {},
    noSync = false,
  }) {
    const { customerShopAccountId = null } = ext;
    if (!productId) {
      return {
        success: false,
        message: 'Product ID Not Set',
      };
    }

    await this.getOne({ customerId, productId, ext });

    const data = {};

    await this.app.sequelize.models.Products.update(data, {
      fields: Object.keys(data),
      where: {
        productId,
      },
    });

    if (!noSync) {
      try {
        await this.app.service.ShopService.syncProducts({
          customerId,
          customerShopAccountId,
        });
      } catch (e) {
        return {
          success: false,
          message: 'Products sync error',
        };
      }
    }

    this.app.logger.info('ProductService (update): %s', productId);

    return {
      success: true,
      data: {
        productId,
      },
    };
  }

  async remove({
    customerId,
    productId,
    ext = {},
  }) {
    const { customerShopAccountId = null } = ext;

    if (!productId) {
      return {
        success: false,
        message: 'Product ID Not Set',
      };
    }

    await this.getOne({ customerId, productId, ext });

    await this.app.sequelize.models.Products.destroy({
      where: {
        productId,
        ...customerShopAccountId ? { customerShopAccountId } : {},
      },
    });

    try {
      await this.app.service.ShopService.syncProducts({
        customerId,
        customerShopAccountId,
      });
    } catch (e) {
      return {
        success: false,
        message: 'Products sync error',
      };
    }

    this.app.logger.info('ProductService (remove): %s', productId);

    return {
      success: true,
      data: {
        productId,
      },
    };
  }
}

module.exports = ProductService;
