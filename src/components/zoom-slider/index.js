// @flow

import React, { Component } from "react";
import { css } from "emotion";

const MAX_ZOOM = 100;
const MIN_ZOOM = 0;
const ZOOM_SCROLL_FACTOR = 20;

const containerClass = css`
    display: flex;
    flex: 1;
`;

const sliderClass = css`width: 100%;`;

const indicatorClass = css`
    width: 30%;
    padding: 4px 0px;
`;

type Props = {
    onChange: number => void,
};

type State = {
    zoom: number,
};

export class ZoomSlider extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    state: State = {
        zoom: 50,
    };

    componentDidMount() {
        document.addEventListener("wheel", (e: WheelEvent) => {
            const next = this.state.zoom - e.deltaY / ZOOM_SCROLL_FACTOR;

            if (next >= MAX_ZOOM) {
                return this._change(MAX_ZOOM);
            }

            if (next < MIN_ZOOM) {
                return this._change(MIN_ZOOM);
            }

            this._change(next);
        });
    }

    props: Props = {
        onChange: () => {},
    };

    handleChange = (e: MouseEvent) => {
        if (e.target instanceof HTMLInputElement) {
            const { props } = this;

            const value = e.target.value;
            this.setState({ zoom: parseFloat(value) });
            props.onChange(parseFloat(value));
        }
    };

    _change(value: number) {
        const { props } = this;
        value = Math.round(value);

        this.setState({ zoom: value });
        props.onChange(value);
    }

    render() {
        const { state } = this;

        return (
            <div className={containerClass}>
                <div className={indicatorClass}>{state.zoom}%</div>

                <div className={sliderClass}>
                    <input
                        className={sliderClass}
                        onChange={this.handleChange}
                        type="range"
                        value={state.zoom}
                    />
                </div>
            </div>
        );
    }
}
