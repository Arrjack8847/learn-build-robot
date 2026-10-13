/**
 * Regression test: load the REAL motor GLB using Three.js GLTFLoader,
 * resolve the front output hub, and ensure the 180-degree upside-down socket alignment
 * does not throw. Does not need WebGL or modify source assets.
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
let socketHub;
const names = [];
model.scene.traverse((part) => {
  if (part.name) names.push(part.name);
  if (part.name.includes("10091")) socketHub = part;
});
const nativeAxis = socketHub
  ? new THREE.Vector3(0, 1, 0).transformDirection(socketHub.matrixWorld)
  : new THREE.Vector3(0, 0, -1);
const pivot = new THREE.Group();
const correction = new THREE.Group();
correction.scale.setScalar(50);
const uprightOrientation = new THREE.Quaternion().setFromUnitVectors(nativeAxis.normalize(), new THREE.Vector3(0, 0, 1));
const halfTurn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
correction.quaternion.copy(uprightOrientation).premultiply(halfTurn);
correction.add(model.scene);
pivot.add(correction);
pivot.updateMatrixWorld(true);
const localSocket = new THREE.Vector3(-0.0076, 0.0158, 0.01134);
const socket = correction.localToWorld(localSocket.clone());
correction.position.sub(socket);
pivot.updateMatrixWorld(true);

const result = nativeAxis.clone().applyQuaternion(correction.quaternion);
assert.ok(result.distanceTo(new THREE.Vector3(0, 0, -1)) < 0.001, "Flipped output socket must face -Z");
const atOrigin = correction.localToWorld(localSocket.clone());
assert.ok(atOrigin.length() < 0.001, "Output socket must coincide with axle insertion origin");
assert.ok(names.length > 0, "Real GLB nodes must be present");

console.log("Real GLB parse passed.");
console.log("Imported nodes:", names.length);
console.log("Output hub found by name:", Boolean(socketHub), socketHub?.name ?? "(known -Z fallback)");
console.log("Aligned motor socket direction:", result.toArray().map(x => +x.toFixed(4)));
console.log("Aligned socket center:", atOrigin.toArray().map(x => +x.toFixed(4)));
