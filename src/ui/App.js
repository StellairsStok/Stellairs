import { SceneManager } from '../interaction/SceneManager.js';
import {
  CATEGORIES,
  SURFACE_DYEING_REGIONS,
  INDEPENDENT_GEOMETRY_STRUCTURES,
} from '../data/brainData.js';
import { buildDeepLayer, buildSurfaceLabels } from '../brain/LayerBuilder.js';
import { paintBrain, paintBrainCombined, resetBrainColors } from '../brain/BrainPainter.js';

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
                <div class="loading-text" id="loading-text">\u6B63\u5728\u52A0\u8F7D\u5927\u8111\u6A21\u578B...</div>
              </div>
            </div>
          </div>
          <button class="back-btn" id="back-btn">\u2190 \u8FD4\u56DE\u603B\u89C8</button>
          <div class="lobe-legend" id="lobe-legend"></div>
          <div class="info-card" id="info-card"></div>
        </div>
        <div class="dropdown-overlay" id="dropdown-overlay"></div>
        <div class="dropdown-panel" id="dropdown-panel"></div>
      </div>
    `;

    document.getElementById('dropdown-overlay').addEventListener('click', () => this._closeDropdown());
    document.getElementById('back-btn').addEventListener('click', () => this._unfocus());

    requestAnimationFrame(() => requestAnimationFrame(() => this._init()));
  }

  async _init() {
    const viewport = document.getElementById('viewport');
    const loadingText = document.getElementById('loading-text');

    try {
      this.sceneManager = new SceneManager(viewport);

      loadingText.textContent = '\u6B63\u5728\u52A0\u8F7D\u5927\u8111\u6A21\u578B...';
      const modelUrl = new URL('brain.glb', window.location.href).href;
      await this.sceneManager.loadModel(modelUrl);

      loadingText.textContent = '\u6B63\u5728\u6784\u5EFA\u89E3\u5256\u7ED3\u6784...';
      await this._buildAll();

      this.sceneManager.onStructureHover = (data) => this._onHover(data);
      this.sceneManager.onStructureClick = (data) => { if (data) this._focusStructure(data); };

      const loading = document.getElementById('loading');
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 400);
      }
    } catch (err) {
      console.error('BrainAtlas Error:', err);
      if (loadingText) loadingText.textContent = '\u52A0\u8F7D\u5931\u8D25: ' + err.message;
    }
  }

  async _buildAll() {
    const topbar = document.getElementById('topbar');
    const surfaceIndex = new Map();
    SURFACE_DYEING_REGIONS.forEach(r => surfaceIndex.set(r.id, r));
    const deepIndex = new Map();
    INDEPENDENT_GEOMETRY_STRUCTURES.forEach(s => deepIndex.set(s.id, s));

    for (const cat of CATEGORIES) {
      const isSurface = cat.type === 'surface';

      if (isSurface) {
        // Build leader-line labels for surface regions
        const regions = (cat.regionIds || []).map(id => surfaceIndex.get(id)).filter(Boolean);
        const labelGroup = buildSurfaceLabels(regions, this.sceneManager);
        labelGroup.name = cat.id;
        labelGroup.visible = cat.default_visible;
        this.sceneManager.addLayer(cat.id + '_labels', labelGroup);
      } else {
        // Build 3D geometry for deep structures
        const structs = (cat.structureIds || []).map(id => deepIndex.get(id)).filter(Boolean);
        const group = buildDeepLayer(structs, this.sceneManager);
        group.name = cat.id;
        group.visible = cat.default_visible;
        this.sceneManager.addLayer(cat.id, group);
      }

      if (cat.default_visible) this.activeCategories.add(cat.id);

      if (cat.id === 'lobes') this._buildLobeLegend(cat);

      // Top bar chip
      const itemCount = isSurface ? (cat.regionIds?.length || 0) : (cat.structureIds?.length || 0);
      const chip = document.createElement('button');
      chip.className = 'category-chip' + (cat.default_visible ? ' active' : '');
      chip.innerHTML = `${cat.label_cn} <span class="chip-count">${itemCount}</span> <span class="chip-arrow">\u25BC</span>`;
      chip.dataset.categoryId = cat.id;

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = this.activeCategories.has(cat.id);
        if (isActive && this._openDropdown === cat.id) {
          this._closeDropdown();
        } else if (isActive) {
          this._openCategoryDropdown(cat, chip, isSurface, surfaceIndex, deepIndex);
        } else {
          this.activeCategories.add(cat.id);
          chip.classList.add('active');
          this._applyVisibility(cat, true);
          this._openCategoryDropdown(cat, chip, isSurface, surfaceIndex, deepIndex);
        }
      });

      const deactivate = () => {
        this.activeCategories.delete(cat.id);
        chip.classList.remove('active');
        chip.classList.remove('expanded');
        this._applyVisibility(cat, false);
        this._closeDropdown();
      };

      chip.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (this.activeCategories.has(cat.id)) deactivate();
      });

      let lastTap = 0;
      chip.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300 && this.activeCategories.has(cat.id)) {
          deactivate();
          e.preventDefault();
        }
        lastTap = now;
      });

      topbar.appendChild(chip);
      await new Promise(r => requestAnimationFrame(r));
    }

    // Initial paint & visibility
    this._repaintSurface();
    this._updateBrainOpacity();
    this._updateLobeLegend();
  }

  _applyVisibility(cat, visible) {
    if (cat.type === 'surface') {
      this.sceneManager.setLayerVisible(cat.id + '_labels', visible);
      this._repaintSurface();
    } else {
      this.sceneManager.setLayerVisible(cat.id, visible);
    }
    this._updateBrainOpacity();
    this._updateLobeLegend();
  }

  _repaintSurface() {
    if (!this.sceneManager.brainWrapper) return;
    const lobesActive = this.activeCategories.has('lobes');
    const corticalActive = this.activeCategories.has('cortical');

    if (lobesActive && corticalActive) {
      paintBrainCombined(this.sceneManager.brainWrapper);
    } else if (lobesActive) {
      paintBrain(this.sceneManager.brainWrapper, 'lobes');
    } else if (corticalActive) {
      paintBrain(this.sceneManager.brainWrapper, 'cortical');
    } else {
      resetBrainColors(this.sceneManager.brainWrapper);
    }
  }

  _openCategoryDropdown(cat, chipEl, isSurface, surfaceIndex, deepIndex) {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('expanded'));
    chipEl.classList.add('expanded');
    this._openDropdown = cat.id;

    const panel = document.getElementById('dropdown-panel');
    const overlay = document.getElementById('dropdown-overlay');

    panel.innerHTML = `
      <div class="dropdown-header">
        <div class="dropdown-title">${cat.label_cn} \u00B7 ${cat.label_en}</div>
        <button class="dropdown-close" id="dropdown-close-btn">\u2715</button>
      </div>
      <div class="structure-grid" id="structure-grid"></div>
    `;

    const grid = document.getElementById('structure-grid');
    const items = isSurface
      ? (cat.regionIds || []).map(id => surfaceIndex.get(id)).filter(Boolean)
      : this._flattenDeep(cat, deepIndex);

    for (const s of items) {
      const item = document.createElement('div');
      item.className = 'structure-item';
      item.innerHTML = `
        <div class="structure-dot" style="background:${s.color}"></div>
        <div class="structure-item-info">
          <div class="structure-item-name">${s.name}</div>
          <div class="structure-item-en">${s.name_en || ''}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        this._focusStructure(s);
        this._closeDropdown();
      });
      grid.appendChild(item);
    }

    document.getElementById('dropdown-close-btn').addEventListener('click', () => {
      this.activeCategories.delete(cat.id);
      chipEl.classList.remove('active');
      this._applyVisibility(cat, false);
      this._closeDropdown();
    });

    panel.classList.add('open');
    overlay.classList.add('open');
  }

  _flattenDeep(cat, deepIndex) {
    const result = [];
    for (const id of (cat.structureIds || [])) {
      const struct = deepIndex.get(id);
      if (!struct) continue;
      for (const inst of struct.instances) {
        result.push({
          ...struct,
          name: struct.name + (inst.suffix || ''),
          name_cn: struct.name + (inst.suffix || ''),
          position: inst.position || (inst.points ? inst.points[Math.floor(inst.points.length / 2)] : null),
          points: inst.points,
        });
      }
    }
    return result;
  }

  _closeDropdown() {
    this._openDropdown = null;
    document.getElementById('dropdown-panel').classList.remove('open');
    document.getElementById('dropdown-overlay').classList.remove('open');
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('expanded'));
  }

  _buildLobeLegend(cat) {
    const legend = document.getElementById('lobe-legend');
    const regions = SURFACE_DYEING_REGIONS.filter(r => r.category === 'lobes');
    let html = '<div class="legend-title">\u8111\u53F6 Lobes</div>';
    for (const r of regions) {
      html += `<div class="legend-item" data-id="${r.id}">
        <div class="legend-color" style="background:${r.color}"></div>
        <div class="legend-name">${r.name}</div>
      </div>`;
    }
    legend.innerHTML = html;
    legend.querySelectorAll('.legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const region = regions.find(r => r.id === item.dataset.id);
        if (region) this._focusStructure(region);
      });
    });
  }

  _updateLobeLegend() {
    const legend = document.getElementById('lobe-legend');
    legend.classList.toggle('visible', this.activeCategories.has('lobes'));
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
    this._repaintSurface();
    this._updateBrainOpacity();
    document.getElementById('back-btn').classList.remove('visible');
    document.getElementById('info-card').classList.remove('visible');
  }

  _updateBrainOpacity() {
    const deepCats = CATEGORIES.filter(c => c.type === 'deep');
    let needTransparent = false;
    for (const c of deepCats) {
      if (this.activeCategories.has(c.id)) { needTransparent = true; break; }
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
        <div class="info-name">${data.name_cn || data.name}</div>
        <div class="info-name-en">${data.name_en || ''}</div>
        ${data.description ? `<div class="info-desc">${data.description}</div>` : ''}
      </div>
    `;
    card.classList.add('visible');
  }

  dispose() {
    this.sceneManager?.dispose();
  }
}
