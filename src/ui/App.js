import { SceneManager } from '../interaction/SceneManager.js';

export class App {
  constructor(root) {
    this.root = root;
    this._build();
  }

  _build() {
    this.root.innerHTML = `
      <header class="app-header">
        <h1 class="app-title">BrainAtlas</h1>
        <span class="app-subtitle">3D 大脑解剖</span>
      </header>
      <div class="viewport" id="viewport">
        <div class="loading-screen" id="loading">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">正在加载大脑模型...</div>
          </div>
        </div>
      </div>
    `;

    this.viewportEl = document.getElementById('viewport');
    this.sceneManager = new SceneManager(this.viewportEl);

    this._loadBrain();
  }

  async _loadBrain() {
    try {
      const basePath = import.meta.env.BASE_URL || '/';
      this.brainModel = await this.sceneManager.loadModel(`${basePath}brain.glb`);

      // Apply a nice brain material to all meshes
      this.brainModel.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          // Keep original material colors if they exist, otherwise set brain color
          if (!child.material.map) {
            child.material.color.setHex(0xd4a0a0);
          }
          child.material.roughness = 0.6;
          child.material.metalness = 0.05;
          child.material.side = 2; // DoubleSide
        }
      });

      // Hide loading screen
      const loading = document.getElementById('loading');
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 400);
      }
    } catch (err) {
      console.error('Failed to load brain model:', err);
      const loading = document.getElementById('loading');
      if (loading) {
        loading.querySelector('.loading-text').textContent = '模型加载失败，请刷新重试';
      }
    }
  }

  dispose() {
    this.sceneManager?.dispose();
  }
}
