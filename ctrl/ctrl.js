class GameCtrl {
	constructor(width, height) {
		this.game = new Game(width, height);
		this.view = new View(this, width, height);

		this.createElementCtrls();

		this.running = false;

		this.loadEvents();

	}

	createElementCtrls() {
		var elements = this.game.createElements();
		this.ballCtrl = new BallCtrl(this, elements.ball);
		this.barCtrl = new BarCtrl(this, elements.bar);
		this.brickCtrl = new BrickCtrl(this, elements.bricks);
	}

	loadEvents() {
		window.addEventListener("keydown", event => {
			switch(event.key) {
				case 'ArrowLeft':
					this.barCtrl.moveLeft();
					break;
				case 'ArrowRight':
					this.barCtrl.moveRight();
					break;
				case ' ':
					this.start() || this.stop();
					break;
			} 
		});
	}

	start() {
		if (!this.running) {
			this.running = true;
			
			this.interval = setInterval( () => {
				this.ballCtrl.move();
				this.game.detectAllCollisions();
				this.brickCtrl.update();
			}, 5);

			return true;
		}
	}

	stop() {
		if (!!this.running) {
			this.running = false;
			clearInterval(this.interval);

			return true;
		}
	}

}


class GameElementCtrl {
	// Skeleton Class - No instantiate
	constructor(gameCtrl, gameElement) {
		this.gameCtrl = gameCtrl;
		this.gameElement = gameElement;
		this.SVGElement = null;

	}

	move() {
		this.gameElement.move();
		this.setPosition();
	}

	setPosition() {
		this.SVGElement.setPosition(this.gameElement.pos.x, this.gameElement.pos.y);
	}

}


class BallCtrl extends GameElementCtrl {
	constructor(gameCtrl, gameElement) {
		super(gameCtrl, gameElement);

		var x = this.gameElement.pos.x;
		var y = this.gameElement.pos.y;
		var r = this.gameElement.r;

		this.SVGElement = new SVGCircle(gameCtrl, 'white', x, y, r);

		this.setPosition();
	}

}


class BarCtrl extends GameElementCtrl {
	constructor(gameCtrl, gameElement) {
		super(gameCtrl, gameElement);

		var x = this.gameElement.pos.x;
		var y = this.gameElement.pos.y;
		var width = this.gameElement.width;
		var height = this.gameElement.height;

		this.SVGElement = new SVGRectangle(gameCtrl, 'white', x, y, width, height);

		this.setPosition();
	}

	moveRight() {
		this.gameElement.moveRight();
		this.setPosition();
	}

	moveLeft() {
		this.gameElement.moveLeft();
		this.setPosition();
	}
}

class BrickCtrl extends GameElementCtrl {
	constructor(gameCtrl, gameElements) {
		super(gameCtrl, gameElements);
		this.gameCtrl = gameCtrl;
		this.gameElements = gameElements;
		this.SVGElements = [];
		for (let i = 0; i < this.gameElements.length; i++) {
			let gameBrick = this.gameElements[i];

			let x = gameBrick.pos.x;
			let y = gameBrick.pos.y;
			let width = gameBrick.width;
			let height = gameBrick.height;
			let level = gameBrick.level;

			let viewBrick = new SVGRectangle(gameCtrl, 'white', x, y, width, height);

			viewBrick.setPosition(gameBrick.pos.x, gameBrick.pos.y);

			this.SVGElements[i] = viewBrick;
		}
		this.update();
	}

	update() {
		for (let i = 0; i < this.gameElements.length; i++) {
			let gameBrick = this.gameElements[i];
			let viewBrick = this.SVGElements[i];
			switch(gameBrick.level) {
				case -1:
					viewBrick.color = '#b0b0b0';
					break;
				case 0:
					viewBrick.element.style.display = 'none';
					break;
				case 1:
					viewBrick.color = '#e2f4c7';
					break;
				case 2:
					viewBrick.color = '#eae374';
					break;
				case 3:
					viewBrick.color = '#f9d62e';
					break;
				case 4:
					viewBrick.color = '#fc913a';
					break;
				case 5:
					viewBrick.color = '#ff4e50';
					break;
			}
		}
	}

}