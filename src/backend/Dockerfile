FROM node:14 as development

WORKDIR /transcendence/backend

# COPY tsconfig.build.json ./
COPY package*.json ./

RUN npm install 
# RUN npm install --save-dev webpack # added to the dev dependencies in package.json
# RUN npm install --save-dev webpack-dev-server # useful ?

COPY . .

RUN npm run build

EXPOSE 3000
