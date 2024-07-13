FROM node:20.15-alpine3.19 AS builder
WORKDIR /app

ADD ../.. .
RUN cd web  \
    && npm install \
    && npm run build:prod  \
    && cd ../server \
    && npm install --production



FROM node:20.15-alpine3.19 as runner
WORKDIR /app

COPY --from=builder /app/server   /app
COPY --from=builder /app/web/dist  /app/dist
RUN apk --no-cache --no-progress add tzdata \
    && set -ex \
    && chmod -R 544 /app

EXPOSE 3000
ENV TZ=Asia/Shanghai
CMD [ "node" ,"/app/server.js" ]
