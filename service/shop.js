const { promisify } = require('util');
const ShopifyAPI = require('shopify-node-api');

class ShopService {
  constructor(app) {
    this.app = app;
  }

  async authorize({
    code,
    hmac,
    locale,
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

    const shopAccount = await this.app.sequelize.models.ShopAccounts.findOne({
      attributes: ['shopAccountId'],
      where: {
        type: 'shopify',
      },
    });

    if (!shopAccount) {
      return { success: false, message: 'Shop Account Not Found' };
    }

    const paramsData = {
      code,
      hmac,
      locale,
      shop,
      state,
      timestamp,
    };
    const params = Object.keys(paramsData)
      .reduce(
        (value, key) => ({ ...value, ...paramsData[key] ? { [key]: paramsData[key] } : {} }),
        {},
      );

    const valid = shopify.is_valid_signature(params, !state);

    if (!valid) {
      return { success: false, message: 'Signature Invalid' };
    }

    let [customerShopAccount] = await this.app.sequelize.models.CustomerShopAccounts
      .findOrCreate({
        attributes: ['token', 'customerShopAccountId'],
        where: {
          shopAccountId: shopAccount.shopAccountId,
          shop,
        },
      });

    if (!customerShopAccount) {
      return { success: false, message: 'Customer Shop Account Not Found' };
    }

    let shopResult = null;
    let { token } = customerShopAccount;

    if (token) {
      shopify.set_access_token(customerShopAccount.token);
      try {
        shopResult = await shopifyGet('/admin/shop.json', {});
      } catch (e) {
        shopResult = null;
      }
    }

    if (!shopResult || !shopResult.shop) {
      if (!code) {
        return {
          success: true,
          data: {
            redirect: shopify.buildAuthURL(),
          },
        };
      }

      token = null;

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

      try {
        shopResult = await shopifyGet('/admin/shop.json', {});
      } catch (e) {
        shopResult = null;
      }

      if (!shopResult || !shopResult.shop) {
        return { success: false, message: 'Shop Get Error' };
      }

      token = resultToken.access_token;
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

    if (token !== customerShopAccount.token) {
      customerShopAccount = await customerShopAccount.update({
        token,
      }, {
        fields: ['token'],
      });

      return {
        success: true,
        data: {
          redirect: `https://${shop}/admin/apps/${this.app.config.get('shopify.name')}`,
        },
      };
    }

    this.app.logger.info('ShopService (authorize): %s', shop);

    return {
      success: true,
      data: {
        customerId,
        customerShopAccountId: customerShopAccount.customerShopAccountId,
      },
    };
  }

  async initShopify({ customerShopAccountId }) {
    const [customerShopAccount] = await this.app.sequelize.models.CustomerShopAccounts
      .findOrCreate({
        attributes: ['shop', 'token'],
        where: {
          customerShopAccountId,
        },
      });

    if (!customerShopAccount) {
      return { success: false, message: 'Customer Shop Account Not Found' };
    }

    return new ShopifyAPI({
      verbose: false,
      shop: customerShopAccount.shop,
      access_token: customerShopAccount.token,
    });
  }

  async syncPages({ customerShopAccountId }) {
    await this.initShopify({ customerShopAccountId });
    // const shopify = await this.initShopify({ customerShopAccountId });
    // const shopifyGet = promisify(shopify.get.bind(shopify));
    //
    // const { pages = [] } = await shopifyGet('/admin/pages.json', { handle });
    //
    // if (pages.length) {
    //   return {
    //     success: false,
    //     message: 'Auction with the same URL already exists',
    //     form: {
    //       path: 'same',
    //     },
    //   };
    // }
    //
    // console.log(pages);
    // return {
    //   success: true,
    //   data: {
    //     pageId: 1,
    //   },
    // };
  }
}

module.exports = ShopService;
