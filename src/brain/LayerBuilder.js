import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/**
 * Build 3D layer group from a brainData category.
 * Each structure gets: geometry + leader line + label outside brain.
 */
export function buildLayer(category, sceneManager) {
  const group = new THREE.Group();
  group.name = category.id;
  group.visible = category.default_visible;

  const type = category.render_type;

  for (const s of category.structures) {
    const container = new THREE.Group();
    container.name = s.name_en;

    let mesh;

    if (type === 'tube' && s.points) {
      mesh = createTube(s, sceneManager);
    } else if (type === 'transparent_volume') {
      mesh = createEllipsoid(s, sceneManager, s.opacity ?? 0.35);
    } else if (type === 'surface_region') {
      mesh = createSurfaceRegion(s, sceneManager);
    } else if (type === 'surface_marker' || type === 'nerve_marker') {
      mesh = createMarker(s, sceneManager, type === 'nerve_marker' ? 0.02 : 0.025);
    } else {
      mesh = createEllipsoid(s, sceneManager, 0.85);
    }

    if (!mesh) continue;

    // Store data on interactive meshes
    if (mesh.isMesh) {
      mesh.userData = { ...s, categoryId: category.id };
      container.add(mesh);
    } else if (mesh.isGroup) {
      mesh.traverse(child => {
        if (child.isMesh) child.userData = { ...s, categoryId: category.id };
      });
      container.add(mesh);
    }

    // For tubes, compute midpoint from points array; otherwise use position
    const structPos = s.position || (s.points ? s.points[Math.floor(s.points.length / 2)] : [0, 0, 0]);

    // Leader line + label outside brain
    const pos = sceneManager.mniToScene(structPos);
    const labelOffset = computeLabelOffset(structPos);
    const labelPos = sceneManager.mniToScene(labelOffset);

    // Leader line
    const lineGeo = new THREE.BufferGeometry().setFromPoints([pos, labelPos]);
    const lineMat = new THREE.LineBasicMaterial({
      color: s.color,
      transparent: true,
      opacity: 0.5,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.renderOrder = 999;
    container.add(line);

    // Dot at leader line endpoint
    const dotGeo = new THREE.SphereGeometry(0.006, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: s.color });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.copy(labelPos);
    container.add(dot);

    // CSS2D Label
    const label = createLabel(s.name_cn, s.color);
    label.position.copy(labelPos);
    container.add(label);

    group.add(container);
  }

  return group;
}

/**
 * Push label position outward from brain center so labels don't crowd.
 */
function computeLabelOffset(mniPos) {
  const [x, y, z] = mniPos;
  const pushOut = 22;
  const ox = x === 0 ? (y > 0 ? 8 : -8) : x;
  const signX = Math.sign(ox);
  return [
    signX * (Math.abs(x) + pushOut),
    y,
    z + 12
  ];
}

function createSurfaceRegion(s, sm) {
  const pos = sm.mniToScene(s.position);
  const sc = s.scale || [0.15, 0.15, 0.15];
  const geo = new THREE.SphereGeometry(1, 24, 24);
  const mat = new THREE.MeshPhysicalMaterial({
    color: s.color,
    transparent: true,
    opacity: 0.4,
    roughness: 0.5,
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

function createMarker(s, sm, size = 0.025) {
  const pos = sm.mniToScene(s.position);
  const outerGeo = new THREE.SphereGeometry(size, 16, 16);
  const outerMat = new THREE.MeshPhysicalMaterial({
    color: s.color, transparent: true, opacity: 0.5,
    roughness: 0.3, depthWrite: false,
  });
  const outer = new THREE.Mesh(outerGeo, outerMat);
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
  const geo = new THREE.TubeGeometry(curve, 32, 0.007, 6, false);
  const mat = new THREE.MeshPhysicalMaterial({
    color: s.color, roughness: 0.4, metalness: 0.1, clearcoat: 0.3,
  });
  return new THREE.Mesh(geo, mat);
}

function createLabel(text, color) {
  const div = document.createElement('div');
  div.className = 'structure-label';
  div.innerHTML = `<div class="structure-label-inner" style="border-left-color:${color}"><span>${text}</span></div>`;
  return new CSS2DObject(div);
}
