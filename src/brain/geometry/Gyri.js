import * as THREE from 'three';
import { createHemisphere } from './BrainBase.js';
import { createBrainMaterial } from '../materials/BrainMaterials.js';
import { CATEGORIES } from '../../data/categories.js';

/**
 * Classify vertex into specific gyrus based on position
 */
function classifyGyrus(x, y, z) {
  const absX = Math.abs(x);

  // Central sulcus boundary
  const centralLine = 0.15 - y * 0.3;
  // Lateral sulcus boundary
  const lateralLine = -0.1 - z * 0.2;

  // Precentral gyrus - strip just anterior to central sulcus
  if (z > centralLine - 0.05 && z < centralLine + 0.12 && y > lateralLine && absX > 0.1) {
    return 'precentralGyrus';
  }

  // Postcentral gyrus - strip just posterior to central sulcus
  if (z > centralLine - 0.18 && z < centralLine - 0.03 && y > lateralLine && absX > 0.1) {
    return 'postcentralGyrus';
  }

  // Superior frontal gyrus
  if (z > 0.3 && y > 0.35 && absX > 0.05) {
    return 'superiorFrontalGyrus';
  }

  // Middle frontal gyrus
  if (z > 0.25 && y > 0.05 && y < 0.4 && absX > 0.2) {
    return 'middleFrontalGyrus';
  }

  // Inferior frontal gyrus
  if (z > 0.2 && y > lateralLine && y < 0.1 && absX > 0.3) {
    return 'inferiorFrontalGyrus';
  }

  // Superior temporal gyrus
  if (y < lateralLine && y > lateralLine - 0.18 && z > -0.4 && absX > 0.3) {
    return 'superiorTemporalGyrus';
  }

  // Middle temporal gyrus
  if (y < lateralLine - 0.15 && y > lateralLine - 0.35 && z > -0.4 && absX > 0.3) {
    return 'middleTemporalGyrus';
  }

  // Inferior temporal gyrus
  if (y < lateralLine - 0.3 && z > -0.4 && absX > 0.2) {
    return 'inferiorTemporalGyrus';
  }

  // Superior parietal lobule
  if (z < centralLine && z > -0.45 && y > 0.3 && absX > 0.1) {
    return 'superiorParietalLobule';
  }

  // Supramarginal gyrus
  if (z < centralLine - 0.1 && z > -0.35 && y > 0.05 && y < 0.35 && absX > 0.25) {
    return 'supramarginalGyrus';
  }

  // Angular gyrus
  if (z < -0.3 && z > -0.55 && y > 0.0 && y < 0.35 && absX > 0.2) {
    return 'angularGyrus';
  }

  // Inferior parietal lobule (remaining parietal)
  if (z < centralLine && z > -0.5 && y > lateralLine && absX > 0.15) {
    return 'inferiorParietalLobule';
  }

  // Cingulate gyrus - medial surface
  if (absX < 0.18 && y > 0.0 && y < 0.6 && z > -0.5 && z < 0.5) {
    return 'cingulateGyrus';
  }

  // Lingual gyrus - medial occipital
  if (z < -0.45 && absX < 0.25 && y < 0.2) {
    return 'lingualGyrus';
  }

  // Fusiform gyrus - bottom surface
  if (y < -0.35 && z > -0.5 && z < 0.1 && absX > 0.15) {
    return 'fusiformGyrus';
  }

  return 'superiorFrontalGyrus'; // default fallback
}

function extractGyrusGeometry(hemisphereGeo, gyrusId) {
  const pos = hemisphereGeo.attributes.position;
  const idx = hemisphereGeo.index;
  const faceCount = idx ? idx.count / 3 : pos.count / 3;
  const matchingFaces = [];

  for (let f = 0; f < faceCount; f++) {
    const i0 = idx ? idx.getX(f * 3) : f * 3;
    const i1 = idx ? idx.getX(f * 3 + 1) : f * 3 + 1;
    const i2 = idx ? idx.getX(f * 3 + 2) : f * 3 + 2;

    const cx = (pos.getX(i0) + pos.getX(i1) + pos.getX(i2)) / 3;
    const cy = (pos.getY(i0) + pos.getY(i1) + pos.getY(i2)) / 3;
    const cz = (pos.getZ(i0) + pos.getZ(i1) + pos.getZ(i2)) / 3;

    if (classifyGyrus(cx, cy, cz) === gyrusId) {
      matchingFaces.push(
        pos.getX(i0), pos.getY(i0), pos.getZ(i0),
        pos.getX(i1), pos.getY(i1), pos.getZ(i1),
        pos.getX(i2), pos.getY(i2), pos.getZ(i2),
      );
    }
  }

  if (matchingFaces.length === 0) return null;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(matchingFaces), 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function createGyri() {
  const group = new THREE.Group();
  group.name = 'gyri';

  const palette = CATEGORIES.find(c => c.id === 'gyri').palette;
  const gyrusIds = Object.keys(palette);

  for (const side of [-1, 1]) {
    const hemiGeo = createHemisphere(side);
    const sideName = side === 1 ? 'R' : 'L';

    for (const gyrusId of gyrusIds) {
      const geo = extractGyrusGeometry(hemiGeo, gyrusId);
      if (!geo) continue;

      const mesh = new THREE.Mesh(geo, createBrainMaterial(palette[gyrusId]));
      mesh.name = `gyrus_${gyrusId}_${sideName}`;
      mesh.userData = {
        regionId: gyrusId.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
        categoryId: 'gyri',
        colorKey: gyrusId,
      };
      group.add(mesh);
    }
    hemiGeo.dispose();
  }

  return group;
}
