# **ESM Hosting**

Deliver ESM from git repository.

# Details
It bundle ESM source code that exists on Git repository and provides to web browsers.
Even if specify raw URL of repository to `import`, will be rejected by SOP, so need like this reverse proxy.

ESM bundler uses [`denoland/deno_emit`](https://github.com/denoland/deno_emit), TypeScript is transpiled when bundled, so can directly specify `.ts` file.

You can select Git hosting service to connect to when starting your server.
For example, you can connect to an on-premises environment such as GitHub or GitLab within company and build an ESM hosting environment for internal use.

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

# API
### `GET /`

**Response**

- Code: `303`
- Redirect: `https://github.com/dojyorin/esm_hosting_git`

Redirect to this repository.

### `GET /target`

**Response**

- Code: `200`
- Type: `text/plain`
- Body: Target URL

Return URL of Git hosting service targeted by current instance.

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

- Code: `200`
- Type: `text/javascript`
- Body: ESM source code.

# Example
```html
<script>
    import * as util from "http://127.0.0.1:9000/x/dojyorin/deno_simple_utility@v1.0.0/mod.ts";
</script>
```