// Separate domain for student PIN and session secrets. Private preview only.
import {createHmac,randomBytes,scrypt,timingSafeEqual} from "node:crypto";
import {promisify} from "node:util";
const derive=promisify(scrypt);
export function createStudentAuthCrypto(env){
 if(env.VERCEL_ENV!=="preview"||env.VERCEL_TARGET_ENV==="production"||!/^([a-fA-F0-9]{64})$/.test(env.STUDENT_AUTH_SECRET??""))throw Error("STUDENT_AUTH_NOT_CONFIGURED");
 const key=Buffer.from(env.STUDENT_AUTH_SECRET,"hex");if(new Set(key).size<8)throw Error("WEAK_STUDENT_SECRET");
 const mac=(domain,parts)=>createHmac("sha256",key).update(JSON.stringify([domain,...parts])).digest();
 const pinKey=async(id,pin,salt)=>Buffer.from(await derive(mac("student-pin/v1",[id,pin]),salt,32,{N:32768,r:8,p:1,maxmem:64*1024*1024}));
 return {
  async hashPin(id,pin){const salt=randomBytes(16);const digest=await pinKey(id,pin,salt);return salt.toString("hex")+":"+digest.toString("hex");},
  async verifyPin(id,pin,stored){if(typeof stored!=="string"||!/^([a-f0-9]{32}):([a-f0-9]{64})$/.test(stored))return false;const [salt,digest]=stored.split(":");return timingSafeEqual(await pinKey(id,pin,Buffer.from(salt,"hex")),Buffer.from(digest,"hex"));},
  newVersion:()=>randomBytes(16).toString("hex"),
  sessionToken:()=>randomBytes(32).toString("base64url"),
  sessionDigest:token=>mac("student-session/v1",[token]).toString("hex"),
  rateDigest:(kind,subject)=>mac("student-rate/v1",[kind,subject]).toString("hex")
 };
}
