# Node 18.x is LTS
FROM node:18 AS base
ENV CI=true
ENV IS_DOCKER=true
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app

RUN corepack enable

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--max_old_space_size=2560 --heapsnapshot-signal=SIGUSR2"

COPY pnpm-lock.yaml package.json ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --shamefully-hoist --no-optional

FROM base AS dev-deps
COPY public/lesswrong-editor public/lesswrong-editor
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod=false --shamefully-hoist --no-optional

FROM dev-deps AS build
ARG BUILD_ARGS=""
RUN pnpm run build ${BUILD_ARGS}

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY public /app/public

ENV SETTINGS_FILE="settings.json"
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE $PORT

COPY settings.json .

CMD ["sh", "-c", "pnpm migrate up && exec node ./build/server/js/serverBundle.js"]
