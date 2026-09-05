import * as THREE from "three";

/**
 * Creates Periodic Table Silhouette Layout
 * 18 columns wide with chemical element period gaps and lanthanide/actinide spacing.
 */
export function createTableLayout(count) {
  const targets = [];
  const tableCoords = [];

  // Period 1: Col 0 (H), Col 17 (He)
  tableCoords.push([0, 0], [17, 0]);

  // Period 2: Cols 0-1, Cols 12-17
  for (let c = 0; c <= 1; c++) tableCoords.push([c, 1]);
  for (let c = 12; c <= 17; c++) tableCoords.push([c, 1]);

  // Period 3: Cols 0-1, Cols 12-17
  for (let c = 0; c <= 1; c++) tableCoords.push([c, 2]);
  for (let c = 12; c <= 17; c++) tableCoords.push([c, 2]);

  // Periods 4-7: Cols 0-17
  for (let r = 3; r <= 6; r++) {
    for (let c = 0; c <= 17; c++) {
      tableCoords.push([c, r]);
    }
  }

  // Lanthanides & Actinides: Cols 2-16
  for (let r = 8; r <= 9; r++) {
    for (let c = 2; c <= 16; c++) {
      tableCoords.push([c, r]);
    }
  }

  let extRow = 11;
  let extCol = 0;

  for (let i = 0; i < count; i++) {
    const object = new THREE.Object3D();
    let col, row;

    if (i < tableCoords.length) {
      col = tableCoords[i][0];
      row = tableCoords[i][1];
    } else {
      col = extCol;
      row = extRow;
      extCol++;
      if (extCol >= 18) {
        extCol = 0;
        extRow++;
      }
    }

    object.position.x = col * 145 - 1230;
    object.position.y = -(row * 185) + 850;
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
