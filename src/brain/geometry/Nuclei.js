import * as THREE from 'three';
import { createEllipsoid } from '../utils/tubeHelpers.js';
import { CATEGORIES } from '../../data/categories.js';

const palette = CATEGORIES.find(c => c.id === 'nuclei').palette;

export function createNuclei() {
  const group = new THREE.Group();
  group.name = 'nuclei';

  // Thalamus - two egg shapes flanking midline
  for (const side of [-1, 1]) {
    const thalamus = createEllipsoid(0.12, 0.09, 0.1, palette.thalamus);
    thalamus.position.set(side * 0.1, -0.15, -0.1);
    thalamus.name = `thalamus_${side > 0 ? 'R' : 'L'}`;
    thalamus.userData = { regionId: 'thalamus', categoryId: 'nuclei', colorKey: 'thalamus' };
    group.add(thalamus);
  }

  // Hypothalamus - below thalamus
  const hypothalamus = createEllipsoid(0.07, 0.05, 0.06, palette.hypothalamus);
  hypothalamus.position.set(0, -0.3, -0.05);
  hypothalamus.name = 'hypothalamus';
  hypothalamus.userData = { regionId: 'hypothalamus', categoryId: 'nuclei', colorKey: 'hypothalamus' };
  group.add(hypothalamus);

  // Caudate nucleus - C-shaped, use tube
  for (const side of [-1, 1]) {
    const s = side * 0.15;
    const caudateCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(s, -0.05, 0.25),
      new THREE.Vector3(s * 1.1, 0.0, 0.15),
      new THREE.Vector3(s * 1.2, -0.05, 0.0),
      new THREE.Vector3(s * 1.1, -0.15, -0.15),
      new THREE.Vector3(s * 0.9, -0.25, -0.2),
      new THREE.Vector3(s * 0.7, -0.3, -0.15),
    ]);
    const caudateGeo = new THREE.TubeGeometry(caudateCurve, 32, 0.035, 8, false);
    const caudate = new THREE.Mesh(caudateGeo, new THREE.MeshPhysicalMaterial({
      color: palette.caudate, roughness: 0.6, metalness: 0.05, clearcoat: 0.3,
    }));
    caudate.name = `caudate_${side > 0 ? 'R' : 'L'}`;
    caudate.userData = { regionId: 'caudate', categoryId: 'nuclei', colorKey: 'caudate' };
    group.add(caudate);
  }

  // Putamen - lens shaped, lateral to thalamus
  for (const side of [-1, 1]) {
    const putamen = createEllipsoid(0.04, 0.1, 0.08, palette.putamen);
    putamen.position.set(side * 0.25, -0.1, 0.0);
    putamen.name = `putamen_${side > 0 ? 'R' : 'L'}`;
    putamen.userData = { regionId: 'putamen', categoryId: 'nuclei', colorKey: 'putamen' };
    group.add(putamen);
  }

  // Globus pallidus - medial to putamen
  for (const side of [-1, 1]) {
    const gp = createEllipsoid(0.03, 0.08, 0.06, palette.globusPallidus);
    gp.position.set(side * 0.19, -0.1, -0.02);
    gp.name = `globus_pallidus_${side > 0 ? 'R' : 'L'}`;
    gp.userData = { regionId: 'globus-pallidus', categoryId: 'nuclei', colorKey: 'globusPallidus' };
    group.add(gp);
  }

  // Amygdala - in temporal lobe, almond-shaped
  for (const side of [-1, 1]) {
    const amygdala = createEllipsoid(0.04, 0.05, 0.04, palette.amygdala);
    amygdala.position.set(side * 0.25, -0.35, 0.1);
    amygdala.name = `amygdala_${side > 0 ? 'R' : 'L'}`;
    amygdala.userData = { regionId: 'amygdala', categoryId: 'nuclei', colorKey: 'amygdala' };
    group.add(amygdala);
  }

  // Hippocampus - curved elongated structure in medial temporal
  for (const side of [-1, 1]) {
    const s = side * 0.15;
    const hippoCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(s, -0.28, 0.15),
      new THREE.Vector3(s * 1.1, -0.25, 0.0),
      new THREE.Vector3(s * 1.2, -0.22, -0.15),
      new THREE.Vector3(s * 1.1, -0.2, -0.3),
    ]);
    const hippoGeo = new THREE.TubeGeometry(hippoCurve, 24, 0.04, 8, false);
    const hippo = new THREE.Mesh(hippoGeo, new THREE.MeshPhysicalMaterial({
      color: palette.hippocampus, roughness: 0.6, metalness: 0.05, clearcoat: 0.3,
    }));
    hippo.name = `hippocampus_${side > 0 ? 'R' : 'L'}`;
    hippo.userData = { regionId: 'hippocampus', categoryId: 'nuclei', colorKey: 'hippocampus' };
    group.add(hippo);
  }

  return group;
}
