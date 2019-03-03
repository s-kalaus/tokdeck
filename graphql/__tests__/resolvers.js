const { PubSub } = require('graphql-subscriptions');
const resolvers = require('../resolvers');

describe('Resolvers', () => {
  const mockContext = {
    dataSources: {
      customerDS: { getOne: jest.fn(), add: jest.fn() },
      authDS: { login: jest.fn(), createToken: jest.fn() },
    },
  };
  const { getOne, add } = mockContext.dataSources.customerDS;
  const { login, createToken } = mockContext.dataSources.authDS;

  describe('Query', () => {
    describe('me', () => {
      it('call customerDS.getOne', async () => {
        await resolvers.Query.me(null, undefined, mockContext);
        expect(getOne).toBeCalledWith({ customerId: undefined });
      });

      it('uses user id from context to lookup trips', async () => {
        getOne.mockReturnValueOnce({ foo: 'fighters' });
        const res = await resolvers.Query.me(null, {}, mockContext);
        expect(res).toEqual({ foo: 'fighters' });
      });
    });

    describe('token', () => {
      it('call authDS.createToken', async () => {
        await resolvers.Query.token(null, undefined, mockContext);
        expect(createToken).toBeCalledWith({ customerId: undefined });
      });

      it('uses user id from context to lookup trips', async () => {
        createToken.mockReturnValueOnce({ foo: 'fighters' });
        const res = await resolvers.Query.token(null, {}, mockContext);
        expect(res).toEqual({ foo: 'fighters' });
      });
    });
  });

  describe('Mutation', () => {
    describe('customerLogin', () => {
      const params = {
        login: 'login',
        password: 'password',
      };

      it('call authDS.login', async () => {
        await resolvers.Mutation.customerLogin(null, params, mockContext);
        expect(login).toBeCalledWith(params);
      });

      it('return proper data', async () => {
        login.mockReturnValueOnce({ foo: 'fighters' });
        const res = await resolvers.Mutation.customerLogin(null, params, mockContext);
        expect(res).toEqual({ foo: 'fighters' });
      });
    });

    describe('customerAdd', () => {
      const params = {
        email: 'email',
        password: 'password',
        firstName: 'firstName',
        lastName: 'lastName',
      };

      it('call customerDS.add', async () => {
        await resolvers.Mutation.customerAdd(null, params, mockContext);
        expect(add).toBeCalledWith(params);
      });

      it('return proper data', async () => {
        add.mockReturnValueOnce({ foo: 'fighters' });
        const res = await resolvers.Mutation.customerAdd(null, params, mockContext);
        expect(res).toEqual({ foo: 'fighters' });
      });
    });
  });

  describe('TokenResponse', () => {
    describe('customer', () => {
      const params = { customerId: 1 };

      it('call customerDS.getOne', async () => {
        await resolvers.TokenResponse.customer(null, params, mockContext);
        expect(getOne).toBeCalledWith(params);
      });

      it('uses user id from context to lookup trips', async () => {
        getOne.mockReturnValueOnce({ foo: 'fighters' });
        const res = await resolvers.TokenResponse.customer(null, params, mockContext);
        expect(res).toEqual({ foo: 'fighters' });
      });
    });

    describe('token', () => {
      const params = { customerId: 1 };

      it('call authDS.createToken', async () => {
        await resolvers.TokenResponse.token(null, params, mockContext);
        expect(createToken).toBeCalledWith(params);
      });

      it('call authDS.createToken (no customerId)', async () => {
        await resolvers.TokenResponse.token(null, undefined, mockContext);
        expect(createToken).toBeCalledWith({ customerId: undefined });
      });

      it('return proper data', async () => {
        createToken.mockReturnValueOnce({ foo: 'fighters' });
        const res = await resolvers.TokenResponse.token(null, params, mockContext);
        expect(res).toEqual({ foo: 'fighters' });
      });
    });
  });

  describe('Subscription', () => {
    describe('messageAdded', () => {
      it('call pubsub.asyncIterator', () => {
        mockContext.pubsub = { asyncIterator: jest.fn() };
        resolvers.Subscription.messageAdded.subscribe(null, null, { app: mockContext });
        expect(mockContext.pubsub.asyncIterator).toBeCalledWith('newMessage');
      });

      it('filter work (target customer)', async () => {
        mockContext.pubsub = new PubSub();
        const iterator = resolvers.Subscription.messageAdded
          .subscribe(null, null, { app: mockContext, customerId: 1 });
        await mockContext.pubsub.publish('newMessage', { messageAdded: { customerId: 1 } });
        iterator.next();
      });

      it('filter work (other customer)', async () => {
        mockContext.pubsub = new PubSub();
        const iterator = resolvers.Subscription.messageAdded
          .subscribe(null, null, { app: mockContext, customerId: 1 });
        await mockContext.pubsub.publish('newMessage', { messageAdded: { customerId: 2 } });
        iterator.next();
      });
    });
  });
});
