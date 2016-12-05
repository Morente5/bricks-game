class GameCtrl {
	constructor(width, height, level) {
		this.width = width;
		this.height = height;
		this.level = level;

		this.loadGame();
		this.loadEvents();
	}

	loadGame() {
		if (!!this.view) {
			this.view.delete();
		}
		this.game = new Game(this.width, this.height, this.level);
		this.view = new View(this, this.width, this.height);

		this.createElementCtrls();
		this.stop();
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
		window.addEventListener("keyup", event => {
			switch(event.key) {
				case 'ArrowLeft':
				case 'ArrowRight':
					this.barCtrl.stop();
					break;
			} 
		});
		this.view.container.addEventListener("touchstart", event => {
			this.start();	
  			event.preventDefault();
  			this.barCtrl.movePosition(event.changedTouches[0].pageX - this.barCtrl.gameElement.width/2);
		}, false);
  		this.view.container.addEventListener("touchmove", event => {
  			event.preventDefault();
  			this.barCtrl.movePosition(event.changedTouches[0].pageX - this.barCtrl.gameElement.width/2);
		}, false);
	}

	start() {
		if (!this.running) {
			this.running = true;
			
			this.interval = setInterval( () => {
				if (!this.game.win && !this.game.lose) {
					this.ballCtrl.move();
					this.barCtrl.move();
					this.game.detectAllCollisions();
					this.brickCtrl.update();
					this.game.checkWin();
					if (!!this.game.win) {
						this.stop();
						this.title = new SVGTitle(this, '#40FF40', 'WIN');
					}
					if (!!this.game.lose) {
						this.stop();
						this.title = new SVGTitle(this, '#FF4040', 'LOSE');
					}
				}
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
	// Skeleton Class - Don't instantiate
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

	movePosition(x) {
		if (this.gameElement.pos.x > this.gameCtrl.width - this.gameElement.width) {
			this.gameElement.pos.x = this.gameCtrl.width - this.gameElement.width;
		}
		else if (this.gameElement.pos.x < 0) {
			this.gameElement.pos.x = 0;
		}
		else {
			this.gameElement.pos.x = x;
		}
		this.setPosition();
	}

	moveRight() {
		this.gameElement.moveRight();
	}

	moveLeft() {
		this.gameElement.moveLeft();
	}

	stop() {
		this.gameElement.stop();
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
					viewBrick.color = '#78bbe6';
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