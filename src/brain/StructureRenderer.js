import * as THREE from 'three';

export class StructureRenderer {
  constructor(scaleFactor) {
    this.scaleFactor = scaleFactor;
    this.categoryGroups = new Map(); // categoryId → THREE.Group
  }

  /**
   * Convert MNI coordinates to Three.js coordinates.
   * MNI: X=left-right, Y=anterior-posterior, Z=superior-inferior
   * Three.js: X=left-right, Y=up-down, Z=forward-back
   * So: X stays, MNI Z → Three.js Y, MNI Y → Three.js Z
   */
  mniToThree(mniPos) {
    return new THREE.Vector3(
      mniPos[0] * this.scaleFactor,
      mniPos[2] * this.scaleFactor,
      mniPos[1] * this.scaleFactor
    );
  }

  /**
   * Convert MNI scale to Three.js scale (Y↔Z swap).
   */
  mniScaleToThree(mniScale) {
    return new THREE.Vector3(
      mniScale[0] * this.scaleFactor,
      mniScale[2] * this.scaleFactor,
      mniScale[1] * this.scaleFactor
    );
  }

  /**
   * Build all categories from BRAIN_DATA.
   * @param {Array} brainData - Array of category objects
   * @returns {Map} categoryId → THREE.Group
   */
  buildAll(brainData) {
    for (const category of brainData) {
      this.buildCategory(category);
    }
    return this.categoryGroups;
  }

  /**
   * Build a single category group.
   * @param {Object} category - { id, structures, ... }
   * @returns {THREE.Group}
   */
  buildCategory(category) {
    const group = new THREE.Group();
    group.name = category.id;
    group.visible = false; // hidden by default

    for (const structure of category.structures) {
      const meshes = this._buildStructure(structure, category.id);
      meshes.forEach(m => group.add(m));
    }

    this.categoryGroups.set(category.id, group);
    return group;
  }

  /**
   * Build individual structure mesh(es).
   * If bilateral, creates a mirrored copy across X=0.
   */
  _buildStructure(structure, categoryId) {
    const meshes = [];
    const {
      geometry: geoType,
      position,
      scale,
      points,
      bilateral,
      opacity,
      color,
      id,
      name_cn,
      name_en,
      description,
    } = structure;

    const userData = { id, name_cn, name_en, description, color, categoryId };

    // text_only has no geometry
    if (geoType === 'text_only') {
      return meshes;
    }

    const mesh = this._createGeometry(geoType, position, scale, points, color, opacity, structure);
    if (!mesh) return meshes;

    mesh.userData = userData;
    meshes.push(mesh);

    // If bilateral, mirror across X=0
    if (bilateral) {
      const mirror = this._mirrorObject(mesh, geoType, structure);
      mirror.userData = { ...userData, id: id + '_R' };
      meshes.push(mirror);
      mesh.userData.id = id + '_L';
    }

    return meshes;
  }

  /**
   * Mirror an object across X=0 for bilateral structures.
   * For tubes and lines, the points themselves must be mirrored.
   */
  _mirrorObject(original, geoType, structure) {
    if ((geoType === 'tube' || geoType === 'line') && structure.points) {
      // Rebuild geometry with mirrored points
      const mirroredPoints = structure.points.map(p => [-p[0], p[1], p[2]]);
      const mirroredStructure = { ...structure, points: mirroredPoints };
      const mirror = this._createGeometry(
        geoType,
        structure.position,
        structure.scale,
        mirroredPoints,
        structure.color,
        structure.opacity,
        mirroredStructure
      );
      if (mirror) {
        // For tube/line the position is baked into the points, so we
        // don't need to flip position.x separately.
        return mirror;
      }
    }

    // For all other types, clone and flip X
    const mirror = original.clone();
    mirror.position.x = -original.position.x;
    return mirror;
  }

  /**
   * Dispatch to the correct geometry builder based on type.
   */
  _createGeometry(geoType, position, scale, points, color, opacity, structure) {
    switch (geoType) {
      case 'surface_region':
        return this._buildSurfaceRegion(position, scale, color, opacity);
      case 'sphere':
      case 'ellipsoid':
        return this._buildSphere(position, scale, color, opacity);
      case 'cylinder':
        return this._buildCylinder(position, scale, color, opacity);
      case 'tube':
        return this._buildTube(points, color, opacity, structure);
      case 'line':
        return this._buildLine(points, color);
      case 'shell':
        return this._buildShell(position, scale, color, opacity);
      case 'surface_marker':
        return this._buildSurfaceMarker(position, color, opacity);
      case 'nerve_marker':
        return this._buildNerveMarker(position, color, opacity);
      case 'transparent_volume':
        return this._buildTransparentVolume(position, scale, color, opacity);
      case 'text_only':
        return null;
      default:
        console.warn(`StructureRenderer: unknown geometry type "${geoType}"`);
        return null;
    }
  }

  // ---------------------------------------------------------------
  // Geometry type builders
  // ---------------------------------------------------------------

  /**
   * surface_region (lobes)
   * Large transparent spheres scaled anisotropically.
   */
  _buildSurfaceRegion(position, scale, color, opacity) {
    const geo = new THREE.SphereGeometry(1, 24, 16);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.6,
      metalness: 0.0,
      transparent: true,
      opacity: opacity != null ? opacity : 0.3,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);

    if (position) {
      mesh.position.copy(this.mniToThree(position));
    }
    if (scale) {
      mesh.scale.copy(this.mniScaleToThree(scale));
    }

    return mesh;
  }

  /**
   * sphere / ellipsoid
   */
  _buildSphere(position, scale, color, opacity) {
    const geo = new THREE.SphereGeometry(1, 16, 12);
    const effectiveOpacity = opacity != null ? opacity : 0.85;
    const mat = this._createMaterial(color, effectiveOpacity);
    const mesh = new THREE.Mesh(geo, mat);

    if (position) {
      mesh.position.copy(this.mniToThree(position));
    }

    const s = scale || [8, 8, 8];
    mesh.scale.copy(this.mniScaleToThree(s));

    return mesh;
  }

  /**
   * cylinder
   */
  _buildCylinder(position, scale, color, opacity) {
    const geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const effectiveOpacity = opacity != null ? opacity : 0.85;
    const mat = this._createMaterial(color, effectiveOpacity);
    const mesh = new THREE.Mesh(geo, mat);

    if (position) {
      mesh.position.copy(this.mniToThree(position));
    }

    const s = scale || [8, 8, 8];
    mesh.scale.copy(this.mniScaleToThree(s));

    return mesh;
  }

  /**
   * tube (pathways with a points array)
   * Creates a CatmullRomCurve3 from the points, then TubeGeometry.
   */
  _buildTube(points, color, opacity, structure) {
    if (!points || points.length < 2) return null;

    const curvePoints = points.map(p => this.mniToThree(p));
    const curve = new THREE.CatmullRomCurve3(curvePoints);

    const radius = (structure.radius || 2) * this.scaleFactor;
    const geo = new THREE.TubeGeometry(curve, 64, radius, 8, false);

    const effectiveOpacity = opacity != null ? opacity : 0.7;
    const mat = this._createMaterial(color, effectiveOpacity);
    const mesh = new THREE.Mesh(geo, mat);

    return mesh;
  }

  /**
   * line (sulci)
   * Creates a THREE.Line from points. Kept selectable.
   */
  _buildLine(points, color) {
    if (!points || points.length < 2) return null;

    const positions = [];
    for (const p of points) {
      const v = this.mniToThree(p);
      positions.push(v.x, v.y, v.z);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      linewidth: 2,
    });

    const line = new THREE.Line(geo, mat);
    return line;
  }

  /**
   * shell (meninges)
   * Very large, very transparent sphere encompassing the brain.
   */
  _buildShell(position, scale, color, opacity) {
    const geo = new THREE.SphereGeometry(1, 32, 24);
    const effectiveOpacity = opacity != null ? opacity : 0.08;
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.6,
      metalness: 0.0,
      transparent: true,
      opacity: effectiveOpacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);

    if (position) {
      mesh.position.copy(this.mniToThree(position));
    }
    if (scale) {
      mesh.scale.copy(this.mniScaleToThree(scale));
    }

    return mesh;
  }

  /**
   * surface_marker
   * Small emissive sphere.
   */
  _buildSurfaceMarker(position, color, opacity) {
    const geo = new THREE.SphereGeometry(1, 8, 6);
    const effectiveOpacity = opacity != null ? opacity : 0.85;
    const mat = this._createMaterial(color, effectiveOpacity, true);
    const mesh = new THREE.Mesh(geo, mat);

    if (position) {
      mesh.position.copy(this.mniToThree(position));
    }

    const s = [3, 3, 3];
    mesh.scale.copy(this.mniScaleToThree(s));

    return mesh;
  }

  /**
   * nerve_marker
   * Small, slightly emissive sphere.
   */
  _buildNerveMarker(position, color, opacity) {
    const geo = new THREE.SphereGeometry(1, 8, 6);
    const effectiveOpacity = opacity != null ? opacity : 0.85;
    const mat = this._createMaterial(color, effectiveOpacity, true);
    const mesh = new THREE.Mesh(geo, mat);

    if (position) {
      mesh.position.copy(this.mniToThree(position));
    }

    const s = [4, 4, 4];
    mesh.scale.copy(this.mniScaleToThree(s));

    return mesh;
  }

  /**
   * transparent_volume
   * Semi-transparent sphere for volumetric regions.
   */
  _buildTransparentVolume(position, scale, color, opacity) {
    const geo = new THREE.SphereGeometry(1, 16, 12);
    const effectiveOpacity = opacity != null ? opacity : 0.3;
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.45,
      metalness: 0.05,
      transparent: true,
      opacity: effectiveOpacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);

    if (position) {
      mesh.position.copy(this.mniToThree(position));
    }

    const s = scale || [8, 8, 8];
    mesh.scale.copy(this.mniScaleToThree(s));

    return mesh;
  }

  // ---------------------------------------------------------------
  // Material helper
  // ---------------------------------------------------------------

  /**
   * Create a standard MeshPhysicalMaterial.
   * @param {string} color - CSS color string or hex
   * @param {number} opacity - 0..1
   * @param {boolean} emissive - whether to add emissive glow
   */
  _createMaterial(color, opacity = 0.85, emissive = false) {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.45,
      metalness: 0.05,
      clearcoat: 0.3,
      transparent: opacity < 1.0,
      opacity: opacity,
      depthWrite: opacity >= 0.5,
      side: THREE.DoubleSide,
    });
    if (emissive) {
      mat.emissive = new THREE.Color(color);
      mat.emissiveIntensity = 0.4;
    }
    return mat;
  }
}
