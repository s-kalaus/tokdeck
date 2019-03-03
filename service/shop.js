const { promisify } = require('util');
const ShopifyAPI = require('shopify-node-api');


class ShopService {
  constructor(app) {
    this.app = app;
  }

  async authorize({
    code,
    hmac,
    shop,
    state,
    timestamp,
  }) {
    const shopify = new ShopifyAPI({
      verbose: false,
      shop,
      shopify_api_key: this.app.config.get('shopify.key'),
      shopify_shared_secret: this.app.config.get('shopify.secret'),
      shopify_scope: this.app.config.get('shopify.scope').join(','),
      redirect_uri: `${this.app.config.get('url')}/express/shop/authorize`,
      nonce: 'tokdeck',
    });
    const exchangeTemporaryToken = promisify(shopify.exchange_temporary_token.bind(shopify));
    const shopifyGet = promisify(shopify.get.bind(shopify));

    if (!code) {
      return {
        success: true,
        data: {
          redirect: shopify.buildAuthURL(),
        },
      };
    }

    const valid = shopify.is_valid_signature({
      code,
      hmac,
      shop,
      state,
      timestamp,
    });

    if (!valid) {
      return { success: false, message: 'Signature Invalid' };
    }

    const shopAccount = await this.app.sequelize.models.ShopAccounts.findOne({
      attributes: ['shopAccountId'],
      where: {
        type: 'shopify',
      },
    });

    if (!shopAccount) {
      return { success: false, message: 'Shop Account Not Found' };
    }

    const [customerShopAccount] = await this.app.sequelize.models.CustomerShopAccounts
      .findOrCreate({
        attributes: ['token'],
        where: {
          shopAccountId: shopAccount.shopAccountId,
          shop,
        },
      });

    if (!customerShopAccount) {
      return { success: false, message: 'Customer Shop Account Not Found' };
    }

    let shopResult = null;

    if (customerShopAccount.token) {
      shopify.set_access_token(customerShopAccount.token);
      shopResult = await shopifyGet('/admin/shop.json', {});
    }

    if (!shopResult || !shopResult.shop) {
      const resultToken = await exchangeTemporaryToken({
        code,
        hmac,
        shop,
        state,
        timestamp,
      });

      if (!resultToken || !resultToken.access_token) {
        return { success: false, message: 'Shop Token Get Error' };
      }

      shopResult = await shopifyGet('/admin/shop.json', {});

      if (!shopResult || !shopResult.shop) {
        return { success: false, message: 'Shop Get Error' };
      }
    }

    const { email } = shopResult.shop;

    let resultCustomer = await this.app.service.CustomerService.getOne({ email });

    if (!resultCustomer.success) {
      const resultAdd = await this.app.service.CustomerService.add({ email });

      if (!resultAdd.success) {
        return { success: false, message: 'Customer Creation Error' };
      }

      resultCustomer = await this.app.service.CustomerService
        .getOne({ customerId: resultAdd.data.customerId });

      if (!resultCustomer.success) {
        return { success: false, message: 'Customer Fetch Error' };
      }
    }

    const { customerId } = resultCustomer.data;

    this.app.logger.info('ShopService (authorize): %s', shop);

    return {
      success: true,
      data: {
        customerId,
      },
    };
  }
}

module.exports = ShopService;
