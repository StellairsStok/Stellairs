import * as THREE from 'three';
import { createTube } from '../utils/tubeHelpers.js';
import { CATEGORIES } from '../../data/categories.js';

const palette = CATEGORIES.find(c => c.id === 'whiteMatter').palette;

function whiteMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.5,
    metalness: 0.02,
    clearcoat: 0.2,
    transparent: true,
    opacity: 0.85,
  });
}

export function createWhiteMatter() {
  const group = new THREE.Group();
  group.name = 'whiteMatter';

  // Corpus callosum - wide arch connecting hemispheres
  const ccShape = new THREE.Shape();
  ccShape.moveTo(-0.35, 0);
  ccShape.quadraticCurveTo(-0.2, 0.12, 0, 0.14);
  ccShape.quadraticCurveTo(0.2, 0.12, 0.35, 0);
  ccShape.quadraticCurveTo(0.2, 0.04, 0, 0.05);
  ccShape.quadraticCurveTo(-0.2, 0.04, -0.35, 0);

  const ccGeo = new THREE.ExtrudeGeometry(ccShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 3,
  });
  ccGeo.center();
  const cc = new THREE.Mesh(ccGeo, whiteMaterial(palette.corpusCallosum));
  cc.position.set(0, 0.1, -0.05);
  cc.rotation.y = Math.PI / 2;
  cc.name = 'corpus_callosum';
  cc.userData = { regionId: 'corpus-callosum', categoryId: 'whiteMatter', colorKey: 'corpusCallosum' };
  group.add(cc);

  // Internal capsule - V-shaped structures
  for (const side of [-1, 1]) {
    const icShape = new THREE.Shape();
    icShape.moveTo(0, -0.08);
    icShape.lineTo(0.06, 0.08);
    icShape.lineTo(0.04, 0.08);
    icShape.lineTo(0, -0.04);
    icShape.lineTo(-0.04, 0.08);
    icShape.lineTo(-0.06, 0.08);
    icShape.closePath();

    const icGeo = new THREE.ExtrudeGeometry(icShape, {
      depth: 0.015,
      bevelEnabled: false,
    });
    icGeo.center();
    const ic = new THREE.Mesh(icGeo, whiteMaterial(palette.internalCapsule));
    ic.position.set(side * 0.16, -0.1, -0.05);
    ic.rotation.y = side > 0 ? 0.3 : -0.3;
    ic.name = `internal_capsule_${side > 0 ? 'R' : 'L'}`;
    ic.userData = { regionId: 'internal-capsule', categoryId: 'whiteMatter', colorKey: 'internalCapsule' };
    group.add(ic);
  }

  // Corona radiata - fan-shaped fiber array spreading upward
  for (const side of [-1, 1]) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 7 - 0.5) * 1.2;
      const fiber = createTube([
        [side * 0.16, -0.05, -0.05],
        [side * (0.16 + Math.sin(angle) * 0.15), 0.15, -0.05 + Math.cos(angle) * 0.1],
        [side * (0.16 + Math.sin(angle) * 0.25), 0.35, -0.05 + Math.cos(angle) * 0.15],
      ], 0.004, palette.coronaRadiata, 16);
      fiber.name = `corona_radiata_${i}_${side > 0 ? 'R' : 'L'}`;
      fiber.userData = { regionId: 'corona-radiata', categoryId: 'whiteMatter', colorKey: 'coronaRadiata' };
      group.add(fiber);
    }
  }

  // Arcuate fasciculus - arc connecting Broca's and Wernicke's
  for (const side of [-1, 1]) {
    const s = side * 0.3;
    const af = createTube([
      [s, -0.05, 0.3],
      [s * 1.1, 0.1, 0.15],
      [s * 1.1, 0.15, 0.0],
      [s * 1.05, 0.1, -0.15],
      [s, -0.05, -0.2],
    ], 0.008, palette.arcuateFasciculus, 32);
    af.name = `arcuate_fasciculus_${side > 0 ? 'R' : 'L'}`;
    af.userData = { regionId: 'arcuate-fasciculus', categoryId: 'whiteMatter', colorKey: 'arcuateFasciculus' };
    group.add(af);
  }

  return group;
}
