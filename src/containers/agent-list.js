// @flow

import React from 'react'
import { connect } from 'react-redux'

type Props = {
    agents: Array<Object>,
};

function AgentList({ agents }: Props) {

    return (
        <div>
            <ul>
                {agents.map(c => (
                    <li key={c.id}>
                        {c.name} - {c.score}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const mapStateToProps = (state) => ({
    agents: state.agents,
});

export default connect(
    mapStateToProps,
)(AgentList)


