FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma migrate dev --name oxbot

CMD [ "pnpm", "start:production" ]