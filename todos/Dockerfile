# syntax=docker/dockerfile:1

ARG NODE_VERSION=18

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /home/node
EXPOSE 3001

# dev container
# Download dependencies as a separate step to take advantage of Docker's caching.
# cache mount to /root/.npm to speed up subsequent builds.
# bind mounts to package.json and package-lock.json to avoid copying them into this layer
FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
CMD npm run start:dev

# prod container
# build without dev dependencies
FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
USER node
COPY . .
CMD node src/index.js

# test container
# Using RUN instead of CMD, so that build will fail if tests fail
# idk why would we need that, perhaps for some ci/cd stuff
FROM base as test
ENV NODE_ENV test
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
RUN npm run test
