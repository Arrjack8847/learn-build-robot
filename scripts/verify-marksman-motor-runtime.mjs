/**
 * Regression test: load the REAL motor GLB using Three.js GLTFLoader,
 * resolve the front output hub, and verify the Blender-like horizontal
 * (+X outward, -X insertion) axis. Does not need WebGL or change source assets.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const bytes = readFileSync(new URL("../3D for marksman/mortor.glb", import.meta.url));
const glb = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
const loader = new GLTFLoader();
const model = await new Promise((resolve, reject) => {
  loader.parse(glb, "", resolve, reject);
});
assert.ok(model.scene, "GLB scene loaded");

model.scene.updateMatrixWorld(true);
// Report the actual LDraw hub and cable-retainer node transforms. In the
// source parts library, 10095.dat is the axle hub and 10091.dat the rear
// cable retainer. Output these before any tutorial-space corrections.
const found = [];
model.scene.traverse((part) => {
  if (!/10095|10091|10090|10092|10089|99499/.test(part.name)) return;
  const p = part.getWorldPosition(new THREE.Vector3());
  const forward = new THREE.Vector3(0, 0, -1).transformDirection(part.matrixWorld);
  found.push({name:part.name,parent:part.parent?.name ?? "(none)",
    position:p.toArray().map(x => +x.toFixed(6)),
    localMinusZ:forward.toArray().map(x=>+x.toFixed(5))});
});
console.log("ACTUAL IMPORTED MOTOR LDraw part node transforms", JSON.stringify(found));
let frontAxleHub;
let rearCableRetainer;
const names = [];
model.scene.traverse((part) => {
  if (part.name) names.push(part.name);
  if (part.name.includes("10095")) frontAxleHub = part;
  if (part.name.includes("10091")) rearCableRetainer = part;
});
assert.ok(frontAxleHub, "Missing actual front axle hub (LDraw 10095)");
assert.ok(rearCableRetainer, "Missing rear cable retainer (LDraw 10091)");
const frontDatum = frontAxleHub.getWorldPosition(new THREE.Vector3());
const rearDatum = rearCableRetainer.getWorldPosition(new THREE.Vector3());
const backToFront = frontDatum.clone().sub(rearDatum);
assert.ok(Math.abs(backToFront.length() - 0.0536) < 0.0001,
  "The front axle hub must be 53.6 mm from the rear cable retainer");
assert.ok(backToFront.z > 0.05,
  "Front output hub must be toward +Z of the native GLB, not the rear end");
const nativeAxis = backToFront.normalize();
// Keep socket coordinates in the model's pre-rotation frame during centring.
const pivot = new THREE.Group();
const assemblyRoot = new THREE.Group();
assemblyRoot.rotation.y = -Math.PI / 2;
const correction = new THREE.Group();
correction.scale.setScalar(50);
correction.quaternion.setFromUnitVectors(nativeAxis, new THREE.Vector3(0, 0, -1));
correction.add(model.scene);
pivot.add(correction);
pivot.updateMatrixWorld(true);
// Centre on the actual 10095 axle-hub opening, not on the 10091 retainer.
const localSocket = frontDatum.clone();
const socket = correction.localToWorld(localSocket.clone());
correction.position.sub(socket);
assemblyRoot.add(pivot);
assemblyRoot.updateMatrixWorld(true);

const localAxis = nativeAxis.clone().applyQuaternion(correction.quaternion);
assert.ok(localAxis.distanceTo(new THREE.Vector3(0, 0, -1)) < 0.001, "Socket-local output must face -Z");
const result = localAxis.applyQuaternion(assemblyRoot.quaternion);
assert.ok(result.distanceTo(new THREE.Vector3(1, 0, 0)) < 0.001, "Visible motor output must point right (+X)");
const atOrigin = correction.localToWorld(localSocket.clone());
assert.ok(atOrigin.length() < 0.001, "Front output socket must coincide with insertion origin");
assemblyRoot.updateMatrixWorld(true);
const frontAfter = frontAxleHub.getWorldPosition(new THREE.Vector3());
const rearAfter = rearCableRetainer.getWorldPosition(new THREE.Vector3());
assert.ok(frontAfter.length() < 0.001, "10095 FRONT hub must be at axle insertion origin");
assert.ok(rearAfter.x < -2, "10091 rear cable end must be to the LEFT of the front face");
assert.ok(frontAfter.distanceTo(rearAfter) > 2.65, "Front and rear may not be confused");
assert.ok(names.length > 0, "Real GLB nodes must be present");

// The 24 mm STL shaft is long along local +X. Its pre-assembly +Y
// rotation aligns it with socket-local -Z; the full assembly root then
// aligns it with world +X (the Blender example's horizontal shaft).
const shaftAxis = new THREE.Vector3(1, 0, 0)
  .applyEuler(new THREE.Euler(0, Math.PI / 2, 0))
  .applyQuaternion(assemblyRoot.quaternion);
assert.ok(shaftAxis.distanceTo(new THREE.Vector3(1, 0, 0)) < 0.001, "Axle length must point along world +X");

// Action 2.1's aligned starting centre is to the RIGHT of the motor
// socket. As the axle seats, it travels along -X with no vertical drift.
const approach = new THREE.Vector3(0, 0, -1.75).applyQuaternion(assemblyRoot.quaternion);
const seated = new THREE.Vector3(0, 0, -0.2).applyQuaternion(assemblyRoot.quaternion);
assert.ok(approach.x > seated.x && seated.x > 0, "Axle must approach from +X and insert toward -X");
assert.ok(Math.abs(approach.y - seated.y) < 0.001 && Math.abs(approach.z - seated.z) < 0.001, "Axle approach must remain coaxial");

// Disc, beam and connector hole normals share the same horizontal axis.
const accessoryAxis = new THREE.Vector3(0, 0, 1).applyQuaternion(assemblyRoot.quaternion);
assert.ok(accessoryAxis.distanceTo(new THREE.Vector3(-1, 0, 0)) < 0.001, "Disc and connector through-holes must follow X axis");

console.log("Real GLB parse passed.");
console.log("Imported nodes:", names.length);
console.log("FRONT axle hub:", frontAxleHub.name, "native position", frontDatum.toArray());
console.log("REAR cable retainer:", rearCableRetainer.name, "native position", rearDatum.toArray());
console.log("FRONT hub after assembly:", frontAfter.toArray());
console.log("REAR cable position after assembly:", rearAfter.toArray());
console.log("Blender-right motor socket direction:", result.toArray().map(x => +x.toFixed(4)));
console.log("Axle world direction:", shaftAxis.toArray().map(x => +x.toFixed(4)));
console.log("Axle insertion centres (start -> seated):", approach.toArray(), seated.toArray());
console.log("Aligned socket center:", atOrigin.toArray().map(x => +x.toFixed(4)));
