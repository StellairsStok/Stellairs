import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class SceneManager {
  constructor(container) {
    this.container = container;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // Camera - will be repositioned after model loads
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 100, 300);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.0;
    this.controls.enablePan = true;
    this.controls.target.set(0, 90, 0);

    // Lights
    this._setupLights();

    // Resize
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    // Animation loop
    this._animate = this._animate.bind(this);
    this._animating = true;
    this._animate();
  }

  _setupLights() {
    // Ambient
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Hemisphere
    this.scene.add(new THREE.HemisphereLight(0xddeeff, 0x444466, 0.6));

    // Key light
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(200, 300, 200);
    this.scene.add(key);

    // Fill light
    const fill = new THREE.DirectionalLight(0x8899cc, 0.5);
    fill.position.set(-200, 100, -100);
    this.scene.add(fill);

    // Rim light
    const rim = new THREE.DirectionalLight(0xaabbff, 0.4);
    rim.position.set(0, -100, -200);
    this.scene.add(rim);
  }

  loadModel(url) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;

          // Compute normals and apply material for every mesh
          model.traverse((child) => {
            if (child.isMesh) {
              // Compute normals if missing
              if (!child.geometry.attributes.normal) {
                child.geometry.computeVertexNormals();
              }

              // Apply a nice brain material
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0xe8b4b8,
                roughness: 0.55,
                metalness: 0.05,
                clearcoat: 0.3,
                clearcoatRoughness: 0.4,
                side: THREE.DoubleSide,
              });
            }
          });

          // Center and position camera based on bounding box
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          // Center the model
          this.controls.target.copy(center);

          // Position camera to frame the model
          const fov = this.camera.fov * (Math.PI / 180);
          const dist = maxDim / (2 * Math.tan(fov / 2)) * 1.5;
          this.camera.position.set(
            center.x + dist * 0.5,
            center.y + dist * 0.3,
            center.z + dist
          );
          this.camera.near = dist * 0.01;
          this.camera.far = dist * 10;
          this.camera.updateProjectionMatrix();

          this.controls.minDistance = dist * 0.3;
          this.controls.maxDistance = dist * 3;

          this.scene.add(model);
          resolve(model);
        },
        undefined,
        (error) => {
          console.error('GLTFLoader error:', error);
          reject(error);
        }
      );
    });
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
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
    this.controls.dispose();
    this.renderer.dispose();
  }
}
