import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/**
 * Build 3D geometry + leader lines for deep structures.
 * All positions in MODEL coordinates, converted via sceneManager.modelToScene().
 */
export function buildDeepLayer(structures, sceneManager) {
  const group = new THREE.Group();

  for (const struct of structures) {
    for (const inst of struct.instances) {
      try {
        const container = new THREE.Group();
        const fullName = struct.name + (inst.suffix || '');
        container.name = fullName;

        const structPos = inst.position || (inst.points ? inst.points[Math.floor(inst.points.length / 2)] : [5, 90, 32]);

        let mesh;
        if (inst.points) {
          mesh = createTube(inst.points, struct, sceneManager);
        } else if (struct.type === 'shell') {
          mesh = createEllipsoid(inst.position, inst.scale, struct, sceneManager, struct.opacity ?? 0.06);
        } else {
          mesh = createEllipsoid(inst.position, inst.scale, struct, sceneManager, struct.opacity ?? 0.85);
        }

        if (!mesh) continue;

        const userData = {
          name_cn: fullName,
          name_en: (struct.name_en || '') + (inst.suffix || ''),
          color: struct.color,
          description: struct.description,
          position: structPos,
          categoryId: struct.category,
        };

        if (mesh.isMesh) {
          mesh.userData = userData;
          container.add(mesh);
        } else if (mesh.isGroup) {
          mesh.traverse(c => { if (c.isMesh) c.userData = userData; });
          container.add(mesh);
        }

        // Leader line + label outside brain
        const pos3 = sceneManager.modelToScene(structPos);
        const labelModelPos = computeLabelOffset(structPos);
        const labelPos3 = sceneManager.modelToScene(labelModelPos);

        addLeaderLine(container, pos3, labelPos3, struct.color, fullName);

        group.add(container);
      } catch (err) {
        console.warn('Failed to build:', struct.name_en, err);
      }
    }
  }

  return group;
}

/**
 * Build leader-line labels for surface-painted regions (no 3D geometry).
 */
export function buildSurfaceLabels(regions, sceneManager) {
  const group = new THREE.Group();

  for (const region of regions) {
    const container = new THREE.Group();
    container.name = region.name_en || region.id;

    const anchor = region.anchor;
    if (!anchor) continue;

    const anchorPos = sceneManager.modelToScene(anchor);
    const labelModelPos = computeLabelOffset(anchor);
    const labelPos = sceneManager.modelToScene(labelModelPos);

    // Small dot at anchor on brain surface
    const dotGeo = new THREE.SphereGeometry(0.008, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: region.color });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.copy(anchorPos);
    dot.userData = {
      name_cn: region.name,
      name_en: region.name_en,
      color: region.color,
      description: region.description,
      position: anchor,
      categoryId: region.category,
      isSurfaceMarker: true,
    };
    container.add(dot);

    addLeaderLine(container, anchorPos, labelPos, region.color, region.name);

    group.add(container);
  }

  return group;
}

// ── Helpers ──

function computeLabelOffset(modelPos) {
  const [x, y, z] = modelPos;
  const midX = 5;
  const pushOut = 45; // model units outward
  const pushUp = 15;

  const dx = x - midX;
  const signX = dx === 0 ? -1 : Math.sign(dx);

  return [
    x + signX * pushOut,
    Math.min(y + pushUp, 195),
    z,
  ];
}

function addLeaderLine(container, from, to, color, labelText) {
  // Thin line
  const lineGeo = new THREE.BufferGeometry().setFromPoints([from, to]);
  const lineMat = new THREE.LineBasicMaterial({
    color, transparent: true, opacity: 0.5, depthTest: false,
  });
  const line = new THREE.Line(lineGeo, lineMat);
  line.renderOrder = 999;
  container.add(line);

  // Endpoint dot
  const dotGeo = new THREE.SphereGeometry(0.004, 6, 6);
  const dotMat = new THREE.MeshBasicMaterial({ color });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.position.copy(to);
  container.add(dot);

  // CSS label
  const div = document.createElement('div');
  div.className = 'structure-label';
  div.innerHTML = `<div class="structure-label-inner" style="border-left-color:${color}"><span>${labelText}</span></div>`;
  const label = new CSS2DObject(div);
  label.position.copy(to);
  container.add(label);
}

function createEllipsoid(pos, scale, struct, sm, opacity = 0.85) {
  const scenePos = sm.modelToScene(pos);
  const sc = scale || [0.04, 0.04, 0.04];
  const geo = new THREE.SphereGeometry(1, 16, 16);
  const mat = new THREE.MeshPhysicalMaterial({
    color: struct.color,
    transparent: opacity < 1,
    opacity,
    roughness: 0.5,
    metalness: 0.05,
    clearcoat: 0.2,
    side: opacity < 0.5 ? THREE.DoubleSide : THREE.FrontSide,
    depthWrite: opacity > 0.5,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(scenePos);
  mesh.scale.set(sc[0], sc[1], sc[2]);
  return mesh;
}

function createTube(points, struct, sm) {
  if (!points || points.length < 2) return null;
  const pts = points.map(p => sm.modelToScene(p));
  const curve = new THREE.CatmullRomCurve3(pts);
  const tubeRadius = struct.type === 'tube' ? 0.008 : 0.006;
  const geo = new THREE.TubeGeometry(curve, 32, tubeRadius, 6, false);
  const mat = new THREE.MeshPhysicalMaterial({
    color: struct.color,
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.3,
    transparent: (struct.opacity ?? 1) < 1,
    opacity: struct.opacity ?? 1,
  });
  return new THREE.Mesh(geo, mat);
}
