import * as THREE from 'three';
import { createHemisphere } from './BrainBase.js';
import { classifyLobe } from '../utils/deformSphere.js';
import { createBrainMaterial } from '../materials/BrainMaterials.js';
import { CATEGORIES } from '../../data/categories.js';

/**
 * Create lobe meshes by classifying vertices of hemisphere geometry
 */
function extractLobeGeometry(hemisphereGeo, lobeId) {
  const pos = hemisphereGeo.attributes.position;
  const idx = hemisphereGeo.index;
  const faceCount = idx ? idx.count / 3 : pos.count / 3;

  const matchingFaces = [];

  for (let f = 0; f < faceCount; f++) {
    const i0 = idx ? idx.getX(f * 3) : f * 3;
    const i1 = idx ? idx.getX(f * 3 + 1) : f * 3 + 1;
    const i2 = idx ? idx.getX(f * 3 + 2) : f * 3 + 2;

    const v0 = new THREE.Vector3(pos.getX(i0), pos.getY(i0), pos.getZ(i0));
    const v1 = new THREE.Vector3(pos.getX(i1), pos.getY(i1), pos.getZ(i1));
    const v2 = new THREE.Vector3(pos.getX(i2), pos.getY(i2), pos.getZ(i2));

    // Classify by centroid
    const cx = (v0.x + v1.x + v2.x) / 3;
    const cy = (v0.y + v1.y + v2.y) / 3;
    const cz = (v0.z + v1.z + v2.z) / 3;

    if (classifyLobe(cx, cy, cz) === lobeId) {
      matchingFaces.push(v0, v1, v2);
    }
  }

  if (matchingFaces.length === 0) return null;

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(matchingFaces.length * 3);
  for (let i = 0; i < matchingFaces.length; i++) {
    vertices[i * 3] = matchingFaces[i].x;
    vertices[i * 3 + 1] = matchingFaces[i].y;
    vertices[i * 3 + 2] = matchingFaces[i].z;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Create all lobe meshes as a group
 */
export function createLobes() {
  const group = new THREE.Group();
  group.name = 'lobes';

  const palette = CATEGORIES.find(c => c.id === 'lobes').palette;
  const lobeIds = Object.keys(palette);

  // Create for both hemispheres
  for (const side of [-1, 1]) {
    const hemiGeo = createHemisphere(side);
    const sideName = side === 1 ? 'R' : 'L';

    for (const lobeId of lobeIds) {
      const lobeGeo = extractLobeGeometry(hemiGeo, lobeId);
      if (!lobeGeo) continue;

      const material = createBrainMaterial(palette[lobeId]);
      const mesh = new THREE.Mesh(lobeGeo, material);
      mesh.name = `lobe_${lobeId}_${sideName}`;
      mesh.userData = {
        regionId: `${lobeId}-lobe`,
        categoryId: 'lobes',
        colorKey: lobeId,
      };
      group.add(mesh);
    }

    hemiGeo.dispose();
  }

  return group;
}
