import {handleRequest} from "./src/server.ts";

await Deno.serve(handleRequest).finished;