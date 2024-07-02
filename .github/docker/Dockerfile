FROM node:20.15-alpine3.19 AS builder
WORKDIR /app

ADD ../.. .
RUN cd web  \
    && npm install \
    && npm build:prod  \
    && cd ../server \
    && npm install



FROM node:20.15-alpine3.19 as runner
WORKDIR /app

COPY --from=builder /app/server/*   /app/server/
COPY --from=builder /app/web/dist/*  /app/server/dist/
RUN set -ex \
    && chmod -R 544 /app

EXPOSE 3000
ENV TZ=Asia/Shanghai
CMD [ "node","/app/server/server.js" ]
