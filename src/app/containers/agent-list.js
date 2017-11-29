// @flow

import React from 'react'
import { connect } from 'react-redux'
import { css } from "emotion";

const deadIndicatorClass = css`
    color: red;
`;

type Props = {
    agents: Array<Object>,
};

function DeadIndicator() {
    return (<span className={deadIndicatorClass}>✝️</span>);
}

function AliveIndicator() {
    return (<span>•</span>);
}

function AgentList({ agents }: Props) {
    const getStateIndicator = c => c.isAlive
        ? <AliveIndicator />
        : <DeadIndicator />

    return (
        <div>
            {agents.map(c => (
                <span key={c.id}> {getStateIndicator(c)} {c.name} - {c.score}</span>
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


