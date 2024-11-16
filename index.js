import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Sky } from 'three/addons/objects/Sky.js'

const gui = new GUI();

const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setClearColor(0x000000);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 10);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// lights
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight('#86cdff', 1);
sunLight.position.set(10, 10, 10);
sunLight.castShadow = true;
scene.add(sunLight);

// Mappings
sunLight.shadow.mapSize.width = 256
sunLight.shadow.mapSize.height = 256
sunLight.shadow.camera.top = 8
sunLight.shadow.camera.right = 8
sunLight.shadow.camera.bottom = - 8
sunLight.shadow.camera.left = - 8
sunLight.shadow.camera.near = 1
sunLight.shadow.camera.far = 20

const textureLoader = new THREE.TextureLoader()

// floor
const floorAlphaTexture = textureLoader.load('./assets/floor/alpha.webp')
const floorColorTexture = textureLoader.load('./assets/floor/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('./assets/floor/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./assets/floor/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./assets/floor/coast_sand_rocks_02_disp_1k.webp')

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

floorColorTexture.colorSpace = THREE.SRGBColorSpace

const floorGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorColorTexture,
  alphaMap: floorAlphaTexture,
  aoMap: floorARMTexture,
  roughnessMap: floorARMTexture,
  metalnessMap: floorARMTexture,
  normalMap: floorNormalTexture,
  displacementMap: floorDisplacementTexture,
  displacementScale: 0.3,
  displacementBias: -0.2,
  transparent: true,
  side: THREE.DoubleSide
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// house
const house = new THREE.Group();
scene.add(house);

// Wall
const wallColorTexture = textureLoader.load('./assets/brick/castle_brick_broken_06_diff_1k.webp')
const wallARMTexture = textureLoader.load('./assets/brick/castle_brick_broken_06_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./assets/brick/castle_brick_broken_06_nor_gl_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
    side: THREE.DoubleSide
  })
);
walls.position.y += 1.25;
house.add(walls);
walls.receiveShadow = true;
walls.castShadow = true;

// Roof
const roofColorTexture = textureLoader.load('./assets/roof/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./assets/roof/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./assets/roof/roof_slates_02_nor_gl_1k.webp')

roofColorTexture.colorSpace = THREE.SRGBColorSpace
roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
    side: THREE.DoubleSide
  })
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = -Math.PI / 4;
house.add(roof);
// roof.receiveShadow = true;
roof.castShadow = true;

// Door
const doorColorTexture = textureLoader.load('./assets/door/color.webp')
const doorAlphaTexture = textureLoader.load('./assets/door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('./assets/door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('./assets/door/height.webp')
const doorNormalTexture = textureLoader.load('./assets/door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./assets/door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./assets/door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    side: THREE.DoubleSide,
  })
);
door.position.set(0, 1.1, 2.01);
house.add(door);
door.receiveShadow = true;
door.castShadow = true;

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

scene.add(ghost1, ghost2, ghost3)

// Bush
const bushColorTexture = textureLoader.load('./assets/bush/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./assets/bush/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./assets/bush/leaves_forest_ground_nor_gl_1k.webp')

bushColorTexture.colorSpace = THREE.SRGBColorSpace
bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#ccffcc',
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture
});
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = - 0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush1.rotation.x = - 0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)
bush1.rotation.x = - 0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)
bush1.rotation.x = - 0.75

house.add(bush1, bush2, bush3, bush4)

// graves
const graveColorTexture = textureLoader.load('./assets/grave/plastered_stone_wall_diff_1k.webp')
const graveARMTexture = textureLoader.load('./assets/grave/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./assets/grave/plastered_stone_wall_nor_gl_1k.webp')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

const gravesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const gravesMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});
const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 3 + Math.random() * 4
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  const grave = new THREE.Mesh(gravesGeometry, gravesMaterial)
  grave.position.set(x, Math.random() * 0.4, z)
  grave.rotation.x = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  graves.add(grave)
}

for (const grave of graves.children) {
  grave.castShadow = true
  grave.receiveShadow = true
}

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Fog
 */
// scene.fog = new THREE.FogExp2('#ff0000', 0.1)
scene.fog = new THREE.FogExp2('#04343f', 0.1)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

const clock = new THREE.Clock()

function animate() {
  window.requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime()
  // Ghosts
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

  const ghost2Angle = -elapsedTime * 0.38
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

  const ghost3Angle = elapsedTime * 0.23
  ghost3.position.x = Math.cos(ghost3Angle) * 6
  ghost3.position.z = Math.sin(ghost3Angle) * 6
  ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

  renderer.render(scene, camera);
  controls.update();
}

animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});