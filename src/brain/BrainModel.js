import * as THREE from 'three';
import { createGhostBrain } from './geometry/BrainBase.js';
import { createLobes } from './geometry/Lobes.js';
import { createGyri } from './geometry/Gyri.js';
import { createVasculature } from './geometry/Vasculature.js';
import { createFunctionalAreas } from './geometry/FunctionalAreas.js';
import { createBrainstem } from './geometry/Brainstem.js';
import { createNuclei } from './geometry/Nuclei.js';
import { createVentricles } from './geometry/Ventricles.js';
import { createMeninges } from './geometry/Meninges.js';
import { createWhiteMatter } from './geometry/WhiteMatter.js';
import { createCranialNerves } from './geometry/CranialNerves.js';
import { CATEGORIES } from '../data/categories.js';

// Categories that show deep structures (need ghost brain context)
const DEEP_CATEGORIES = new Set([
  'nuclei', 'ventricles', 'whiteMatter', 'cranialNerves',
]);

const CATEGORY_BUILDERS = {
  lobes: createLobes,
  gyri: createGyri,
  vasculature: createVasculature,
  functional: createFunctionalAreas,
  brainstem: createBrainstem,
  nuclei: createNuclei,
  ventricles: createVentricles,
  meninges: createMeninges,
  whiteMatter: createWhiteMatter,
  cranialNerves: createCranialNerves,
};

export class BrainModel {
  constructor(scene) {
    this.scene = scene;
    this.categoryGroups = {};
    this.ghostBrain = null;
    this.activeCategory = null;
    this._tweens = [];
  }

  /**
   * Build all category geometry groups (called once at init)
   */
  async build(onProgress) {
    const categoryIds = CATEGORIES.map(c => c.id);
    const total = categoryIds.length + 1; // +1 for ghost brain
    let done = 0;

    // Build ghost brain first
    this.ghostBrain = createGhostBrain();
    this.scene.add(this.ghostBrain);
    done++;
    onProgress?.(done / total);

    // Build each category, yielding to the browser between each
    for (const id of categoryIds) {
      const builder = CATEGORY_BUILDERS[id];
      if (!builder) continue;

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          const group = builder();
          group.visible = false;
          this.scene.add(group);
          this.categoryGroups[id] = group;
          done++;
          onProgress?.(done / total);
          resolve();
        });
      });
    }
  }

  /**
   * Switch to a category - hides all others, shows selected
   */
  switchCategory(categoryId) {
    const prevCategory = this.activeCategory;
    this.activeCategory = categoryId;

    // Cancel running tweens
    this._tweens.forEach(t => cancelAnimationFrame(t));
    this._tweens = [];

    // Hide all categories
    for (const [id, group] of Object.entries(this.categoryGroups)) {
      if (id === categoryId) {
        group.visible = true;
        this._fadeIn(group);
      } else if (id === prevCategory) {
        this._fadeOut(group, () => { group.visible = false; });
      } else {
        group.visible = false;
        this._setGroupOpacity(group, 0);
      }
    }

    // Show ghost brain for deep structures
    const needGhost = DEEP_CATEGORIES.has(categoryId);
    this.ghostBrain.visible = needGhost;
  }

  /**
   * Get all visible meshes for raycasting
   */
  getInteractableMeshes() {
    const category = this.activeCategory;
    if (!category) return [];

    const group = this.categoryGroups[category];
    if (!group) return [];

    const meshes = [];
    group.traverse(child => {
      if (child.isMesh && child.userData.regionId) {
        meshes.push(child);
      }
    });
    return meshes;
  }

  _fadeIn(group, duration = 300) {
    const start = performance.now();
    const animate = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = t * (2 - t); // easeOutQuad
      this._setGroupOpacity(group, ease);
      if (t < 1) {
        const id = requestAnimationFrame(animate);
        this._tweens.push(id);
      }
    };
    animate();
  }

  _fadeOut(group, onComplete, duration = 250) {
    const start = performance.now();
    const animate = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - t * t; // easeInQuad
      this._setGroupOpacity(group, ease);
      if (t < 1) {
        const id = requestAnimationFrame(animate);
        this._tweens.push(id);
      } else {
        onComplete?.();
      }
    };
    animate();
  }

  _setGroupOpacity(group, opacity) {
    group.traverse(child => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        if (!mat._origOpacity) {
          mat._origOpacity = mat.opacity;
          mat._origTransparent = mat.transparent;
        }
        mat.transparent = true;
        mat.opacity = mat._origOpacity * opacity;
        mat.needsUpdate = true;
      }
    });
  }

  dispose() {
    this._tweens.forEach(t => cancelAnimationFrame(t));
    for (const group of Object.values(this.categoryGroups)) {
      group.traverse(child => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
    }
    if (this.ghostBrain) {
      this.ghostBrain.traverse(child => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
    }
  }
}
