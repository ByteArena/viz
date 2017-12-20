// @flow

import React from "react"
import { connect } from "react-redux"
import { css } from "emotion";
import actions from "../actions";

import { CAMERAID as CAMERA_TOP } from "../../game/camera/orthotop";
import { CAMERAID as CAMERA_PERSPECTIVE } from "../../game/camera/perspective";

const selectClass = css`width: 100%;`;

const containerClass = css`
    display: flex;
    flex: 1;
`;

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
                    <option value={CAMERA_TOP}>[T]op - Ortho</option>
                    <option value={CAMERA_PERSPECTIVE}>[P]erspective</option>
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


