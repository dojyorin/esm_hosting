# **ESM Hosting**

Deliver ESM from git repository.

# Details
It bundle ESM source code that exists on Git repository and provides to web browsers.
Even if specify raw URL of repository to `import`, will be rejected by SOP, so need like this reverse proxy.

ESM bundler uses `denoland/deno_emit`, TypeScript is transpiled when bundled, so can directly specify `.ts` file.

You can select Git hosting service to connect to when starting your server.
For example, you can connect to an on-premises environment such as GitHub or GitLab within company and build an ESM hosting environment for internal use.

# Execution
```sh
# for Docker
./script/start_docker.sh

# for Local
./script/start_local.sh
```

# Environment
- `ESM_HOST` ... URL of Git hosting service. If not specified, the default value (`https://github.com`) will be applied.

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
- Body: target

### `GET /x/(:owner)/(:repo)@(:ref)/(:path)(?minify)`

**Request**

- Path
    - `:owner` ... owner name
    - `:repo` ... repository name
    - `:ref` ... tag or branch name
    - `:path` ... path to ESM file
- Query
    - `minify` (option) ... Minify ESM source code

**Response**

- Code: `200`
- Type: `text/javascript`
- Body: ESM source code.

# Example
```html
<script>
    import * as util from "http://127.0.0.1:8000/x/dojyorin/deno_simple_utility@v1.0.0/mod.ts";
</script>
```