FROM node:16.14-alpine

RUN npm install -g pnpm@next-7

WORKDIR /app

COPY package*.json ./

COPY pnpm-lock.yaml ./

RUN pnpm i

COPY . .

CMD [ "pnpm", "start:production" ]