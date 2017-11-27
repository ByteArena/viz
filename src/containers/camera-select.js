// @flow

import React from "react"
import { connect } from "react-redux"
import { css } from "emotion";
import actions from "../actions";

const selectClass = css`width: 100%;`;

const containerClass = css`
    display: flex;
    flex: 1;
`;

const DEFAULT_CAM = "default";
const TOP_CAM = "orthotop";

type Props = {
    camera: string,
    dispatch: (any) => void,
};

function CameraSelect({ camera, dispatch }: Props) {

    function handleChange(e: any) {
        dispatch(actions.settings.updateCamera(e.target.value))
    }

    return (
        <div className={containerClass}>
            <div className={selectClass}>
                <select
                    className={selectClass}
                    onChange={handleChange}
                    value={camera}
                >
                    <option value={DEFAULT_CAM}>[D]efault - Perspective</option>
                    <option value={TOP_CAM}>[T]op - Ortho</option>
                </select>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    camera: state.settings.camera,
});

export default connect(
    mapStateToProps,
)(CameraSelect)


