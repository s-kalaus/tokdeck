development:
	@cd docker/tokdeck-node && docker build -t tokdeck-node .
	@cd docker/tokdeck-build && docker build -t tokdeck-build .
	@cd docker && docker-compose up -d --build

rebuild:
	@cd docker && docker-compose build --no-cache

down:
	@cd docker && docker-compose down

ssh:
	@cd docker && docker-compose exec tokdeck-runner-development bash

ssh-mysql:
	@cd docker && docker-compose exec -u root tokdeck-mysql-development bash

ssh-rabbitmq:
	@cd docker && docker-compose exec tokdeck-rabbitmq-development bash

ssh-nginx:
	@cd docker && docker-compose exec tokdeck-nginx-development bash

up-ci:
	@cd docker && docker-compose -f docker-compose-ci.yml up -d --build

down-ci:
	@cd docker && docker-compose -f docker-compose-ci.yml down

ssh-ci-gitlab:
	@cd docker && docker-compose -f docker-compose-ci.yml exec tokdeck-gitlab-ci bash

test:
	@npm i
	@npm run jscpd
	@npm run lint
	@npm run test

build-prod:
	@sh ./bin/build.sh prod ${CI_JOB_ID}
