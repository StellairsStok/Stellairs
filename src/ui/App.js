import * as THREE from 'three';
import { SceneManager } from '../interaction/SceneManager.js';
import { StructureRenderer } from '../brain/StructureRenderer.js';
import { BRAIN_DATA } from '../data/brain-structures.js';

export class App {
  constructor(root) {
    this.root = root;
    this.activeCategory = null;
    this.selectedMesh = null;
    this.originalMaterials = new Map();
    this.sidebarExpanded = false;
    this._build();
  }

  _build() {
    this.root.innerHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-toggle" id="sidebarToggle">
          <div class="sidebar-handle"></div>
          <span class="sidebar-toggle-label">选择分类</span>
        </div>
        <div class="sidebar-header">
          <h1>BrainAtlas</h1>
          <p>3D 大脑解剖图谱</p>
        </div>
        <div class="category-list" id="categoryList"></div>
      </aside>
      <div class="viewport" id="viewport">
        <div class="loading-screen" id="loading">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">正在加载大脑模型...</div>
          </div>
        </div>
      </div>
      <div class="info-card" id="infoCard">
        <div class="info-card-header">
          <div class="info-color" id="infoColor"></div>
          <div class="info-names">
            <div class="info-name-cn" id="infoNameCn"></div>
            <div class="info-name-en" id="infoNameEn"></div>
          </div>
          <button class="info-close" id="infoClose">&times;</button>
        </div>
        <div class="info-description" id="infoDesc"></div>
      </div>
    `;

    this.viewportEl = document.getElementById('viewport');
    this.sidebarEl = document.getElementById('sidebar');
    this.categoryListEl = document.getElementById('categoryList');
    this.infoCardEl = document.getElementById('infoCard');

    this.sceneManager = new SceneManager(this.viewportEl);

    this._buildCategoryList();
    this._setupSidebarToggle();
    this._setupInfoClose();
    this._loadBrain();
  }

  _buildCategoryList() {
    for (const cat of BRAIN_DATA.categories) {
      const item = document.createElement('button');
      item.className = 'category-item';
      item.dataset.categoryId = cat.id;

      // Pick a representative color from the first structure
      const color = cat.structures.length > 0 ? cat.structures[0].color : '#888';

      item.innerHTML = `
        <span class="category-color" style="background:${color}"></span>
        <span class="category-label">${cat.name_cn}<small>${cat.name_en}</small></span>
      `;

      item.addEventListener('click', () => this._selectCategory(cat.id));
      this.categoryListEl.appendChild(item);
    }
  }

  _setupSidebarToggle() {
    const toggle = document.getElementById('sidebarToggle');
    toggle.addEventListener('click', () => {
      this.sidebarExpanded = !this.sidebarExpanded;
      this.sidebarEl.classList.toggle('expanded', this.sidebarExpanded);
    });
  }

  _setupInfoClose() {
    document.getElementById('infoClose').addEventListener('click', () => {
      this._hideInfoCard();
      this._deselectMesh();
    });
  }

  async _loadBrain() {
    try {
      const basePath = import.meta.env.BASE_URL || '/';
      this.brainModel = await this.sceneManager.loadModel(`${basePath}brain.glb`);

      // Apply brain material
      this.brainModel.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          if (!child.material.map) {
            child.material.color.setHex(0xd4a0a0);
          }
          child.material.roughness = 0.6;
          child.material.metalness = 0.05;
          child.material.side = THREE.DoubleSide;
        }
      });

      // Build anatomical structures
      this.structureRenderer = new StructureRenderer(this.sceneManager.scaleFactor);
      this.structureRenderer.buildAll(BRAIN_DATA.categories);

      // Add all category groups to scene
      for (const [, group] of this.structureRenderer.categoryGroups) {
        this.sceneManager.addGroup(group);
      }

      // Setup raycasting for structure selection
      this._setupRaycasting();

      // Hide loading screen
      const loading = document.getElementById('loading');
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => loading.remove(), 400);
      }

      // Default: show lobes
      this._selectCategory('lobes');

    } catch (err) {
      console.error('Failed to load brain model:', err);
      const loading = document.getElementById('loading');
      if (loading) {
        loading.querySelector('.loading-text').textContent = '模型加载失败，请刷新重试';
      }
    }
  }

  _selectCategory(categoryId) {
    // Deselect previous structure
    this._deselectMesh();
    this._hideInfoCard();

    // Hide all categories, show selected
    for (const [id, group] of this.structureRenderer.categoryGroups) {
      group.visible = (id === categoryId);
    }

    // Set brain opacity based on category
    const category = BRAIN_DATA.categories.find(c => c.id === categoryId);
    if (category) {
      this.sceneManager.setBrainOpacity(category.brainOpacity);
    }

    this.activeCategory = categoryId;

    // Update sidebar active state
    const items = this.categoryListEl.querySelectorAll('.category-item');
    items.forEach(item => {
      item.classList.toggle('active', item.dataset.categoryId === categoryId);
    });

    // Collapse sidebar on mobile
    if (window.innerWidth <= 768) {
      this.sidebarExpanded = false;
      this.sidebarEl.classList.remove('expanded');
    }

    // Update toggle label on mobile
    const label = this.sidebarEl.querySelector('.sidebar-toggle-label');
    if (label && category) {
      label.textContent = category.name_cn;
    }
  }

  _setupRaycasting() {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDown = null;

    const canvas = this.sceneManager.renderer.domElement;

    canvas.addEventListener('pointerdown', (e) => {
      pointerDown = { x: e.clientX, y: e.clientY, time: Date.now() };
    });

    canvas.addEventListener('pointerup', (e) => {
      if (!pointerDown) return;

      const dx = e.clientX - pointerDown.x;
      const dy = e.clientY - pointerDown.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const elapsed = Date.now() - pointerDown.time;
      pointerDown = null;

      if (dist > 8 || elapsed > 500) return;

      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, this.sceneManager.camera);

      // Get meshes from active category
      const activeGroup = this.structureRenderer.categoryGroups.get(this.activeCategory);
      if (!activeGroup) return;

      const meshes = [];
      activeGroup.traverse((child) => {
        if (child.isMesh) meshes.push(child);
      });

      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.name_cn) {
          this._selectMesh(hit);
        }
      } else {
        this._deselectMesh();
        this._hideInfoCard();
      }
    });
  }

  _selectMesh(mesh) {
    this._deselectMesh();

    this.selectedMesh = mesh;

    // Store original material
    if (!this.originalMaterials.has(mesh.uuid)) {
      this.originalMaterials.set(mesh.uuid, mesh.material);
    }

    // Apply highlight
    const highlightMat = mesh.material.clone();
    const baseColor = new THREE.Color(mesh.userData.color || '#ffffff');
    highlightMat.emissive = baseColor;
    highlightMat.emissiveIntensity = 0.5;
    highlightMat.clearcoat = 0.8;
    highlightMat.needsUpdate = true;
    mesh.material = highlightMat;

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(10);

    // Show info card
    this._showInfoCard(mesh.userData);
  }

  _deselectMesh() {
    if (!this.selectedMesh) return;

    const orig = this.originalMaterials.get(this.selectedMesh.uuid);
    if (orig) {
      if (this.selectedMesh.material !== orig) {
        this.selectedMesh.material.dispose();
      }
      this.selectedMesh.material = orig;
      this.originalMaterials.delete(this.selectedMesh.uuid);
    }
    this.selectedMesh = null;
  }

  _showInfoCard(data) {
    document.getElementById('infoColor').style.background = data.color || '#888';
    document.getElementById('infoNameCn').textContent = data.name_cn || '';
    document.getElementById('infoNameEn').textContent = data.name_en || '';
    document.getElementById('infoDesc').textContent = data.description || '';
    this.infoCardEl.classList.add('visible');
  }

  _hideInfoCard() {
    this.infoCardEl.classList.remove('visible');
  }

  dispose() {
    this.sceneManager?.dispose();
  }
}
