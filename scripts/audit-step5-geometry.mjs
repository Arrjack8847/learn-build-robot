import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Read actual STL triangles (no assumptions from filenames or colors).
export function readTriangles(path) {
  const bytes = readFileSync(resolve(path));
  const count = bytes.readUInt32LE(80);
  if (84 + count * 50 !== bytes.length) throw Error("Not a complete binary STL: " + path);
  const tris = new Float32Array(count * 9);
  const bounds = [[Infinity, Infinity, Infinity], [-Infinity, -Infinity, -Infinity]];
  for (let i = 0; i < count; i++) {
    for (let v = 0; v < 3; v++) for (let a = 0; a < 3; a++) {
      const value = bytes.readFloatLE(84 + 50*i + 12 + 12*v + 4*a);
      tris[9*i+3*v+a] = value;
      bounds[0][a] = Math.min(bounds[0][a], value);
      bounds[1][a] = Math.max(bounds[1][a], value);
    }
  }
  return { path, count, tris, bounds };
}
export function sliceSegments(shape, axis, plane) {
  const a=(axis+1)%3,b=(axis+2)%3, segments=[];
  const t=shape.tris;
  for (let i=0;i<t.length;i+=9) {
    const pts=[[t[i],t[i+1],t[i+2]],[t[i+3],t[i+4],t[i+5]],[t[i+6],t[i+7],t[i+8]]];
    const crosses=[];
    for(let j=0;j<3;j++){
      const p=pts[j],q=pts[(j+1)%3], v=p[axis]-plane,w=q[axis]-plane;
      if((v<0 && w>0)||(v>0 && w<0)){
        const f=-v/(w-v);
        crosses.push([p[a]+f*(q[a]-p[a]),p[b]+f*(q[b]-p[b])]);
      }
    }
    if(crosses.length===2)segments.push(crosses);
  }
  return {a,b,segments};
}
export function insideSegments(segments,x,y) {
  let count=0;
  for(const [p,q] of segments){
    if((p[1] > y) !== (q[1] > y)){
      const t=(y-p[1])/(q[1]-p[1]);
      if(p[0] + t*(q[0]-p[0]) > x)count++;
    }
  }
  return count%2!==0;
}
function round(value){return Math.round(value*100)/100;}
function profile(shape,axis,plane,w=41,h=19){
  const {a,b,segments}=sliceSegments(shape,axis,plane);
  const minA=shape.bounds[0][a],maxA=shape.bounds[1][a];
  const minB=shape.bounds[0][b],maxB=shape.bounds[1][b];
  const lines=[];
  for(let iy=h-1;iy>=0;iy--){
    let row="";
    for(let ix=0;ix<w;ix++){
      const u=minA+(maxA-minA)*(ix+0.5)/w;
      const v=minB+(maxB-minB)*(iy+0.5)/h;
      row+=insideSegments(segments,u,v)?"#":".";
    }
    lines.push(row);
  }
  return ["plane "+["X","Y","Z"][axis]+"="+round(plane)+" ; cols = "+["X","Y","Z"][a]+"["+round(minA)+","+round(maxA)+"] ; rows = "+["X","Y","Z"][b]+"["+round(minB)+","+round(maxB)+"] ; segments="+segments.length, ...lines].join("\n");
}
const parts=[
  "48989.stl","15100_fixed.stl",
  "3D for marksman/connector/long connector.stl",
  "3D for marksman/connector/pin_pin.stl",
  "3D for marksman/connector/pin_short.stl",
  "3D for marksman/beams/11.stl"
];
for(const path of parts){
 const shape=readTriangles(path);
 const length=shape.bounds[0].map((x,i)=>round(shape.bounds[1][i]-x));
 console.log("\n### "+path);
 console.log(JSON.stringify({triangles:shape.count,min:shape.bounds[0].map(round),max:shape.bounds[1].map(round),dimensions:length,center:shape.bounds[0].map((x,i)=>round((x+shape.bounds[1][i])/2))}));
 if(path==="48989.stl" || path==="15100_fixed.stl"){
  for(const axis of [0,1,2]){
   const mn=shape.bounds[0][axis],mx=shape.bounds[1][axis];
   for(const f of [0.18,0.5,0.82])console.log(profile(shape,axis,mn+(mx-mn)*f));
  }
 }
}
