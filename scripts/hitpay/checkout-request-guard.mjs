// Preview checkout request boundary. Do not accept null or cross-site Origin.
export async function validateSandboxCheckoutRequest(request,env){
  const expected=env.VERCEL_URL?"https://"+env.VERCEL_URL:"";
  const url=new URL(request.url);
  if(request.method!=="POST"||!expected||url.origin!==expected||request.headers.get("origin")!==expected||request.headers.get("sec-fetch-site")!=="same-origin"||request.headers.get("x-stem-sandbox-checkout")!=="1"||url.search)return {ok:false,status:403,reason:"INVALID_REQUEST"};
  const action=url.pathname.split("/").at(-1);
  if(action!=="status"&&action!=="open")return {ok:false,status:404,reason:"NOT_FOUND"};
  // Some server adapters expose an empty POST as a stream instead of null.
  // Reject actual bytes rather than rejecting the mere existence of a stream.
  const length=request.headers.get("content-length");
  if(length!==null&&length!=="0")return {ok:false,status:400,reason:"INVALID_REQUEST"};
  if(request.body!==null){
    const reader=request.body.getReader();
    try{for(;;){const chunk=await reader.read();if(chunk.done)break;if(chunk.value.byteLength){await reader.cancel();return {ok:false,status:400,reason:"INVALID_REQUEST"};}}}
    finally{reader.releaseLock();}
  }
  return {ok:true,expected,action};
}
