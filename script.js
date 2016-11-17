class Game {
	constructor(parent) {
		this.parent = parent;
		this.buildSVG();
	}

	buildSVG(parent) {
		this.svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.svg1.setAttribute('height', 500);
		this.svg1.setAttribute('width', 800);
		this.parent.appendChild(this.svg1);
	}

}


window.onload = () => {
	container = document.getElementById('container');
	game = new Game(container);
};
