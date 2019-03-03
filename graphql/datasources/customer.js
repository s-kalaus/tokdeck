class CustomerDS {
  constructor(app) {
    this.app = app;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getOne({ customerId = this.context.customerId } = {}) {
    const resultCustomer = await this.app.service.CustomerService.getOne({ customerId });

    if (!resultCustomer.success) {
      throw new Error(resultCustomer.message);
    }

    const { firstName, lastName, email } = resultCustomer.data;

    return {
      customerId,
      firstName,
      lastName,
      email,
    };
  }

  async add({
    email,
    password,
    firstName,
    lastName,
  }) {
    const resultAdd = await this.app.service.CustomerService.add({
      email,
      password,
      firstName,
      lastName,
    });

    if (!resultAdd.success) {
      throw new Error(resultAdd.message);
    }

    return this.app.dataSource.authDS.login({ login: email, password });
  }
}

module.exports = CustomerDS;
