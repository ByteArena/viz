// @flow

import React from 'react'
import { connect } from 'react-redux'
import { css } from "emotion";

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

type Props = {
    status: boolean,
};

function StatusIndicator({ status }: Props) {
    
    const child = status === true
        ? <ConnectedIndicator />
        : <BrokenIndicator />;

    return (
        <div className={containerClass}>
            <div className={labelClass}>Server</div>

            {child}
        </div>
    );
}

const mapStateToProps = (state) => ({
    status: state.status,
});

export default connect(
    mapStateToProps,
)(StatusIndicator)
