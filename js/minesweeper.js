var c = document.getElementById("msContainer");
var ctx = c.getContext("2d");
var mine = document.getElementById("mine");

class Board {
	constructor(squaresX, squaresY, leftX, topY, width, height) {
		this.numColors = ["#000000", "#0000FF", "#20B000", "#FF0000", "#B000B0", "#B01010", "#40E0D0", "#000000", "#606060"];
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
		this.PlaceBombs(1);
		this.CreateNums();
		this.MakeCover();
		this.Draw();
	}
	PlaceBombs(diff) { // diff should range from 1 to 5
		this.squareValue = [];
		this.numOfMines = 0;
		for (var x = 0; x < this.squaresX; x++) {
			var tempCol = [];
			for (var y = 0; y < this.squaresY; y++) {
				if (Math.random() * (25 + diff) > 23) {
					tempCol.push(-1);
					this.numOfMines++;
				}
				else
					tempCol.push(0);
			}
			this.squareValue.push(tempCol);
		}
		console.log(this.numOfMines + " mines placed.");
	}
	CreateNums() {
		for (var x = 0; x < this.squaresX; x++) {
			for (var y = 0; y < this.squaresY; y++) {
				if (this.squareValue[x][y] != -1) {
					var tempNum = 0;
					tempNum += this.SquareVal(x - 1, y - 1);
					tempNum += this.SquareVal(x, y - 1);
					tempNum += this.SquareVal(x + 1, y - 1);
					tempNum += this.SquareVal(x - 1, y);
					tempNum += this.SquareVal(x + 1, y);
					tempNum += this.SquareVal(x - 1, y + 1);
					tempNum += this.SquareVal(x, y + 1);
					tempNum += this.SquareVal(x + 1, y + 1);
					this.squareValue[x][y] = tempNum;
				}
			}
		}
	}
	SquareVal(x, y) { // returns 1 if the square is a mine, 0 otherwise
		if (x >= 0 && y >= 0 && x < this.squaresX && y < this.squaresY && this.squareValue[x][y] == -1) {
			return 1;
		}
		return 0
	}
	MakeCover() {
		this.covered = [];
		for (var x = 0; x < this.squaresX; x++) {
			var tempCol = [];
			for (var y = 0; y < this.squaresY; y++) {
				tempCol.push(true);
			}
			this.covered.push(tempCol);
		}
	}
	Draw() {
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
			ctx.moveTo(this.leftX, this.topY + this.squareHeight * y - 0.5);
        	ctx.lineTo(this.leftX + this.width, this.topY + this.squareHeight * y - 0.5);
		}
		for (var x = 1; x < this.squaresX; x++) {
			ctx.moveTo(this.leftX + this.squareWidth * x - 0.5, this.topY);
        	ctx.lineTo(this.leftX + this.squareWidth * x - 0.5, this.topY + this.height);
		}
		ctx.stroke();

		ctx.font = "20px Arial"; // squares
		for (var x = 0; x < this.squaresX; x++) {
			for (var y = 0; y < this.squaresY; y++) {
				if (this.covered[x][y]) { // draw cover
					var screenX = this.leftX + this.squareWidth * x;
					var screenY = this.topY + this.squareHeight * y;
					ctx.strokeStyle = "#F0F0F0";
					ctx.lineWidth = 3;
					ctx.beginPath();
					ctx.moveTo(screenX, screenY + 1.5);
					ctx.lineTo(screenX + this.squareWidth, screenY + 1.5);
					ctx.moveTo(screenX + 1.5, screenY);
					ctx.lineTo(screenX + 1.5, screenY + this.squareHeight);
					ctx.stroke();
					ctx.strokeStyle = "#808080";
					ctx.beginPath();
					ctx.moveTo(screenX + this.squareWidth, screenY + this.squareHeight - 1.5);
					ctx.lineTo(screenX, screenY + this.squareHeight - 1.5);
					ctx.moveTo(screenX + this.squareWidth - 1.5, screenY + this.squareHeight);
					ctx.lineTo(screenX + this.squareWidth - 1.5, screenY);
					ctx.stroke();
				}
				else {
					if (this.squareValue[x][y] > 0) { // draw number
						var screenX = this.leftX + this.squareWidth * (x + 0.5) - 7;
						var screenY = this.topY + this.squareHeight * (y + 0.5) + 8.5;
						ctx.fillStyle = this.numColors[this.squareValue[x][y]];
						ctx.fillText(this.squareValue[x][y], screenX, screenY);
					}
					else if (this.squareValue[x][y] == -1) { // change to draw bomb picture
						var screenX = this.leftX + this.squareWidth * (x + 0.5) - 7;
						var screenY = this.topY + this.squareHeight * (y + 0.5) - 7;
						ctx.drawImage(mine, screenX, screenY);
					}
				}
			}
		}
	}
	ClickLoses(screenX, screenY) { // returns true if the game is lost
		var x = Math.floor((screenX - this.leftX) / this.squareWidth);
		var y = Math.floor((screenY - this.topY) / this.squareHeight);
		if (x >= 0 && y >= 0 && x < this.squaresX && y < this.squaresY) {
			this.covered[x][y] = false;
			this.Draw();
			if (this.squareValue[x][y] == -1)
				return true;
		}
		return false;
	}
}

myBoard = new Board(36, 16, 50, 50, 900, 400);


c.addEventListener('click', function(event) {
	var screenX = event.pageX - c.offsetLeft - c.clientLeft;
    var screenY = event.pageY - c.offsetTop - c.clientTop;
    myBoard.ClickLoses(screenX, screenY);
}, false);












