import * as THREE from 'three';

/**
 * Paint brain surface vertices by anatomical region.
 * Maps MNI coordinates to model coordinates and assigns vertex colors.
 *
 * Model coordinate system (from GLB analysis):
 *   Model X = MNI X + 5.3  (left/right)
 *   Model Y = MNI Z + 90.1 (inferior/superior)
 *   Model Z = MNI Y + 32.2 (posterior/anterior)
 * Center: (5.3, 90.1, 32.2), Size: 214 x 180 x 172
 */

// MNI offset to model coords
const CX = 5.3, CY = 90.1, CZ = 32.2;

// Convert MNI to model space (before centering/scaling)
function mniToModel(mniX, mniY, mniZ) {
  return [mniX + CX, mniZ + CY, mniY + CZ];
}

/**
 * Brain region definitions using MNI coordinate boundaries.
 * Each region is defined by a test function on MNI coords.
 */
const SURFACE_REGIONS = [
  {
    id: 'frontal_l',
    name_cn: '额叶(左)', name_en: 'Frontal Lobe (L)',
    color: new THREE.Color('#4A90D9'),
    test: (x, y, z) => y > 0 && z > 10 && x < 0,
  },
  {
    id: 'frontal_r',
    name_cn: '额叶(右)', name_en: 'Frontal Lobe (R)',
    color: new THREE.Color('#4A90D9'),
    test: (x, y, z) => y > 0 && z > 10 && x > 0,
  },
  {
    id: 'parietal_l',
    name_cn: '顶叶(左)', name_en: 'Parietal Lobe (L)',
    color: new THREE.Color('#50B86C'),
    test: (x, y, z) => y > -65 && y <= 0 && z > 30 && x < 0,
  },
  {
    id: 'parietal_r',
    name_cn: '顶叶(右)', name_en: 'Parietal Lobe (R)',
    color: new THREE.Color('#50B86C'),
    test: (x, y, z) => y > -65 && y <= 0 && z > 30 && x > 0,
  },
  {
    id: 'temporal_l',
    name_cn: '颞叶(左)', name_en: 'Temporal Lobe (L)',
    color: new THREE.Color('#F5C242'),
    test: (x, y, z) => x < -25 && z < 10 && y > -65 && y < 10,
  },
  {
    id: 'temporal_r',
    name_cn: '颞叶(右)', name_en: 'Temporal Lobe (R)',
    color: new THREE.Color('#F5C242'),
    test: (x, y, z) => x > 25 && z < 10 && y > -65 && y < 10,
  },
  {
    id: 'occipital',
    name_cn: '枕叶', name_en: 'Occipital Lobe',
    color: new THREE.Color('#E05555'),
    test: (x, y, z) => y <= -65,
  },
  {
    id: 'insula_l',
    name_cn: '岛叶(左)', name_en: 'Insula (L)',
    color: new THREE.Color('#9B59B6'),
    test: (x, y, z) => x < -20 && x > -40 && z > -5 && z < 20 && y > -20 && y < 20,
  },
  {
    id: 'insula_r',
    name_cn: '岛叶(右)', name_en: 'Insula (R)',
    color: new THREE.Color('#9B59B6'),
    test: (x, y, z) => x > 20 && x < 40 && z > -5 && z < 20 && y > -20 && y < 20,
  },
];

// Cortical area marker positions (smaller spots on the surface)
const CORTICAL_MARKERS = [
  { id: 'M1', name_cn: '初级运动皮层 M1', name_en: 'Primary Motor Cortex', color: '#2E86C1', mni: [-38, -22, 56], radius: 12 },
  { id: 'S1', name_cn: '初级感觉皮层 S1', name_en: 'Primary Somatosensory', color: '#28B463', mni: [-42, -30, 54], radius: 12 },
  { id: 'V1', name_cn: '初级视觉皮层 V1', name_en: 'Primary Visual Cortex', color: '#E74C3C', mni: [-6, -82, 4], radius: 14 },
  { id: 'A1', name_cn: '初级听觉皮层 A1', name_en: 'Primary Auditory Cortex', color: '#F39C12', mni: [-48, -22, 8], radius: 10 },
  { id: 'broca', name_cn: 'Broca区', name_en: "Broca's Area", color: '#1ABC9C', mni: [-48, 20, 14], radius: 10 },
  { id: 'wernicke', name_cn: 'Wernicke区', name_en: "Wernicke's Area", color: '#16A085', mni: [-58, -42, 14], radius: 12 },
  { id: 'pfc', name_cn: '前额叶皮层', name_en: 'Prefrontal Cortex', color: '#5DADE2', mni: [-24, 56, 20], radius: 14 },
  { id: 'acc', name_cn: '前扣带皮层', name_en: 'Anterior Cingulate', color: '#EB984E', mni: [-4, 32, 24], radius: 10 },
  { id: 'angular', name_cn: '角回', name_en: 'Angular Gyrus', color: '#82E0AA', mni: [-46, -66, 32], radius: 10 },
  { id: 'fusiform', name_cn: '梭状回', name_en: 'Fusiform Gyrus', color: '#F1948A', mni: [-40, -50, -18], radius: 10 },
];

const DEFAULT_COLOR = new THREE.Color(0xe8ccc0); // skin/brain base color

/**
 * Paint the brain model's vertices with lobe colors.
 * @param {THREE.Group} brainWrapper - the wrapper group containing the model
 * @param {string} mode - 'lobes', 'cortical', 'none'
 * @param {Set} activeRegions - set of region IDs to paint (null = all)
 */
export function paintBrain(brainWrapper, mode, activeRegions = null) {
  brainWrapper.traverse((child) => {
    if (!child.isMesh) return;

    const geo = child.geometry;
    const posAttr = geo.getAttribute('position');
    if (!posAttr) return;

    const count = posAttr.count;

    // Create or get color attribute
    let colorAttr = geo.getAttribute('color');
    if (!colorAttr) {
      const colors = new Float32Array(count * 3);
      colorAttr = new THREE.BufferAttribute(colors, 3);
      geo.setAttribute('color', colorAttr);
    }

    const pos = new THREE.Vector3();

    // Vertex positions in GLB are in original model space.
    // Model coordinate system (from GLB bounding box analysis):
    //   Model X = MNI X + 5.3   (left/right)
    //   Model Y = MNI Z + 90.1  (inferior/superior)
    //   Model Z = MNI Y + 32.2  (posterior/anterior)
    // Inverse: MNI X = ModelX - CX, MNI Y = ModelZ - CZ, MNI Z = ModelY - CY

    for (let i = 0; i < count; i++) {
      pos.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));

      // Convert vertex model coords directly to MNI
      const mniX = pos.x - CX;    // model X → MNI X
      const mniY = pos.z - CZ;    // model Z → MNI Y
      const mniZ = pos.y - CY;    // model Y → MNI Z

      let color = DEFAULT_COLOR;

      if (mode === 'lobes' || mode === 'both') {
        for (const region of SURFACE_REGIONS) {
          if (activeRegions && !activeRegions.has(region.id)) continue;
          if (region.test(mniX, mniY, mniZ)) {
            color = region.color;
            break;
          }
        }
      }

      if (mode === 'cortical' || mode === 'both') {
        for (const marker of CORTICAL_MARKERS) {
          if (activeRegions && !activeRegions.has(marker.id)) continue;
          const [mx, my, mz] = marker.mni;
          const dist = Math.sqrt((mniX - mx) ** 2 + (mniY - my) ** 2 + (mniZ - mz) ** 2);
          if (dist < marker.radius) {
            const fade = 1 - (dist / marker.radius) * 0.3;
            color = new THREE.Color(marker.color).multiplyScalar(fade);
            break;
          }
        }
      }

      colorAttr.setXYZ(i, color.r, color.g, color.b);
    }

    colorAttr.needsUpdate = true;

    // Enable vertex colors on material
    child.material.vertexColors = true;
    child.material.needsUpdate = true;
    child.material.color.set(0xffffff); // neutral base so vertex colors show correctly
  });
}

/**
 * Reset brain to default color (no region painting).
 */
export function resetBrainColors(brainWrapper) {
  brainWrapper.traverse((child) => {
    if (!child.isMesh) return;
    const geo = child.geometry;
    const colorAttr = geo.getAttribute('color');
    if (colorAttr) {
      for (let i = 0; i < colorAttr.count; i++) {
        colorAttr.setXYZ(i, DEFAULT_COLOR.r, DEFAULT_COLOR.g, DEFAULT_COLOR.b);
      }
      colorAttr.needsUpdate = true;
    }
  });
}

/**
 * Get the lobe region at a given MNI coordinate (for hover detection).
 */
export function getRegionAtMNI(mniX, mniY, mniZ) {
  for (const region of SURFACE_REGIONS) {
    if (region.test(mniX, mniY, mniZ)) return region;
  }
  return null;
}

/**
 * Get cortical marker near an MNI coordinate.
 */
export function getCorticalAtMNI(mniX, mniY, mniZ) {
  for (const marker of CORTICAL_MARKERS) {
    const [mx, my, mz] = marker.mni;
    const dist = Math.sqrt((mniX - mx) ** 2 + (mniY - my) ** 2 + (mniZ - mz) ** 2);
    if (dist < marker.radius) return marker;
  }
  return null;
}

export { SURFACE_REGIONS, CORTICAL_MARKERS };
