DOCKER_PS= $(shell docker ps -a -q)
DOCKER_IMAGES= $(shell docker images -q)
DOCKER_VOLUME_LS= $(shell docker volume ls -q)

all: build

set_local_env:
#	$(eval DB_PASSWORD=$(shell head -c 10 /dev/urandom | base64))
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
