#!/bin/sh

set -xe

export USER=rootless

# Create rootless user
addgroup -S ${USER}
adduser -G ${USER}  -H -D -g 'rootless  user' -s /sbin/nologin ${USER}   && usermod -p '*' ${USER}

chmod 555 -R /app
