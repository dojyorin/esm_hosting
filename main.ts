import {bundle} from "./deps.ts";

const envTarget = Deno.env.get("ESMH_TARGET") || "https://github.com";

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
            <title>ESM Hosting</title>
            <h1>ESM Hosting</h1>
            <p>See <a href="https://github.com/dojyorin/esm_hosting">GitHub</a> for more info.</p>
            <p>[Target] ${envTarget}</p>
        `, "text/html");
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

            return resContent(code, "text/javascript", true);
        }
        catch(e){
            console.error(e);
            return resCode(400);
        }
    }

    return resCode(404);
}).finished;