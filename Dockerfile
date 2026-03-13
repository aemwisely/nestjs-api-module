FROM node:24-alpine AS base

FROM base AS dependencies

WORKDIR /app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn install --frozen-lockfile

FROM base AS builder
ARG APP

WORKDIR /app

COPY . . 
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
RUN yarn build ${APP}

FROM base AS runner

WORKDIR /app

ARG APP
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV APP=$APP
ENV APP_MAIN_FILE=dist/apps/$APP/src/main

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/ormconfig.js /app/ormconfig.js
COPY migrations ./migrations

EXPOSE 3000

ENTRYPOINT ["sh", "-c"]
CMD ["node $APP_MAIN_FILE"]
