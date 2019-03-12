const BaseController = require('./base');

class ShopController extends BaseController {
  init(app) {
    app.get('/express/shop/authorize', (req, res) => this.authorize(req, res));
  }

  async authorize(req, res) {
    const {
      code,
      hmac,
      locale,
      shop,
      state,
      timestamp,
    } = req.query;

    const resultAuth = await this.app.service.ShopService.authorize({
      code,
      hmac,
      locale,
      shop,
      state,
      timestamp,
    });

    if (!resultAuth.success) {
      return this.error(res, resultAuth);
    }

    const { redirect, customerId, customerShopAccountId } = resultAuth.data;

    if (redirect) {
      return this.render(res, 'redirect', {
        redirect,
      });
    }

    const resultToken = await this.app.service.AuthService.createToken({
      customerId,
      ...customerShopAccountId ? { ext: { customerShopAccountId: `${customerShopAccountId}` } } : {},
    });

    if (!resultToken.success) {
      return this.error(res, resultToken);
    }

    const { token } = resultToken.data;

    res.cookie('authorization', token);

    return res.redirect('/');
  }
}

module.exports = ShopController;
