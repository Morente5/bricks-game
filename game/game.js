class Game {
	constructor(width, height, level) {
		this.width = width;
		this.height = height;
		this.level = level;

		this.win = false;
		this.lose = false;

		this.running = false;
	}

	createElements() {
		// Wall
		this.wall = new Wall(this, this.width, this.height);

		// Ball
		var initialAngle = Math.random() * Math.PI/2 + 5*Math.PI/4;
		this.ball = new Ball(this, this.width / 2, this.height - 50, 10, 2, initialAngle);

		// Bar
		this.bar = new Bar(this, 120, 20, 5);

		// Bricks
		var brickWidth = this.width / 12;
		var brickHeight = this.height / 36;
		this.bricksLevel = this.level.map(elem =>
			new Brick(
				this,
				this.width / 2 + (-6 + elem[1]) * brickWidth,
				elem[0] * brickHeight,
				brickWidth,
				brickHeight,
				elem[2]
				)
			);

		return {
			ball: this.ball,
			bar: this.bar,
			bricks: this.bricksLevel
		};
	}

	detectAllCollisions() {
		this.ball.detectCollision(this.wall, setNewDirection);
		this.ball.detectCollision(this.bar, setNewDirection);
		var coll = false;
		var i = 0;
		while (!coll && i < this.bricksLevel.length) {
			coll = this.ball.detectCollision(this.bricksLevel[i], (ball, brick, coll, collision) => {
				if (!!coll && brick.level !== 0) {
					setNewDirection(ball, brick, coll, collision);
					brick.break();
				}
			});
			i++;
		}
	}

	checkWin() {
		if (this.bricksLevel.every(elem => elem.level > 0)) {
			this.win = true;
		};
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
	// Skeleton Class - Don't instantiate
	constructor(game, x, y, speed, angle) {
		this.game = game;
		this.pos = new Position(x, y);
		this.vel = new Velocity(speed, angle);
	}

	move() {
		this.pos.increase(this.vel.x, this.vel.y);
	}

}


class Wall {
	constructor(game, width, height) {
		this.width = width;
		this.height = height;
		this.pos = new Position(0, 0);
	}
}


class Ball extends GameElement {
	constructor(game, x, y, r, speed, angle) {
		super(game, x, y, speed, angle);
		this.r = r;
	}
	
	detectCollision(rect, callback) {
		let collision = {
				'left': false,
				'right': false,
				'top': false,
				'bottom': false
			};

		if (rect instanceof Wall) {
			if (this.pos.x <= this.r) {  // LEFT
				collision.left = true;
			}
			else if (this.pos.x >= rect.width - this.r) {  // RIGHT
				collision.right = true;
			}
			if (this.pos.y <= this.r) {  // TOP
				collision.top = true;
			}
			else if (this.pos.y >= rect.height - this.r) {  // BOTTOM
				collision.bottom = true;
				this.game.lose = true;
			}
		}

		if (rect instanceof Rectangle && rect.level != 0) {
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
					collision.top = true;
				}
				else {
					collision.bottom = true;
				}
			}
			// CASE 2: VERTICAL collision
			else if (dy <= (rect.height / 2)) {
				if (this.pos.x < rect.pos.x + rect.width / 2) {
					collision.left = true;
				}
				else {
					collision.right = true;
				}
			}
			// CASE 3: CORNER collision
			else if (Math.hypot(cx, cy) <= this.r) {
				if (this.pos.y < rect.pos.y + rect.height / 2) {
					collision.top = true;
				}
				else {
					collision.bottom = true;
				}
				if (this.pos.x < rect.pos.x + rect.width / 2) {
					collision.left = true;
				}
				else {
					collision.right = true;
				}
			}
		}

		let coll = collision.top ||
				   collision.bottom ||
				   collision.left ||
				   collision.right;

		if (!!coll) {
			callback(this, rect, coll, collision);
		}
		return coll;
	}

}

function setNewDirection(ball, rect, coll, collision) {

	if (rect instanceof Bar) {  // BAR
		var bar = rect;
		var varAng = (Math.random() - 0.5) * Math.PI/16;

		if (collision.top && collision.left) {
			ball.vel.angle = 7*Math.PI/6 + varAng; 
		}
		else if (collision.top && collision.right) {
			ball.vel.angle = 11*Math.PI/6 + varAng; 
		}
		else if (collision.top) {  // Position-dependent angle
			ball.pos.y = rect.pos.y - ball.r;
			ball.vel.angle = 2*Math.PI/3 * (ball.pos.x - bar.pos.x) / (bar.width) + 7*Math.PI/6 + varAng;
		}
		else if (collision.left) {
			ball.pos.x = rect.pos.x - ball.r;
			ball.vel.changeX();
		}
		else if (collision.right) {
			ball.pos.x = rect.pos.x + rect.width + ball.r;
			ball.vel.changeX();
		}
	}

	else if (rect instanceof Brick) {  // BRICK
		// Corners
		if (collision.bottom && collision.right) {
			ball.vel.angle = Math.random() * Math.PI/4 + Math.PI/8; 
		}
		else if (collision.bottom && collision.left) {
			ball.vel.angle = Math.random() * Math.PI/4 + 5*Math.PI/8; 
		}
		else if (collision.top && collision.left) {
			ball.vel.angle = Math.random() * Math.PI/4 + 9*Math.PI/8; 
		}
		else if (collision.top && collision.right) {
			ball.vel.angle = Math.random() * Math.PI/4 + 13*Math.PI/8; 
		}
		// Sides
		else if (collision.top) {
			ball.pos.y = rect.pos.y - ball.r;
			ball.vel.changeY();
		}
		else if (collision.bottom) {
			ball.pos.y = rect.pos.y + rect.height + ball.r;
			ball.vel.changeY();
		}
		else if (collision.right) {
			ball.pos.x = rect.pos.x + rect.width + ball.r;
			ball.vel.changeX();
		}
		else if (collision.left) {
			ball.pos.x = rect.pos.x - ball.r;
			ball.vel.changeX();
		}
	}

	else if (rect instanceof Wall) {  // WALL
		// Corners
		if (collision.bottom && collision.right) {
			ball.vel.angle = Math.random() * Math.PI/4 + 9*Math.PI/8; 
		}
		else if (collision.bottom && collision.left) {
			ball.vel.angle = Math.random() * Math.PI/4 + 13*Math.PI/8; 
		}
		else if (collision.top && collision.left) {
			ball.vel.angle = Math.random() * Math.PI/4 + 17*Math.PI/8; 
		}
		else if (collision.top && collision.right) {
			ball.vel.angle = Math.random() * Math.PI/4 + 21*Math.PI/8; 
		}
		// Sides
		else if (collision.top) {
			ball.pos.y = ball.r;
			ball.vel.changeY();
		}
		else if (collision.bottom) {
			ball.pos.y = rect.height - ball.r;
			ball.vel.changeY();
		}
		else if (collision.right) {
			ball.pos.x = rect.width - ball.r;
			ball.vel.changeX();
		}
		else if (collision.left) {
			ball.pos.x = ball.r;
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
		this.moving = false;
	}

	moveRight() {
		this.moving = true;
		this.vel.angle = 0;
	}

	moveLeft() {
		this.moving = true;
		this.vel.angle = Math.PI;
	}

	stop() {
		this.moving = false;
	}

	move() {
		if (!!this.moving) {
			super.move();
			if (this.pos.x > this.game.width - this.width) {
				this.pos.x = this.game.width - this.width;
			}
			if (this.pos.x < 0) {
				this.pos.x = 0;
			}
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