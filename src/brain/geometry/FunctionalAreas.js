import * as THREE from 'three';
import { createHemisphere } from './BrainBase.js';
import { createBrainMaterial } from '../materials/BrainMaterials.js';
import { CATEGORIES } from '../../data/categories.js';

function classifyFunctional(x, y, z) {
  const absX = Math.abs(x);
  const centralLine = 0.15 - y * 0.3;

  // Primary motor cortex - precentral strip
  if (z > centralLine - 0.03 && z < centralLine + 0.1 && y > -0.1 && absX > 0.1) {
    return 'motorCortex';
  }

  // Primary somatosensory cortex - postcentral strip
  if (z > centralLine - 0.15 && z < centralLine - 0.02 && y > -0.1 && absX > 0.1) {
    return 'sensoryCortex';
  }

  // Broca's area - left inferior frontal (only left hemisphere)
  if (x > 0.3 && z > 0.2 && z < 0.5 && y > -0.15 && y < 0.1) {
    return 'brocaArea';
  }

  // Wernicke's area - left posterior superior temporal
  if (x > 0.3 && y < -0.05 && y > -0.25 && z > -0.3 && z < 0.0) {
    return 'wernickeArea';
  }

  // Primary visual cortex - occipital pole
  if (z < -0.6 && absX < 0.35) {
    return 'visualCortex';
  }

  // Primary auditory cortex - superior temporal
  if (absX > 0.35 && y < -0.05 && y > -0.2 && z > -0.1 && z < 0.15) {
    return 'auditoryCortex';
  }

  // Prefrontal cortex - anterior frontal
  if (z > 0.5 && y > -0.2) {
    return 'prefrontal';
  }

  return null;
}

function extractFunctionalGeometry(hemisphereGeo, areaId) {
  const pos = hemisphereGeo.attributes.position;
  const idx = hemisphereGeo.index;
  const faceCount = idx ? idx.count / 3 : pos.count / 3;
  const verts = [];

  for (let f = 0; f < faceCount; f++) {
    const i0 = idx ? idx.getX(f * 3) : f * 3;
    const i1 = idx ? idx.getX(f * 3 + 1) : f * 3 + 1;
    const i2 = idx ? idx.getX(f * 3 + 2) : f * 3 + 2;

    const cx = (pos.getX(i0) + pos.getX(i1) + pos.getX(i2)) / 3;
    const cy = (pos.getY(i0) + pos.getY(i1) + pos.getY(i2)) / 3;
    const cz = (pos.getZ(i0) + pos.getZ(i1) + pos.getZ(i2)) / 3;

    if (classifyFunctional(cx, cy, cz) === areaId) {
      verts.push(
        pos.getX(i0), pos.getY(i0), pos.getZ(i0),
        pos.getX(i1), pos.getY(i1), pos.getZ(i1),
        pos.getX(i2), pos.getY(i2), pos.getZ(i2),
      );
    }
  }

  if (verts.length === 0) return null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
  geo.computeVertexNormals();
  return geo;
}

export function createFunctionalAreas() {
  const group = new THREE.Group();
  group.name = 'functional';

  const palette = CATEGORIES.find(c => c.id === 'functional').palette;
  const areaIds = Object.keys(palette);

  for (const side of [-1, 1]) {
    const hemiGeo = createHemisphere(side);
    const sideName = side === 1 ? 'R' : 'L';

    for (const areaId of areaIds) {
      const geo = extractFunctionalGeometry(hemiGeo, areaId);
      if (!geo) continue;

      const mesh = new THREE.Mesh(geo, createBrainMaterial(palette[areaId]));
      mesh.name = `func_${areaId}_${sideName}`;
      mesh.userData = {
        regionId: areaId.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
        categoryId: 'functional',
        colorKey: areaId,
      };
      group.add(mesh);
    }
    hemiGeo.dispose();
  }

  return group;
}
