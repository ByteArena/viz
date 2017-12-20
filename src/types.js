// @flow

declare var pc: any;    // playcanvas global ref

type Vizmessage = { // eslint-disable-line no-unused-vars
    Objects: VizObjectMessage[],
    Obstacles: VizObstacleMessage[],
    DebugPoints: Vec2Array[],
    DebugSegments: Vec2Array[][],
};

type Vec2Array = [number, number];

type Point2 = {
    x: number,
    y: number,
};

type Point3 = Point2 & {
    z: number,
};

type VizObjectMessage = {
    Id: string,
    Type: string,
    Position: Vec2Array,
    Velocity: Vec2Array,
    Radius: number,
    Orientation: number,
    PlayerInfo: PlayerInfo,
};

type PlayerInfo = {
    IsAlive: boolean,
    PlayerId: string,
    PlayerName: string,
    Score: VizMessagePlayerScore,
};

type VizMessagePlayerScore = {
    Value: number,
};

type VizObstacleMessage = {
    Id: string,
    A: Vec2Array,
    B: Vec2Array,
};


type Game = Object; // eslint-disable-line no-unused-vars

interface Camera {
    init(zoom: number): void;
    uninit(): void;
    setZoom(zoom: number): Camera;
    update(followpos: Point3): void;
}

type StoreDispatch = (Object) => void; // eslint-disable-line no-unused-vars

