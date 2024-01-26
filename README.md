# **ESM Hosting**
![actions:release](https://github.com/dojyorin/esm_hosting/actions/workflows/release.yaml/badge.svg)
![shields:license](https://img.shields.io/github/license/dojyorin/esm_hosting)
![shields:release](https://img.shields.io/github/release/dojyorin/esm_hosting)

Minimal ESM hosting service.

# Details
Bundle ESM code located on Git repository and serve to client.

ESM bundler uses [`denoland/deno_emit`](https://github.com/denoland/deno_emit) and TypeScript is transpiled when bundling so can directly specify `.ts` file.

You can select Git hosting service to connect to when starting server.

For example, connect to on-premise GitHub or GitLab within company and build ESM hosting service for internal use.

This project is inspired by [esm.sh](https://esm.sh) and [deno.land/x](https://deno.land/x).

# Execution
```sh
# for Docker
./script/start_docker.sh

# for Local
./script/start_local.sh

# for Local (No verify TLS)
# Use at your own risk!
# Be sure to use for limited purpose. (ex: legacy intranet)
./script/start_local.sh --unsafe
```

# Environment
- `ESMH_HOST` ... Listen hostname.
    - Default: `127.0.0.1`
- `ESMH_PORT` ... Listen port.
    - Default: `3080`
- `ESMH_TLS_KEY` ... Private key file path when using TLS.
    - Format: PEM
- `ESMH_TLS_CERT` ... Certificate file path when using TLS.
    - Format: PEM
- `ESMH_TARGET` ... Git hosting service URL.
    - Default: `https://github.com`

# Specification
### `GET /x/(:owner)/(:repo)@(:ref)/(:path)(?minify)(&map)(&ts)`

**Request**

- Path
    - `:owner` ... Owner name.
    - `:repo` ... Repository name.
    - `:ref` ... Tag name. (or branch name)
    - `:path` ... Path to file.
- Query
    - `minify` (option) ... Minify ESM code.
    - `map` (option) ... Embed SourceMap.
    - `ts` (option) ... Embed original TypeScript.

**Response**

- Type: `text/javascript`
- Body: ESM code.

# Example
```html
<script>
    import * as mod from "http://127.0.0.1:3080/x/dojyorin/deno_simple_utility@v1.0.0/mod.ts";
</script>
```