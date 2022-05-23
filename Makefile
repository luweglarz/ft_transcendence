DOCKER_PS= $(shell docker ps -a -q)
DOCKER_IMAGES= $(shell docker images -q)
DOCKER_VOLUME_LS= $(shell docker volume ls -q)
DATA_PATH_SITE= /Volumes/data/site
DATA_PATH_DB= /Volumes/data/postgres


all: build

build:
	mkdir -p ${DATA_PATH_SITE}
	mkdir -p ${DATA_PATH_DB}
	docker-compose -f docker/docker-compose.yml up -d --build 
	@echo "`tput  setaf 2` Server build and up"

run:
	docker-compose -f docker/docker-compose.yml start

stop:
	docker-compose -f docker/docker-compose.yml stop

fclean: clean
	rm -rf data

clean:
	docker-compose -f docker/docker-compose.yml down
ifneq ($(strip $(DOCKER_PS)),)
	docker rm -f $(DOCKER_PS)
endif
ifneq ($(strip $(DOCKER_IMAGES)),)
	docker rmi $(DOCKER_IMAGES)
endif
ifneq ($(strip $(DOCKER_VOLUME_LS)),)
	docker volume rm $(DOCKER_VOLUME_LS)
endif

re: fclean all