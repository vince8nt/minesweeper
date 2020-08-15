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
		this.squareWidth = width / squaresX;
		this.squareHeight = height / squaresY;
		this.draw();
	}
	draw() {
		ctx.clearRect(this.leftX - 2, this.topY - 2, this.width + 4, this.height + 4);

		ctx.strokeStyle = "#000000"; // outline
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(this.leftX, this.topY);
        ctx.lineTo(this.leftX + this.width, this.topY);
        ctx.lineTo(this.leftX + this.width, this.topY + this.height);
        ctx.lineTo(this.leftX, this.topY + this.height);
        ctx.lineTo(this.leftX, this.topY);
		ctx.stroke();

		ctx.strokeStyle = "#000000"; // grid
		ctx.lineWidth = 2;
		ctx.beginPath();
		for (var y = 1; y < this.squaresY; y++) {
			ctx.moveTo(this.leftX, this.topY + this.squareHeight * y);
        	ctx.lineTo(this.leftX + this.width, this.topY + this.squareHeight * y);
		}
		for (var x = 1; x < this.squaresX; x++) {
			ctx.moveTo(this.leftX  + this.squareWidth * x, this.topY);
        	ctx.lineTo(this.leftX  + this.squareWidth * x, this.topY + this.height);
		}
		ctx.stroke();
		
	}
}

myBoard = new Board(49, 22, 10, 10, 980, 440);
myBoard.draw();