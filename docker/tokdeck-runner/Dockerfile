FROM tokdeck-node:latest

RUN apt-get update
RUN apt-get install -y screen
RUN apt-get install -y mysql-client
RUN apt-get install -y mc
RUN apt-get install -y htop

WORKDIR /var/www/tokdeck

ENTRYPOINT ["sh", "/root/host/init.sh"]
