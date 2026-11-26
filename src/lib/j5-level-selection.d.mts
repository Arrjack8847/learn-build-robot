export type LevelRow={level:number;status:"locked"|"unlocked"|"in-progress"|"completed";completed:number;required:number;available:boolean;reason:"level-locked"|"membership-required"|"check-in-required"|null};
export function projectLevelRows(rows:unknown,studentId:string,membership:string,checkIn:string):LevelRow[]|null;
export function validLevelProjection(rows:unknown,membership:string,checkIn:string):boolean;
export function levelCardState(level:number,state:unknown,privateUI:boolean):{open:boolean;label:string|null;progress:{completed:number;required:number}|null;current:boolean};
