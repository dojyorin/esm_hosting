import {bundle} from "./deps.ts";
import {resCode, resRedirect, resContent} from "./src/response.ts";

const envTarget = Deno.env.get("ESMH_TARGET") || "https://github.com";

await Deno.serve({
    hostname: Deno.env.get("ESMH_HOST") || "127.0.0.1",
    port: (v => v ? Number(v) : 9000)(Deno.env.get("ESMH_PORT")),
    key: (v => v && Deno.readTextFileSync(v))(Deno.env.get("ESMH_TLSKEY")),
    cert: (v => v && Deno.readTextFileSync(v))(Deno.env.get("ESMH_TLSCER")),
    onListen({hostname, port}){
        console.info("Listen:", `${hostname}:${port}`);
        console.info("Target:", envTarget);
    },
    onError(e){
        console.error(e);
        return resCode(500);
    }
}, async(request)=>{
    if(request.method !== "GET"){
        return resCode(405);
    }

    const {pathname, searchParams} = new URL(request.url);

    if(pathname === "/"){
        return resRedirect("https://github.com/dojyorin/esm_hosting_git");
    }
    else if(pathname === "/target"){
        return resContent(envTarget, "text/plain");
    }
    else if(pathname.startsWith("/x/")){
        const [, owner, repo, ref, path] = pathname.match(/^\/x\/([\w.-]+)\/([\w.-]+)@([\w.-]+)\/([\w./-]+)$/) ?? [];

        try{
            const {code} = await bundle(`${envTarget}/${owner}/${repo}/raw/${ref}/${path}`, {
                minify: searchParams.has("minify")
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