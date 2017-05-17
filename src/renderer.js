import { WebGLRenderer } from 'three';

export default function createRenderer({ getDimensions }) {
    console.log("Create renderer !");

    const { width, height } = getDimensions();
	
	// Create the renderer
	const renderer = new WebGLRenderer({ 
		// Allow transparency to show the gradient background
		// we defined in the CSS
		alpha: true, 

		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine :)
		antialias: true 
	});

	// Define the size of the renderer; in this case,
	// it will fill the entire screen
	renderer.setSize(width, height);
	
	// Enable shadow rendering
	renderer.shadowMap.enabled = true;

    return renderer;
}