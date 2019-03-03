#!/bin/sh

PROXY_PASSWORD=${1:-password}

cat <<EOT >> /etc/hosts
127.0.0.1 dashboard.pixc.com
127.0.0.1 dashboard-1.pixc.com
127.0.0.1 dashboard-2.pixc.com
127.0.0.1 dashboard-3.pixc.com
127.0.0.1 dashboard-4.pixc.com
127.0.0.1 dashboard-5.pixc.com
127.0.0.1 dashboard-6.pixc.com
127.0.0.1 dashboard-7.pixc.com
127.0.0.1 dashboard-8.pixc.com
127.0.0.1 dashboard-9.pixc.com
127.0.0.1 dashboard-0.pixc.com
127.0.0.1 dashboard-a.pixc.com
127.0.0.1 dashboard-b.pixc.com
127.0.0.1 dashboard-c.pixc.com
127.0.0.1 dashboard-d.pixc.com
127.0.0.1 dashboard-e.pixc.com
127.0.0.1 dashboard-f.pixc.com
127.0.0.1 pixc.com
127.0.0.1 ws.pixc.com
127.0.0.1 phpmyadmin.pixc.com
EOT

sed -i "s/|\s*\((count(\$analyzed_sql_results\['select_expr'\]\)/| (\1)/g" /usr/share/phpmyadmin/libraries/sql.lib.php
sed -i "s/$dbserver='localhost'/$dbserver='mysql-prod'/g" /etc/phpmyadmin/config-db.php

cp /etc/php/7.2/fpm/pool.d/www.conf /etc/php/7.2/fpm/pool.d/www.conf.bak

sed -i "s/ENV_DATABASE/$DATABASE/g" /etc/php/7.2/fpm/pool.d/www.conf.bak
sed -i "s/ENV_DB_USERNAME/$DB_USERNAME/g" /etc/php/7.2/fpm/pool.d/www.conf.bak

DB_PASSWORD_TMP=`echo $DB_PASSWORD | sed -e "s/&/\\\\\&/g"`
sed -i "s/ENV_DB_PASSWORD/${DB_PASSWORD_TMP}/g" /etc/php/7.2/fpm/pool.d/www.conf.bak

sed -i "s/ENV_DB_HOST/$DB_HOST/g" /etc/php/7.2/fpm/pool.d/www.conf.bak

cp -f /etc/php/7.2/fpm/pool.d/www.conf.bak /etc/php/7.2/fpm/pool.d/www.conf
rm -f /etc/php/7.2/fpm/pool.d/www.conf.bak

service php7.2-fpm start

nginx

tail -f /dev/null
