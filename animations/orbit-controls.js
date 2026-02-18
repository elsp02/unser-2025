console.clear();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


const orbitFrame = document.getElementById("orbitFrame");
const orbitToggle = document.getElementById("orbitToggle");
const container = document.getElementById("orbit-control-container");
const downloadBtn = document.getElementById("downloadBtn");

// Fallback: falls du den Frame nicht hast, kann er auch direkt der Container sein
if (!container) {
  throw new Error(" #orbit-control-container wurde nicht gefunden.");
}

   //1 = aspect ratio, 0.1 - 1000 ist near/far clipping plane (alles näher als 0.1 und weiter als 1000 wird abgeschnitten )
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 4, 2);


const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement); //orbit-control container in der die szene reingesetzt wird

// Resize an Container (nicht an window!) -> szene wird größentechnisch an container angepasst
function resizeToContainer() {
  const w = container.clientWidth || 1; //Falls clientWidth kurz 0 ist (z.B. Element unsichtbar), bekommst ich nicht aspect = 0/0
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
//scene.add(new THREE.AxesHelper(5));

// Boden
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshPhongMaterial({ color: "#fbfaf2", side: THREE.DoubleSide })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.2;
floor.receiveShadow = true;
scene.add(floor);

// Model laden
const loader = new GLTFLoader();
loader.load(
  "./scan/scan-elena.glb",
  (gltf) => {
    const object = gltf.scene;
    object.scale.set(2, 2, 2);
    scene.add(object);

    // BoundingBox + Center + Size berechnen
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Blickpunkt = Center + Offset nach oben
    const target = center.clone();
    target.y += size.y * 0.25; // 25% der Höhe nach oben (tweak: 0.15–0.4)

    // OrbitControls: Zielpunkt = echter Model-Center
    controls.target.copy(target);

    // Kamera sinnvoll positionieren (fit-to-object)
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = THREE.MathUtils.degToRad(camera.fov);
    let dist = (maxDim / 2) / Math.tan(fov / 2);

    // bisschen “Luft” geben
    dist *= 1.2;

    // Richtung: schräg von vorne-oben
    const dir = new THREE.Vector3(1, 0.6, 1).normalize();
    camera.position.copy(target).addScaledVector(dir, dist);

    camera.near = dist / 100;
    camera.far  = dist * 100;
    camera.updateProjectionMatrix();

    //  wie weit/nah zoomen
    controls.minDistance = dist * 0.2;
    controls.maxDistance = dist * 1.0;
    controls.update();

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
//controls.maxDistance = 6;
//controls.minDistance = 2;

// Mobile Touch: 1 Finger rotate, 2 Finger pinch zoom
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_ROTATE,
};


// Verhindert normales touch verhalten 
renderer.domElement.style.touchAction = "none";
renderer.domElement.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
renderer.domElement.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
renderer.domElement.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });

   //speichert wo der frame vorher war
let originalcontainer = null; // wo war die szene drin
let originalnextcontainer = null; //welches element kommt danach? - damit an richtige stelle zurücksetzen

// Host = container den ich fullscreen in main packe und nur dafür erstelle
const host = document.createElement("div");
host.className = "orbit-fullscreen-host";

function setOrbitFullscreen(fullscreen) {
  document.body.classList.toggle("orbit-fullscreen", fullscreen);

  // fallback zeilen (nicht unbedingt notwendig) Wenn kein orbitFrame existiert, skipp nur die CSS-Klasse
  if (!orbitFrame) {
    if (orbitToggle) orbitToggle.textContent = fullscreen ? "Minimieren" : "Maximieren";
    resizeToContainer();
    return;
  }

  //wenn ifFullscreen dann fullscreen aktivieren
  if (fullscreen) {
    // Originalposition merken
    originalcontainer = orbitFrame.parentNode;
    originalnextcontainer = orbitFrame.nextSibling;

    // Frame in den Host schieben und Host ins main setzen
    host.appendChild(orbitFrame);
    document.querySelector("main")?.appendChild(host);

    if (orbitToggle) orbitToggle.textContent = "Minimieren";
  } 
  //ansonsten deaktivieren
    else {
    // Zurück an die Originalposition
    if (originalcontainer) {
      if (originalnextcontainer) originalcontainer.insertBefore(orbitFrame, originalnextcontainer);
      else originalcontainer.appendChild(orbitFrame);
    }
    if (host.parentNode) host.parentNode.removeChild(host);

    if (orbitToggle) orbitToggle.textContent = "Maximieren";
  }

  // Wichtig: nach Layout-Wechsel einmal neu anpassen
  resizeToContainer();

  // GSAP/ScrollTrigger refresh:
  if (window.ScrollTrigger) {
    requestAnimationFrame(() => window.ScrollTrigger.refresh());
  }
}

// klick auf Button "Maximieren"
if (orbitToggle) {
  orbitToggle.addEventListener("pointerdown", () => {
    const fullscreen = document.body.classList.contains("orbit-fullscreen");
    setOrbitFullscreen(!fullscreen); //umtoggeln
    if (downloadBtn) {
      downloadBtn.style.opacity = "1";
      downloadBtn.style.pointerEvents = "auto";
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
