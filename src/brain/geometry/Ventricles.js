import * as THREE from 'three';
import { CATEGORIES } from '../../data/categories.js';

const palette = CATEGORIES.find(c => c.id === 'ventricles').palette;

function ventricleMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.3,
    metalness: 0.05,
    transparent: true,
    opacity: 0.45,
    clearcoat: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

export function createVentricles() {
  const group = new THREE.Group();
  group.name = 'ventricles';

  // Lateral ventricles - C-shaped tubes
  for (const side of [-1, 1]) {
    const s = side * 0.1;
    const latCurve = new THREE.CatmullRomCurve3([
      // Anterior horn (frontal)
      new THREE.Vector3(s, -0.05, 0.3),
      new THREE.Vector3(s * 1.2, 0.0, 0.2),
      // Body
      new THREE.Vector3(s * 1.3, 0.02, 0.05),
      new THREE.Vector3(s * 1.2, 0.0, -0.1),
      // Atrium
      new THREE.Vector3(s * 1.1, -0.05, -0.25),
      // Posterior horn (occipital)
      new THREE.Vector3(s * 0.9, -0.03, -0.4),
      // Inferior horn (temporal) - curves down
      new THREE.Vector3(s * 1.1, -0.1, -0.25),
      new THREE.Vector3(s * 1.3, -0.2, -0.1),
      new THREE.Vector3(s * 1.2, -0.28, 0.05),
    ]);

    const latGeo = new THREE.TubeGeometry(latCurve, 48, 0.04, 8, false);
    const colorKey = side > 0 ? 'lateralVentricleR' : 'lateralVentricleL';
    const lat = new THREE.Mesh(latGeo, ventricleMaterial(palette[colorKey]));
    lat.name = `lateral_ventricle_${side > 0 ? 'R' : 'L'}`;
    lat.userData = {
      regionId: side > 0 ? 'lateral-ventricle-r' : 'lateral-ventricle-l',
      categoryId: 'ventricles',
      colorKey,
    };
    group.add(lat);
  }

  // Third ventricle - thin vertical slab between thalami
  const thirdGeo = new THREE.BoxGeometry(0.01, 0.12, 0.12, 1, 8, 8);
  // Round it a bit
  const thirdPos = thirdGeo.attributes.position;
  for (let i = 0; i < thirdPos.count; i++) {
    const y = thirdPos.getY(i);
    const z = thirdPos.getZ(i);
    const r = Math.sqrt(y * y + z * z);
    const maxR = 0.08;
    if (r > maxR) {
      const scale = maxR / r;
      thirdPos.setY(i, y * scale);
      thirdPos.setZ(i, z * scale);
    }
  }
  thirdGeo.computeVertexNormals();

  const third = new THREE.Mesh(thirdGeo, ventricleMaterial(palette.thirdVentricle));
  third.position.set(0, -0.18, -0.08);
  third.name = 'third_ventricle';
  third.userData = { regionId: 'third-ventricle', categoryId: 'ventricles', colorKey: 'thirdVentricle' };
  group.add(third);

  // Cerebral aqueduct - thin tube connecting 3rd and 4th
  const aqCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.25, -0.1),
    new THREE.Vector3(0, -0.35, -0.15),
    new THREE.Vector3(0, -0.45, -0.18),
  ]);
  const aqGeo = new THREE.TubeGeometry(aqCurve, 16, 0.008, 6, false);
  const aq = new THREE.Mesh(aqGeo, ventricleMaterial(palette.cerebralAqueduct));
  aq.name = 'cerebral_aqueduct';
  aq.userData = { regionId: 'cerebral-aqueduct', categoryId: 'ventricles', colorKey: 'cerebralAqueduct' };
  group.add(aq);

  // Fourth ventricle - diamond/tent shape behind brainstem
  const fourthGeo = new THREE.OctahedronGeometry(0.06, 1);
  fourthGeo.scale(1, 0.8, 1.2);
  const fourth = new THREE.Mesh(fourthGeo, ventricleMaterial(palette.fourthVentricle));
  fourth.position.set(0, -0.55, -0.3);
  fourth.name = 'fourth_ventricle';
  fourth.userData = { regionId: 'fourth-ventricle', categoryId: 'ventricles', colorKey: 'fourthVentricle' };
  group.add(fourth);

  return group;
}
