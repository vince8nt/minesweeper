var c = document.getElementById("msContainer");
var ctx = c.getContext("2d");
var mine = document.getElementById("mine");
var flag = document.getElementById("flag");

class Button {
	constructor(x, y, width, height, label, color, border) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.label = label;
		this.color = color;
		this.border = border;
		this.Draw();
	}
	Draw() {
		ctx.fillStyle = this.border;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
		ctx.fillStyle = "#000000";
		ctx.fillText(this.label, this.x + 10, this.y + this.height / 2 + 5);
	}
	Clear() {
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}
	SetBorder(border) {
		this.border = border;
		this.Draw();
	}
	SetColor(color) {
		this.color = color;
		this.Draw();
	}
	SetLabel(label) {
		this.label = label;
		this.Draw();
	}
	GetLabel() {
		return this.label;
	}
	Clicked(pointerX, pointerY) {
		if (pointerX < this.x || this.x + this.width < pointerX) {
			return false;
		}
		if (pointerY < this.y || this.y + this.height < pointerY) {
			return false;
		}
		return true;
	}	
}

class Selector {
	constructor (color, borderColor, selectColor) {
		this.color = color;
		this.borderColor = borderColor;
		this.selectColor = selectColor;
		this.buttons = [];
		this.selected = -1;
	}
	AddButton (x, y, width, height, label) {
		if (this.buttons.length == 0) {
			this.buttons.push(new Button(x, y, width, height, label, this.color, this.selectColor));
			this.selected = 0;
		}
		else {
			this.buttons.push(new Button(x, y, width, height, label, this.color, this.borderColor));
		}
	}
	GetSelected () {
		if (this.selected == -1)
			return "";
		return this.buttons[this.selected].GetLabel();
	}
	Clicked (pointerX, pointerY) {
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].Clicked(pointerX, pointerY)) {
				this.buttons[this.selected].SetBorder(this.borderColor);
				this.selected = i;
				this.buttons[i].SetBorder(this.selectColor);
				return true;
			}
		}
		return false;
	}
	Draw () {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].Draw();
		}
	}
	Clear () {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].Clear();
		}
	}
}

class Board {
	constructor(squaresX, squaresY, leftX, topY, squareSize, diff) {
		this.numColors = ["#000000", "#0000FF", "#20B000", "#FF0000", "#B000B0", "#B01010", "#40E0D0", "#000000", "#606060"];
		this.squaresX = squaresX;
		this.squaresY = squaresY;
		this.leftX = leftX;
		this.topY = topY;
		this.squareSize = squareSize;
		this.diff = diff;
		this.width = squaresX * squareSize;
		this.height = squaresY * squareSize;
		this.numCovered = squaresX * squaresY;
		this.PlaceBombs();
		this.CreateNums();
		this.MakeCover();
		this.Draw();
	}
	PlaceBombs() { // diff should range from 1 to 5
		this.squareValue = [];
		this.numOfMines = 0;
		for (var x = 0; x < this.squaresX; x++) {
			var tempCol = [];
			for (var y = 0; y < this.squaresY; y++) {
				if (Math.random() * (25 + this.diff) > 23) {
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
				tempCol.push(1);
			}
			this.covered.push(tempCol);
		}
	}
	Clear() {
		ctx.clearRect(this.leftX - 2, this.topY - 2, this.width + 4, this.height + 4);
	}
	Draw() {
		ctx.fillStyle = "#C8C8C8";
		ctx.fillRect(this.leftX, this.topY, this.width, this.height);

		ctx.strokeStyle = "#D0D0D0"; // outline
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
			ctx.moveTo(this.leftX, this.topY + this.squareSize * y - 0.5);
        	ctx.lineTo(this.leftX + this.width, this.topY + this.squareSize * y - 0.5);
		}
		for (var x = 1; x < this.squaresX; x++) {
			ctx.moveTo(this.leftX + this.squareSize * x - 0.5, this.topY);
        	ctx.lineTo(this.leftX + this.squareSize * x - 0.5, this.topY + this.height);
		}
		ctx.stroke();

		ctx.font = "20px Arial"; // squares
		for (var x = 0; x < this.squaresX; x++) {
			for (var y = 0; y < this.squaresY; y++) {
				if (this.covered[x][y] != 0) { // draw cover
					var screenX = this.leftX + this.squareSize * x;
					var screenY = this.topY + this.squareSize * y;
					ctx.strokeStyle = "#F0F0F0";
					ctx.lineWidth = 3;
					ctx.beginPath();
					ctx.moveTo(screenX, screenY + 1.5);
					ctx.lineTo(screenX + this.squareSize, screenY + 1.5);
					ctx.moveTo(screenX + 1.5, screenY);
					ctx.lineTo(screenX + 1.5, screenY + this.squareSize);
					ctx.stroke();
					ctx.strokeStyle = "#808080";
					ctx.beginPath();
					ctx.moveTo(screenX + this.squareSize, screenY + this.squareSize - 1.5);
					ctx.lineTo(screenX, screenY + this.squareSize - 1.5);
					ctx.moveTo(screenX + this.squareSize - 1.5, screenY + this.squareSize);
					ctx.lineTo(screenX + this.squareSize - 1.5, screenY);
					ctx.stroke();
					if (this.covered[x][y] == 2) { // draw flag
						var screenX = this.leftX + this.squareSize * (x + 0.5) - 8.5;
						var screenY = this.topY + this.squareSize * (y + 0.5) - 8.5;
						ctx.drawImage(flag, screenX, screenY);
					}
				}
				else {
					if (this.squareValue[x][y] > 0) { // draw number
						var screenX = this.leftX + this.squareSize * (x + 0.5) - 7;
						var screenY = this.topY + this.squareSize * (y + 0.5) + 8.5;
						ctx.fillStyle = this.numColors[this.squareValue[x][y]];
						ctx.fillText(this.squareValue[x][y], screenX, screenY);
					}
					else if (this.squareValue[x][y] < 0) { // change to draw bomb picture
						var screenX = this.leftX + this.squareSize * (x + 0.5) - 6.5;
						var screenY = this.topY + this.squareSize * (y + 0.5) - 6.5;
						ctx.drawImage(mine, screenX, screenY);
						if (this.squareValue[x][y] == -2) { // draw red X
							screenX += 6.5;
							screenY += 6.5;
							ctx.strokeStyle = "#FF0000";
							ctx.lineWidth = 2;
							ctx.beginPath();
							ctx.moveTo(screenX - 10, screenY - 10);
							ctx.lineTo(screenX + 10, screenY + 10);
							ctx.moveTo(screenX - 10, screenY + 10);
							ctx.lineTo(screenX + 10, screenY - 10);
							ctx.stroke();
						}
					}
				}
			}
		}
	}
	ClickUncover(screenX, screenY) { // returns true if the game is over
		var x = Math.floor((screenX - this.leftX) / this.squareSize);
		var y = Math.floor((screenY - this.topY) / this.squareSize);
		if (x >= 0 && y >= 0 && x < this.squaresX && y < this.squaresY && this.covered[x][y] == 1) {
			if (this.squareValue[x][y] == -1) { // lose game
				this.UncoverMines();
				setTimeout(function(){
					alert("You Lose");
					resetButton.Draw();
				}, 0);
				return true;
			}
			this.RecurUncover(x, y);
			this.Draw();
			if (this.numCovered <= this.numOfMines) {
				setTimeout(function(){
					alert("You Win");
					resetButton.Draw();
				}, 0);
				return true;
			}
		}
		return false;
	}
	RecurUncover(x, y) {
		if (x >= 0 && y >= 0 && x < this.squaresX && y < this.squaresY && this.covered[x][y] == 1) {
			this.covered[x][y] = 0;
			this.numCovered--;
			if (this.squareValue[x][y] == 0) {
				this.RecurUncover(x - 1, y - 1);
				this.RecurUncover(x, y - 1);
				this.RecurUncover(x + 1, y - 1);
				this.RecurUncover(x - 1, y);
				this.RecurUncover(x + 1, y);
				this.RecurUncover(x - 1, y + 1);
				this.RecurUncover(x, y + 1);
				this.RecurUncover(x + 1, y + 1);
			}
		}
	}
	UncoverMines() {
		for (var x = 0; x < this.squaresX; x++) {
			for (var y = 0; y < this.squaresY; y++) {
				if (this.squareValue[x][y] == -1 ) {
					this.covered[x][y] = 0;
				}
				else if (this.covered[x][y] == 2) {
					this.covered[x][y] = 0;
					this.squareValue[x][y] = -2;
				}
			}
		}
		this.Draw();
	}
	ClickFlag(screenX, screenY) {
		var x = Math.floor((screenX - this.leftX) / this.squareSize);
		var y = Math.floor((screenY - this.topY) / this.squareSize);
		if (x >= 0 && y >= 0 && x < this.squaresX && y < this.squaresY) {
			if (this.covered[x][y] == 1) {
				this.covered[x][y] = 2;
				this.Draw();
			}
			else if (this.covered[x][y] == 2) {
				this.covered[x][y] = 1;
				this.Draw();
			}
		}
	}
}

function MakeBoard(size, level) {
	var sizeVals = [[12, 8, 158, 130, 57], [16, 10, 140, 130, 45], [30, 17, 95, 130, 27], [36, 20, 86, 130, 23], [48, 24, 44, 130, 19]];
	var i;
	var diff;
	if (size == "tiny")
		i = 0;
	else if (size == "small")
		i = 1;
	else if (size == "medium")
		i = 2;
	else if (size == "large")
		i = 3;
	else
		i = 4;
	if (level == "novice")
		diff = 1;
	else if (level == "easy")
		diff = 2;
	else if (level == "medium")
		diff = 3;
	else if (level == "hard")
		diff = 4;
	else
		diff = 5;
	return new Board(sizeVals[i][0], sizeVals[i][1], sizeVals[i][2], sizeVals[i][3], sizeVals[i][4], diff);
}

resetButton = new Button(400, 300, 200, 120, "Reset", "#00FF00", "#000000");

myBoard = MakeBoard("medium", "medium");

selectSize = new Selector("#808080", "#D0D0D0", "#FF0000");
selectSize.AddButton(450, 10, 100, 50, "medium");
selectSize.AddButton(230, 10, 100, 50, "tiny");
selectSize.AddButton(340, 10, 100, 50, "small");
selectSize.AddButton(560, 10, 100, 50, "large");
selectSize.AddButton(670, 10, 100, 50, "huge");

selectDiff = new Selector("#808080", "#D0D0D0", "#FF0000");
selectDiff.AddButton(450, 70, 100, 50, "medium");
selectDiff.AddButton(230, 70, 100, 50, "novice");
selectDiff.AddButton(340, 70, 100, 50, "easy");
selectDiff.AddButton(560, 70, 100, 50, "hard");
selectDiff.AddButton(670, 70, 100, 50, "expert");

startButton = new Button(440, 300, 120, 120, "Start", "#00FF00", "#000000");

var gameOver = false;
var inMenu = true;


c.addEventListener('click', function(event) { // left click
	event.preventDefault();
	var screenX = event.pageX - c.offsetLeft - c.clientLeft;
    var screenY = event.pageY - c.offsetTop - c.clientTop;
	if (inMenu) {
		if (selectSize.Clicked(screenX, screenY) || selectDiff.Clicked(screenX, screenY)) {
			myBoard.Clear();
			myBoard = MakeBoard(selectSize.GetSelected(), selectDiff.GetSelected());
			startButton.Draw();
		}
		else if (startButton.Clicked(screenX, screenY)) {
			inMenu = false;
			selectSize.Clear();
			selectDiff.Clear();
			myBoard.Draw();
		}
	}
	else {
		if (gameOver) {
		    if (resetButton.Clicked(screenX, screenY)) {
		    	gameOver = false;
		    	inMenu = true;
		    	myBoard = MakeBoard(selectSize.GetSelected(), selectDiff.GetSelected());
		    	selectSize.Draw();
				selectDiff.Draw();
				startButton.Draw();
		    }
		}
		else {
			if (myBoard.ClickUncover(screenX, screenY)) {
		    	console.log("game over.");
		    	gameOver = true;
		    }
		}
	}
    return false;
}, false);

c.addEventListener('contextmenu', function(event) {
	if (!gameOver && !inMenu) {
		event.preventDefault();
		var screenX = event.pageX - c.offsetLeft - c.clientLeft;
	    var screenY = event.pageY - c.offsetTop - c.clientTop;
	    myBoard.ClickFlag(screenX, screenY);
	    return false;
	}
}, false);










