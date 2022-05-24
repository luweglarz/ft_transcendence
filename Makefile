DOCKER_PS= $(shell docker ps -a -q)
DOCKER_IMAGES= $(shell docker images -q)
DOCKER_VOLUME_LS= $(shell docker volume ls -q)

all: build

build:
	docker-compose  up --build 
	@echo "`tput  setaf 2` Server build and up"

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