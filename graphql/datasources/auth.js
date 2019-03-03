class AuthDS {
  constructor(app) {
    this.app = app;
  }

  initialize(config) {
    this.context = config.context;
  }

  async login({ login, password }) {
    const resultAuth = await this.app.service.AuthService.login({ login, password });

    if (!resultAuth.success) {
      throw new Error(resultAuth.message);
    }

    const { customerId, roleName } = resultAuth.data;

    this.context.roleName = roleName;
    this.context.customerId = customerId;

    return { customerId };
  }

  async createToken({ customerId = this.context.customerId } = {}) {
    const resultToken = await this.app.service.AuthService.createToken({ customerId });

    if (!resultToken.success) {
      throw new Error(resultToken.message);
    }

    const { token } = resultToken.data;

    return token;
  }
}

module.exports = AuthDS;
