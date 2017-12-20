// @flow

import React from 'react'
import { connect } from 'react-redux'
import { css } from "emotion";
import actions from "../actions";

const deadIndicatorClass = css`
`;

const agentlistClass = css`
    display: flex;
    flex-direction: row;
`;

const agentClass = css`
    cursor: pointer;
    padding: 0 1em;
    flex: 1;
`;

const agentSelectedClass = css`
    color: #FFFBCC;
    text-decoration: underline;
`;

const agentScore = css`
    font-weight: bold:
`;

type Props = {
    agents: Array<Object>,
    cameratarget: ?string,
    dispatch: any => void,
};

function DeadIndicator() {
    return (<span className={deadIndicatorClass}>[Respawning]</span>);
}

function AliveIndicator() {
    return null;
}

function AgentList({ agents, cameratarget, dispatch }: Props) {

    const getStateIndicator = c => c.isAlive ? <AliveIndicator /> : <DeadIndicator />;

    return (
        <div className={agentlistClass}>
            {agents.map(c => {

                let agentClasses = [agentClass];
                if (c.id === cameratarget) {
                    agentClasses.push(agentSelectedClass);
                }

                
                return (
                    <div
                        key={c.id}
                        className={agentClasses.join(" ")}
                        onClick={() => dispatch(actions.settings.setCameraTarget(c.id))}
                    >
                        {c.name} {getStateIndicator(c)} : <span className={agentScore}>{c.score}</span>
                    </div>
                );
            })}
        </div>
    );
}

const mapStateToProps = (state) => ({
    agents: state.agents,
    cameratarget: state.settings.cameratarget,
});

export default connect(
    mapStateToProps,
)(AgentList)


