#!/bin/sh

npm i

cd frontend
npm i
cd ..
pm2 start --only frontend

sleep 8

mysql -htokdeck-mysql-development -uroot -e "DROP DATABASE IF EXISTS tokdeck_development"
mysql -htokdeck-mysql-development -uroot -e "CREATE DATABASE tokdeck_development DEFAULT CHARSET utf8"
mysql -htokdeck-mysql-development -uroot -e "CREATE USER 'tokdeck_development'@'%' IDENTIFIED BY 'tokdeck_development'"
mysql -htokdeck-mysql-development -uroot -e "GRANT ALL PRIVILEGES ON tokdeck_development.* TO 'tokdeck_development'@'%'"
node ./bin/db-create
node ./bin/db-fixture common development

pm2 start --only express
pm2 start --only graphql

tail -f /dev/null
