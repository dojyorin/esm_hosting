import {createCache} from "https://deno.land/x/deno_cache@0.6.3/mod.ts";
import {bundle} from "https://deno.land/x/emit@0.35.0/mod.ts";

function resCode(code:number){
    return new Response(undefined, {
        status: code
    });
}

function resContent(body:BodyInit, type:string, cors?:boolean){
    return new Response(body, {
        headers: {
            "Content-Type": type,
            ...cors && {
                "Access-Control-Allow-Origin": "*"
            }
        }
    });
}

const pathModule = /^\/x\/([\w.-]+)\/([\w.-]+)@([\w.-]+)\/([\w./-]+)$/;
const targetHost = (v => v || "https://github.com")(Deno.env.get("ESMH_TARGET"));

await Deno.serve({
    hostname: (v => v || "0.0.0.0")(Deno.env.get("ESMH_HOST")),
    port: (v => v ? Number(v) : 3080)(Deno.env.get("ESMH_PORT")),
    key: (v => v && Deno.readTextFileSync(v))(Deno.env.get("ESMH_TLS_KEY")),
    cert: (v => v && Deno.readTextFileSync(v))(Deno.env.get("ESMH_TLS_CERT")),
    onListen({hostname, port}){
        console.info("Server start.");
        console.info("Listen:", `${hostname}:${port}`);
        console.info("Target:", targetHost);
    },
    onError(e){
        console.error(e);
        return resCode(500);
    }
}, async({method, url})=>{
    const {pathname, searchParams} = new URL(url);

    if(pathname === "/"){
        if(method !== "GET"){
            return resCode(405);
        }

        return resContent(/*html*/`
            <!doctype html>
            <meta charset="utf-8">
            <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50%' y='50%' style='dominant-baseline:central;text-anchor:middle;font-size:100px;'>🧩</text></svg>">
            <title>ESM Hosting</title>
            <h1>ESM Hosting</h1>
            <p>See <a href="https://github.com/dojyorin/esm_hosting">GitHub</a> for more info.</p>
            <p>[Target] <code>${targetHost}</code></p>
        `, "text/html");
    }
    else if(pathModule.test(pathname)){
        if(method !== "GET"){
            return resCode(405);
        }

        const [, owner, repo, ref, path] = pathname.match(pathModule) ?? [];
        const targetURL = `${targetHost}/${owner}/${repo}/raw/${ref}/${path}`;

        if(searchParams.has("bundle")){
            const {code} = await bundle(targetURL, {
                minify: searchParams.has("minify"),
                compilerOptions: {
                    inlineSourceMap: searchParams.has("map"),
                    inlineSources: searchParams.has("ts")
                }
            });

            return resContent(code, "text/javascript", true);
        }

        const response = await createCache().load(targetURL);

        switch(response?.kind){
            case "module": return resContent(response.content, "text/typescript", true);
            case "external": return resCode(422);
            default: return resCode(404);
        }
    }

    return resCode(404);
}).finished;