var c = document.getElementById("msContainer");
var ctx = c.getContext("2d");

class Board {
	constructor(squaresX, squaresY, leftX, topY, width, height) {
		this.squaresX = squaresX;
		this.squaresY = squaresY;
		this.leftX = leftX;
		this.topY = topY;
		this.width = width;
		this.height = height
		this.draw();
	}
	draw() {
		
	}
}