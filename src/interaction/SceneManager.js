import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f6f8);
    this.layers = {};
    this._hoveredMesh = null;
    this._focusedStructure = null;

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    // WebGL
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // CSS2D for labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(w, h);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.left = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(this.labelRenderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100);
    this.camera.position.set(0, 0.5, 2.8);
    this._defaultCamPos = this.camera.position.clone();
    this._defaultTarget = new THREE.Vector3(0, 0, 0);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 0.3;
    this.controls.maxDistance = 8;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.enablePan = true;
    this.controls.target.set(0, 0, 0);

    this._setupLights();

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onClick = this._onClick.bind(this);
    this.renderer.domElement.addEventListener('pointermove', this._onPointerMove);
    this.renderer.domElement.addEventListener('click', this._onClick);
    this.onStructureHover = null;
    this.onStructureClick = null;

    // Resize
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    // Animation
    this._animate = this._animate.bind(this);
    this._animating = true;
    this._tweens = [];
    this._animate();

    this.loader = new GLTFLoader();
  }

  _setupLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    this.scene.add(new THREE.HemisphereLight(0xddeeff, 0x8899aa, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 5, 5);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xaaccff, 0.35);
    fill.position.set(-3, 2, -3);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.2);
    rim.position.set(0, -3, -5);
    this.scene.add(rim);
  }

  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(url, (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        this._brainScale = 2.0 / maxDim;
        this._brainCenter = center.clone();

        const wrapper = new THREE.Group();
        wrapper.add(model);
        model.position.set(-center.x, -center.y, -center.z);
        wrapper.scale.setScalar(this._brainScale);
        wrapper.name = 'brainModel';

        model.traverse((child) => {
          if (child.isMesh) {
            child.material = child.material.clone();
            child.material.roughness = 0.6;
            child.material.metalness = 0.05;
            child.material.side = THREE.DoubleSide;
            child.material.transparent = true;
            child.material.opacity = 1.0;
            if (!child.material.map) {
              child.material.color.setHex(0xe8ccc0);
            }
          }
        });

        this.scene.add(wrapper);
        this.brainWrapper = wrapper;
        resolve(wrapper);
      }, undefined, (err) => reject(new Error('GLB load: ' + err)));
    });
  }

  mniToScene(pos) {
    if (!pos || !Array.isArray(pos)) return new THREE.Vector3(0, 0, 0);
    const s = this._brainScale || 1;
    return new THREE.Vector3(
      (pos[0] || 0) * s * 0.012,
      (pos[2] || 0) * s * 0.012,
      -(pos[1] || 0) * s * 0.012
    );
  }

  setBrainOpacity(opacity) {
    if (!this.brainWrapper) return;
    this.brainWrapper.traverse((child) => {
      if (child.isMesh) {
        child.material.opacity = opacity;
        child.material.transparent = true;
        child.material.depthWrite = opacity > 0.5;
      }
    });
  }

  addLayer(id, group) {
    this.layers[id] = group;
    this.scene.add(group);
  }

  setLayerVisible(id, visible) {
    if (this.layers[id]) {
      this.layers[id].visible = visible;
    }
  }

  /**
   * Focus camera on a structure, dim everything else.
   */
  focusOnStructure(structureData) {
    if (!structureData) return;
    this._focusedStructure = structureData;
    this.controls.autoRotate = false;

    const rawPos = structureData.position || (structureData.points ? structureData.points[Math.floor(structureData.points.length / 2)] : [0, 0, 0]);
    const pos = this.mniToScene(rawPos);
    const dist = 0.8;
    const camTarget = pos.clone();
    const camPos = pos.clone().add(new THREE.Vector3(0, 0.2, dist));

    this._animateTo(camPos, camTarget, 600);
    this._dimNonFocused(structureData);
    this.setBrainOpacity(0.1);
  }

  resetFocus() {
    this._focusedStructure = null;
    this.controls.autoRotate = true;
    this._animateTo(this._defaultCamPos.clone(), this._defaultTarget.clone(), 500);
    this._restoreAllOpacity();
  }

  _dimNonFocused(focusedData) {
    for (const [, group] of Object.entries(this.layers)) {
      if (!group.visible) continue;
      group.children.forEach(container => {
        container.traverse(child => {
          if (child.isMesh && child.userData.name_cn) {
            const isFocused = child.userData.name_en === focusedData.name_en;
            if (!isFocused) {
              child._savedOpacity = child.material.opacity;
              child.material.opacity = 0.08;
              child.material.transparent = true;
              child.material.depthWrite = false;
            } else {
              child.material.opacity = 1.0;
              child.material.depthWrite = true;
            }
          }
        });
      });
    }
  }

  _restoreAllOpacity() {
    for (const [, group] of Object.entries(this.layers)) {
      group.children.forEach(container => {
        container.traverse(child => {
          if (child.isMesh && child._savedOpacity !== undefined) {
            child.material.opacity = child._savedOpacity;
            child.material.depthWrite = child._savedOpacity > 0.5;
            delete child._savedOpacity;
          }
        });
      });
    }
  }

  _animateTo(targetPos, targetLookAt, duration) {
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const tween = { active: true };
    tween.update = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLookAt, ease);
      if (t >= 1) tween.active = false;
    };
    this._tweens.push(tween);
  }

  _onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
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

    const intersects = this.raycaster.intersectObjects(interactable, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (this._hoveredMesh !== hit) {
        this._unhover();
        this._hoveredMesh = hit;
        hit._origEmissive = hit.material.emissive?.getHex() || 0;
        hit.material.emissive = new THREE.Color(0x333333);
        hit.material.emissiveIntensity = 0.5;
        this.onStructureHover?.(hit.userData);
      }
    } else {
      this._unhover();
    }
  }

  _unhover() {
    if (this._hoveredMesh) {
      this._hoveredMesh.material.emissive = new THREE.Color(this._hoveredMesh._origEmissive || 0);
      this._hoveredMesh.material.emissiveIntensity = 0;
      this._hoveredMesh = null;
      this.onStructureHover?.(null);
    }
  }

  _onResize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
  }

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

  dispose() {
    this._animating = false;
    window.removeEventListener('resize', this._onResize);
    this.renderer.domElement.removeEventListener('pointermove', this._onPointerMove);
    this.renderer.domElement.removeEventListener('click', this._onClick);
    this.renderer.dispose();
    this.controls.dispose();
  }
}
