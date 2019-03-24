const { promisify } = require('util');
const ShopService = require('./shop');

class ShopProductService extends ShopService {
  async getOne({
    oid,
    customerShopAccountId,
  }) {
    const shopify = await this.initShopify({ customerShopAccountId });
    const shopifyGet = promisify(shopify.get.bind(shopify));

    const { page: { title } } = await shopifyGet(`/admin/products/${oid}.json`);

    return { title };
  }
}

module.exports = ShopProductService;
