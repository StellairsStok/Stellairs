import * as THREE from 'three';
import { SURFACE_DYEING_REGIONS } from '../data/brainData.js';

/**
 * Paint brain surface vertices by anatomical region.
 * Works directly in model coordinates — no MNI conversion needed.
 *
 * Model axes (same as Three.js): X=left/right, Y=bottom/top, Z=back/front.
 */

const DEFAULT_COLOR = new THREE.Color(0xe8ccc0);

// Pre-compute THREE.Color for each region
const regionColors = new Map();
for (const r of SURFACE_DYEING_REGIONS) {
  regionColors.set(r.id, new THREE.Color(r.color));
}

/**
 * Paint vertices matching the given category filter.
 * @param {THREE.Group} brainWrapper
 * @param {string} categoryFilter - 'lobes', 'cortical', or 'all'
 */
export function paintBrain(brainWrapper, categoryFilter = 'all') {
  const regions = SURFACE_DYEING_REGIONS.filter(r => {
    if (categoryFilter === 'all') return true;
    return r.category === categoryFilter;
  });

  brainWrapper.traverse((child) => {
    if (!child.isMesh) return;

    const geo = child.geometry;
    const posAttr = geo.getAttribute('position');
    if (!posAttr) return;

    const count = posAttr.count;

    // Create or get color attribute
    let colorAttr = geo.getAttribute('color');
    if (!colorAttr) {
      colorAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
      geo.setAttribute('color', colorAttr);
    }

    // First pass: fill with default color
    for (let i = 0; i < count; i++) {
      colorAttr.setXYZ(i, DEFAULT_COLOR.r, DEFAULT_COLOR.g, DEFAULT_COLOR.b);
    }

    // Second pass: paint matching regions
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      for (const region of regions) {
        if (region.test(x, y, z)) {
          const c = regionColors.get(region.id);
          colorAttr.setXYZ(i, c.r, c.g, c.b);
          break;
        }
      }
    }

    colorAttr.needsUpdate = true;

    // Enable vertex colors
    child.material.vertexColors = true;
    child.material.needsUpdate = true;
    child.material.color.set(0xffffff);
  });
}

/**
 * Paint with both lobes and cortical overlaid.
 * Lobes paint first; cortical areas override matching vertices.
 */
export function paintBrainCombined(brainWrapper) {
  const lobeRegions = SURFACE_DYEING_REGIONS.filter(r => r.category === 'lobes');
  const corticalRegions = SURFACE_DYEING_REGIONS.filter(r => r.category === 'cortical');

  brainWrapper.traverse((child) => {
    if (!child.isMesh) return;

    const geo = child.geometry;
    const posAttr = geo.getAttribute('position');
    if (!posAttr) return;

    const count = posAttr.count;

    let colorAttr = geo.getAttribute('color');
    if (!colorAttr) {
      colorAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
      geo.setAttribute('color', colorAttr);
    }

    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      let color = DEFAULT_COLOR;

      // Lobe layer (base)
      for (const region of lobeRegions) {
        if (region.test(x, y, z)) {
          color = regionColors.get(region.id);
          break;
        }
      }

      // Cortical layer (override)
      for (const region of corticalRegions) {
        if (region.test(x, y, z)) {
          color = regionColors.get(region.id);
          break;
        }
      }

      colorAttr.setXYZ(i, color.r, color.g, color.b);
    }

    colorAttr.needsUpdate = true;
    child.material.vertexColors = true;
    child.material.needsUpdate = true;
    child.material.color.set(0xffffff);
  });
}

/**
 * Reset brain to default unpainted color.
 * Also disables vertex colors so the material's own color shows.
 */
export function resetBrainColors(brainWrapper) {
  brainWrapper.traverse((child) => {
    if (!child.isMesh) return;
    const colorAttr = child.geometry.getAttribute('color');
    if (colorAttr) {
      for (let i = 0; i < colorAttr.count; i++) {
        colorAttr.setXYZ(i, DEFAULT_COLOR.r, DEFAULT_COLOR.g, DEFAULT_COLOR.b);
      }
      colorAttr.needsUpdate = true;
    }
    // Restore base color so brain is visible even without vertex colors
    child.material.vertexColors = false;
    child.material.color.setHex(0xe8cec2);
    child.material.needsUpdate = true;
  });
}
