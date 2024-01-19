# **ESM Hosting**

Minimal ESM hosting service.

# Details
It bundle ESM source code that on Git repository and provide to web browser.

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

# for Local (ignore certificate)
./script/start_local.sh --unsafe
```

# Environment
- `ESMH_HOST` ... Listen hostname.
    - Default: `127.0.0.1`
- `ESMH_PORT` ... Listen port.
    - Default: `8000`
- `ESMH_TLS_KEY` ... Private key file path when enabling TLS.
    - Format: PEM
- `ESMH_TLS_CERT` ... Certificate file path when enabling TLS.
    - Format: PEM
- `ESMH_TARGET` ... Git hosting service URL.
    - Default: `https://github.com`

# Specification
### `GET /x/(:owner)/(:repo)@(:ref)/(:path)(?minify)`

**Request**

- Path
    - `:owner` ... Owner name
    - `:repo` ... Repository name
    - `:ref` ... Tag name (or branch name)
    - `:path` ... Path to file
- Query
    - `minify` (option) ... Minify source code

**Response**

- Type: `text/javascript`
- Body: ESM source code.

# Example
```html
<script>
    import * as x from "http://127.0.0.1:8000/x/dojyorin/deno_simple_utility@v1.0.0/mod.ts";
</script>
```