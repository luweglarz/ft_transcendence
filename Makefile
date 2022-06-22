DOCKER_PS= $(shell docker ps -a -q)
DOCKER_IMAGES= $(shell docker images -q)
DOCKER_VOLUME_LS= $(shell docker volume ls -q)

all: build

set_local_env:
	$(eval OAUTH_42_CLIENT_ID=$(shell bash -c 'read -p "OAUTH client ID: " secret; echo $$secret'))
	$(eval OAUTH_42_CLIENT_SECRET=$(shell bash -c 'read -s -p "OAUTH client secret (hidden): " secret; echo $$secret; echo >&2'))
	$(eval JWT_SECRET=$(shell head -c 21 /dev/urandom | base64))
	@echo "OAUTH_42_CLIENT_ID='$(OAUTH_42_CLIENT_ID)'" > .env
	@echo "OAUTH_42_CLIENT_SECRET='$(OAUTH_42_CLIENT_SECRET)'" >> .env
	@echo "JWT_SECRET='$(JWT_SECRET)'" >> .env
	@cat src/postgres/dev.env src/backend/env/docker-compose.dev.env > src/backend/.env
	@perl -i -pe 's/DB_HOST=.*/DB_HOST="localhost"/' src/backend/.env
	@echo "`tput setaf 2`⚙ Local dev environment generated."

build:
	docker-compose up --build 
	@echo "`tput  setaf 2` Server built and up"

up:
	docker-compose up
	@echo "`tput  setaf 2` Server up"

run:
	docker-compose start

stop:
	docker-compose stop

fclean: clean

clean:
	docker-compose down
ifneq ($(strip $(DOCKER_PS)),)
	docker rm -f $(DOCKER_PS)
endif
ifneq ($(strip $(DOCKER_IMAGES)),)
	docker rmi -f $(DOCKER_IMAGES)
endif
ifneq ($(strip $(DOCKER_VOLUME_LS)),)
	docker volume rm -f $(DOCKER_VOLUME_LS)
endif

re: fclean all
