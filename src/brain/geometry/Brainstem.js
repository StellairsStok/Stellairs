import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { createBrainMaterial } from '../materials/BrainMaterials.js';
import { CATEGORIES } from '../../data/categories.js';

const noise3D = createNoise3D();
const palette = CATEGORIES.find(c => c.id === 'brainstem').palette;

function createDeformedEllipsoid(rx, ry, rz, detail = 32) {
  const geo = new THREE.SphereGeometry(1, detail, detail);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i) * rx;
    let y = pos.getY(i) * ry;
    let z = pos.getZ(i) * rz;
    // Add subtle surface noise
    const n = noise3D(x * 4, y * 4, z * 4) * 0.02;
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    x += (x / len) * n;
    y += (y / len) * n;
    z += (z / len) * n;
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createBrainstem() {
  const group = new THREE.Group();
  group.name = 'brainstem';

  // Midbrain - top of brainstem
  const midbrainGeo = createDeformedEllipsoid(0.12, 0.08, 0.1, 24);
  const midbrain = new THREE.Mesh(midbrainGeo, createBrainMaterial(palette.midbrain));
  midbrain.position.set(0, -0.5, -0.15);
  midbrain.name = 'midbrain';
  midbrain.userData = { regionId: 'midbrain', categoryId: 'brainstem', colorKey: 'midbrain' };
  group.add(midbrain);

  // Pons - middle, bulging
  const ponsGeo = createDeformedEllipsoid(0.14, 0.1, 0.13, 24);
  const pons = new THREE.Mesh(ponsGeo, createBrainMaterial(palette.pons));
  pons.position.set(0, -0.65, -0.2);
  pons.name = 'pons';
  pons.userData = { regionId: 'pons', categoryId: 'brainstem', colorKey: 'pons' };
  group.add(pons);

  // Medulla oblongata - bottom, tapering
  const medullaGeo = createDeformedEllipsoid(0.09, 0.12, 0.08, 24);
  const medulla = new THREE.Mesh(medullaGeo, createBrainMaterial(palette.medulla));
  medulla.position.set(0, -0.82, -0.22);
  medulla.name = 'medulla';
  medulla.userData = { regionId: 'medulla', categoryId: 'brainstem', colorKey: 'medulla' };
  group.add(medulla);

  // Cerebellum - behind and below
  // Anterior lobe
  const cerebAntGeo = createDeformedEllipsoid(0.35, 0.2, 0.22, 32);
  // Add horizontal folia grooves
  const antPos = cerebAntGeo.attributes.position;
  for (let i = 0; i < antPos.count; i++) {
    const y = antPos.getY(i);
    const groove = Math.sin(y * 30) * 0.008;
    const x = antPos.getX(i);
    const z = antPos.getZ(i);
    const len = Math.sqrt(x * x + z * z) || 1;
    antPos.setX(i, x + (x / len) * groove);
    antPos.setZ(i, z + (z / len) * groove);
  }
  cerebAntGeo.computeVertexNormals();

  const cerebAnt = new THREE.Mesh(cerebAntGeo, createBrainMaterial(palette.cerebellumAnterior));
  cerebAnt.position.set(0, -0.55, -0.5);
  cerebAnt.name = 'cerebellum_anterior';
  cerebAnt.userData = { regionId: 'cerebellum-anterior', categoryId: 'brainstem', colorKey: 'cerebellumAnterior' };
  group.add(cerebAnt);

  // Posterior lobe
  const cerebPostGeo = createDeformedEllipsoid(0.38, 0.22, 0.25, 32);
  const postPos = cerebPostGeo.attributes.position;
  for (let i = 0; i < postPos.count; i++) {
    const y = postPos.getY(i);
    const groove = Math.sin(y * 28) * 0.01;
    const x = postPos.getX(i);
    const z = postPos.getZ(i);
    const len = Math.sqrt(x * x + z * z) || 1;
    postPos.setX(i, x + (x / len) * groove);
    postPos.setZ(i, z + (z / len) * groove);
  }
  cerebPostGeo.computeVertexNormals();

  const cerebPost = new THREE.Mesh(cerebPostGeo, createBrainMaterial(palette.cerebellumPosterior));
  cerebPost.position.set(0, -0.7, -0.55);
  cerebPost.name = 'cerebellum_posterior';
  cerebPost.userData = { regionId: 'cerebellum-posterior', categoryId: 'brainstem', colorKey: 'cerebellumPosterior' };
  group.add(cerebPost);

  // Vermis - midline connecting structure
  const vermisGeo = createDeformedEllipsoid(0.06, 0.18, 0.2, 24);
  const vermis = new THREE.Mesh(vermisGeo, createBrainMaterial(palette.vermis));
  vermis.position.set(0, -0.62, -0.52);
  vermis.name = 'vermis';
  vermis.userData = { regionId: 'vermis', categoryId: 'brainstem', colorKey: 'vermis' };
  group.add(vermis);

  return group;
}
