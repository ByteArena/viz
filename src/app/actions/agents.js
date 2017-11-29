// @flow

export function addAgent(name: string, id: string) {
    return {
        type: "ADD_AGENT",
        name,
        id,
    }
}

export function updateAgentScore(value: number, id: string) {
    return {
        type: "UPDATE_AGENT_SCORE",
        value,
        id,
    }
}

export function updateAgentIsAlive(value: boolean, id: string) {
    return {
        type: "UPDATE_AGENT_IS_ALIVE",
        value,
        id,
    }
}

export function clear() {
    return { type: "CLEAR" };
}
