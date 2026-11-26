// Wix hosted OAuth authorization-code flow with PKCE.
// This development implementation retains member tokens in tab-scoped storage,
// never in localStorage. Production persistent sessions should use HttpOnly cookies.
const CLIENT = import.meta.env["VITE_WIX_CLIENT_ID"]?.trim() || "";
const TOKEN_URL = "https://www.wixapis.com/oauth2/token";
const REDIRECT_URL = "https://www.wixapis.com/_api/redirects-api/v1/redirect-session";
const PENDING_KEY = "bsr.wix.oauth.v1";
const SESSION_KEY = "bsr.wix.session.v1";

type Tokens = { access_token: string; refresh_token: string; expires_in: number };
type Session = Tokens & { expiresAt: number; clientId: string };
type Pending = { state: string; verifier: string; redirectUri: string; createdAt: number; clientId: string };
export const wixConfigured = Boolean(CLIENT);

function requireConfig() {
  if (!CLIENT) throw new Error("Student sign-in has not been configured yet.");
  if (!window.isSecureContext) throw new Error("A secure HTTPS connection is required.");
}
function randomString() {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}
function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function request<T>(url: string, body: object, token?: string): Promise<T> {
  const result = await fetch(url, {
    method:"POST", headers:{"Content-Type":"application/json", ...(token ? {Authorization:token} : {})},
    body:JSON.stringify(body), cache:"no-store", credentials:"omit", redirect:"error",
  });
  if (!result.ok) throw new Error("Wix authentication request failed. Please try again.");
  return result.json() as Promise<T>;
}
function verifyTokens(tokens: Tokens) {
  if (typeof tokens.access_token !== "string" || !tokens.access_token ||
      typeof tokens.refresh_token !== "string" || !tokens.refresh_token ||
      !Number.isFinite(tokens.expires_in) || tokens.expires_in <= 0)
    throw new Error("Invalid authentication response.");
}
function save(tokens: Tokens) {
  verifyTokens(tokens);
  const session: Session = {...tokens, expiresAt:Date.now()+tokens.expires_in*1000, clientId:CLIENT};
  sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));
  return session;
}
function load(): Session | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null") as Session | null;
    if (!value || value.clientId !== CLIENT || !Number.isFinite(value.expiresAt)) return null;
    verifyTokens(value);
    return value;
  } catch { return null; }
}
export function clearWixSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(PENDING_KEY);
}
function redirectToWix(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid authentication redirect.");
  window.location.assign(url.href);
}
export async function beginWixLogin() {
  requireConfig();
  clearWixSession();
  const verifier=randomString(), state=randomString();
  const redirectUri=window.location.origin+"/auth/callback";
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(verifier));
  const pending: Pending={state,verifier,redirectUri,createdAt:Date.now(),clientId:CLIENT};
  sessionStorage.setItem(PENDING_KEY,JSON.stringify(pending));
  const visitor=await request<Tokens>(TOKEN_URL,{clientId:CLIENT,grantType:"anonymous"});
  verifyTokens(visitor);
  const result=await request<{redirectSession:{fullUrl:string}}>(REDIRECT_URL,{
    auth:{authRequest:{redirectUri,clientId:CLIENT,codeChallenge:base64url(new Uint8Array(digest)),
      codeChallengeMethod:"S256",responseMode:"fragment",responseType:"code",scope:"offline_access",state}}
  },visitor.access_token);
  redirectToWix(result.redirectSession.fullUrl);
}
let callbackTask: Promise<void> | undefined;
export function completeWixLogin(): Promise<void> {
  // React development remounts cannot redeem the same code twice.
  if (callbackTask) return callbackTask;
  callbackTask=(async()=>{
    requireConfig();
    const params=new URLSearchParams(window.location.hash.slice(1));
    const code=params.get("code"),state=params.get("state");
    const raw=sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    window.history.replaceState(null,"",window.location.pathname);
    if (!raw || !code || !state || params.has("error")) throw new Error("Sign-in was cancelled or expired. Start again.");
    const data=JSON.parse(raw) as Pending;
    if (data.clientId!==CLIENT || data.state!==state || data.redirectUri!==window.location.origin+"/auth/callback" ||
        !Number.isFinite(data.createdAt) || Date.now()-data.createdAt>15*60*1000 || Date.now()<data.createdAt)
      throw new Error("Sign-in verification failed. Start again.");
    const tokens=await request<Tokens>(TOKEN_URL,{clientId:CLIENT,grantType:"authorization_code",
      redirectUri:data.redirectUri,code,codeVerifier:data.verifier});
    save(tokens);
  })();
  return callbackTask;
}
let renewTask: Promise<string> | undefined;
export async function getWixMemberToken(): Promise<string | null> {
  const session=load();
  if (!session) return null;
  if (session.expiresAt>Date.now()+60000) return session.access_token;
  if (!renewTask) {
    renewTask=(async()=>{
      const tokens=await request<Tokens>(TOKEN_URL,{grantType:"refresh_token",refresh_token:session.refresh_token});
      // Prevent an in-flight refresh from reviving a signed-out session.
      if (load()?.refresh_token!==session.refresh_token) throw new Error("Session changed.");
      return save(tokens).access_token;
    })().finally(()=>{renewTask=undefined;});
  }
  return renewTask;
}
export async function logoutWix() {
  const token=await getWixMemberToken().catch(()=>null);
  clearWixSession();
  if (!token) {window.location.assign("/");return;}
  const result=await request<{redirectSession:{fullUrl:string}}>(REDIRECT_URL,{
    logout:{clientId:CLIENT},callbacks:{postFlowUrl:window.location.origin+"/"}
  },token);
  redirectToWix(result.redirectSession.fullUrl);
}
