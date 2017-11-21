// @flow

export default class DrawGridHelper {
    _altitude: number;
    _width: number;
    _height: number;

    constructor(_altitude: number, _width: number, _height: number) {
        this._altitude = _altitude;
        this._width = _width;
        this._height = _height;
    }

    init() {}

    update(app: any) {
        const { _width, _height, _altitude } = this;

        const minX = -1 * (_width / 2);
        const minY = -1 * (_height / 2);

        const maxX = minX + _width;
        const maxY = minY + _height;

        for (let x = minX; x < maxX; x++) {
            app.renderLine(
                new pc.Vec3(x, _altitude, minY),
                new pc.Vec3(x, _altitude, maxY),
                new pc.Color(1, 1, 1),
            );
            app.renderLine(
                new pc.Vec3(x + 0.25, _altitude, minY),
                new pc.Vec3(x + 0.25, _altitude, maxY),
                new pc.Color(0.25, 0.25, 0.25),
            );
            app.renderLine(
                new pc.Vec3(x + 0.5, _altitude, minY),
                new pc.Vec3(x + 0.5, _altitude, maxY),
                new pc.Color(0.5, 0.5, 0.5),
            );
            app.renderLine(
                new pc.Vec3(x + 0.75, _altitude, minY),
                new pc.Vec3(x + 0.75, _altitude, maxY),
                new pc.Color(0.25, 0.25, 0.25),
            );
        }

        for (let y = minY; y < maxY; y++) {
            app.renderLine(
                new pc.Vec3(minX, _altitude, y),
                new pc.Vec3(maxX, _altitude, y),
                new pc.Color(1, 1, 1),
            );
            app.renderLine(
                new pc.Vec3(minX, _altitude, y + 0.25),
                new pc.Vec3(maxX, _altitude, y + 0.25),
                new pc.Color(0.25, 0.25, 0.25),
            );
            app.renderLine(
                new pc.Vec3(minX, _altitude, y + 0.5),
                new pc.Vec3(maxX, _altitude, y + 0.5),
                new pc.Color(0.5, 0.5, 0.5),
            );
            app.renderLine(
                new pc.Vec3(minX, _altitude, y + 0.75),
                new pc.Vec3(maxX, _altitude, y + 0.75),
                new pc.Color(0.25, 0.25, 0.25),
            );
        }
    }
}
