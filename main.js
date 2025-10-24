import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// Camera
const aspect = window.innerWidth / window.innerHeight;
const d = 20;
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);

camera.position.set(20, 20, 20); // Set camera position
camera.lookAt(scene.position); // Point camera to the center of the scene

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Grid Helper
const size = 100;
const divisions = 100;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// Ground Plane for Raycasting
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
const groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
groundPlane.rotation.x = -Math.PI / 2;
scene.add(groundPlane);

// Placeholder Cube
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
const cube = new THREE.Mesh(geometry, material);
cube.position.y = 1; // Place cube on top of the ground plane
scene.add(cube);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let targetPosition = new THREE.Vector3().copy(cube.position);

// Render Loop
function animate() {
    requestAnimationFrame(animate);

    // Smoothly move the cube towards the target position
    cube.position.lerp(targetPosition, 0.05);

    renderer.render(scene, camera);
}

animate();

// Handle Mouse Click
window.addEventListener('mousedown', (event) => {
    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObject(groundPlane);

    if (intersects.length > 0) {
        // Set the target position to the intersection point, but keep the cube's height
        targetPosition.set(intersects[0].point.x, 1, intersects[0].point.z);
    }
});


// Handle window resizing
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
