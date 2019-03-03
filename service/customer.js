const { hash } = require('bcrypt');

class CustomerService {
  constructor(app) {
    this.app = app;
  }

  async getOne({ customerId }) {
    const customer = await this.app.sequelize.models.Customers.findOne({
      attributes: ['firstName', 'lastName', 'email'],
      where: {
        customerId,
        isDeleted: false,
      },
    });

    if (!customer) {
      return { success: false, message: 'Customer Not Found' };
    }

    const { firstName, lastName, email } = customer;

    this.app.logger.info('CustomerService (getOne): %s', customerId);

    return {
      success: true,
      data: {
        customerId,
        firstName,
        lastName,
        email,
      },
    };
  }

  async exists({ email }) {
    const exists = !!await this.app.sequelize.models.Customers.count({
      where: {
        email,
        isDeleted: false,
      },
    });

    this.app.logger.info('CustomerService (exists): %s, %s', email, exists);

    return {
      success: true,
      data: {
        exists,
      },
    };
  }

  async add({
    email,
    password,
    firstName,
    lastName,
  }) {
    const resultExists = await this.exists({ email });

    if (!resultExists.success) {
      return resultExists;
    }

    if (resultExists.data.exists) {
      return { success: false, message: 'Customer With This Email Already Exists' };
    }

    const passwordHash = await hash(password, 4);

    const customer = await this.app.sequelize.models.Customers.create({
      email,
      password,
      firstName,
      lastName,
      passwordHash,
    });

    if (!customer) {
      return { success: false, message: 'Customer Creation Error' };
    }

    this.app.logger.info('CustomerService (add): %s', customer.customerId);

    return {
      success: true,
      data: {
        customerId: customer.customerId,
      },
    };
  }
}

module.exports = CustomerService;
