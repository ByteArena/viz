// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";

type Props = {};

type State = {
    agents: Array<Object>,
};

export class AgentList extends Component<Props, State> {
    static contextTypes = {
        subscribeTo: PropTypes.func,
    };

    state = {
        agents: [],
    };

    componentWillMount() {
        const { context } = this;

        context.subscribeTo("init", ({ agents }) => {
            this.setState({ agents });
        });
    }

    render() {
        const { state } = this;

        const agents = state.agents.map(c => (
            <li key={c.Id}>
                {c.AgentName}
            </li>
        ));

        return (
            <div>
                <ul>
                    {agents}
                </ul>
            </div>
        );
    }
}
