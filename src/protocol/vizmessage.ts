type Vizmessage = {
	Objects:   VizObjectMessage[],
	Obstacles: VizObstacleMessage[],
}

type Vec2Array = [number, number];

type VizObjectMessage = {
	Id: string,
	Type: string,
	Position: Vec2Array,
	Velocity: Vec2Array,
	Radius: number,
	Orientation: number,
}

type VizObstacleMessage = {
	Id: string,
	A: Vec2Array,
	B: Vec2Array,
}