import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import * as TWEEN from "@tweenjs/tween.js";

import { createCardElement } from "../components/cardElement.js";
import { showEntityModal } from "../components/modal.js";
import {
  createTableLayout,
  createSphereLayout,
  createDoubleHelixLayout,
  createGridLayout
} from "./layouts.js";

const TEngine = TWEEN.default || TWEEN;
const TweenClass = TEngine.Tween || TWEEN.Tween;
const EasingClass = TEngine.Easing || TWEEN.Easing;
const GroupClass = TEngine.Group || TWEEN.Group;

/**
 * SceneManager handles 3D CSS3DRenderer, camera framing, animations, layout transitions, and interactive search focus.
 */
export class SceneManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.objects = [];
    this.dataMap = new Map();
    this.targets = {};
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.controls = null;
    this.activeLayout = "table";
    this.currentSearchQuery = "";
    this.tweenGroup = new GroupClass();
  }

  init(data) {
    // Perspective Camera setup
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.set(0, 0, 3200);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();

    // Create 3D CSS Objects for dataset records
    data.forEach((item) => {
      const el = createCardElement(item);
      const cssObject = new CSS3DObject(el);
      cssObject.position.x = Math.random() * 4000 - 2000;
      cssObject.position.y = Math.random() * 4000 - 2000;
      cssObject.position.z = Math.random() * 4000 - 2000;

      this.dataMap.set(cssObject, item);

      el.addEventListener("click", () => {
        this.focusOnCard(cssObject, 1200);
        showEntityModal(item);
      });

      this.scene.add(cssObject);
      this.objects.push(cssObject);
    });

    // Calculate layout matrices
    const count = this.objects.length;
    this.targets = {
      table: createTableLayout(count),
      sphere: createSphereLayout(count),
      helix: createDoubleHelixLayout(count),
      grid: createGridLayout(count)
    };

    // CSS3DRenderer setup
    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    // TrackballControls setup
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 500;
    this.controls.maxDistance = 6000;
    this.controls.target.set(0, 0, 0);
    this.controls.addEventListener("change", () => this.render());

    // Pointer-directed cursor zooming
    this.setupCursorZoom();

    window.addEventListener("resize", () => this.onWindowResize());

    // Start animation loop
    requestAnimationFrame((time) => this.animate(time));

    // Primary default layout (Periodic Table)
    this.transform(this.targets.table, 1500);
  }

  /**
   * Dynamically updates 3D scene objects with new dataset records.
   * @param {Array<Object>} data - Updated array of candidate record objects
   */
  updateData(data) {
    if (!this.scene) return;

    // Remove existing CSS3DObjects from scene
    this.objects.forEach((obj) => {
      this.scene.remove(obj);
      if (obj.element && obj.element.parentNode) {
        obj.element.parentNode.removeChild(obj.element);
      }
    });

    this.objects = [];
    this.dataMap.clear();

    // Create new 3D CSS Objects for updated dataset records
    data.forEach((item) => {
      const el = createCardElement(item);
      const cssObject = new CSS3DObject(el);
      cssObject.position.x = Math.random() * 4000 - 2000;
      cssObject.position.y = Math.random() * 4000 - 2000;
      cssObject.position.z = Math.random() * 4000 - 2000;

      this.dataMap.set(cssObject, item);

      el.addEventListener("click", () => {
        this.focusOnCard(cssObject, 1200);
        showEntityModal(item);
      });

      this.scene.add(cssObject);
      this.objects.push(cssObject);
    });

    // Re-calculate layout matrices
    const count = this.objects.length;
    this.targets = {
      table: createTableLayout(count),
      sphere: createSphereLayout(count),
      helix: createDoubleHelixLayout(count),
      grid: createGridLayout(count)
    };

    // Transition objects to active layout positions
    if (this.targets[this.activeLayout]) {
      this.transform(this.targets[this.activeLayout], 1200);
    }

    // Re-apply search filter if query is currently set
    if (this.currentSearchQuery) {
      this.filterCards(this.currentSearchQuery);
    }
  }

  /**
   * Pointer-directed zooming: lerps camera target towards 3D focal point under pointer
   */
  setupCursorZoom() {
    const dom = this.renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    dom.addEventListener("wheel", (e) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        if (point && !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.z)) {
          this.controls.target.lerp(point, 0.12);
        }
      } else {
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -this.controls.target.z);
        const targetPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, targetPoint);
        if (targetPoint && !isNaN(targetPoint.x)) {
          this.controls.target.lerp(targetPoint, 0.08);
        }
      }
    }, { passive: true });
  }

  /**
   * Smoothly transforms 3D objects to target matrix positions/rotations
   */
  transform(targetArray, duration = 1500) {
    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      const target = targetArray[i];

      new TweenClass(object.position, this.tweenGroup)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration
        )
        .easing(EasingClass.Exponential.InOut)
        .start();

      new TweenClass(object.rotation, this.tweenGroup)
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration
        )
        .easing(EasingClass.Exponential.InOut)
        .start();
    }
  }

  /**
   * Switches active 3D layout mode and re-applies active search filters
   */
  setLayout(mode) {
    if (this.targets[mode]) {
      this.activeLayout = mode;

      if (this.tweenGroup) {
        this.tweenGroup.removeAll();
      }

      this.transform(this.targets[mode], 1500);

      const searchInput = document.getElementById("search-input") || document.querySelector('input[type="text"]');
      const query = searchInput ? searchInput.value.trim() : this.currentSearchQuery;

      if (query !== "") {
        this.filterCards(query);
      } else {
        this.resetCameraDefault(1200);
      }
    }
  }

  /**
   * Smoothly animates camera to frame target card upright and centered
   */
  focusOnCard(targetObject, duration = 1200) {
    if (!targetObject) return;

    const idx = this.objects.indexOf(targetObject);
    let targetPos;
    if (idx !== -1 && this.targets[this.activeLayout] && this.targets[this.activeLayout][idx]) {
      targetPos = this.targets[this.activeLayout][idx].position.clone();
    } else {
      targetPos = targetObject.position.clone();
    }

    if (isNaN(targetPos.x) || isNaN(targetPos.y) || isNaN(targetPos.z)) {
      this.resetCameraDefault();
      return;
    }

    let targetCamPos;
    let targetLookAt;

    if (this.activeLayout === "sphere" || this.activeLayout === "helix") {
      let dir = targetPos.clone().normalize();
      if (isNaN(dir.x) || isNaN(dir.y) || isNaN(dir.z) || dir.lengthSq() < 0.001) {
        dir = new THREE.Vector3(0, 0, 1);
      }
      targetCamPos = dir.multiplyScalar(2000);
      targetLookAt = new THREE.Vector3(0, 0, 0);
    } else if (this.activeLayout === "grid") {
      targetCamPos = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z + 1050);
      targetLookAt = targetPos.clone();
    } else {
      targetCamPos = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z + 850);
      targetLookAt = targetPos.clone();
    }

    if (isNaN(targetCamPos.x) || isNaN(targetCamPos.y) || isNaN(targetCamPos.z)) {
      this.resetCameraDefault();
      return;
    }

    this.camera.up.set(0, 1, 0);

    new TweenClass(this.camera.position, this.tweenGroup)
      .to({ x: targetCamPos.x, y: targetCamPos.y, z: targetCamPos.z }, duration)
      .easing(EasingClass.Cubic.Out)
      .start();

    new TweenClass(this.controls.target, this.tweenGroup)
      .to({ x: targetLookAt.x, y: targetLookAt.y, z: targetLookAt.z }, duration)
      .easing(EasingClass.Cubic.Out)
      .onUpdate(() => {
        this.camera.lookAt(this.controls.target);
      })
      .start();
  }

  /**
   * Resets camera smoothly to default overview position
   */
  resetCameraDefault(duration = 1200) {
    if (!this.camera || !this.controls) return;

    this.camera.up.set(0, 1, 0);

    new TweenClass(this.camera.position, this.tweenGroup)
      .to({ x: 0, y: 0, z: 3200 }, duration)
      .easing(EasingClass.Cubic.Out)
      .start();

    new TweenClass(this.controls.target, this.tweenGroup)
      .to({ x: 0, y: 0, z: 0 }, duration)
      .easing(EasingClass.Cubic.Out)
      .onUpdate(() => {
        this.camera.lookAt(this.controls.target);
      })
      .start();
  }

  /**
   * Filters 3D cards based on search query with visual highlighting
   */
  filterCards(query) {
    const rawQuery = (query || "").trim();
    this.currentSearchQuery = rawQuery;
    const q = rawQuery.toLowerCase();
    let firstMatch = null;

    this.objects.forEach((obj) => {
      const el = obj.element;
      if (!q) {
        el.style.opacity = "1";
        el.style.filter = "none";
        el.style.zIndex = "1";
        el.style.pointerEvents = "auto";
      } else {
        const text = el.textContent.toLowerCase();
        if (text.includes(q)) {
          el.style.opacity = "1";
          el.style.filter = "drop-shadow(0 0 30px #6366f1) brightness(1.3)";
          el.style.zIndex = "9999";
          el.style.pointerEvents = "auto";
          if (!firstMatch) {
            firstMatch = obj;
          }
        } else {
          el.style.opacity = "0.14";
          el.style.filter = "blur(2px) grayscale(70%)";
          el.style.zIndex = "1";
          el.style.pointerEvents = "none";
        }
      }
    });

    if (q && firstMatch) {
      this.focusOnCard(firstMatch, 1200);
    } else if (!q) {
      this.resetCameraDefault(1200);
    }

    this.render();
  }

  getFirstMatchItem(query) {
    const q = (query || "").toLowerCase().trim();
    if (!q) return null;
    for (const obj of this.objects) {
      if (obj.element && obj.element.textContent.toLowerCase().includes(q)) {
        return this.dataMap.get(obj) || null;
      }
    }
    return null;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate(time) {
    requestAnimationFrame((t) => this.animate(t));

    if (this.tweenGroup) {
      this.tweenGroup.update(time);
    }
    if (this.controls) {
      this.controls.update();
    }
    this.render();
  }
}
