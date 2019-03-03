const BaseController = require('./base');

class ShopController extends BaseController {
  init(app) {
    app.get('/express/shop/authorize', (req, res) => this.authorize(req, res));
  }

  async authorize(req, res) {
    const {
      code,
      hmac,
      shop,
      state,
      timestamp,
    } = req.query;

    const resultAuth = await this.app.service.ShopService.authorize({
      code,
      hmac,
      shop,
      state,
      timestamp,
    });

    if (!resultAuth.success) {
      return this.error(res, resultAuth);
    }

    const { redirect, customerId } = resultAuth.data;

    if (redirect) {
      return res.redirect(redirect);
    }

    const resultToken = await this.app.service.AuthService.createToken({
      customerId,
    });

    if (!resultToken.success) {
      return this.error(res, resultToken);
    }

    const { token } = resultToken.data;

    return this.render(res, 'index', {
      shop,
      customerId,
      token,
    });
  }
}

module.exports = ShopController;