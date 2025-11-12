FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start:prod"]
