const yup = require('yup');
const { validator } = require('../../lib/graphql');

const validatorsDef = validator({
  Mutation: {
    customerLogin: yup.object().shape({
      login: yup
        .string()
        .email()
        .max(200),
      password: yup
        .string()
        .min(8)
        .max(30),
    }),
  },
});

module.exports = validatorsDef;
