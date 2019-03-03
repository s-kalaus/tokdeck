#!/bin/sh

npm i

cd frontend
npm i
pm2 start npm -n tokdeck-development-frontend -- start
cd ..

sleep 8

mysql -htokdeck-mysql-development -uroot -e "DROP DATABASE IF EXISTS tokdeck_development"
mysql -htokdeck-mysql-development -uroot -e "CREATE DATABASE tokdeck_development DEFAULT CHARSET utf8"
mysql -htokdeck-mysql-development -uroot -e "CREATE USER 'tokdeck_development'@'%' IDENTIFIED BY 'tokdeck_development'"
mysql -htokdeck-mysql-development -uroot -e "GRANT ALL PRIVILEGES ON tokdeck_development.* TO 'tokdeck_development'@'%'"
node ./bin/db-create
node ./bin/db-fixture common development

pm2 start ./bin/graphql.js -n tokdeck-development-graphql
pm2 start ./bin/express.js -n tokdeck-development-express

tail -f /dev/null
