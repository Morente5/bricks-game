class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.running = false;
	}

	createElements() {
		var initialAngle = Math.random() * Math.PI/2 + 5*Math.PI/4; 
		this.ball = new Ball(this, this.width / 2, this.height - 50, 10, 2, initialAngle);
		this.bar = new Bar(this, 200, 20, 20);

		var brickWidth = 40;
		var brickHeight = 20;
		var bricksLevel = [];
		bricksLevel.push(
			[0, 3, 4],
			[0, 8, 4],
			[1, 3, 4],
			[1, 8, 4],
			[2, 4, 2],
			[2, 7, 2],
			[3, 4, 2],
			[3, 7, 2]
		);
		for (let i = 4; i <= 5; i++) {
			for (let j = 3; j <= 8; j++) {
				bricksLevel.push([i, j, 2]);
			}
		}
		for (let i = 6; i <= 7; i++) {
			for (let j = 2; j <= 9; j++) {
				if (j == 4 || j == 7) {
					bricksLevel.push([i, j, -1]);
				} else {
					bricksLevel.push([i, j, 2]);
				}
			}
		}
		for (let i = 8; i <= 10; i++) {
			for (let j = 1; j <= 10; j++) {
				bricksLevel.push([i, j, 2]);
			}
		}
		for (let i = 11; i <= 13; i++) {
			bricksLevel.push(
				[i, 1, 2],
				[i, 3, 1],
				[i, 8, 1],
				[i, 10, 2]
			);
		}
		for (let j = 4; j <= 7; j++) {
			bricksLevel.push([11, j, 1]);
		}
		bricksLevel.push(
			[14, 4, 1],
			[14, 7, 1],
			[15, 4, 1],
			[15, 7, 1]
		);

		this.bricks = bricksLevel.map(elem =>
			new Brick(
				this,
				this.width / 2 + (-6 + elem[1]) * brickWidth,
				elem[0] * brickHeight,
				brickWidth,
				brickHeight,
				elem[2]
				)
			);

		return {ball: this.ball, bar: this.bar, bricks: this.bricks};
	}

	detectAllCollisions() {
		this.ball.detectWall(setNewDirection);
		this.ball.detectCollision(this.bar, setNewDirection);
		for (let i = 0; i < this.bricks.length; i++) {
			this.ball.detectCollision(this.bricks[i], (ball, coll, brick, sides) => {
				if (!!coll && brick.level !== 0) {
					setNewDirection(ball, coll, brick, sides);
					brick.break();
				}
				
			});
		}
	}

}


class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	increase(x, y) {
		this.x += x;
		this.y += y;
	}
}


class Velocity {
	constructor(speed=0, angle=0) {
		this.speed = speed;
		this.angle = angle;
	}

	get x() {
		return this.speed * Math.cos(this.angle);
	}

	get y() {
		return this.speed * Math.sin(this.angle);
	}

	set vector(v) {
		this.speed = Math.hypot(v[0], v[1]);
		this.angle = Math.atan2(v[1], v[2]);
	}

	changeX() {
		this.angle = Math.atan2(this.y, -this.x);
	}

	changeY() {
		this.angle = Math.atan2(-this.y, this.x);
	}

}

class GameElement {
	// Skeleton Class - No instantiate
	constructor(game, x, y, speed, angle) {
		this.game = game;
		this.pos = new Position(x, y);
		this.vel = new Velocity(speed, angle);
	}

	move() {
		this.pos.increase(this.vel.x, this.vel.y);
	}

}

class Wall {}

class Ball extends GameElement {
	constructor(game, x, y, r, speed, angle) {
		super(game, x, y, speed, angle);
		this.r = r;
	}

	detectWall(callback) {
		let rect = new Wall();
		let sides = {
			LEFT: {
				collision: false,
				newX: this.r
			},
			RIGHT: {
				collision: false,
				newX: this.game.width - this.r
			},
			TOP: {
				collision: false,
				newY: this.r
			},
			BOTTOM: {
				collision: false,
				newY: this.game.height - this.r
			}
		};

		if (this.pos.x <= this.r) {  // LEFT
			sides.LEFT.collision = true;
		}
		if (this.pos.x >= this.game.width - this.r) {  // RIGHT
			sides.RIGHT.collision = true;
		}
		if (this.pos.y <= this.r) {  // TOP
			sides.TOP.collision = true;
		}
		if (this.pos.y >= this.game.height - this.r) {  // BOTTOM
			sides.BOTTOM.collision = true;
		}

		let coll = sides.BOTTOM.collision ||
				   sides.TOP.collision ||
				   sides.RIGHT.collision ||
				   sides.LEFT.collision;
		if (coll) {
			callback(this, coll, rect, sides);
		}
	}
	
	detectCollision(rect, callback) {
		let sides = {
			LEFT: {
				collision: false,
				newX: rect.pos.x - this.r
			},
			RIGHT: {
				collision: false,
				newX: rect.pos.x + rect.width + this.r
			},
			TOP: {
				collision: false,
				newY: rect.pos.y - this.r
			},
			BOTTOM: {
				collision: false,
				newY: rect.pos.y + rect.height + this.r
			}
		};

		// Distance between centers
		let dx = Math.abs(this.pos.x - rect.pos.x - rect.width / 2);
		let dy = Math.abs(this.pos.y - rect.pos.y - rect.height / 2);
		// Distance to the corner for case 3
		let cx = dx - rect.width / 2;
		let cy = dy - rect.height / 2;

		// CASE 1: No collision
		if (dx > (rect.width / 2 + this.r) ||
			dy > (rect.height / 2 + this.r)) {	
		}
		// CASE 2: HORIZONTAL collision
		else if (dx <= (rect.width / 2)) {
			if (this.pos.y < rect.pos.y + rect.height / 2) {
				sides.TOP.collision = true;
			}
			else {
				sides.BOTTOM.collision = true;
			}
		}
		// CASE 2: VERTICAL collision
		else if (dy <= (rect.height / 2)) {
			if (this.pos.x < rect.pos.x + rect.width / 2) {
				sides.LEFT.collision = true;
			}
			else {
				sides.RIGHT.collision = true;
			}
		}
		// CASE 3: CORNER collision
		else if (Math.hypot(cx, cy) <= this.r) {
			if (this.pos.y < rect.pos.y + rect.height / 2) {
				sides.TOP.collision = true;
			}
			else {
				sides.BOTTOM.collision = true;
			}
			if (this.pos.x < rect.pos.x + rect.width / 2) {
				sides.LEFT.collision = true;
			}
			else {
				sides.RIGHT.collision = true;
			}
		}

		let coll = sides.BOTTOM.collision ||
				   sides.TOP.collision ||
				   sides.RIGHT.collision ||
				   sides.LEFT.collision;
		if (coll) {
			callback(this, coll, rect, sides);
		}
	}

}

function setNewDirection(ball, coll, rect, sides) {
	let ang = 0;
	if (rect instanceof Wall) {
		ang = Math.PI;
	}

	if (rect instanceof Bar) {
		var bar = rect;
		var varAng = (Math.random() - 0.5) * Math.PI/16;
		if (sides.TOP.collision && sides.LEFT.collision) {
			ball.vel.angle = 7*Math.PI/6 + varAng; 
		}
		else if (sides.TOP.collision && sides.RIGHT.collision) {
			ball.vel.angle = 11*Math.PI/6 + varAng; 
		}
		else if (sides.TOP.collision) {
			ball.pos.y = sides.TOP.newY;
			ball.vel.angle = 2*Math.PI/3 * (ball.pos.x - bar.pos.x) / (bar.width) + 7*Math.PI/6 + varAng;
		}
	}
	else {
		// Corners
		if (sides.BOTTOM.collision && sides.RIGHT.collision) {
			ball.vel.angle = Math.random() * Math.PI/4 + Math.PI/8 + ang; 
		}
		else if (sides.BOTTOM.collision && sides.LEFT.collision) {
			ball.vel.angle = Math.random() * Math.PI/4 + 5*Math.PI/8 + ang; 
		}
		else if (sides.TOP.collision && sides.LEFT.collision) {
			ball.vel.angle = Math.random() * Math.PI/4 + 9*Math.PI/8 + ang; 
		}
		else if (sides.TOP.collision && sides.RIGHT.collision) {
			ball.vel.angle = Math.random() * Math.PI/4 + 13*Math.PI/8 + ang; 
		}
		// Sides
		else if (sides.TOP.collision) {
			ball.pos.y = sides.TOP.newY;
			ball.vel.changeY();
		}
		else if (sides.BOTTOM.collision) {
			ball.pos.y = sides.BOTTOM.newY;
			ball.vel.changeY();
		}
		else if (sides.RIGHT.collision) {
			ball.pos.x = sides.RIGHT.newX;
			ball.vel.changeX();
		}
		else if (sides.LEFT.collision) {
			ball.pos.x = sides.LEFT.newX;
			ball.vel.changeX();
		}
	}
}

class Rectangle extends GameElement {
	constructor(game, x, y, width, height, speed, angle) {
		super(game, x, y, speed, angle);
		this.width = width;
		this.height = height;

	}

}


class Bar extends Rectangle{
	constructor(game, width, height, speed) {
		super(game, (game.width-width)/2, game.height-height-10, width, height, speed, 0);
	}

	moveRight() {
		this.vel.angle = 0;
		this.move();
		if (this.pos.x > this.game.width - this.width) {
			this.pos.x = this.game.width - this.width;
		}
	}

	moveLeft() {
		this.vel.angle = Math.PI;
		this.move();
		if (this.pos.x < 0) {
			this.pos.x = 0;
		}
	}

}


class Brick extends Rectangle{
	constructor(game, x, y, width, height, level) {
		super(game, x, y, width, height, 0);
		this.level = level;
	}

	break() {
		if (this.level > 0) {
			this.level--;
		}
	}


}