import {bundle, envGet} from "../deps.ts";

const remote = envGet("ESM_HOST", "string", false) ?? "https://github.com";
const html = await Deno.readTextFile(new URL(import.meta.resolve("./client.html")));

function resCode(code:number){
    return new Response(undefined, {
        status: code
    });
}

export async function handleRequest(request:Request){
    if(request.method !== "GET"){
        return resCode(405);
    }

    const {pathname, searchParams} = new URL(request.url);

    if(pathname === "/"){
        return new Response(html, {
            headers: {
                "Content-Type": "text/html"
            }
        });
    }
    else if(pathname.startsWith("/x/")){
        const [, owner, repo, ref, path] = pathname.match(/^\/x\/([\w.-]+)\/([\w.-]+)@([\w.-]+)\/([\w./-]+)$/) ?? [];

        if(!owner || !repo || !ref || !path){
            return resCode(404);
        }

        const {code} = await bundle(`${remote}/${owner}/${repo}/raw/${ref}/${path}`, {
            minify: searchParams.has("minify")
        });

        return new Response(code, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "text/javascript"
            }
        });
    }
    else{
        return resCode(404);
    }
}