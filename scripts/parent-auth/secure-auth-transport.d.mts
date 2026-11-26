export interface AuthCrypto {identityDigest(kind:string,email:string):string;codeDigest(identity:string,challenge:string,code:string):string;sessionDigest(token:string):string;sixDigits():string;newVersion():string;sessionToken():string;constantTimeEqual(a:unknown,b:unknown):boolean;}
export interface OtpMailer {sendParentCode(email:string,code:string,ttlMs:number,challengeId:string):Promise<boolean>;}
type Env=Record<string,string|undefined>;
export function createAuthCrypto(env:Env):AuthCrypto;
export function createTestOtpMailer(env:Env,request?:typeof fetch):OtpMailer;
export function createPortalOtpMailer(env:Env,recipient:string,request?:typeof fetch):OtpMailer;
export function previewRecipients(env:Env):string[];
export function validPreviewEmail(value:unknown):value is string;
export function openPreviewRecipients(env:Env):boolean;
