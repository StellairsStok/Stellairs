import * as THREE from 'three';
import { deformToBrain } from '../utils/deformSphere.js';
import { createGhostMaterial } from '../materials/BrainMaterials.js';

/**
 * Create the base brain hemisphere geometry (high detail)
 */
export function createHemisphere(side = 1) {
  const geometry = new THREE.SphereGeometry(1, 128, 128,
    side === 1 ? 0 : Math.PI,  // phiStart
    Math.PI                      // phiLength (half sphere)
  );

  deformToBrain(geometry, side);
  return geometry;
}

/**
 * Create ghost brain mesh for deep structure context
 */
export function createGhostBrain() {
  const group = new THREE.Group();
  group.name = 'ghostBrain';

  const leftGeo = createHemisphere(-1);
  const rightGeo = createHemisphere(1);
  const mat = createGhostMaterial();

  const left = new THREE.Mesh(leftGeo, mat);
  const right = new THREE.Mesh(rightGeo, mat);
  left.name = 'ghost_left';
  right.name = 'ghost_right';

  group.add(left, right);
  group.visible = false;
  return group;
}
