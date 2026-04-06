import * as THREE from 'three';
import { deformToBrain } from '../utils/deformSphere.js';
import { CATEGORIES } from '../../data/categories.js';

const palette = CATEGORIES.find(c => c.id === 'meninges').palette;

function meningealMaterial(color, opacity) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.7,
    metalness: 0.0,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
    clearcoat: 0.2,
  });
}

function createMeningealShell(offset, color, opacity) {
  const group = new THREE.Group();

  for (const side of [-1, 1]) {
    const geo = new THREE.SphereGeometry(1 + offset, 64, 64,
      side === 1 ? 0 : Math.PI, Math.PI
    );
    deformToBrain(geo, side);

    // Scale up slightly to create offset
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      pos.setXYZ(i, x * (1 + offset), y * (1 + offset), z * (1 + offset));
    }
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, meningealMaterial(color, opacity));
    group.add(mesh);
  }

  return group;
}

export function createMeninges() {
  const group = new THREE.Group();
  group.name = 'meninges';

  // Pia mater - closest to brain surface
  const pia = createMeningealShell(0.01, palette.piaMater, 0.15);
  pia.name = 'pia_mater';
  pia.children.forEach(m => {
    m.userData = { regionId: 'pia-mater', categoryId: 'meninges', colorKey: 'piaMater' };
  });
  group.add(pia);

  // Arachnoid mater - middle layer
  const arachnoid = createMeningealShell(0.04, palette.arachnoid, 0.12);
  arachnoid.name = 'arachnoid';
  arachnoid.children.forEach(m => {
    m.userData = { regionId: 'arachnoid', categoryId: 'meninges', colorKey: 'arachnoid' };
  });
  group.add(arachnoid);

  // Dura mater - outermost layer
  const dura = createMeningealShell(0.07, palette.duraMater, 0.1);
  dura.name = 'dura_mater';
  dura.children.forEach(m => {
    m.userData = { regionId: 'dura-mater', categoryId: 'meninges', colorKey: 'duraMater' };
  });
  group.add(dura);

  return group;
}
