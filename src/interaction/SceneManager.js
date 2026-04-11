import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf2f4f8);
    this.layers = {};
    this._hoveredMesh = null;
    this._focusedStructure = null;

    const w = container.clientWidth  || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    // ── WebGL renderer ──
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = false;
    container.appendChild(this.renderer.domElement);

    // ── CSS2D label renderer ──
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(w, h);
    this.labelRenderer.domElement.style.cssText =
      'position:absolute;top:0;left:0;pointer-events:none;';
    container.appendChild(this.labelRenderer.domElement);

    // ── Camera — tilted slightly for a natural first impression ──
    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 100);
    this.camera.position.set(0.35, 0.55, 2.6);
    this._defaultCamPos = this.camera.position.clone();
    this._defaultTarget = new THREE.Vector3(0, 0.02, 0);

    // ── Orbit controls ──
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping    = true;
    this.controls.dampingFactor    = 0.07;
    this.controls.minDistance      = 0.3;
    this.controls.maxDistance      = 7;
    this.controls.autoRotate       = true;
    this.controls.autoRotateSpeed  = 0.45;
    this.controls.enablePan        = true;
    this.controls.target.copy(this._defaultTarget);

    this._setupLights();

    // ── Raycaster ──
    this.raycaster = new THREE.Raycaster();
    this.pointer   = new THREE.Vector2(-999, -999);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onClick       = this._onClick.bind(this);
    this.renderer.domElement.addEventListener('pointermove', this._onPointerMove);
    this.renderer.domElement.addEventListener('click',       this._onClick);
    this.onStructureHover = null;
    this.onStructureClick = null;

    // ── Resize ──
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    // ── Animation loop ──
    this._animate  = this._animate.bind(this);
    this._animating = true;
    this._tweens    = [];
    this._animate();

    this.loader = new GLTFLoader();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Lighting — three-point + rim + hemisphere for anatomical depth
  // ──────────────────────────────────────────────────────────────────────────
  _setupLights() {
    // Soft ambient fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambient);

    // Warm hemisphere sky/ground
    const hemi = new THREE.HemisphereLight(0xdce8ff, 0x88a090, 0.45);
    this.scene.add(hemi);

    // Key light (upper right front)
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 6, 5);
    this.scene.add(key);

    // Fill light (left, slightly cool)
    const fill = new THREE.DirectionalLight(0xb8ccff, 0.40);
    fill.position.set(-4, 2, -2);
    this.scene.add(fill);

    // Rim / back light (below rear — gives depth to translucent brain)
    const rim = new THREE.DirectionalLight(0xfff4e0, 0.28);
    rim.position.set(0, -4, -5);
    this.scene.add(rim);

    // Top specular highlight
    const top = new THREE.DirectionalLight(0xffffff, 0.18);
    top.position.set(0, 8, 0);
    this.scene.add(top);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Model loading
  // ──────────────────────────────────────────────────────────────────────────
  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(url, (gltf) => {
        const model = gltf.scene;

        // Measure model in its original space
        const box    = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;

        this._brainScale  = 2.0 / maxDim;
        this._brainCenter = center.clone();

        // Centre model inside wrapper, then scale wrapper to ≈ 2-unit space
        const wrapper = new THREE.Group();
        wrapper.add(model);
        model.position.set(-center.x, -center.y, -center.z);
        wrapper.scale.setScalar(this._brainScale);
        wrapper.name = 'brainModel';

        model.traverse((child) => {
          if (!child.isMesh) return;
          child.material = child.material.clone();
          child.material.roughness   = 0.58;
          child.material.metalness   = 0.04;
          child.material.side        = THREE.DoubleSide;
          child.material.transparent = true;
          child.material.opacity     = 1.0;
          // Only set default color when no texture is present
          if (!child.material.map) {
            child.material.color.setHex(0xe8cec2);
          }
        });

        this.scene.add(wrapper);
        this.brainWrapper = wrapper;
        resolve(wrapper);
      }, undefined, (err) => reject(new Error('GLB load failed: ' + err)));
    });
  }

  /**
   * Convert model coordinates to scene space.
   *   scene = (model − brainCenter) × brainScale
   *
   * Model axes match Three.js Y-up convention:
   *   X = left → right,  Y = bottom → top,  Z = back → front
   */
  modelToScene(pos) {
    if (!pos || !Array.isArray(pos)) return new THREE.Vector3(0, 0, 0);
    const s = this._brainScale;
    const c = this._brainCenter;
    return new THREE.Vector3(
      ((pos[0] || 0) - c.x) * s,
      ((pos[1] || 0) - c.y) * s,
      ((pos[2] || 0) - c.z) * s,
    );
  }

  setBrainOpacity(opacity) {
    if (!this.brainWrapper) return;
    this.brainWrapper.traverse((child) => {
      if (!child.isMesh) return;
      child.material.opacity    = opacity;
      child.material.transparent = true;
      child.material.depthWrite  = opacity > 0.5;
    });
  }

  addLayer(id, group) {
    this.layers[id] = group;
    this.scene.add(group);
  }

  setLayerVisible(id, visible) {
    if (this.layers[id]) this.layers[id].visible = visible;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Focus / unfocus
  // ──────────────────────────────────────────────────────────────────────────
  focusOnStructure(structureData) {
    if (!structureData) return;
    this._focusedStructure = structureData;
    this.controls.autoRotate = false;

    const rawPos = structureData.position
      || (structureData.points
          ? structureData.points[Math.floor(structureData.points.length / 2)]
          : null);
    if (!rawPos) return;

    const pos  = this.modelToScene(rawPos);
    // Adaptive distance: deep nuclei are small → come closer
    const dist = structureData.category === 'deep_nuclei' ? 0.65 : 0.85;
    const camPos = pos.clone().add(new THREE.Vector3(0.1, 0.22, dist));

    this._animateTo(camPos, pos.clone(), 650);
    this._dimNonFocused(structureData);
    this.setBrainOpacity(0.08);
  }

  resetFocus() {
    this._focusedStructure = null;
    this.controls.autoRotate = true;
    this._animateTo(
      this._defaultCamPos.clone(),
      this._defaultTarget.clone(),
      520,
    );
    this._restoreAllOpacity();
  }

  _dimNonFocused(focusedData) {
    for (const [, group] of Object.entries(this.layers)) {
      if (!group.visible) continue;
      group.traverse((child) => {
        if (!child.isMesh || !child.userData.name_cn) return;
        const isFocused = child.userData.name_en === focusedData.name_en ||
                          child.userData.name_cn === (focusedData.name_cn || focusedData.name);
        if (!isFocused) {
          child._savedOpacity = child.material.opacity;
          child.material.opacity   = 0.06;
          child.material.transparent = true;
          child.material.depthWrite  = false;
        } else {
          child.material.opacity   = 1.0;
          child.material.depthWrite = true;
        }
      });
    }
  }

  _restoreAllOpacity() {
    for (const [, group] of Object.entries(this.layers)) {
      group.traverse((child) => {
        if (child.isMesh && child._savedOpacity !== undefined) {
          child.material.opacity   = child._savedOpacity;
          child.material.depthWrite = child._savedOpacity > 0.5;
          delete child._savedOpacity;
        }
      });
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Camera tween
  // ──────────────────────────────────────────────────────────────────────────
  _animateTo(targetPos, targetLookAt, duration) {
    const startPos    = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime   = performance.now();

    const tween = { active: true };
    tween.update = (now) => {
      const t    = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLookAt, ease);
      if (t >= 1) tween.active = false;
    };
    this._tweens.push(tween);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Pointer / hover / click
  // ──────────────────────────────────────────────────────────────────────────
  _onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x =  ((event.clientX - rect.left) / rect.width)  * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top)  / rect.height) * 2 + 1;
  }

  _onClick() {
    if (this._hoveredMesh && this.onStructureClick) {
      this.onStructureClick(this._hoveredMesh.userData);
    }
  }

  _checkHover() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const interactable = [];
    for (const [, group] of Object.entries(this.layers)) {
      if (!group.visible) continue;
      group.traverse((child) => {
        if (child.isMesh && child.userData.name_cn) interactable.push(child);
      });
    }

    const hits = this.raycaster.intersectObjects(interactable, false);
    if (hits.length > 0) {
      const hit = hits[0].object;
      if (this._hoveredMesh !== hit) {
        this._unhover();
        this._hoveredMesh = hit;
        hit._origEmissive = hit.material.emissive?.getHex() ?? 0;
        hit.material.emissive = new THREE.Color(0x444444);
        hit.material.emissiveIntensity = 0.55;
        this.onStructureHover?.(hit.userData);
      }
    } else {
      this._unhover();
    }
  }

  _unhover() {
    if (this._hoveredMesh) {
      this._hoveredMesh.material.emissive =
        new THREE.Color(this._hoveredMesh._origEmissive ?? 0);
      this._hoveredMesh.material.emissiveIntensity = 0;
      this._hoveredMesh = null;
      this.onStructureHover?.(null);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Resize
  // ──────────────────────────────────────────────────────────────────────────
  _onResize() {
    const w = this.container.clientWidth  || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Render loop
  // ──────────────────────────────────────────────────────────────────────────
  _animate() {
    if (!this._animating) return;
    requestAnimationFrame(this._animate);

    const now = performance.now();
    this._tweens = this._tweens.filter(t => {
      if (t.active) { t.update(now); return true; }
      return false;
    });

    this.controls.update();
    this._checkHover();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Cleanup
  // ──────────────────────────────────────────────────────────────────────────
  dispose() {
    this._animating = false;
    window.removeEventListener('resize', this._onResize);
    this.renderer.domElement.removeEventListener('pointermove', this._onPointerMove);
    this.renderer.domElement.removeEventListener('click',       this._onClick);
    this.renderer.dispose();
    this.controls.dispose();
  }
}
