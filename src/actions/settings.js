// @flow

export function updateZoom(value: number) {
    return {
        type: "UPDATE_ZOOM",
        value,
    }
}

export function addZoom(value: number) {
    return {
        type: "ADD_ZOOM",
        value,
    }
}

export function updateCamera(value: string) {
    return {
        type: "UPDATE_CAMERA",
        value,
    }
}
