// https://medium.com/@necsoft/three-js-101-hello-world-part-1-443207b1ebe1

import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
const scene = new Scene();

// Create a basic perspective camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer with Antialiasing
const renderer = new WebGLRenderer({ antialias:true });

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: "#433F81" });
const cube = new Mesh(geometry, material);

// Add cube to Scene
scene.add(cube);

// Render Loop
const render = () => {
    requestAnimationFrame(render);
    
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // Render the scene
    renderer.render(scene, camera);
};

render();
