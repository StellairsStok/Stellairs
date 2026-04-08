import * as THREE from 'three';
import { SceneManager } from '../interaction/SceneManager.js';
import { StructureRenderer } from '../brain/StructureRenderer.js';
import { BRAIN_DATA } from '../data/brain-structures.js';

export class App {
  constructor(root) {
    this.root = root;
    this.activeCategory = null;
    this._selectedMesh = null;
    this._origMat = null;
    this._pointerDown = null;
    this._build();
  }

  _build() {
    // Build sidebar items
    const sidebarItems = BRAIN_DATA.map(cat => `
      <button class="cat-btn" data-id="${cat.id}">
        <span class="cat-dot" style="background:${cat.structures?.[0]?.color || cat.tubes?.[0]?.color || cat.shells?.[0]?.color || '#888'}"></span>
        <span class="cat-label">${cat.label_cn}</span>
        <span class="cat-en">${cat.label_en}</span>
      </button>
    `).join('');

    this.root.innerHTML = `
      <div class="viewport" id="viewport">
        <div class="loading-screen" id="loading">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">正在加载大脑模型...</div>
          </div>
        </div>
      </div>
      <header class="app-header">
        <h1 class="app-title">BrainAtlas</h1>
        <button class="menu-btn" id="menuBtn">☰</button>
      </header>
      <div class="sidebar" id="sidebar">
        <div class="sidebar-head">
          <span>图层选择</span>
          <button class="sidebar-close" id="sidebarClose">✕</button>
        </div>
        <div class="sidebar-list">${sidebarItems}</div>
      </div>
      <div class="info-card" id="infoCard"></div>
    `;

    this.viewportEl = document.getElementById('viewport');
    this.sidebar = document.getElementById('sidebar');
    this.infoCard = document.getElementById('infoCard');

    // Menu toggle
    document.getElementById('menuBtn').addEventListener('click', () => {
      this.sidebar.classList.toggle('open');
    });
    document.getElementById('sidebarClose').addEventListener('click', () => {
      this.sidebar.classList.remove('open');
    });

    // Category buttons
    this.sidebar.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this._switchCategory(id);
        this.sidebar.classList.remove('open');
      });
    });

    // Scene
    this.sceneManager = new SceneManager(this.viewportEl);

    // Pointer events for raycasting
    const canvas = this.sceneManager.renderer.domElement;
    canvas.addEventListener('pointerdown', e => {
      this._pointerDown = { x: e.clientX, y: e.clientY, t: Date.now() };
    });
    canvas.addEventListener('pointerup', e => this._onPointerUp(e));

    this._loadBrain();
  }

  async _loadBrain() {
    const loading = document.getElementById('loading');
    try {
      const basePath = import.meta.env.BASE_URL || './';
      await this.sceneManager.loadModel(`${basePath}brain.glb`);

      // Build structures
      this.structureRenderer = new StructureRenderer(
        this.sceneManager.scene,
        this.sceneManager.scaleFactor
      );
      this.structureRenderer.buildAll();

      // Default to lobes
      this._switchCategory('lobes');

      // Hide loading
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 500);
      }
    } catch (err) {
      console.error('Failed to load brain:', err);
      const txt = loading?.querySelector('.loading-text');
      if (txt) txt.textContent = '加载失败，请刷新重试';
    }
  }

  _switchCategory(catId) {
    this.activeCategory = catId;
    this._deselect();

    // Update sidebar active state
    this.sidebar.querySelectorAll('.cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === catId);
    });

    // Show structures
    this.structureRenderer.showCategory(catId);

    // Set brain opacity
    const cat = BRAIN_DATA.find(c => c.id === catId);
    this.sceneManager.setBrainOpacity(cat?.brainOpacity ?? 0.5);
  }

  _onPointerUp(e) {
    if (!this._pointerDown) return;
    const dx = e.clientX - this._pointerDown.x;
    const dy = e.clientY - this._pointerDown.y;
    if (Math.sqrt(dx * dx + dy * dy) > 8 || Date.now() - this._pointerDown.t > 500) {
      this._pointerDown = null;
      return;
    }
    this._pointerDown = null;

    const canvas = this.sceneManager.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, this.sceneManager.camera);

    const meshes = this.structureRenderer?.getVisibleMeshes() || [];
    const hits = raycaster.intersectObjects(meshes, false);

    if (hits.length > 0) {
      this._selectMesh(hits[0].object);
    } else {
      this._deselect();
    }
  }

  _selectMesh(mesh) {
    this._deselect();
    this._selectedMesh = mesh;
    this._origMat = mesh.material;

    // Highlight
    const hlMat = mesh.material.clone();
    hlMat.emissive = new THREE.Color(mesh.userData.color);
    hlMat.emissiveIntensity = 0.5;
    hlMat.needsUpdate = true;
    mesh.material = hlMat;

    // Show info card
    const d = mesh.userData;
    this.infoCard.innerHTML = `
      <div class="info-handle"></div>
      <div class="info-head">
        <span class="info-dot" style="background:${d.color}"></span>
        <div>
          <div class="info-cn">${d.name_cn}</div>
          <div class="info-en">${d.name_en}</div>
        </div>
      </div>
      <p class="info-desc">${d.desc}</p>
    `;
    this.infoCard.classList.add('visible');

    if (navigator.vibrate) navigator.vibrate(10);
  }

  _deselect() {
    if (this._selectedMesh && this._origMat) {
      if (this._selectedMesh.material !== this._origMat) {
        this._selectedMesh.material.dispose();
      }
      this._selectedMesh.material = this._origMat;
    }
    this._selectedMesh = null;
    this._origMat = null;
    this.infoCard.classList.remove('visible');
  }

  dispose() {
    this.structureRenderer?.dispose();
    this.sceneManager?.dispose();
  }
}
