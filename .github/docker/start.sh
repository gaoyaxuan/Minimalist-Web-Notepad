#!/bin/sh

export USER=rootless
setids() {
    PUID=${PUID:-1001}
    PGID=${PGID:-1001}
    groupmod -o -g "$PGID" $USER
    usermod -o -u "$PUID" $USER
}
# 基础镜像中node 是1000
if [ "$PUID" = "1000" ] && [ "$PGID" = "1000" ]; then
  echo "Using existing node user/group (1000:1000)"
  USER="node"
elif  [ "$PUID" = "1000" ] || [ "$PGID" = "1000" ]; then
  echo "Changing node user/group to 9999 to avoid conflict"
  groupmod -o -g "9999" "node"
  usermod -o -u "9999" "node"
  echo "Configuring rootless user/group..."
  setids
else
  echo "Configuring rootless user/group..."
  setids
fi

cd /app

# Exec CMD or S6 by default if nothing present
if [ $# -gt 0 ];then
    gosu "$USER"  "$@"
else
    gosu "$USER" "node" "/app/server.js"
fi
