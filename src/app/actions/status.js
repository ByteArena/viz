// @flow

export function updateStatus(status: boolean) {
    return {
        type: "UPDATE_STATUS",
        status,
    }
}
