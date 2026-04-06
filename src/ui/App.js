import { SceneManager } from '../interaction/SceneManager.js';
import { brainData } from '../data/brainData.js';
import { buildLayer } from '../brain/LayerBuilder.js';

// Categories that need the brain to be transparent
const DEEP_CATEGORIES = new Set([
  'basal_ganglia', 'limbic', 'diencephalon', 'brainstem',
  'ventricles', 'cerebellum',
]);

export class App {
  constructor(root) {
    this.root = root;
    this.activeCategories = new Set();
    this._build();
  }

  _build() {
    this.root.innerHTML = `
      <div class="app-layout">
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <h1 class="app-title">BrainAtlas</h1>
            <span class="app-subtitle">3D 大脑解剖</span>
          </div>
          <div class="layer-list" id="layer-list"></div>
        </aside>
        <div class="main-area">
          <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
          <div class="viewport" id="viewport">
            <div class="loading-screen" id="loading">
              <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text" id="loading-text">正在加载大脑模型...</div>
              </div>
            </div>
          </div>
          <div class="info-card" id="info-card"></div>
        </div>
      </div>
    `;

    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => this._init());
    });
  }

  async _init() {
    const viewport = document.getElementById('viewport');
    const loadingText = document.getElementById('loading-text');

    try {
      this.sceneManager = new SceneManager(viewport);

      loadingText.textContent = '正在加载大脑模型...';
      const modelUrl = new URL('brain.glb', window.location.href).href;
      await this.sceneManager.loadModel(modelUrl);

      loadingText.textContent = '正在构建解剖结构...';
      await this._buildLayers();

      // Setup hover interaction
      this.sceneManager.onStructureHover = (data) => this._onHover(data);
      this.sceneManager.onStructureClick = (data) => this._onHover(data);

      // Hide loading
      const loading = document.getElementById('loading');
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 400);
      }
    } catch (err) {
      console.error('BrainAtlas Error:', err);
      if (loadingText) loadingText.textContent = '加载失败: ' + err.message;
    }
  }

  async _buildLayers() {
    const listEl = document.getElementById('layer-list');

    for (const category of brainData.categories) {
      // Build 3D layer
      const group = buildLayer(category, this.sceneManager);
      this.sceneManager.addLayer(category.id, group);

      if (category.default_visible) {
        this.activeCategories.add(category.id);
      }

      // Build sidebar item
      const item = document.createElement('div');
      item.className = 'layer-item' + (category.default_visible ? ' active' : '');
      item.innerHTML = `
        <div class="layer-toggle">
          <div class="layer-checkbox ${category.default_visible ? 'checked' : ''}"></div>
          <div class="layer-info">
            <span class="layer-name">${category.label_cn}</span>
            <span class="layer-name-en">${category.label_en}</span>
          </div>
        </div>
        <div class="layer-count">${category.structures.length}</div>
      `;

      item.addEventListener('click', () => {
        const isActive = this.activeCategories.has(category.id);
        if (isActive) {
          this.activeCategories.delete(category.id);
          item.classList.remove('active');
          item.querySelector('.layer-checkbox').classList.remove('checked');
        } else {
          this.activeCategories.add(category.id);
          item.classList.add('active');
          item.querySelector('.layer-checkbox').classList.add('checked');
        }
        this.sceneManager.setLayerVisible(category.id, !isActive);
        this._updateBrainOpacity();
      });

      listEl.appendChild(item);

      // Yield to browser
      await new Promise(r => requestAnimationFrame(r));
    }

    this._updateBrainOpacity();
  }

  _updateBrainOpacity() {
    let needTransparent = false;
    for (const id of this.activeCategories) {
      if (DEEP_CATEGORIES.has(id)) {
        needTransparent = true;
        break;
      }
    }
    this.sceneManager.setBrainOpacity(needTransparent ? 0.15 : 1.0);
  }

  _onHover(data) {
    const card = document.getElementById('info-card');
    if (!data) {
      card.classList.remove('visible');
      return;
    }

    card.innerHTML = `
      <div class="info-dot" style="background:${data.color}"></div>
      <div class="info-body">
        <div class="info-name">${data.name_cn}</div>
        <div class="info-name-en">${data.name_en}</div>
        ${data.description ? `<div class="info-desc">${data.description}</div>` : ''}
      </div>
    `;
    card.classList.add('visible');
  }

  dispose() {
    this.sceneManager?.dispose();
  }
}
