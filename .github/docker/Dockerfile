FROM node:22-alpine AS builder

WORKDIR /app

ADD .  .

RUN apk --no-cache --no-progress add wget && sh /app/.github/docker/gosu.sh
RUN cd web  \
    && npm install \
    && npm run build:prod  \
    && cd ../server \
    && npm install --production



FROM node:22-alpine as runner

WORKDIR /app

COPY --from=builder /app/server/.   /app/
COPY --from=builder /app/web/dist/.  /app/dist/
COPY --from=builder /usr/sbin/gosu /usr/sbin/
COPY --from=builder /app/.github/docker/build.sh  /app/
COPY --from=builder /app/.github/docker/start.sh  /app/

RUN apk --no-cache --no-progress add tzdata  shadow \
    && set -ex \
    && sh build.sh \
    && rm build.sh

EXPOSE 3000
ENV TZ=Asia/Shanghai

ENTRYPOINT ["/app/start.sh"]
