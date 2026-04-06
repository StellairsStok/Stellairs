import { SceneManager } from '../interaction/SceneManager.js';
import { brainData } from '../data/brainData.js';
import { buildLayer } from '../brain/LayerBuilder.js';

const DEEP_CATEGORIES = new Set([
  'basal_ganglia', 'limbic', 'diencephalon', 'brainstem',
  'ventricles', 'cerebellum',
]);

export class App {
  constructor(root) {
    this.root = root;
    this.activeCategories = new Set();
    this._openDropdown = null;
    this._focusedItem = null;
    this._build();
  }

  _build() {
    this.root.innerHTML = `
      <div class="app-layout">
        <nav class="topbar" id="topbar">
          <span class="topbar-brand">BrainAtlas</span>
        </nav>
        <div class="main-area">
          <div class="viewport" id="viewport">
            <div class="loading-screen" id="loading">
              <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text" id="loading-text">正在加载大脑模型...</div>
              </div>
            </div>
          </div>
          <button class="back-btn" id="back-btn">\u2190 返回总览</button>
          <div class="lobe-legend" id="lobe-legend"></div>
          <div class="info-card" id="info-card"></div>
        </div>
        <div class="dropdown-overlay" id="dropdown-overlay"></div>
        <div class="dropdown-panel" id="dropdown-panel"></div>
      </div>
    `;

    document.getElementById('dropdown-overlay').addEventListener('click', () => {
      this._closeDropdown();
    });

    document.getElementById('back-btn').addEventListener('click', () => {
      this._unfocus();
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

      this.sceneManager.onStructureHover = (data) => this._onHover(data);
      this.sceneManager.onStructureClick = (data) => {
        if (data) this._focusStructure(data);
      };

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
    const topbar = document.getElementById('topbar');

    for (const category of brainData.categories) {
      let group;
      try {
        group = buildLayer(category, this.sceneManager);
      } catch (err) {
        console.error('Failed to build layer:', category.id, err);
        continue;
      }
      this.sceneManager.addLayer(category.id, group);

      if (category.default_visible) {
        this.activeCategories.add(category.id);
      }

      if (category.id === 'lobes') {
        this._buildLobeLegend(category);
      }

      // Top bar chip
      const chip = document.createElement('button');
      chip.className = 'category-chip' + (category.default_visible ? ' active' : '');
      chip.innerHTML = `${category.label_cn} <span class="chip-count">${category.structures.length}</span> <span class="chip-arrow">\u25BC</span>`;
      chip.dataset.categoryId = category.id;

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = this.activeCategories.has(category.id);

        if (isActive && this._openDropdown === category.id) {
          this._closeDropdown();
        } else if (isActive) {
          this._openCategoryDropdown(category, chip);
        } else {
          this.activeCategories.add(category.id);
          chip.classList.add('active');
          this.sceneManager.setLayerVisible(category.id, true);
          this._updateBrainOpacity();
          this._updateLobeLegend();
          this._openCategoryDropdown(category, chip);
        }
      });

      chip.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (this.activeCategories.has(category.id)) {
          this.activeCategories.delete(category.id);
          chip.classList.remove('active');
          chip.classList.remove('expanded');
          this.sceneManager.setLayerVisible(category.id, false);
          this._updateBrainOpacity();
          this._closeDropdown();
          this._updateLobeLegend();
        }
      });

      let lastTap = 0;
      chip.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300 && this.activeCategories.has(category.id)) {
          this.activeCategories.delete(category.id);
          chip.classList.remove('active');
          chip.classList.remove('expanded');
          this.sceneManager.setLayerVisible(category.id, false);
          this._updateBrainOpacity();
          this._closeDropdown();
          this._updateLobeLegend();
          e.preventDefault();
        }
        lastTap = now;
      });

      topbar.appendChild(chip);
      await new Promise(r => requestAnimationFrame(r));
    }

    this._updateBrainOpacity();
    this._updateLobeLegend();
  }

  _openCategoryDropdown(category, chipEl) {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('expanded'));
    chipEl.classList.add('expanded');

    this._openDropdown = category.id;
    const panel = document.getElementById('dropdown-panel');
    const overlay = document.getElementById('dropdown-overlay');

    panel.innerHTML = `
      <div class="dropdown-header">
        <div class="dropdown-title">
          <div class="dropdown-title-dot" style="background:${category.structures[0]?.color || '#999'}"></div>
          ${category.label_cn} \u00B7 ${category.label_en}
        </div>
        <button class="dropdown-close" id="dropdown-close-btn">\u2715</button>
      </div>
      <div class="structure-grid" id="structure-grid"></div>
    `;

    const grid = document.getElementById('structure-grid');
    for (const s of category.structures) {
      const item = document.createElement('div');
      item.className = 'structure-item';
      item.innerHTML = `
        <div class="structure-dot" style="background:${s.color}"></div>
        <div class="structure-item-info">
          <div class="structure-item-name">${s.name_cn}</div>
          <div class="structure-item-en">${s.name_en}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        this._focusStructure(s);
        this._closeDropdown();
      });
      grid.appendChild(item);
    }

    document.getElementById('dropdown-close-btn').addEventListener('click', () => {
      this.activeCategories.delete(category.id);
      chipEl.classList.remove('active');
      this.sceneManager.setLayerVisible(category.id, false);
      this._updateBrainOpacity();
      this._updateLobeLegend();
      this._closeDropdown();
    });

    panel.classList.add('open');
    overlay.classList.add('open');
  }

  _closeDropdown() {
    this._openDropdown = null;
    document.getElementById('dropdown-panel').classList.remove('open');
    document.getElementById('dropdown-overlay').classList.remove('open');
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('expanded'));
  }

  _buildLobeLegend(category) {
    const legend = document.getElementById('lobe-legend');
    let html = '<div class="legend-title">脑叶 Lobes</div>';
    for (const s of category.structures) {
      html += `<div class="legend-item" data-name="${s.name_en}">
        <div class="legend-color" style="background:${s.color}"></div>
        <div class="legend-name">${s.name_cn}</div>
      </div>`;
    }
    legend.innerHTML = html;

    legend.querySelectorAll('.legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.dataset.name;
        const struct = category.structures.find(s => s.name_en === name);
        if (struct) this._focusStructure(struct);
      });
    });
  }

  _updateLobeLegend() {
    const legend = document.getElementById('lobe-legend');
    if (this.activeCategories.has('lobes')) {
      legend.classList.add('visible');
    } else {
      legend.classList.remove('visible');
    }
  }

  _focusStructure(data) {
    this._focusedItem = data;
    this.sceneManager.focusOnStructure(data);
    document.getElementById('back-btn').classList.add('visible');
    this._showInfoCard(data);
  }

  _unfocus() {
    this._focusedItem = null;
    this.sceneManager.resetFocus();
    this._updateBrainOpacity();
    document.getElementById('back-btn').classList.remove('visible');
    document.getElementById('info-card').classList.remove('visible');
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
    if (this._focusedItem) return;
    if (!data) {
      document.getElementById('info-card').classList.remove('visible');
      return;
    }
    this._showInfoCard(data);
  }

  _showInfoCard(data) {
    const card = document.getElementById('info-card');
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
