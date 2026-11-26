import type {WixStore} from "./wix-store.mjs";
import type {AuthCrypto,OtpMailer} from "./secure-auth-transport.mjs";
type Result={ok:boolean;status:string;token?:string};
type Session={status(token:string):Promise<Result>;logout(token:string):Promise<Result>;resolveIdentity(token:string):Promise<{accountType:string;accountId:string}|null>};
type Base={store:WixStore;crypto:AuthCrypto;clock:{now():number};accountType?:string};
export function createPreviewOtp(input:Base&{mailer:OtpMailer;recipient:string}):Session&{requestCode():Promise<Result>;verifyCode(code:string):Promise<Result>};
export function createPreviewSessionAccess(input:Base):Session;
