const { verify, sign } = require('jsonwebtoken');
const { compare } = require('bcrypt');

class AuthService {
  constructor(app) {
    this.app = app;
  }

  async authorize({ token }) {
    const result = verify(token, this.app.config.get('token.secret'));

    if (!result.customerId) {
      return { success: false, message: 'Incorrect Token' };
    }

    this.app.logger.info('AuthService (authorize): %s', result.customerId);

    return {
      success: true,
      data: {
        roleName: 'customer',
        customerId: result.customerId,
      },
    };
  }

  createToken({ customerId }) {
    if (!customerId) {
      return { success: false, message: 'Customer ID Not Set' };
    }

    const token = sign({
      customerId: `${customerId}`,
      exp: Math.floor(Date.now() / 1000) + this.app.config.get('token.ttl'),
    }, this.app.config.get('token.secret'));

    this.app.logger.info('AuthService (createToken): %s', customerId);

    return {
      success: true,
      data: {
        token,
      },
    };
  }

  async login({ login, password }) {
    const customer = await this.app.sequelize.models.Customers.findOne({
      attributes: ['customerId', 'passwordHash'],
      where: {
        email: login,
        isDeleted: false,
      },
    });

    if (!customer) {
      return { success: false, message: 'Customer Not Found' };
    }

    const { customerId, passwordHash } = customer;

    if (!passwordHash) {
      return { success: false, message: 'Customer Has No Password' };
    }

    const resultCompare = await compare(password, passwordHash);

    if (!resultCompare) {
      return { success: false, message: 'Password Incorrect' };
    }

    this.app.logger.info('AuthService (login): %s', customerId);

    return {
      success: true,
      data: {
        customerId,
        roleName: 'customer',
      },
    };
  }
}

module.exports = AuthService;
