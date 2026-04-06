import * as THREE from 'three';
import { createTube } from '../utils/tubeHelpers.js';
import { CATEGORIES } from '../../data/categories.js';

const palette = CATEGORIES.find(c => c.id === 'cranialNerves').palette;

// Cranial nerve origin points on brainstem and exit trajectories
const NERVE_PATHS = {
  cn1: { name: 'Olfactory', points: [[0.08, -0.38, 0.55], [0.08, -0.42, 0.7], [0.06, -0.45, 0.85]] },
  cn2: { name: 'Optic', points: [[0, -0.4, 0.3], [0, -0.42, 0.45], [0.05, -0.44, 0.6], [0.12, -0.45, 0.7]] },
  cn3: { name: 'Oculomotor', points: [[0.04, -0.48, -0.1], [0.06, -0.5, 0.0], [0.1, -0.52, 0.15], [0.13, -0.54, 0.3]] },
  cn4: { name: 'Trochlear', points: [[0.03, -0.45, -0.2], [0.05, -0.44, -0.12], [0.09, -0.46, 0.0], [0.13, -0.5, 0.15]] },
  cn5: { name: 'Trigeminal', points: [[0.12, -0.6, -0.15], [0.2, -0.58, -0.05], [0.3, -0.55, 0.1], [0.38, -0.52, 0.2]] },
  cn6: { name: 'Abducens', points: [[0.03, -0.65, -0.15], [0.06, -0.62, -0.05], [0.1, -0.58, 0.1], [0.14, -0.55, 0.25]] },
  cn7: { name: 'Facial', points: [[0.1, -0.68, -0.18], [0.16, -0.65, -0.08], [0.24, -0.6, 0.05], [0.32, -0.55, 0.15]] },
  cn8: { name: 'Vestibulocochlear', points: [[0.12, -0.68, -0.2], [0.18, -0.67, -0.15], [0.25, -0.65, -0.08], [0.3, -0.63, -0.02]] },
  cn9: { name: 'Glossopharyngeal', points: [[0.06, -0.78, -0.2], [0.1, -0.76, -0.12], [0.16, -0.73, 0.0], [0.2, -0.7, 0.1]] },
  cn10: { name: 'Vagus', points: [[0.05, -0.8, -0.2], [0.08, -0.82, -0.1], [0.1, -0.88, 0.0], [0.1, -0.95, 0.05], [0.1, -1.05, 0.0]] },
  cn11: { name: 'Accessory', points: [[0.04, -0.85, -0.22], [0.06, -0.9, -0.15], [0.06, -0.98, -0.1], [0.08, -1.05, -0.08]] },
  cn12: { name: 'Hypoglossal', points: [[0.06, -0.78, -0.18], [0.1, -0.78, -0.08], [0.15, -0.78, 0.05], [0.18, -0.78, 0.15]] },
};

export function createCranialNerves() {
  const group = new THREE.Group();
  group.name = 'cranialNerves';

  for (const [key, data] of Object.entries(NERVE_PATHS)) {
    for (const side of [-1, 1]) {
      const points = data.points.map(p => [p[0] * side, p[1], p[2]]);
      const nerve = createTube(points, 0.006, palette[key], 24);
      nerve.name = `${key}_${side > 0 ? 'R' : 'L'}`;
      nerve.userData = {
        regionId: key,
        categoryId: 'cranialNerves',
        colorKey: key,
      };
      group.add(nerve);
    }
  }

  return group;
}
