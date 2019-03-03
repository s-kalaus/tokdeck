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
    customerAdd: yup.object().shape({
      email: yup
        .string()
        .email()
        .max(50),
      password: yup
        .string()
        .min(8)
        .max(30),
      firstName: yup
        .string()
        .min(1)
        .max(30),
      lastName: yup
        .string()
        .min(1)
        .max(30),
    }),
  },
});

module.exports = validatorsDef;
