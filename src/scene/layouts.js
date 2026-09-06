import * as THREE from "three";

/**
 * Creates Table Layout (20 Columns × 10 Rows arrangement = 200 tiles)
 */
export function createTableLayout(count) {
  const targets = [];
  const cols = 20;
  const rows = Math.ceil(count / cols);

  for (let i = 0; i < count; i++) {
    const object = new THREE.Object3D();

    const col = i % cols;
    const row = Math.floor(i / cols);

    object.position.x = col * 160 - ((cols - 1) * 160) / 2;
    object.position.y = -(row * 200) + ((Math.min(rows, 10) - 1) * 200) / 2;
    object.position.z = 0;
    object.rotation.set(0, 0, 0);

    targets.push(object);
  }

  return targets;
}

/**
 * Creates Fibonacci Sphere Layout with Outward Facing Orientations
 */
export function createSphereLayout(count) {
  const targets = [];
  const vector = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;

    const object = new THREE.Object3D();
    object.position.setFromSphericalCoords(850, phi, theta);

    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);

    targets.push(object);
  }

  return targets;
}

/**
 * Creates Double Helix Layout (2 Intertwined Spiral Strands)
 */
export function createDoubleHelixLayout(count) {
  const targets = [];
  const vector = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const strand = i % 2;
    const indexInStrand = Math.floor(i / 2);
    const angle = indexInStrand * 0.175 + strand * Math.PI;

    const object = new THREE.Object3D();
    object.position.x = 900 * Math.sin(angle);
    object.position.y = -(indexInStrand * 16) + 750;
    object.position.z = 900 * Math.cos(angle);

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;
    object.lookAt(vector);

    targets.push(object);
  }

  return targets;
}

/**
 * Creates Grid Layout (Exactly 5 x 4 x 10 depth matrix)
 */
export function createGridLayout(count) {
  const targets = [];

  for (let i = 0; i < count; i++) {
    const object = new THREE.Object3D();

    const x = i % 5;
    const y = Math.floor(i / 5) % 4;
    const z = Math.floor(i / 20);

    object.position.x = x * 360 - 720;
    object.position.y = -(y * 360) + 540;
    object.position.z = z * 360 - 1600;
    object.rotation.set(0, 0, 0);

    targets.push(object);
  }

  return targets;
}
