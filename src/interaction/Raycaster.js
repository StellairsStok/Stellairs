import * as THREE from 'three';

export class BrainRaycaster {
  constructor(camera, renderer, brainModel) {
    this.camera = camera;
    this.renderer = renderer;
    this.brainModel = brainModel;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this._selectedMesh = null;
    this._originalMaterials = new Map();
    this._pointerDown = null;
    this._onRegionSelected = null;
    this._onRegionDeselected = null;

    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', this._onPointerDown);
    canvas.addEventListener('pointerup', this._onPointerUp);
  }

  onRegionSelected(callback) {
    this._onRegionSelected = callback;
  }

  onRegionDeselected(callback) {
    this._onRegionDeselected = callback;
  }

  _onPointerDown(event) {
    this._pointerDown = { x: event.clientX, y: event.clientY, time: Date.now() };
  }

  _onPointerUp(event) {
    if (!this._pointerDown) return;

    // Check if this was a tap (not drag)
    const dx = event.clientX - this._pointerDown.x;
    const dy = event.clientY - this._pointerDown.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const elapsed = Date.now() - this._pointerDown.time;
    this._pointerDown = null;

    // Threshold: less than 8px movement and less than 300ms
    if (dist > 8 || elapsed > 500) return;

    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = this.brainModel.getInteractableMeshes();
    const intersects = this.raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this._selectMesh(hit);
    } else {
      this._deselectMesh();
    }
  }

  _selectMesh(mesh) {
    // Deselect previous
    this._restoreMaterial();

    this._selectedMesh = mesh;

    // Store original material and apply highlight
    if (!this._originalMaterials.has(mesh.uuid)) {
      this._originalMaterials.set(mesh.uuid, mesh.material);
    }

    const highlightMat = mesh.material.clone();
    const baseColor = new THREE.Color(mesh.material.color);
    highlightMat.emissive = baseColor;
    highlightMat.emissiveIntensity = 0.35;
    highlightMat.clearcoat = 0.7;
    highlightMat.needsUpdate = true;
    mesh.material = highlightMat;

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    this._onRegionSelected?.(mesh.userData);
  }

  _deselectMesh() {
    this._restoreMaterial();
    this._selectedMesh = null;
    this._onRegionDeselected?.();
  }

  _restoreMaterial() {
    if (this._selectedMesh) {
      const orig = this._originalMaterials.get(this._selectedMesh.uuid);
      if (orig) {
        // Dispose the highlight clone
        if (this._selectedMesh.material !== orig) {
          this._selectedMesh.material.dispose();
        }
        this._selectedMesh.material = orig;
        this._originalMaterials.delete(this._selectedMesh.uuid);
      }
    }
  }

  dispose() {
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this._onPointerDown);
    canvas.removeEventListener('pointerup', this._onPointerUp);
    this._restoreMaterial();
  }
}
