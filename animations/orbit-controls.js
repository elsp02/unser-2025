console.clear();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


//three.js scene
const scene = new THREE.Scene();
//kamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

//orbit controls
let controls;

let object;

//loader initialisieren
const loader = new GLTFLoader();

loader.load(
    "gltf/bottle.gltf",
    function (gltf){
        object = gltf.scene;
        object.scale.set(50, 50, 50)
        scene.add(object);
         object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    },
    function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        //If there is an error, log it
        console.error(error);
    }
    
);

//renderer initialisieren
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

//renderer in container tun und zu DOM hinzufügen
document.getElementById("orbit-control-container").appendChild(renderer.domElement);

//kamera positionieren
camera.position.set(0, 5, 25);
camera.lookAt(0, 0, 0);


//------------------
//Licht (gibt noch Spotlight und Pointlight)
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
//es gibt kein ambienLightHelper

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 15, 0);
directionalLight.castShadow = true; //sorgt dafür, dass das licht schatten wirft

//größe des schattenkasts einstellen, damit der schatten nicht abgeschnitten wird
const d = 30;   // spiel hiermit herum!

directionalLight.shadow.camera.left   = -d;
directionalLight.shadow.camera.right  =  d;
directionalLight.shadow.camera.top    =  d;
directionalLight.shadow.camera.bottom = -d;


const dLHelper = new THREE.DirectionalLightHelper(directionalLight, 3);

const spotLight = new THREE.SpotLight("#ffffff", 1); 
spotLight.angle = Math.PI / 6;// (color, intensity, distance, angle, penumbra, decay)
spotLight.position.set(5, 30, 2);
spotLight.castShadow = true;

const sLHelper = new THREE.SpotLightHelper(spotLight, 3);

scene.add(ambientLight, directionalLight, dLHelper, spotLight, sLHelper);
//mainGroup.add(ambientLight, directionalLight, dLHelper);

scene.add(new THREE.AxesHelper(5));

//----------------------
//boden initialisieren
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100), //größe des bodens
  new THREE.MeshPhongMaterial({ color: "#fbfaf2", side: THREE.DoubleSide })
  //new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide }) //material und farbe des bodens
);
floor.rotation.x = -Math.PI / 2; //boden drehen damit er horizontal liegt
floor.position.y = -1; //boden nach unten verschieben damit er unter dem objekt liegt
floor.receiveShadow = true; //sorgt dafür, dass der boden schatten empfängt
scene.add(floor);

//-----------------------
//zum kamera kontrollieren damit wir rotieren, zoomen können  mit der maus
controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true; //für sanftere bewegung
controls.enablePan = false; //verhindert verschieben vom objekt
controls.maxPolarAngle = Math.PI / 2; //verhindert, dass ich unter das objekt komme
controls.maxDistance = 60; //wie weit ich rasugehen kann mit der kamera 
//controls.maxZoom = 20; //wie nah ich ranzoomen kann


//raycaster


//--------------
//szene wird nun gerendert
function animate() {
    requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement
  
  controls.update();// nur benötigt wenn damping = true
  renderer.render(scene, camera);
};

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//3D rendering starten
animate();