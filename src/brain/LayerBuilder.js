import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/**
 * Build 3D layer groups from brainData categories
 */
export function buildLayer(category, sceneManager) {
  const group = new THREE.Group();
  group.name = category.id;
  group.visible = category.default_visible;

  const type = category.render_type;

  for (const s of category.structures) {
    let mesh;

    if (type === 'tube' && s.points) {
      mesh = createTube(s, sceneManager);
    } else if (type === 'transparent_volume') {
      mesh = createEllipsoid(s, sceneManager, s.opacity ?? 0.35);
    } else if (type === 'surface_region') {
      mesh = createSurfaceRegion(s, sceneManager);
    } else if (type === 'surface_marker' || type === 'nerve_marker') {
      mesh = createMarker(s, sceneManager, type === 'nerve_marker' ? 0.025 : 0.03);
    } else {
      // deep_structure, brainstem_segment, etc
      mesh = createEllipsoid(s, sceneManager, 0.85);
    }

    if (mesh) {
      mesh.userData = { ...s, categoryId: category.id };
      group.add(mesh);

      // Add label
      const label = createLabel(s.name_cn);
      if (mesh.isGroup) {
        mesh.children[0]?.add(label);
      } else {
        mesh.add(label);
      }
    }
  }

  return group;
}

function createSurfaceRegion(s, sm) {
  const pos = sm.mniToScene(s.position);
  const sc = s.scale || [0.15, 0.15, 0.15];

  const geo = new THREE.SphereGeometry(1, 24, 24);
  const mat = new THREE.MeshPhysicalMaterial({
    color: s.color,
    transparent: true,
    opacity: 0.45,
    roughness: 0.5,
    metalness: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(pos);
  mesh.scale.set(sc[0], sc[1], sc[2]);
  return mesh;
}

function createEllipsoid(s, sm, opacity = 0.85) {
  const pos = sm.mniToScene(s.position);
  const sc = s.scale || [0.03, 0.03, 0.03];

  const geo = new THREE.SphereGeometry(1, 20, 20);
  const mat = new THREE.MeshPhysicalMaterial({
    color: s.color,
    transparent: opacity < 1,
    opacity,
    roughness: 0.5,
    metalness: 0.05,
    clearcoat: 0.3,
    side: opacity < 0.5 ? THREE.DoubleSide : THREE.FrontSide,
    depthWrite: opacity > 0.5,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(pos);
  mesh.scale.set(sc[0], sc[1], sc[2]);
  return mesh;
}

function createMarker(s, sm, size = 0.03) {
  const pos = sm.mniToScene(s.position);

  // Outer sphere
  const outerGeo = new THREE.SphereGeometry(size, 16, 16);
  const outerMat = new THREE.MeshPhysicalMaterial({
    color: s.color,
    transparent: true,
    opacity: 0.6,
    roughness: 0.3,
    depthWrite: false,
  });
  const outer = new THREE.Mesh(outerGeo, outerMat);

  // Inner dot
  const innerGeo = new THREE.SphereGeometry(size * 0.4, 12, 12);
  const innerMat = new THREE.MeshBasicMaterial({ color: s.color });
  const inner = new THREE.Mesh(innerGeo, innerMat);

  const group = new THREE.Group();
  group.add(outer);
  group.add(inner);
  group.position.copy(pos);
  return group;
}

function createTube(s, sm) {
  if (!s.points || s.points.length < 2) return null;

  const pts = s.points.map(p => sm.mniToScene(p));
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, 32, 0.008, 6, false);
  const mat = new THREE.MeshPhysicalMaterial({
    color: s.color,
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.3,
  });

  const mesh = new THREE.Mesh(geo, mat);
  // Set position at midpoint for label
  mesh.userData._labelPos = pts[Math.floor(pts.length / 2)];
  return mesh;
}

function createLabel(text) {
  const div = document.createElement('div');
  div.className = 'structure-label';
  div.textContent = text;
  div.style.display = 'none'; // hidden by default, shown on hover
  const label = new CSS2DObject(div);
  label.position.set(0, 0.04, 0);
  return label;
}
