import * as THREE from 'three';
import { createTube, createTaperedTube } from '../utils/tubeHelpers.js';
import { CATEGORIES } from '../../data/categories.js';

const palette = CATEGORIES.find(c => c.id === 'vasculature').palette;

export function createVasculature() {
  const group = new THREE.Group();
  group.name = 'vasculature';

  // Anterior Cerebral Artery (ACA) - runs along medial surface frontward
  for (const side of [-1, 1]) {
    const s = side * 0.06;
    const aca = createTaperedTube([
      [s, -0.6, -0.1],
      [s, -0.45, 0.1],
      [s, -0.2, 0.3],
      [s, 0.05, 0.55],
      [s, 0.3, 0.65],
      [s, 0.55, 0.6],
      [s, 0.7, 0.4],
    ], 0.022, 0.008, palette.aca);
    aca.name = `aca_${side > 0 ? 'R' : 'L'}`;
    aca.userData = { regionId: 'aca', categoryId: 'vasculature', colorKey: 'aca' };
    group.add(aca);
  }

  // Middle Cerebral Artery (MCA) - runs laterally in Sylvian fissure
  for (const side of [-1, 1]) {
    const s = side;
    const mca = createTaperedTube([
      [0, -0.55, 0.0],
      [s * 0.15, -0.45, 0.05],
      [s * 0.35, -0.3, 0.1],
      [s * 0.55, -0.15, 0.12],
      [s * 0.7, -0.05, 0.05],
      [s * 0.8, 0.1, -0.05],
      [s * 0.75, 0.25, -0.1],
    ], 0.025, 0.009, palette.mca);
    mca.name = `mca_${side > 0 ? 'R' : 'L'}`;
    mca.userData = { regionId: 'mca', categoryId: 'vasculature', colorKey: 'mca' };
    group.add(mca);

    // MCA branches
    for (let b = 0; b < 3; b++) {
      const t = 0.4 + b * 0.2;
      const brPts = [];
      const startX = s * (0.35 + t * 0.35);
      const startY = -0.3 + t * 0.3;
      brPts.push([startX, startY, 0.1 - t * 0.05]);
      brPts.push([startX + s * 0.1, startY + 0.15, 0.05 + b * 0.05]);
      brPts.push([startX + s * 0.05, startY + 0.3, 0.1 + b * 0.03]);
      const branch = createTube(brPts, 0.006, palette.mca, 24);
      branch.name = `mca_branch_${b}_${side > 0 ? 'R' : 'L'}`;
      branch.userData = { regionId: 'mca', categoryId: 'vasculature', colorKey: 'mca' };
      group.add(branch);
    }
  }

  // Posterior Cerebral Artery (PCA) - wraps around to occipital
  for (const side of [-1, 1]) {
    const s = side * 0.08;
    const pca = createTaperedTube([
      [0, -0.6, -0.15],
      [s * 1.5, -0.5, -0.25],
      [s * 2.5, -0.35, -0.4],
      [s * 3, -0.15, -0.55],
      [s * 2.5, 0.05, -0.65],
      [s * 2, 0.2, -0.7],
    ], 0.02, 0.008, palette.pca);
    pca.name = `pca_${side > 0 ? 'R' : 'L'}`;
    pca.userData = { regionId: 'pca', categoryId: 'vasculature', colorKey: 'pca' };
    group.add(pca);
  }

  // Circle of Willis
  const willisPoints = [];
  const willisRadius = 0.2;
  for (let i = 0; i <= 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    willisPoints.push([
      Math.sin(angle) * willisRadius,
      -0.6,
      Math.cos(angle) * willisRadius * 0.7 - 0.1,
    ]);
  }
  const willis = createTube(willisPoints, 0.012, palette.circleOfWillis, 48);
  willis.name = 'circle_of_willis';
  willis.userData = { regionId: 'circle-of-willis', categoryId: 'vasculature', colorKey: 'circleOfWillis' };
  group.add(willis);

  // Basilar artery - midline, below brainstem
  const basilar = createTaperedTube([
    [0, -0.85, -0.3],
    [0, -0.75, -0.25],
    [0, -0.65, -0.15],
    [0, -0.58, -0.1],
  ], 0.018, 0.022, palette.basilarArtery);
  basilar.name = 'basilar_artery';
  basilar.userData = { regionId: 'basilar-artery', categoryId: 'vasculature', colorKey: 'basilarArtery' };
  group.add(basilar);

  // Vertebral arteries
  for (const side of [-1, 1]) {
    const s = side * 0.08;
    const vert = createTaperedTube([
      [s, -1.1, -0.35],
      [s, -1.0, -0.32],
      [s * 0.5, -0.9, -0.3],
      [0, -0.85, -0.3],
    ], 0.015, 0.018, palette.vertebralArtery);
    vert.name = `vertebral_${side > 0 ? 'R' : 'L'}`;
    vert.userData = { regionId: 'vertebral-artery', categoryId: 'vasculature', colorKey: 'vertebralArtery' };
    group.add(vert);
  }

  return group;
}
