FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

CMD [ "pnpm", "start:production" ]