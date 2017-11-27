// @flow

import { Vector2 } from "bytearena-sdk/lib/commonjs/vector2";

export default class DebugSegmentsHelper {
    _altitude: number;

    constructor(altitude: number) {
        this._altitude = altitude;
    }

    init() {}

    update(app: any, segments: Vec2Array[][]) {
        const { _altitude: altitude } = this;

        segments.map(segment => {
            const pointA = new Vector2(segment[0][0], segment[0][1]);
            const pointB = new Vector2(segment[1][0], segment[1][1]);

            const color = new pc.Color(1, 0, 0);

            const v = pointB.clone().sub(pointA);
            const vmag = v.mag();
            const vnormals = v.normals();

            // bordures couloir gauche et droite
            const bottomleft = vnormals[0].clone().mag(0.001);

            const bottomright = vnormals[1].clone().mag(0.001);

            const abstopleft = bottomleft
                .clone()
                .rotate(-Math.PI / 2)
                .mag(vmag)
                .add(bottomleft)
                .add(pointA); // 15 u en avant

            const abstopright = bottomright
                .clone()
                .rotate(Math.PI / 2)
                .mag(vmag)
                .add(bottomright)
                .add(pointA); // 15 u en avant

            const absbottomleft = bottomleft.clone().add(pointA);
            const absbottomright = bottomright.clone().add(pointA);

            app.renderLine(
                new pc.Vec3(absbottomleft.x, altitude, absbottomleft.y),
                new pc.Vec3(abstopleft.x, altitude, abstopleft.y),
                color,
            );

            app.renderLine(
                new pc.Vec3(pointA[0], altitude, pointA[1]),
                new pc.Vec3(pointB[0], altitude, pointB[1]),
                color,
            );

            app.renderLine(
                new pc.Vec3(absbottomright.x, altitude, absbottomright.y),
                new pc.Vec3(abstopright.x, altitude, abstopright.y),
                color,
            );
        });
    }
}
