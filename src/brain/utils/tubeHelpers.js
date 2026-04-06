import * as THREE from 'three';

/**
 * Create a tube mesh along a spline curve
 */
export function createTube(points, radius = 0.015, color = 0xff0000, segments = 64) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(...p))
  );
  const geometry = new THREE.TubeGeometry(curve, segments, radius, 8, false);
  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.5,
    metalness: 0.1,
    clearcoat: 0.3,
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * Create a tapered tube (varying radius)
 */
export function createTaperedTube(points, radiusStart = 0.02, radiusEnd = 0.008, color = 0xff0000) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(...p))
  );
  const segments = 48;
  const radialSegments = 8;

  // Custom tube with varying radius
  const frames = curve.computeFrenetFrames(segments, false);
  const vertices = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const radius = radiusStart + (radiusEnd - radiusStart) * t;
    const point = curve.getPointAt(t);
    const N = frames.normals[i];
    const B = frames.binormals[i];

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      const nx = cos * N.x + sin * B.x;
      const ny = cos * N.y + sin * B.y;
      const nz = cos * N.z + sin * B.z;

      vertices.push(
        point.x + radius * nx,
        point.y + radius * ny,
        point.z + radius * nz
      );
      normals.push(nx, ny, nz);
      uvs.push(t, j / radialSegments);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.5,
    metalness: 0.1,
    clearcoat: 0.3,
  });

  return new THREE.Mesh(geometry, material);
}

/**
 * Create a smooth ellipsoid mesh
 */
export function createEllipsoid(rx, ry, rz, color, options = {}) {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  geometry.scale(rx, ry, rz);

  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: options.roughness ?? 0.6,
    metalness: options.metalness ?? 0.05,
    clearcoat: options.clearcoat ?? 0.3,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
    side: options.side ?? THREE.FrontSide,
  });

  return new THREE.Mesh(geometry, material);
}
