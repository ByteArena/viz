// @flow

import React from "react";
import { connect } from "react-redux";
import { css } from "emotion";
import actions from "../actions";

const containerClass = css`
    display: flex;
    flex: 1;
`;

const sliderClass = css`
    width: 85%;
`;

const indicatorClass = css`
    width: 15%;
    padding: 4px 0px;
    padding-left: 4px;
    text-align: right;
`;

type Props = {
    zoom: number,
    dispatch: any => void,
};

function ZoomSlider({ zoom, dispatch }: Props) {
    function handleChange(e: any) {
        dispatch(actions.settings.updateZoom(e.target.value));
    }

    return (
        <div className={containerClass}>
            <div className={sliderClass}>
                <input
                    className={sliderClass}
                    onChange={handleChange}
                    type="range"
                    value={zoom}
                />
            </div>
            <div className={indicatorClass}>{zoom}%</div>
        </div>
    );
}

const mapStateToProps = state => ({
    zoom: state.settings.zoom,
});

export default connect(mapStateToProps)(ZoomSlider);
