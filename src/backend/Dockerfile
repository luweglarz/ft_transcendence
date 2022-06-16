FROM node:14 as development

WORKDIR /transcendence/backend

COPY package*.json ./

RUN npm clean-install 

COPY . .

RUN npm run build

EXPOSE 3000
