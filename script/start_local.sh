#!/bin/sh
set -eu

cd ${0%/*}

deno run --allow-net --allow-env --allow-read --allow-write $([[ ${1-''} == '--insecure' ]] && echo '--unsafely-ignore-certificate-errors') ../main.ts