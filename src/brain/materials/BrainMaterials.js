import * as THREE from 'three';

/**
 * Create a high-quality PBR material for brain tissue
 */
export function createBrainMaterial(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: options.roughness ?? 0.65,
    metalness: options.metalness ?? 0.05,
    clearcoat: options.clearcoat ?? 0.4,
    clearcoatRoughness: options.clearcoatRoughness ?? 0.3,
    sheen: options.sheen ?? 0.3,
    sheenColor: options.sheenColor ?? new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.3),
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
    side: options.side ?? THREE.FrontSide,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
  });
}

/**
 * Create a ghost/transparent material for context brain outline
 */
export function createGhostMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xccccdd,
    roughness: 0.8,
    metalness: 0.0,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

/**
 * Create highlight material for selected region
 */
export function createHighlightMaterial(baseColor) {
  const color = new THREE.Color(baseColor);
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    emissive: color,
    emissiveIntensity: 0.3,
  });
}
