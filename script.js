class Game {
	constructor(parent) {
		this.parent = parent;
		this.buildSVG();
		this.buildButtons();

		this.ball = new Ball(this.svg, 'white', 30, 30, 10);

		this.initiated = false;

		this.start();
	}

	buildSVG() {
		this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.svg.setAttribute('height', 500);
		this.svg.setAttribute('width', 800);
		this.svg.style.backgroundColor = '#1E262C';
		this.parent.appendChild(this.svg);
	}

	buildButtons() {
		this.startButton = document.createElement('button');
		this.startButton.appendChild(document.createTextNode('Start'));
		this.startButton.addEventListener('click', () => this.start());
		this.parent.appendChild(this.startButton);

		this.stopButton = document.createElement('button');
		this.stopButton.appendChild(document.createTextNode('Stop'));
		this.stopButton.addEventListener('click', () => this.stop());
		this.parent.appendChild(this.stopButton);
	}

	start() {
		if (!this.initiated) {
			this.initiated = true;
			this.interval = setInterval( () => {
				this.ball.move();
				//this.detectCollision();
			}, 10);
			// Detectar colisiones
			// Dibujar objetos en nueva posición
		}
	}

	stop() {
		if (!!this.initiated) {
			this.initiated = false;
			clearInterval(this.interval);
		}
	}

}


class Position {
	constructor(element, x, y) {
		this.element = element;
		this.x = x;
		this.y = y;
	}

	set x(x) {
		this.element.setAttribute('cx', x);
	}

	get x() {
		return this.element.cx.animVal.value;
	}

	set y(y) {
		this.element.setAttribute('cy', y);
	}

	get y() {
		return this.element.cy.animVal.value;
	}

	increase(x, y) {
		this.x += x;
		this.y += y;
	}
}

class Velocity {
	constructor(element, speed=0, angle=0) {
		this.element = element;
		this.speed = speed;
		this.angle = angle;
	}

	get x() {
		return this.speed * Math.cos(this.angle);
	}

	get y() {
		return this.speed * Math.sin(this.angle);
	}

	set vel(vel) {
		this.speed = Math.hypot(vel.x, vel.y);
		this.angle = Math.atan2(vel.y, vel.x);
	}

	get vel() {
		return {'x': this.x, 'y': this.y};
	}

}

class GameElement {
	constructor(graphic, color, x, y, type='polygon') {
		this.graphic = graphic;

		this.buildElem(color, type);

		this.position = new Position(this.element, x, y);
		this.velocity = new Velocity(this.element);
	}

	buildElem(color, type='polygon') {
		this.element = document.createElementNS('http://www.w3.org/2000/svg', type);
		this.element.setAttribute('fill', color);
		this.graphic.appendChild(this.element);
	}

	set r(r) {
		this.element.setAttribute('r', r);
	}

	get r() {
		return this.element.r.animVal.value;
	}

	move() {
		let vel = this.velocity.vel;
		this.position.increase(vel.x, vel.y);
	}

}


class Ball extends GameElement {
	constructor(graphic, color, x, y, r) {
		super(graphic, color, x, y, 'circle');
		this.r = r;
	}
	
}

window.onload = () => {
	container = document.getElementById('container');
	game = new Game(container);

};
