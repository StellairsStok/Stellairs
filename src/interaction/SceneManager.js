import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.01,
      100
    );
    this.camera.position.set(0, 0.5, 2.5);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 8;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.8;
    this.controls.enablePan = true;
    this.controls.target.set(0, 0, 0);

    // Lighting
    this._setupLights();

    // Resize
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    // Animation
    this._animate = this._animate.bind(this);
    this._animating = true;
    this._animate();

    // GLTF Loader
    this.loader = new GLTFLoader();
  }

  _setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xddeeff, 0x8899aa, 0.5);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 5, 5);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xaaccff, 0.4);
    fill.position.set(-3, 2, -3);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.3);
    rim.position.set(0, -2, -5);
    this.scene.add(rim);

    const bottom = new THREE.DirectionalLight(0xffeedd, 0.2);
    bottom.position.set(0, -5, 0);
    this.scene.add(bottom);
  }

  /**
   * Load a GLB model and add to scene
   * Returns the loaded model group
   */
  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;

          // Center and scale the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.0 / maxDim; // Normalize to ~2 units

          model.position.sub(center);
          model.scale.setScalar(scale);

          // Recalculate after centering
          const newBox = new THREE.Box3().setFromObject(model);
          const newCenter = newBox.getCenter(new THREE.Vector3());
          this.controls.target.copy(newCenter);

          this.scene.add(model);
          resolve(model);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          reject(error);
        }
      );
    });
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _animate() {
    if (!this._animating) return;
    requestAnimationFrame(this._animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this._animating = false;
    window.removeEventListener('resize', this._onResize);
    this.renderer.dispose();
    this.controls.dispose();
  }
}
