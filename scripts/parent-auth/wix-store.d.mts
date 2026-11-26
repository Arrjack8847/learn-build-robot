export type WixRow=Record<string,unknown>;
export interface WixStore {
 get(collection:string,id:string):Promise<WixRow|null>;
 insert(collection:string,id:string,data:object):Promise<boolean>;
 replaceIfVersion(collection:string,id:string,expectedVersion:string,data:object):Promise<boolean>;
 listFixtureChildren(parentId:string):Promise<WixRow[]>;
 listMembershipInbox(input:{since:number;subscriptionId:string}):Promise<WixRow[]>;
 challengeStore:{readStrong(key:string):Promise<WixRow|null>;compareAndSet(key:string,expected:string|null,next:object):Promise<boolean>};
}
export function createWixStore(env:Record<string,string|undefined>,request?:typeof fetch):WixStore;
