class View {
	constructor(gameCtrl, width, height) {
		this.gameCtrl = gameCtrl;
		this.height = height;
		this.width = width;

		this.container = document.getElementById('container');
		this.svg = new SVGGraphic(this.gameCtrl, this.container, '#1E262C', width, height);
	}

	delete() {
		this.svg.parent.removeChild(this.svg.graphic);
	}
}


class SVGGraphic {
	constructor(gameCtrl, parent, color, width, height) {
		this.parent = parent;
		this.width = width;
		this.height = height;
		this.color = color;

		this.buildSVG();
	}

	buildSVG() {
		this.graphic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.graphic.setAttribute('height', this.height);
		this.graphic.setAttribute('width', this.width);
		this.graphic.style.backgroundColor = this.color;
		this.parent.appendChild(this.graphic);
	}

}


class SVGElement {
	// Skeleton Class - No instantiate
	constructor(gameCtrl, color, type, xAttrName='', yAttrName='') {
		this.gameCtrl = gameCtrl;
		this.graphic = this.gameCtrl.view.svg.graphic;

		this.xAttrName = xAttrName;
		this.yAttrName = yAttrName;

		this.buildElem(type);
		this.color = color;
	}

	buildElem(type) {
		this.element = document.createElementNS('http://www.w3.org/2000/svg', type);
		this.graphic.appendChild(this.element);
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	set color(color) {
		this.element.setAttribute('fill', color);
	}

	set x(x) {
		this.element.setAttribute(this.xAttrName, x);
	}

	get x() {
		return parseFloat(this.element.attributes[this.xAttrName].value);
	}

	set y(y) {
		this.element.setAttribute(this.yAttrName, y);
	}

	get y() {
		return parseFloat(this.element.attributes[this.yAttrName].value);
	}

}


class SVGCircle extends SVGElement {
	constructor(gameCtrl, color, x, y, r) {
		super(gameCtrl, color, 'circle', 'cx', 'cy');
		this.setPosition(x, y);
		this.r = r;
	}

	set r(r) {
		this.element.setAttribute('r', r);
	}

	get r() {
		return parseFloat(this.element.attributes.r.value);
	}

}


class SVGRectangle extends SVGElement {
	constructor(gameCtrl, color, x, y, width, height) {
		super(gameCtrl, color, 'rect', 'x', 'y');
		this.width = width;
		this.height = height;

	}

	set width(w) {
		this.element.setAttribute('width', w);
	}

	get width() {
		return parseFloat(this.element.attributes.width.value);
	}

	set height(h) {
		this.element.setAttribute('height', h);
	}

	get height() {
		return parseFloat(this.element.attributes.height.value);
	}

}
