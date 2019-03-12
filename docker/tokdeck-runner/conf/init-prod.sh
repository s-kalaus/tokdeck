#!/bin/sh

pm2

pm2 start ./bin/graphql.js -n tokdeck-development-graphql
pm2 start ./bin/express.js -n tokdeck-development-express

tail -f /dev/null
