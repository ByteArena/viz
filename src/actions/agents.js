// @flow

export function addAgent(name: string, id: string) {
    return {
        type: "ADD_AGENT",
        name,
        id,
    }
}

export function clear() {
    return { type: "CLEAR" };
}
