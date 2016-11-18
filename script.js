class Game {
	constructor(parent) {
		this.parent = parent;
		this.buildSVG();

		this.ball = new Ball(this.svg, 0, 0, 40, 'white');

		//this.start();
	}

	buildSVG() {
		this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.svg.setAttribute('height', 500);
		this.svg.setAttribute('width', 800);
		this.svg.style.backgroundColor = '#1E262C';
		this.parent.appendChild(this.svg);
	}

	start() {
		this.interval.setInterval( () => {
			this.detectCollision();
		}, 10);
		// Detectar colisiones
		// Dibujar objetos en nueva posición
	}

	stop() {
		clearInterval(this.interval);
	}

}


class Vector2D {
	contructor(x, y) {
		this.x = x;
		this.y = y;
	}

}

class GameElement {
	constructor(graphic, color, x, y, element='polygon') {
		this.graphic = graphic;

		this.buildElem(color, element);

		this.x = x;
		this.y = y;
	}

	buildElem(color, element='polygon') {
		this.createElem(element);
		this.element.setAttribute('fill', color);
		this.graphic.appendChild(this.element);
	}

	createElem(element) {
		this.element = document.createElementNS('http://www.w3.org/2000/svg', element);
	}

	set x(x) {
		this.element.setAttribute('cx', x);
	}

	get x() {

	}

	set y(y) {
		this.element.setAttribute('cy', y);
	}

}


class Ball extends GameElement {
	constructor(graphic, color, x, y, r) {
		super(graphic, color, x, y);
		this.r = r;
	}
	
}

window.onload = () => {
	container = document.getElementById('container');
	game = new Game(container);

};
