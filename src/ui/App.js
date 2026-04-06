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
      <div class="controls-hint" id="controls-hint">
        <span>拖动旋转 · 双指缩放</span>
      </div>
    `;

    this.viewportEl = document.getElementById('viewport');
    this.sceneManager = new SceneManager(this.viewportEl);
    this._loadBrain();
  }

  async _loadBrain() {
    const loading = document.getElementById('loading');
    const loadingText = loading?.querySelector('.loading-text');

    try {
      const basePath = import.meta.env.BASE_URL || './';
      const model = await this.sceneManager.loadModel(`${basePath}brain.glb`);
      this.brainModel = model;

      // Hide loading
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 500);
      }

      // Hide hint after a few seconds
      const hint = document.getElementById('controls-hint');
      if (hint) {
        setTimeout(() => {
          hint.classList.add('fade-out');
          setTimeout(() => hint.remove(), 500);
        }, 4000);
      }
    } catch (err) {
      console.error('Failed to load brain model:', err);
      if (loadingText) {
        loadingText.textContent = '加载失败，请刷新重试';
      }
    }
  }

  dispose() {
    this.sceneManager?.dispose();
  }
}
