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
            <div class="loading-text" id="loading-text">正在加载大脑模型...</div>
          </div>
        </div>
      </div>
    `;

    // Wait for layout to be ready before initializing Three.js
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._init();
      });
    });
  }

  async _init() {
    const viewport = document.getElementById('viewport');
    const loadingText = document.getElementById('loading-text');

    try {
      this.sceneManager = new SceneManager(viewport);

      // Use absolute URL based on current page location
      const modelUrl = new URL('brain.glb', window.location.href).href;
      this.brainModel = await this.sceneManager.loadModel(modelUrl);

      // Apply brain material
      this.brainModel.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          if (!child.material.map) {
            child.material.color.setHex(0xd4a0a0);
          }
          child.material.roughness = 0.6;
          child.material.metalness = 0.05;
          child.material.side = 2;
        }
      });

      // Hide loading
      const loading = document.getElementById('loading');
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 400);
      }
    } catch (err) {
      console.error('BrainAtlas Error:', err);
      if (loadingText) {
        loadingText.textContent = '加载失败: ' + err.message;
      }
    }
  }

  dispose() {
    this.sceneManager?.dispose();
  }
}
