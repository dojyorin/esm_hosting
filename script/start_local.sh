#!/bin/sh
set -eu

cd ${0%/*}

deno run --allow-net --allow-read --allow-env $([[ -f ../.env ]] && echo '--env') ../main.ts