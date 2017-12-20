// @flow

import React from 'react'
import { connect } from 'react-redux'
import { css } from "emotion";
import actions from "../actions";

const deadIndicatorClass = css`
    color: red;
`;

type Props = {
    agents: Array<Object>,
    dispatch: any => void,
};

function DeadIndicator() {
    return (<span className={deadIndicatorClass}>[Respawning]</span>);
}

function AliveIndicator() {
    return (<span>•</span>);
}

function AgentList({ agents, dispatch }: Props) {

    const getStateIndicator = c => c.isAlive
        ? <AliveIndicator />
        : <DeadIndicator />

    return (
        <div>
            {agents.map(c => (
                <span
                    key={c.id}
                    onClick={() => dispatch(actions.settings.setCameraTarget(c.id))}
                > {c.name} {getStateIndicator(c)} - {c.score}</span>
            ))}
        </div>
    );
}

const mapStateToProps = (state) => ({
    agents: state.agents,
});

export default connect(
    mapStateToProps,
)(AgentList)


