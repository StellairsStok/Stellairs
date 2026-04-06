import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

/**
 * Multi-octave simplex noise for realistic cortical folding
 */
function fbm(x, y, z, octaves = 5, lacunarity = 2.0, gain = 0.5) {
  let value = 0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let maxVal = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise3D(x * frequency, y * frequency, z * frequency);
    maxVal += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return value / maxVal;
}

/**
 * Brain profile function - shapes the overall brain silhouette
 * using spherical coordinates
 */
function brainProfile(theta, phi) {
  let r = 1.0;
  // Flatten bottom
  r += 0.12 * Math.cos(phi);
  // Elongate front-to-back (anteroposterior)
  r += 0.08 * Math.cos(theta) * Math.sin(phi);
  // Widen laterally
  r += 0.05 * Math.sin(theta) * Math.sin(theta) * Math.sin(phi);
  // Frontal pole bulge
  const frontFactor = Math.max(0, Math.cos(theta - 0.3));
  r += 0.06 * frontFactor * frontFactor * Math.sin(phi);
  // Occipital tapering
  const backFactor = Math.max(0, Math.cos(theta + Math.PI * 0.8));
  r -= 0.04 * backFactor;
  // Temporal bulge (lower lateral)
  const tempFactor = Math.sin(phi) * Math.abs(Math.sin(theta));
  r += 0.04 * Math.max(0, tempFactor - 0.3) * Math.max(0, Math.cos(phi - 1.2));
  return r;
}

/**
 * Define major sulci as path functions that create indentations
 */
function sulcusDepth(x, y, z) {
  let depth = 0;

  // Central sulcus (Rolandic fissure) - vertical line near middle of lateral surface
  const centralSulcus = Math.exp(-80 * Math.pow(z - 0.15 + y * 0.3, 2)) *
    Math.max(0, Math.abs(x) - 0.1) * (1 - Math.abs(y - 0.3));
  depth += 0.06 * centralSulcus;

  // Lateral sulcus (Sylvian fissure) - horizontal on lateral surface
  const lateralSulcus = Math.exp(-60 * Math.pow(y + 0.1 + z * 0.2, 2)) *
    Math.max(0, Math.abs(x) - 0.2) * Math.max(0, -z + 0.3);
  depth += 0.07 * lateralSulcus;

  // Parieto-occipital sulcus - on medial surface
  const poSulcus = Math.exp(-50 * Math.pow(x, 2)) *
    Math.exp(-40 * Math.pow(z + 0.5 - y * 0.5, 2));
  depth += 0.05 * poSulcus;

  // Longitudinal fissure (midline)
  const longFissure = Math.exp(-30 * x * x) * Math.max(0, y - 0.1);
  depth += 0.08 * longFissure;

  // Calcarine sulcus - in occipital medial surface
  const calcarine = Math.exp(-50 * Math.pow(x, 2)) *
    Math.exp(-40 * Math.pow(y - 0.1, 2)) * Math.max(0, -(z + 0.3));
  depth += 0.04 * calcarine;

  return depth;
}

/**
 * Deform sphere geometry to create realistic brain hemisphere
 * @param {THREE.BufferGeometry} geometry - SphereGeometry to deform
 * @param {number} side - 1 for right hemisphere, -1 for left
 */
export function deformToBrain(geometry, side = 1) {
  const pos = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const count = pos.count;

  for (let i = 0; i < count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Convert to spherical for brain profile
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.atan2(z, x); // azimuthal angle
    const phi = Math.acos(Math.max(-1, Math.min(1, y / (r || 1)))); // polar angle

    // Apply brain profile
    let newR = r * brainProfile(theta, phi);

    // Scale: wider than tall, elongated front-to-back
    const sx = 0.82;
    const sy = 0.95;
    const sz = 1.08;

    x *= sx;
    y *= sy;
    z *= sz;

    // Apply sulcus indentations
    const sulcusD = sulcusDepth(x, y, z);

    // Normalize to get direction
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const nx = x / len;
    const ny = y / len;
    const nz = z / len;

    // Apply multi-scale cortical folding noise
    const fold1 = fbm(x * 3.5, y * 3.5, z * 3.5, 3, 2.0, 0.5) * 0.06;  // major folds
    const fold2 = fbm(x * 7.0, y * 7.0, z * 7.0, 3, 2.0, 0.45) * 0.025;  // secondary folds
    const fold3 = fbm(x * 14.0, y * 14.0, z * 14.0, 2, 2.0, 0.4) * 0.012; // fine detail
    const fold4 = fbm(x * 28.0, y * 28.0, z * 28.0, 2, 2.0, 0.35) * 0.005; // micro detail

    const totalDisp = (newR - r) / (r || 1) + fold1 + fold2 + fold3 + fold4 - sulcusD;

    x += nx * totalDisp * r;
    y += ny * totalDisp * r;
    z += nz * totalDisp * r;

    // Offset hemisphere to the side and flatten medial wall
    if (side !== 0) {
      // Flatten medial wall (x near 0)
      const medialFlatten = Math.max(0, 1 - Math.abs(x) * 8);
      x = x * (1 - medialFlatten * 0.7);
      // Shift hemisphere
      x += side * 0.08;
    }

    pos.setXYZ(i, x, y, z);
  }

  geometry.computeVertexNormals();
  pos.needsUpdate = true;
  return geometry;
}

/**
 * Classify which brain lobe a vertex belongs to based on position
 */
export function classifyLobe(x, y, z) {
  // Normalized spherical-ish coordinates
  const theta = Math.atan2(z, Math.abs(x) + 0.001);
  const elevation = y;

  // Insular - deep lateral position
  if (Math.abs(x) > 0.3 && Math.abs(x) < 0.55 && y > -0.2 && y < 0.3 && z > -0.2 && z < 0.3) {
    return 'insular';
  }

  // Limbic - medial surface
  if (Math.abs(x) < 0.15 && y > -0.3 && y < 0.5) {
    return 'limbic';
  }

  // Central sulcus boundary (divides frontal from parietal)
  const centralLine = 0.15 - y * 0.3;

  // Lateral sulcus boundary (divides temporal from frontal/parietal)
  const lateralLine = -0.1 - z * 0.2;

  // Temporal lobe - below lateral sulcus, lateral surface
  if (y < lateralLine && z > -0.5) {
    return 'temporal';
  }

  // Occipital lobe - posterior
  if (z < -0.55) {
    return 'occipital';
  }

  // Frontal lobe - anterior to central sulcus
  if (z > centralLine) {
    return 'frontal';
  }

  // Parietal lobe - posterior to central sulcus, above lateral sulcus
  return 'parietal';
}
