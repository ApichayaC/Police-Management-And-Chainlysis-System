FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000
CMD [ "node", "dist/main.js" ]