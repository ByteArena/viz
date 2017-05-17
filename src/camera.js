import { PerspectiveCamera } from 'three';

export default function createCamera({ getDimensions }) {
    console.log("Create camera !");

    const { width, height } = getDimensions();

    // Create the camera
    const fieldOfView = 60;
	const aspectRatio = width / height;
	const nearPlane = 1;
	const farPlane = 10000;
	const camera = new PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	// Set the position of the camera
	camera.position.x = 0;
	camera.position.y = 100;
    camera.position.z = 200;

    return camera;
}