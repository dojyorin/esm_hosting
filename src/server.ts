import {bundle, envGet} from "../deps.ts";
import {resCode, resRedirect, resContent} from "./response.ts";

const remote = envGet("ESM_HOST", "string", false) ?? "https://github.com";

export async function handleRequest(request:Request){
    if(request.method !== "GET"){
        return resCode(405);
    }

    const {pathname, searchParams} = new URL(request.url);

    if(pathname === "/"){
        return resRedirect("https://github.com/dojyorin/esm_hosting_git/blob/master/README.md");
    }
    else if(pathname.startsWith("/x/")){
        const [, owner, repo, ref, path] = pathname.match(/^\/x\/([\w.-]+)\/([\w.-]+)@([\w.-]+)\/([\w./-]+)$/) ?? [];

        try{
            const {code} = await bundle(`${remote}/${owner}/${repo}/raw/${ref}/${path}`, {
                minify: searchParams.has("minify")
            });

            return resContent(code, "text/javascript", true);
        }
        catch(e){
            console.error(e);
            return resCode(404);
        }
    }

    return resCode(404);
}