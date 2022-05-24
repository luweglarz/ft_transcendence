FROM node:14 as development

WORKDIR /transcendence/backend

COPY tsconfig.build.json ./
COPY package*.json ./

RUN npm install 
RUN npm install --save-dev webpack
RUN npm install --save-dev webpack-dev-server

RUN npm run build


EXPOSE 3000