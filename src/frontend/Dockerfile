FROM node:14 as development

WORKDIR /transcendence/frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4200
