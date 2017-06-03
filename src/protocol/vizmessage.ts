type Vizmessage = {
	Agents:                  Vizagentmessage[],
	Projectiles:             Vizprojectilemessage[],
	Obstacles:               Vizobstaclemessage[],
	DebugIntersects:         Vec2Array,
	DebugIntersectsRejected: Vec2Array,
	DebugPoints:             Vec2Array,
}

type Vec2Array = [number, number];

type Vizagentmessage = {
	Id: string,
	Position: Vec2Array,
	Velocity: Vec2Array,
	VisionRadius: number,
	VisionAngle: number,
	Radius: number,
	Kind: string,
	Orientation: number,
}

type Vizprojectilemessage = {
	Position: Vec2Array,
	Radius: number,
	From: Vizagentmessage,
	Kind: string,
}

type Vizobstaclemessage = {
	Id: string,
	A: Vec2Array,
	B: Vec2Array,
}