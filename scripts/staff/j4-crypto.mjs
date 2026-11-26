import {createHmac,randomBytes,scrypt,timingSafeEqual} from "node:crypto";
import {promisify} from "node:util";
const derive=promisify(scrypt);
export function createJ4Crypto(env){
 const secret=env.J4_SESSION_SECRET;
 if(typeof secret!=="string"||!/^[a-fA-F0-9]{64}$/.test(secret)||new Set(Buffer.from(secret,"hex")).size<8)throw Error("J4_SECRET_REQUIRED");
 const ids=["qa-j4-staff-1","qa-j4-staff-2","qa-j4-staff-3"];
 const credentials=JSON.parse(env.J4_STAFF_PASSWORD_HASHES??"null");
 if(!credentials||Object.keys(credentials).length!==3||ids.some(id=>typeof credentials[id]!=="string"||!/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(credentials[id]))||new Set(ids.map(id=>credentials[id])).size!==3)throw Error("J4_INDIVIDUAL_CREDENTIALS_REQUIRED");
 const key=Buffer.from(secret,"hex");
 return {
  newId:()=>randomBytes(16).toString("hex"),
  newToken:()=>randomBytes(32).toString("base64url"),
  staffSessionDigest:token=>createHmac("sha256",key).update("j4-session/v1:"+token).digest("hex"),
  async verifyPassword(id,password){
   const row=credentials[id];
   if(!ids.includes(id)||typeof password!=="string"||password.length>256)return false;
   const [,salt,expected]=row.split(":");
   const hash=await derive(password,Buffer.from(salt,"hex"),64);
   return timingSafeEqual(hash,Buffer.from(expected,"hex"));
  }
 };
}
