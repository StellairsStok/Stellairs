import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/**
 * Build 3D geometry + leader lines for deep structures.
 *
 * All positions are in MODEL coordinates and converted via
 * sceneManager.modelToScene().
 *
 * If an instance carries a `labelPos` field (model coords), that exact
 * position is used for the CSS label — preventing the pile-up of midline
 * labels on one side that the old auto-offset caused.
 */
export function buildDeepLayer(structures, sceneManager) {
  const group = new THREE.Group();

  for (const struct of structures) {
    for (const inst of struct.instances) {
      try {
        const container = new THREE.Group();
        const fullName = struct.name + (inst.suffix || '');
        container.name = fullName;

        // Representative position (centre of structure, for leader-line root)
        const structPos = inst.position
          || (inst.points ? inst.points[Math.floor(inst.points.length / 2)] : [5, 90, 32]);

        // Build the 3D mesh
        let mesh;
        if (inst.points) {
          mesh = createTube(inst.points, struct, sceneManager);
        } else if (struct.type === 'shell') {
          mesh = createEllipsoid(inst.position, inst.scale, struct, sceneManager, struct.opacity ?? 0.07);
        } else {
          mesh = createEllipsoid(inst.position, inst.scale, struct, sceneManager, struct.opacity ?? 0.88);
        }

        if (!mesh) continue;

        const userData = {
          name_cn:    fullName,
          name_en:    (struct.name_en || '') + (inst.suffix || ''),
          color:      struct.color,
          description: struct.description,
          position:   structPos,
          categoryId: struct.category,
        };

        if (mesh.isMesh) {
          mesh.userData = userData;
          container.add(mesh);
        } else if (mesh.isGroup) {
          mesh.traverse(c => { if (c.isMesh) c.userData = userData; });
          container.add(mesh);
        }

        // ── Leader line & label ──
        const rootPos3  = sceneManager.modelToScene(structPos);
        // Use explicit labelPos if provided, otherwise auto-compute
        const labelModelPos = inst.labelPos
          ? inst.labelPos
          : autoLabelOffset(structPos);
        const labelPos3 = sceneManager.modelToScene(labelModelPos);

        addLeaderLine(container, rootPos3, labelPos3, struct.color, fullName);

        group.add(container);
      } catch (err) {
        console.warn('LayerBuilder: failed to build', struct.name_en, err);
      }
    }
  }

  return group;
}

/**
 * Build leader-line labels for surface-painted regions (no 3D geometry).
 * The anchor point sits on the brain surface; the label floats outside.
 */
export function buildSurfaceLabels(regions, sceneManager) {
  const group = new THREE.Group();

  for (const region of regions) {
    const container = new THREE.Group();
    container.name = region.name_en || region.id;

    const anchor = region.anchor;
    if (!anchor) continue;

    const anchorPos3 = sceneManager.modelToScene(anchor);
    const labelModelPos = autoLabelOffset(anchor);
    const labelPos3     = sceneManager.modelToScene(labelModelPos);

    // Small colour dot on the brain surface
    const dotGeo = new THREE.SphereGeometry(0.009, 10, 10);
    const dotMat = new THREE.MeshBasicMaterial({ color: region.color, depthTest: false });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.copy(anchorPos3);
    dot.renderOrder = 998;
    dot.userData = {
      name_cn:    region.name,
      name_en:    region.name_en,
      color:      region.color,
      description: region.description,
      position:   anchor,
      categoryId: region.category,
      isSurfaceMarker: true,
    };
    container.add(dot);

    addLeaderLine(container, anchorPos3, labelPos3, region.color, region.name);
    group.add(container);
  }

  return group;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Auto-compute a sensible label position when no explicit `labelPos` is given.
 * Pushes the label laterally outward + slightly upward from the structure centre.
 */
function autoLabelOffset(modelPos) {
  const [x, y, z] = modelPos;
  const midX = 5;
  const dx   = x - midX;
  // For left-hemisphere structures push left; right → right; midline → left
  const sign = dx < -5 ? -1 : dx > 5 ? 1 : -1;
  const pushX = sign * (Math.abs(dx) + 55);
  return [
    midX + pushX,
    Math.min(y + 18, 192),
    z,
  ];
}

/**
 * Draw a thin leader line from `from` to `to`, plus an endpoint dot and a
 * CSS2D text label at `to`.
 */
function addLeaderLine(container, from, to, color, labelText) {
  // Dashed thin line
  const lineGeo = new THREE.BufferGeometry().setFromPoints([from, to]);
  const lineMat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.55,
    depthTest: false,
  });
  const line = new THREE.Line(lineGeo, lineMat);
  line.renderOrder = 999;
  container.add(line);

  // Endpoint dot
  const dotGeo = new THREE.SphereGeometry(0.005, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color, depthTest: false });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.position.copy(to);
  dot.renderOrder = 999;
  container.add(dot);

  // CSS label
  const div = document.createElement('div');
  div.className = 'structure-label';
  div.innerHTML = `
    <div class="structure-label-inner" style="--lc:${color}">
      <span class="structure-label-pip" style="background:${color}"></span>
      <span>${labelText}</span>
    </div>`;
  const label = new CSS2DObject(div);
  label.position.copy(to);
  container.add(label);
}

/**
 * Create an ellipsoidal mesh representing a deep nucleus.
 *
 * @param {number[]} pos     Model-space centre [x, y, z]
 * @param {number[]} scale   Scene-space radii [rx, ry, rz]
 * @param {object}   struct  Structure definition (color, etc.)
 * @param {object}   sm      SceneManager instance
 * @param {number}   opacity 0–1
 */
function createEllipsoid(pos, scale, struct, sm, opacity = 0.88) {
  const scenePos = sm.modelToScene(pos);
  const sc = scale || [0.06, 0.06, 0.06];

  const geo = new THREE.SphereGeometry(1, 20, 20);
  const mat = new THREE.MeshPhysicalMaterial({
    color:      struct.color,
    transparent: opacity < 1,
    opacity,
    roughness:  0.45,
    metalness:  0.05,
    clearcoat:  0.25,
    clearcoatRoughness: 0.3,
    side:       opacity < 0.5 ? THREE.DoubleSide : THREE.FrontSide,
    depthWrite: opacity > 0.5,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(scenePos);
  mesh.scale.set(sc[0], sc[1], sc[2]);
  return mesh;
}

/**
 * Create a tube mesh along a series of model-space waypoints.
 *
 * @param {number[][]} points  Array of [x, y, z] model-space points
 * @param {object}     struct  Structure definition
 * @param {object}     sm      SceneManager instance
 */
function createTube(points, struct, sm) {
  if (!points || points.length < 2) return null;

  const pts   = points.map(p => sm.modelToScene(p));
  const curve = new THREE.CatmullRomCurve3(pts);

  // Slightly thicker radius for better visibility
  const radius = struct.id === 'arteries' ? 0.007 : 0.010;
  const geo = new THREE.TubeGeometry(curve, 40, radius, 8, false);
  const opacity = struct.opacity ?? 1;

  const mat = new THREE.MeshPhysicalMaterial({
    color:      struct.color,
    roughness:  0.35,
    metalness:  0.12,
    clearcoat:  0.35,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity > 0.5,
  });

  return new THREE.Mesh(geo, mat);
}
