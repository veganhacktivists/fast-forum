# Node 18.x is LTS
FROM node:18
ENV IS_DOCKER=true
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app

ARG NODE_ENV="production"
ENV NODE_ENV="${NODE_ENV}"
ENV NODE_OPTIONS="--max_old_space_size=2560 --heapsnapshot-signal=SIGUSR2"

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --shamefully-hoist

# COPY yarn.lock yarn.lock
# RUN yarn install && yarn cache clean

COPY public/lesswrong-editor public/lesswrong-editor
COPY . .

EXPOSE 3000

CMD [ "pnpm", "run", "production" ]
