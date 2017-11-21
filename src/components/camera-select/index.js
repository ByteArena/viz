// @flow

import React, { Component } from "react";
import { css } from "emotion";
import * as charCodes from "charcodes";

const selectClass = css`width: 100%;`;

const containerClass = css`
    display: flex;
    flex: 1;
`;

const labelClass = css`width: 30%;`;

// $FlowFixMe
type Props = {
    onChange: string => void,
};

type State = {
    value: string,
};

const TOP_CAM_KEY = charCodes.lowercaseT;
const DEFAULT_CAM_KEY = charCodes.lowercaseD;

const DEFAULT_CAM = "default";
const TOP_CAM = "orthotop";

export class CameraSelect extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    state: State = {
        value: "default",
    };

    componentDidMount() {
        document.addEventListener("keypress", (e: KeyboardEvent) => {
            if (e.keyCode === TOP_CAM_KEY) {
                this._change(TOP_CAM);
            } else if (e.keyCode === DEFAULT_CAM_KEY) {
                this._change(DEFAULT_CAM);
            }
        });
    }

    props: Props = {
        onChange: () => {},
    };

    handleChange = (e: MouseEvent) => {
        // $FlowFixMe: value is not necessarily present in e.target (if target has no value prop)
        this._change(e.target.value);
    };

    _change(value: string) {
        const { props } = this;
        this.setState({ value });
        props.onChange(value);
    }

    render() {
        const { state } = this;

        return (
            <div className={containerClass}>
                <div className={labelClass}>Camera</div>

                <div className={selectClass}>
                    <select
                        className={selectClass}
                        onChange={this.handleChange}
                        value={state.value}
                    >
                        <option value={DEFAULT_CAM}>{DEFAULT_CAM}</option>
                        <option value={TOP_CAM}>{TOP_CAM}</option>
                    </select>
                </div>
            </div>
        );
    }
}
