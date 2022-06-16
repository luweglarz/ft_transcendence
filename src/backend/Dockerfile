FROM node:14 as development

WORKDIR /transcendence/backend

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 3000
