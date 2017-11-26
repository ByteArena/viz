// @flow

export function addAgent(name: string, id: string) {
    return {
        type: "ADD_AGENT",
        name,
        id,
    }
}
