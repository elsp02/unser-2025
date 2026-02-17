console.clear();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* =========================================================
   0) DOM ELEMENTS (müssen im HTML existieren)
   - #orbitFrame               (Rahmen/Preview-Card)
   - #orbitToggle              (Button/Text "Maximieren")
   - #orbit-control-container  (Canvas-Container)
   ========================================================= */

const orbitFrame = document.getElementById("orbitFrame");
const orbitToggle = document.getElementById("orbitToggle");
const container = document.getElementById("orbit-control-container");

// Fallback: falls du den Frame nicht hast, kann er auch direkt der Container sein
if (!container) {
  throw new Error(" #orbit-control-container wurde nicht gefunden.");
}

/* =========================================================
   1) THREE.JS SETUP
   ========================================================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 5, 25);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Resize an Container (nicht an window!)
function resizeToContainer() {
  const w = container.clientWidth || 1;
  const h = container.clientHeight || 1;

  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resizeToContainer();

// Auch auf Layout-Änderungen reagieren (z.B. beim Maximieren)
const ro = new ResizeObserver(() => resizeToContainer());
ro.observe(container);

// Licht
const ambientLight = new THREE.AmbientLight(0xffffff, 2);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 15, 0);
directionalLight.castShadow = true;

const d = 30;
directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;

scene.add(ambientLight, directionalLight);
scene.add(new THREE.AxesHelper(5));

// Boden
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshPhongMaterial({ color: "#fbfaf2", side: THREE.DoubleSide })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Model laden
const loader = new GLTFLoader();
loader.load(
  "gltf/bottle.gltf",
  (gltf) => {
    const object = gltf.scene;
    object.scale.set(50, 50, 50);
    scene.add(object);

    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  },
  (xhr) => {
    if (xhr.total) console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => console.error(error)
);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;
controls.maxDistance = 60;

// Mobile Touch: 1 Finger rotate, 2 Finger pinch zoom
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_ROTATE,
};

// Verhindert, dass Mobile beim Wischen im Canvas die Seite scrollt
renderer.domElement.style.touchAction = "none";
renderer.domElement.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
renderer.domElement.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
renderer.domElement.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });

/* =========================================================
   2) FULLSCREEN TOGGLE (Maximieren / Minimieren)
   - setzt/entfernt body Klasse: orbit-fullscreen
   - verschiebt optional den Frame in einen Host, damit nur der sichtbar ist
   ========================================================= */

let originalParent = null;
let originalNextSibling = null;

// Host (damit der Frame im Fullscreen alleine steht)
const host = document.createElement("div");
host.className = "orbit-fullscreen-host";

function setOrbitFullscreen(isFullscreen) {
  document.body.classList.toggle("orbit-fullscreen", isFullscreen);

  // Wenn kein orbitFrame existiert, skippen wir nur die CSS-Klasse
  if (!orbitFrame) {
    if (orbitToggle) orbitToggle.textContent = isFullscreen ? "Minimieren" : "Maximieren";
    resizeToContainer();
    return;
  }

  if (isFullscreen) {
    // Originalposition merken
    originalParent = orbitFrame.parentNode;
    originalNextSibling = orbitFrame.nextSibling;

    // Frame in den Host schieben und Host ins main setzen
    host.appendChild(orbitFrame);
    document.querySelector("main")?.appendChild(host);

    if (orbitToggle) orbitToggle.textContent = "Minimieren";
  } else {
    // Zurück an die Originalposition
    if (originalParent) {
      if (originalNextSibling) originalParent.insertBefore(orbitFrame, originalNextSibling);
      else originalParent.appendChild(orbitFrame);
    }
    if (host.parentNode) host.parentNode.removeChild(host);

    if (orbitToggle) orbitToggle.textContent = "Maximieren";
  }

  // Wichtig: nach Layout-Wechsel einmal neu anpassen
  resizeToContainer();

  // Falls du GSAP/ScrollTrigger nutzt, optional refresh:
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => window.ScrollTrigger.refresh());
  }
}

// Doppelklick auf Button "Maximieren"
if (orbitToggle) {
  orbitToggle.addEventListener("dblclick", () => {
    const nowFull = document.body.classList.contains("orbit-fullscreen");
    setOrbitFullscreen(!nowFull);
  });
}

// Optional: Doppelklick direkt auf das Canvas toggelt auch
renderer.domElement.addEventListener("dblclick", () => {
  const nowFull = document.body.classList.contains("orbit-fullscreen");
  setOrbitFullscreen(!nowFull);
});

// Optional: ESC zum Minimieren
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("orbit-fullscreen")) {
    setOrbitFullscreen(false);
  }
});

/* =========================================================
   3) RENDER LOOP
   ========================================================= */

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
