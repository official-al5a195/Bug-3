// Select the right panel container
const container = document.querySelector('.right-panel');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Resize handling for the right panel only
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Example geometry (replace with your heart animation logic)
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xee5282, wireframe: true });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

camera.position.z = 50;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
