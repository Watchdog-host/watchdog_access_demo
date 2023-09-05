## base image
FROM node:alpine as builder

# EDGE PANEL app
COPY / /data
WORKDIR /data

# pnpm
RUN npm install pnpm -g
RUN pnpm install
RUN pnpm run build

## runtime image
FROM registry.gitlab.com/ioedge/consumer-products/gateway:0.1.0


## copy static files
COPY --from=builder /data/build /usr/local/bin/html