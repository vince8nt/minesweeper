var c = document.getElementById("msContainer");
var ctx = c.getContext("2d");

class Board {

	constructor(squaresX, squaresY, leftX, topY, width, height) {
		this.numColors = ["#000000", "#0000FF", "#20B000", "#FF0000"];
		this.squaresX = squaresX;
		this.squaresY = squaresY;
		this.leftX = leftX;
		this.topY = topY;
		this.width = width;
		this.height = height
		this.squareWidth = width / squaresX;
		this.squareHeight = height / squaresY;
		console.log("square width: " + this.squareWidth);
		console.log("square height: " + this.squareHeight);
		this.placeBombs();
		this.draw();
	}
	placeBombs() {
		this.squareValue = [];
		for (var x = 0; x < this.squaresX; x++) {
			var tempCol = [];
			for (var y = 0; y < this.squaresY; y++) {
				tempCol.push(Math.floor(Math.random() * 5 - 1));
			}
			this.squareValue.push(tempCol);
		}
	}
	draw() {
		ctx.fillStyle = "#C8C8C8";
		ctx.fillRect(this.leftX, this.topY, this.width, this.height);

		ctx.strokeStyle = "#000000"; // outline
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.leftX - 1, this.topY - 1);
        ctx.lineTo(this.leftX + this.width + 1, this.topY - 1);
        ctx.lineTo(this.leftX + this.width + 1, this.topY + this.height + 1);
        ctx.lineTo(this.leftX - 1, this.topY + this.height + 1);
        ctx.lineTo(this.leftX - 1, this.topY - 1);
		ctx.stroke();
		
		ctx.strokeStyle = "#606060"; // grid
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (var y = 1; y < this.squaresY; y++) {
			ctx.moveTo(this.leftX, this.topY + this.squareHeight * y + 0.5);
        	ctx.lineTo(this.leftX + this.width, this.topY + this.squareHeight * y + 0.5);
		}
		for (var x = 1; x < this.squaresX; x++) {
			ctx.moveTo(this.leftX + this.squareWidth * x + 0.5, this.topY);
        	ctx.lineTo(this.leftX + this.squareWidth * x + 0.5, this.topY + this.height);
		}
		ctx.stroke();

		ctx.font = "30px Arial"; // numbers
		for (var x = 0; x < this.squaresX; x++) {
			for (var y = 0; y < this.squaresY; y++) {
				if (this.squareValue[x][y] > 0) {
					var screenX = this.leftX + this.squareWidth * (x + 0.5) - 7.5;
					var screenY = this.topY + this.squareHeight * (y + 0.5) + 11;
					ctx.fillStyle = this.numColors[this.squareValue[x][y]];
					ctx.fillText(this.squareValue[x][y], screenX, screenY);
				}
				else if (this.squareValue[x][y] == -1) { // change to draw bomb picture
					var screenX = this.leftX + this.squareWidth * (x + 0.5) - 7.5;
					var screenY = this.topY + this.squareHeight * (y + 0.5) + 11;
					ctx.fillStyle = "#404040";
					ctx.fillText("B", screenX, screenY);
				}
			}
		}
	}
}

myBoard = new Board(36, 16, 50, 50, 900, 400);
myBoard.draw();











