import { SceneManager } from '../interaction/SceneManager.js';
import {
  CATEGORIES,
  SURFACE_DYEING_REGIONS,
  INDEPENDENT_GEOMETRY_STRUCTURES,
} from '../data/brainData.js';
import { buildDeepLayer, buildSurfaceLabels } from '../brain/LayerBuilder.js';
import { paintBrain, paintBrainCombined, resetBrainColors } from '../brain/BrainPainter.js';

// SVG brain icon used in the topbar brand
const BRAIN_SVG = `
<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.8
           A3 3 0 0 1 4.5 9a2.5 2.5 0 0 1 5-1z"/>
  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.8
           A3 3 0 0 0 19.5 9a2.5 2.5 0 0 0-5-1z"/>
</svg>`;

// Human-readable category labels for tags in the info card
const CATEGORY_LABELS = {
  lobes:       '脑叶',
  cortical:    '皮层功能区',
  deep_nuclei: '深层核团',
  system:      '系统结构',
  accessory:   '附属结构',
};

export class App {
  constructor(root) {
    this.root = root;
    this.activeCategories = new Set();
    this._openDropdown    = null;
    this._focusedItem     = null;
    this._build();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DOM scaffold
  // ──────────────────────────────────────────────────────────────────────────
  _build() {
    this.root.innerHTML = `
      <div class="app-layout">

        <nav class="topbar" id="topbar">
          <div class="topbar-brand">
            <div class="topbar-brand-icon">${BRAIN_SVG}</div>
            <div>
              <div class="topbar-brand-text">BrainAtlas</div>
              <div class="topbar-brand-sub">3D Interactive</div>
            </div>
          </div>
          <div class="topbar-divider"></div>
          <!-- category chips injected dynamically -->
        </nav>

        <div class="main-area">
          <div class="viewport" id="viewport">
            <div class="loading-screen" id="loading">
              <div class="loading-content">
                <div class="loading-brain">
                  <div class="loading-brain-ring"></div>
                  <div class="loading-brain-ring"></div>
                  <div class="loading-brain-ring"></div>
                </div>
                <div class="loading-info">
                  <div class="loading-title">BrainAtlas 3D</div>
                  <div class="loading-text" id="loading-text">正在加载大脑模型…</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Back button (shown when a structure is focused) -->
          <button class="back-btn" id="back-btn" aria-label="返回总览">
            <span class="back-icon">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                   stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <polyline points="6.5,1.5 2.5,5 6.5,8.5"/>
              </svg>
            </span>
            返回总览
          </button>

          <!-- Lobe colour legend -->
          <div class="lobe-legend" id="lobe-legend"></div>

          <!-- Hover / focus info card -->
          <div class="info-card" id="info-card" role="status" aria-live="polite"></div>

          <!-- Keyboard hint -->
          <div class="hint-badge" id="hint-badge">
            拖拽旋转 · 滚轮缩放 · <kbd>ESC</kbd> 退出聚焦
          </div>
        </div>

        <div class="dropdown-overlay" id="dropdown-overlay"></div>
        <div class="dropdown-panel"  id="dropdown-panel"></div>
      </div>
    `;

    document.getElementById('dropdown-overlay')
      .addEventListener('click', () => this._closeDropdown());
    document.getElementById('back-btn')
      .addEventListener('click', () => this._unfocus());

    // ESC key: exit focus or close dropdown
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this._focusedItem) this._unfocus();
        else if (this._openDropdown) this._closeDropdown();
      }
    });

    requestAnimationFrame(() => requestAnimationFrame(() => this._init()));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Async initialisation
  // ──────────────────────────────────────────────────────────────────────────
  async _init() {
    const viewport    = document.getElementById('viewport');
    const loadingText = document.getElementById('loading-text');

    try {
      this.sceneManager = new SceneManager(viewport);

      loadingText.textContent = '正在加载大脑模型…';
      const modelUrl = new URL('brain.glb', window.location.href).href;
      await this.sceneManager.loadModel(modelUrl);

      loadingText.textContent = '正在构建解剖结构…';
      await this._buildAll();

      this.sceneManager.onStructureHover = (data) => this._onHover(data);
      this.sceneManager.onStructureClick = (data) => { if (data) this._focusStructure(data); };

      const loading = document.getElementById('loading');
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 500);
      }
    } catch (err) {
      console.error('BrainAtlas Error:', err);
      if (loadingText) loadingText.textContent = '加载失败: ' + err.message;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Build all categories & UI chips
  // ──────────────────────────────────────────────────────────────────────────
  async _buildAll() {
    const topbar = document.getElementById('topbar');
    const surfaceIndex = new Map(SURFACE_DYEING_REGIONS.map(r => [r.id, r]));
    const deepIndex    = new Map(INDEPENDENT_GEOMETRY_STRUCTURES.map(s => [s.id, s]));

    for (const cat of CATEGORIES) {
      const isSurface = cat.type === 'surface';

      if (isSurface) {
        const regions    = (cat.regionIds || []).map(id => surfaceIndex.get(id)).filter(Boolean);
        const labelGroup = buildSurfaceLabels(regions, this.sceneManager);
        labelGroup.name  = cat.id;
        labelGroup.visible = cat.default_visible;
        this.sceneManager.addLayer(cat.id + '_labels', labelGroup);
      } else {
        const structs = (cat.structureIds || []).map(id => deepIndex.get(id)).filter(Boolean);
        const group   = buildDeepLayer(structs, this.sceneManager);
        group.name    = cat.id;
        group.visible = cat.default_visible;
        this.sceneManager.addLayer(cat.id, group);
      }

      if (cat.default_visible) this.activeCategories.add(cat.id);
      if (cat.id === 'lobes') this._buildLobeLegend();

      // ── Top-bar chip ──
      const itemCount = isSurface
        ? (cat.regionIds?.length ?? 0)
        : (cat.structureIds?.length ?? 0);

      const chip = document.createElement('button');
      chip.className    = 'category-chip' + (cat.default_visible ? ' active' : '');
      chip.dataset.categoryId = cat.id;
      chip.innerHTML    = `${cat.label_cn}` +
        `<span class="chip-count">${itemCount}</span>` +
        `<span class="chip-arrow">&#9660;</span>`;

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
        chip.classList.remove('active', 'expanded');
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

    this._repaintSurface();
    this._updateBrainOpacity();
    this._updateLobeLegend();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Visibility helpers
  // ──────────────────────────────────────────────────────────────────────────
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
    const lobesOn    = this.activeCategories.has('lobes');
    const corticalOn = this.activeCategories.has('cortical');

    if (lobesOn && corticalOn) {
      paintBrainCombined(this.sceneManager.brainWrapper);
    } else if (lobesOn) {
      paintBrain(this.sceneManager.brainWrapper, 'lobes');
    } else if (corticalOn) {
      paintBrain(this.sceneManager.brainWrapper, 'cortical');
    } else {
      resetBrainColors(this.sceneManager.brainWrapper);
    }
  }

  _updateBrainOpacity() {
    const deepActive = CATEGORIES
      .filter(c => c.type === 'deep')
      .some(c => this.activeCategories.has(c.id));
    this.sceneManager.setBrainOpacity(deepActive ? 0.14 : 1.0);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Dropdown panel
  // ──────────────────────────────────────────────────────────────────────────
  _openCategoryDropdown(cat, chipEl, isSurface, surfaceIndex, deepIndex) {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('expanded'));
    chipEl.classList.add('expanded');
    this._openDropdown = cat.id;

    const panel   = document.getElementById('dropdown-panel');
    const overlay = document.getElementById('dropdown-overlay');

    panel.innerHTML = `
      <div class="dropdown-header">
        <div class="dropdown-title">${cat.label_cn} · ${cat.label_en}</div>
        <button class="dropdown-close" id="dp-close" aria-label="关闭">✕</button>
      </div>
      <div class="structure-grid" id="structure-grid"></div>
    `;

    const grid  = document.getElementById('structure-grid');
    const items = isSurface
      ? (cat.regionIds || []).map(id => surfaceIndex.get(id)).filter(Boolean)
      : this._flattenDeep(cat, deepIndex);

    for (const s of items) {
      const item = document.createElement('div');
      item.className  = 'structure-item';
      item.innerHTML  = `
        <div class="structure-dot" style="background:${s.color}"></div>
        <div class="structure-item-info">
          <div class="structure-item-name">${s.name}</div>
          <div class="structure-item-en">${s.name_en || ''}</div>
        </div>`;
      item.addEventListener('click', () => {
        this._focusStructure(s);
        this._closeDropdown();
      });
      grid.appendChild(item);
    }

    document.getElementById('dp-close').addEventListener('click', () => {
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
          name:    struct.name + (inst.suffix || ''),
          name_cn: struct.name + (inst.suffix || ''),
          position: inst.position
            || (inst.points ? inst.points[Math.floor(inst.points.length / 2)] : null),
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

  // ──────────────────────────────────────────────────────────────────────────
  // Lobe legend
  // ──────────────────────────────────────────────────────────────────────────
  _buildLobeLegend() {
    const legend  = document.getElementById('lobe-legend');
    const regions = SURFACE_DYEING_REGIONS.filter(r => r.category === 'lobes');
    let html = '<div class="legend-title">脑叶 Lobes</div>';
    for (const r of regions) {
      html += `
        <div class="legend-item" data-id="${r.id}">
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

  // ──────────────────────────────────────────────────────────────────────────
  // Focus / unfocus
  // ──────────────────────────────────────────────────────────────────────────
  _focusStructure(data) {
    this._focusedItem = data;
    this.sceneManager.focusOnStructure(data);
    document.getElementById('back-btn').classList.add('visible');
    this._showInfoCard(data, true);
  }

  _unfocus() {
    this._focusedItem = null;
    this.sceneManager.resetFocus();
    this._repaintSurface();
    this._updateBrainOpacity();
    document.getElementById('back-btn').classList.remove('visible');
    document.getElementById('info-card').classList.remove('visible');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Hover
  // ──────────────────────────────────────────────────────────────────────────
  _onHover(data) {
    if (this._focusedItem) return;
    if (!data) {
      document.getElementById('info-card').classList.remove('visible');
      return;
    }
    this._showInfoCard(data, false);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Info card
  // ──────────────────────────────────────────────────────────────────────────
  _showInfoCard(data, pinned = false) {
    const card = document.getElementById('info-card');
    const categoryLabel = CATEGORY_LABELS[data.categoryId] || '';

    card.innerHTML = `
      <div class="info-swatch" style="background:${data.color}"></div>
      <div class="info-body">
        <div class="info-name">${data.name_cn || data.name}</div>
        <div class="info-name-en">${data.name_en || ''}</div>
        ${data.description
          ? `<div class="info-desc">${data.description}</div>`
          : ''}
        ${categoryLabel
          ? `<div class="info-tag">${categoryLabel}</div>`
          : ''}
      </div>`;
    card.classList.add('visible');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Cleanup
  // ──────────────────────────────────────────────────────────────────────────
  dispose() {
    this.sceneManager?.dispose();
  }
}
