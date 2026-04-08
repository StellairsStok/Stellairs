import * as THREE from 'three';
import { BRAIN_DATA } from '../data/brain-structures.js';

/**
 * Convert MNI coordinates to Three.js coordinates
 * MNI: X=left/right, Y=posterior/anterior, Z=inferior/superior
 * Three.js: X=left/right, Y=up, Z=forward
 */
function mniToThree(x, y, z, sf) {
  return new THREE.Vector3(x * sf, z * sf, y * sf);
}

function mniScaleToThree(sx, sy, sz, sf) {
  return new THREE.Vector3(sx * sf, sz * sf, sy * sf);
}

export class StructureRenderer {
  constructor(scene, scaleFactor) {
    this.scene = scene;
    this.sf = scaleFactor;
    this.groups = {};
    this.allMeshes = [];
  }

  buildAll() {
    for (const cat of BRAIN_DATA) {
      const group = new THREE.Group();
      group.name = cat.id;
      group.visible = false;

      // Build solid structures (spheres/ellipsoids/cylinders)
      if (cat.structures) {
        for (const s of cat.structures) {
          this._buildStructure(group, s, cat.id);
        }
      }

      // Build tubes (vessels, white matter)
      if (cat.tubes) {
        for (const t of cat.tubes) {
          this._buildTube(group, t, cat.id);
        }
      }

      // Build shells (meninges)
      if (cat.shells) {
        for (const sh of cat.shells) {
          this._buildShell(group, sh, cat.id);
        }
      }

      this.scene.add(group);
      this.groups[cat.id] = group;
    }
  }

  _buildStructure(group, s, catId) {
    const positions = [s.pos];
    // Add bilateral mirror
    if (s.bi && s.pos[0] !== 0) {
      positions.push([-s.pos[0], s.pos[1], s.pos[2]]);
    }

    for (const pos of positions) {
      const p = mniToThree(pos[0], pos[1], pos[2], this.sf);
      let geo;
      const sc = s.sc || [4, 4, 4];
      const s3 = mniScaleToThree(sc[0], sc[1], sc[2], this.sf);

      if (s.geo === 'cylinder') {
        geo = new THREE.CylinderGeometry(1, 1, 1, 16);
      } else if (s.marker) {
        // Small marker sphere with minimum visible size
        geo = new THREE.SphereGeometry(1, 12, 12);
        s3.multiplyScalar(Math.max(1, 3 / Math.max(s3.x, s3.y, s3.z)));
      } else {
        geo = new THREE.SphereGeometry(1, 16, 16);
      }

      const isTransparent = (s.opacity !== undefined && s.opacity < 1) ||
                             catId === 'lobes' || catId === 'ventricles';
      const opacity = s.opacity ?? (catId === 'lobes' ? 0.45 : (catId === 'ventricles' ? 0.35 : 1.0));

      const mat = new THREE.MeshPhysicalMaterial({
        color: s.color,
        roughness: s.marker ? 0.3 : 0.55,
        metalness: 0.05,
        clearcoat: s.marker ? 0.6 : 0.3,
        transparent: isTransparent || s.marker,
        opacity: s.marker ? 0.85 : opacity,
        side: isTransparent ? THREE.DoubleSide : THREE.FrontSide,
        depthWrite: !isTransparent,
        emissive: s.marker ? new THREE.Color(s.color) : new THREE.Color(0x000000),
        emissiveIntensity: s.marker ? 0.4 : 0,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(p);
      mesh.scale.set(
        Math.max(s3.x, 0.01) * 0.5,
        Math.max(s3.y, 0.01) * 0.5,
        Math.max(s3.z, 0.01) * 0.5
      );

      mesh.userData = {
        name_cn: s.name_cn,
        name_en: s.name_en,
        desc: s.desc,
        color: s.color,
        catId,
      };

      group.add(mesh);
      this.allMeshes.push(mesh);
    }
  }

  _buildTube(group, t, catId) {
    const pointSets = [t.pts];
    if (t.bi && t.pts[0][0] !== 0) {
      pointSets.push(t.pts.map(p => [-p[0], p[1], p[2]]));
    }

    for (const pts of pointSets) {
      const curvePoints = pts.map(p => mniToThree(p[0], p[1], p[2], this.sf));
      if (curvePoints.length < 2) continue;

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const radius = (t.r || 1.5) * this.sf;
      const geo = new THREE.TubeGeometry(curve, 32, radius, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({
        color: t.color,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.4,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = {
        name_cn: t.name_cn,
        name_en: t.name_en,
        desc: t.desc,
        color: t.color,
        catId,
      };

      group.add(mesh);
      this.allMeshes.push(mesh);
    }
  }

  _buildShell(group, sh, catId) {
    const geo = new THREE.SphereGeometry(sh.offset, 48, 48);
    const mat = new THREE.MeshPhysicalMaterial({
      color: sh.color,
      roughness: 0.7,
      transparent: true,
      opacity: sh.opacity || 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = {
      name_cn: sh.name_cn,
      name_en: sh.name_en,
      desc: sh.desc,
      color: sh.color,
      catId,
    };

    group.add(mesh);
    this.allMeshes.push(mesh);
  }

  showCategory(catId) {
    for (const [id, g] of Object.entries(this.groups)) {
      g.visible = id === catId;
    }
  }

  getVisibleMeshes() {
    const meshes = [];
    for (const g of Object.values(this.groups)) {
      if (!g.visible) continue;
      g.traverse(child => {
        if (child.isMesh) meshes.push(child);
      });
    }
    return meshes;
  }

  dispose() {
    for (const g of Object.values(this.groups)) {
      g.traverse(child => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
    }
  }
}
