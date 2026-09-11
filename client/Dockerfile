FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /app

COPY package.json pnpm-*.yaml ./

RUN pnpm install

COPY . .
RUN pnpm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist/ng-blog /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]