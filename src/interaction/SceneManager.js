import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.brainMeshes = [];
    this.scaleFactor = 0.01; // default, updated after model load

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f0f1a);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45, container.clientWidth / container.clientHeight, 0.1, 10000
    );
    this.camera.position.set(0, 100, 300);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.6;
    this.controls.enablePan = true;
    this.controls.target.set(0, 0, 0);

    this._setupLights();

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    this._animate = this._animate.bind(this);
    this._animating = true;
    this._animate();
  }

  _setupLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    this.scene.add(new THREE.HemisphereLight(0xddeeff, 0x444466, 0.6));

    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(200, 300, 200);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0x8899cc, 0.5);
    fill.position.set(-200, 100, -100);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xaabbff, 0.3);
    rim.position.set(0, -100, -200);
    this.scene.add(rim);
  }

  loadModel(url) {
    return new Promise((resolve, reject) => {
      new GLTFLoader().load(url, (gltf) => {
        const model = gltf.scene;

        model.traverse(child => {
          if (child.isMesh) {
            if (!child.geometry.attributes.normal) {
              child.geometry.computeVertexNormals();
            }
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0xe8b4b8,
              roughness: 0.55,
              metalness: 0.05,
              clearcoat: 0.3,
              clearcoatRoughness: 0.4,
              transparent: true,
              opacity: 1.0,
              side: THREE.DoubleSide,
              depthWrite: true,
            });
            this.brainMeshes.push(child);
          }
        });

        // Center and normalize
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / maxDim;

        this.scaleFactor = scale;

        model.position.sub(center);
        model.scale.setScalar(scale);

        // Frame camera
        this.controls.target.set(0, 0, 0);
        const dist = 1.5 / Math.tan((this.camera.fov * Math.PI / 180) / 2) * 1.2;
        this.camera.position.set(dist * 0.4, dist * 0.3, dist);
        this.camera.near = 0.01;
        this.camera.far = dist * 10;
        this.camera.updateProjectionMatrix();
        this.controls.minDistance = dist * 0.3;
        this.controls.maxDistance = dist * 3;

        this.scene.add(model);
        resolve(model);
      }, undefined, reject);
    });
  }

  setBrainOpacity(opacity) {
    for (const mesh of this.brainMeshes) {
      mesh.material.opacity = opacity;
      mesh.material.transparent = opacity < 1;
      mesh.material.depthWrite = opacity > 0.5;
      mesh.material.needsUpdate = true;
    }
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
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
