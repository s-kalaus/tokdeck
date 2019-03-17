module.exports = {
  apps: [{
    name: 'tokdeck-development-frontend',
    script: 'npm',
    cwd: 'frontend',
    args: 'start',
    instances: 1,
    autorestart: true,
  }, {
    name: 'tokdeck-development-graphql',
    script: './bin/graphql.js',
    instances: 1,
    autorestart: true,
    watch: ['./config', './graphql', './lib', './model', './service'],
  }, {
    name: 'tokdeck-development-express',
    script: './bin/express.js',
    instances: 1,
    autorestart: true,
    watch: ['./config', './express', './lib', './model', './service', './view'],
  }],
};
