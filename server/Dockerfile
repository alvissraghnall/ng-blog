FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install 2>&1 | tee pnpm.log || true && \
    pkgs=$(grep -oP '(?<=Ignored build scripts:\s).*' pnpm.log | tr ',' '\n' | tr -d '│ ' | xargs) && \
    [ -n "$pkgs" ] && pnpm install $(printf -- "--allow-build=%s " $pkgs) || echo "No build approvals needed"

COPY . .
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "start:dev"]
