#!/bin/sh
set -eu

cd ${0%/*}

deno run --allow-net --allow-read --allow-env ../main.ts