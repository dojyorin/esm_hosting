import {contentType, bundle} from "./deps.ts";

const envTarget = Deno.env.get("ESMH_TARGET") || "https://github.com";

function resCode(code:number){
    return new Response(undefined, {
        status: code
    });
}

function resContent(body:BodyInit, type:string, cors?:boolean){
    return new Response(body, {
        headers: {
            "Content-Type": contentType(type) ?? "application/octet-stream",
            ...cors && {
                "Access-Control-Allow-Origin": "*"
            }
        }
    });
}

await Deno.serve({
    hostname: Deno.env.get("ESMH_HOST") || "127.0.0.1",
    port: (v => v ? Number(v) : 3080)(Deno.env.get("ESMH_PORT")),
    key: (v => v && Deno.readTextFileSync(v))(Deno.env.get("ESMH_TLS_KEY")),
    cert: (v => v && Deno.readTextFileSync(v))(Deno.env.get("ESMH_TLS_CERT")),
    onListen({hostname, port}){
        console.info("Server start.");
        console.info("Listen:", `${hostname}:${port}`);
        console.info("Target:", envTarget);
    },
    onError(e){
        console.error(e);
        return resCode(500);
    }
}, async({method, url})=>{
    if(method !== "GET"){
        return resCode(405);
    }

    const {pathname, searchParams} = new URL(url);

    if(pathname === "/"){
        return resContent(/*html*/`
            <!doctype html>
            <meta charset="utf-8">
            <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50%' y='50%' style='dominant-baseline:central;text-anchor:middle;font-size:100px;'>🧩</text></svg>">
            <title>ESM Hosting</title>
            <h1>ESM Hosting</h1>
            <p>See <a href="https://github.com/dojyorin/esm_hosting">GitHub</a> for more info.</p>
            <p>[Target] ${envTarget}</p>
        `, "html");
    }
    else if(pathname.startsWith("/x/")){
        const [, owner, repo, ref, path] = pathname.match(/^\/x\/([\w.-]+)\/([\w.-]+)@([\w.-]+)\/([\w./-]+)$/) ?? [];

        try{
            const {code} = await bundle(`${envTarget}/${owner}/${repo}/raw/${ref}/${path}`, {
                minify: searchParams.has("minify"),
                compilerOptions: {
                    inlineSourceMap: searchParams.has("map"),
                    inlineSources: searchParams.has("ts")
                }
            });

            return resContent(code, "js", true);
        }
        catch(e){
            console.error(e);
            return resCode(400);
        }
    }

    return resCode(404);
}).finished;