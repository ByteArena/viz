// @flow

import React from 'react'
import { connect } from 'react-redux'

type Props = {
    agents: Array<Object>,
};

function AgentList({ agents }: Props) {

    return (
        <div>
            {agents.map(c => (
                <span key={c.id}>• {c.name} - {c.score}</span>
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


