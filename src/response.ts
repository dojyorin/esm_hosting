export function resCode(code:number){
    return new Response(undefined, {
        status: code
    });
}

export function resRedirect(path:string){
    return new Response(undefined, {
        status: 303,
        headers: {
            "Location": path
        }
    });
}

export function resContent(body:BodyInit, type:string, cors?:true){
    return new Response(body, {
        headers: {
            "Content-Type": type,
            ...cors && {
                "Access-Control-Allow-Origin": "*"
            }
        }
    });
}