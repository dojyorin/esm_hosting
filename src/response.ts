export function resCode(code:number){
    return new Response(undefined, {
        status: code
    });
}

export function resContent(body:BodyInit, type:string, cors?:boolean){
    return new Response(body, {
        headers: {
            "Content-Type": type,
            ...cors && {
                "Access-Control-Allow-Origin": "*"
            }
        }
    });
}