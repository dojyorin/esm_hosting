# **ESM Hosting**
![actions:release](https://github.com/dojyorin/esm_hosting/actions/workflows/release.yaml/badge.svg)
![shields:license](https://img.shields.io/github/license/dojyorin/esm_hosting)
![shields:release](https://img.shields.io/github/release/dojyorin/esm_hosting)

Minimal ESM hosting service.

# Details
Serverware for hosting ESM code in Git repositories.

Can be provide TypeScript as is or transpiled to JavaScript and bundled.

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

# for Local (No verify TLS, use at your own risk!)
# Be sure to use for limited purpose. (ex: legacy intranet)
./script/start_local.sh --insecure
```

# Environment
- `ESMH_HOST` ... Listen hostname.
    - Default: `0.0.0.0`
- `ESMH_PORT` ... Listen port.
    - Default: `3080`
- `ESMH_TLS_KEY` ... Key file path when using TLS.
    - Format: PEM
- `ESMH_TLS_CERT` ... Certificate file path when using TLS.
    - Format: PEM
- `ESMH_TARGET` ... Git hosting service URL.
    - Default: `https://github.com`

# Specification
### `GET /x/:owner/:repo@:ref/:path?bundle&minify&map&ts`

**Request**

- Path
    - `:owner` (required) ... Owner name.
    - `:repo` (required) ... Repository name.
    - `:ref` (required) ... Tag name. (or branch name)
    - `:path` (required) ... Path to file.
- Query
    - `bundle` (option) ... Transpiled to JavaScript and bundled.
        - `minify` (option, require `bundle`) ... Minify bundled code.
        - `map` (option, require `bundle`) ... Embed source map.
        - `ts` (option, require `bundle`) ... Embed original TypeScript.

**Response**

- Type: `text/typescript` or `text/javascript` (use `bundle` query.)
- Body: ESM code.

# Example
**in Browser**

```js
import * as mod from "http://127.0.0.1:3080/x/dojyorin/deno_simple_utility@v2.0.0/mod.pure.ts?bundle&minify";
```

**in Deno**

```ts
import * as mod from "http://127.0.0.1:3080/x/dojyorin/deno_simple_utility@v2.0.0/mod.ts";
```