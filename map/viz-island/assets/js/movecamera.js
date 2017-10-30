var FirstPersonMovement = pc.createScript('firstPersonMovement');

// optional, assign a camera entity, otherwise one is created
FirstPersonMovement.attributes.add('camera', {
    type: 'entity'
});

// initialize code called once per entity
FirstPersonMovement.prototype.initialize = function() {
    this.distance = 10;
    this.height = 6;
    this.orbitAngle = 0;
};

// update code called every frame
FirstPersonMovement.prototype.update = function(dt) {

    //if (this.app.keyboard.isPressed(pc.input.KEY_LEFT)) {
        this.orbitAngle+=0.08;
    //}

    //if (this.app.keyboard.isPressed(pc.input.KEY_RIGHT)) {
    //    this.orbitAngle--;
    //}

    var cameraEntity = this.camera;

    // Step 1: Place the camera where the sphere is
    cameraEntity.setPosition(0, 0, 0);

    // Step 2: Rotate the ball around the world Y (up) axis by some stored angle
    cameraEntity.setEulerAngles(0, this.orbitAngle, 0);

    // Step 3: Move the camera backwards by some 'distance' and up by some 'height'
    // Note that a camera looks down its negative Z local axis. So if this.distance
    // is a positive number, it will move backwards.
    cameraEntity.translateLocal(0, this.height, this.distance);

    // Step 4: Look at the ball from the camera's new position
    cameraEntity.lookAt(0, 0, 0);
};