FROM node:18 as development

WORKDIR /transcendence/frontend

COPY package*.json ./

RUN npm clean-install

COPY . .

RUN npm run build

EXPOSE 4200
