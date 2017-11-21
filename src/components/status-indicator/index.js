// @flow

import React, { Component } from "react";
import { css } from "emotion";
import PropTypes from "prop-types";

const indicatorClass = css`
    display: inline;
`;

const labelClass = css`
    width: 23%;
`;

const containerClass = css`
    display: flex;
    flex: 1;
`;

function ConnectedIndicator() {
    const className = css`
        ${indicatorClass}
        color: green;
    `;

    return (
        <div className={className}>
            Connected
        </div>
    );
}

function BrokenIndicator() {
    const className = css`
        ${indicatorClass}
        color: red;
    `;

    return (
        <div className={className}>
            Not connected
        </div>
    );
}

type Props = {}

type State = {
    status: boolean,
}

export class StatusIndicator extends Component<Props, State> {

    static contextTypes = {
        subscribeTo: PropTypes.func,
    };

    state: State = {
        status: false,
    }

    componentDidMount() {
        this.context.subscribeTo("status", (status) => {
            this.setState({status});
        })
    }

    render() {
        const status = this.state.status === true
            ? <ConnectedIndicator />
            : <BrokenIndicator />;

        return (
            <div className={containerClass}>
                <div className={labelClass}>Server</div>

                {status}
            </div>
        );
    }

}
