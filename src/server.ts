import {bundle} from "../deps.ts";
import {resCode, resRedirect, resContent} from "./response.ts";

const esmHost = Deno.env.get("ESM_HOST") ?? "https://github.com";
const pathMatch = /^\/x\/([\w.-]+)\/([\w.-]+)@([\w.-]+)\/([\w./-]+)$/;

export async function handleRequest(request:Request){
    if(request.method !== "GET"){
        return resCode(405);
    }

    const {pathname, searchParams} = new URL(request.url);

    if(pathname === "/"){
        return resRedirect("https://github.com/dojyorin/esm_hosting_git");
    }
    else if(pathname === "/target"){
        return resContent(esmHost, "text/plain");
    }
    else if(pathMatch.test(pathname)){
        const [, owner, repo, ref, path] = pathname.match(pathMatch) ?? [];

        const {code} = await bundle(`${esmHost}/${owner}/${repo}/raw/${ref}/${path}`, {
            minify: searchParams.has("minify")
        });

        return resContent(code, "text/javascript", true);
    }

    return resCode(404);
}