function FlooditController(model) {
	this._model = model;
}

FlooditController.prototype = {
	calcMaxRounds : function() {
		var offsetFromColors = 0;
		var offsetFromSize = 0;

		if(this._model._numCellsInRow == 6) {
			offsetFromSize = 5;
			offsetFromColors = 2;
		}
		else if(this._model._numCellsInRow == 10) {
			offsetFromSize = 8;
			offsetFromColors = 3;
		}
		else if(this._model._numCellsInRow == 14) {
			offsetFromSize = 12;
			offsetFromColors = 4.25;
		}
		else if(this._model._numCellsInRow == 18) {
			offsetFromSize = 16;
			offsetFromColors = 5.4;
		}
		else if(this._model._numCellsInRow == 22) {
			offsetFromSize = 19;
			offsetFromColors = 6.75;
		}
		else if(this._model._numCellsInRow == 26) {
			offsetFromSize = 23;
			offsetFromColors = 7.7;
		}

		return Math.floor(offsetFromSize + ((this._model._numColors - 3) * offsetFromColors));
	},

	//Using an iterative approach instead of a recursive approach to try to make it easier to understand.
	floodFill : function(color)
	{
		points = [{x: 0, y: 0}];

		for(var i = 0; i < points.length; i ++)
		{
			x = points[i].x;
			y= points[i].y;

			if (this._model._cells[x][y].fill() == this._model._currentColor)
			{
				//update the color of the rectangle
				this._model._cells[x][y].setFill(color);

				//add its neighbors to the list of things to check
				if (x < this._model._numCellsInRow - 1)
				{
					points.push({x: x + 1, y: y});
				}
				if(x > 0)
				{
					points.push({x: x - 1, y: y});
				}
				if (y < this._model._numCellsInRow - 1)
				{
					points.push({x: x, y: y + 1});
				}
				if(y > 0)
				{
					points.push({x: x, y: y - 1});
				}
			}
		}
	},

	//returns a random color from the color array based on how many colors the user selected
	randomColor : function() {
		var index = Math.floor((Math.random() * this._model._numColors));
		return(this._model._colorsArray[index]);
	},

	resetGame : function() {
		//clear the Kinetic.js layer
		this._model._layer.removeChildren();

		//reset variables
		this._model._cells = [];
		this._model._round = 0;

		//grab input parameters from the html select boxes
		this._model._numCellsInRow = parseInt(document.getElementById("size").value);
		this._model._numColors = parseInt(document.getElementById("colors").value);

		//reset the game
		this._model._stage.width(this._model._cellSize * this._model._numCellsInRow);

		this._model._stage.height(this._model._cellSize * this._model._numCellsInRow + this._model._textHeight + this._model._settingsHeight + this._model._buttonsHeight);
		this.initGame();

		return false;
	},

	initGame : function ()
	{
		//initialize the layer
		for(var i = 0; i < this._model._numCellsInRow; i++) {
			//build our rect storage array along with the rectangles
			this._model._cells[i]=[];
			for(var j = 0; j < this._model._numCellsInRow; j++) {
				var rect = new Kinetic.Rect({
					x: this._model._cellSize * i,
					y: this._model._cellSize * j + this._model._settingsHeight,
					width: this._model._cellSize,
					height: this._model._cellSize,
					fill: this.randomColor(),
					draggable: false,
					name: 'rectangle'
				});

				if(i == 0 && j == 0)
				{
					this._model._currentColor = rect.fill();
				}

				//add the rectangle to our rectangle array
				this._model._cells[i][j]=rect;

				//add it to the kinetic layer
				this._model._layer.add(rect);
			}
		}

		//add our text
		this._model._simpleText = this._simpleText = new Kinetic.Text({
			x: this._model._stage.width() / 2,
			y: this._model._stage.height() - this._model._textHeight - this._model._buttonsHeight,
			fontSize: 30,
			fontFamily: 'Calibri',
			fill: 'green'
		});
		this._model._layer.add(this._model._simpleText);
		this.updateRoundsText(this._model._round + " / " + this.calcMaxRounds());


		//add the buttons
		for(var j = 0; j < this._model._numColors / 4; j++)
		{
			for(var i = 0; i < 4; i++)
			{
				if(i + (j * 4) >= this._model._numColors)
				{
					continue;
				}

				var circle = new Kinetic.Circle({
					x: (this._model._stage.getWidth() / 2 - 68) + (i * 45),
					y: this._model._stage.getHeight() - this._model._buttonsHeight +  + (j * 50),
					radius: 20,
					fill: this._model._colorsArray[i + j*4],
					stroke: 'black',
					strokeWidth: 2
				});

				var that = this;
				circle.addEventListener('click', function(e) {
					that.cellClicked(this.fill());
				});

				this._model._layer.add(circle);
			}
		}

		//if this is the first time it has been run, add the layer to the stage
		if(this._model._stage.children.length < 1)
		{
			this._model._stage.add(this._model._layer);
		}

		this._model._layer.draw();
	},

	updateRoundsText : function (msg) {
		this._model._simpleText.setText(msg);
		// to align text in the middle of the screen, we can set the
		// shape offset to the center of the text shape after instantiating it
		this._model._simpleText.offsetX(this._model._simpleText.width()/2);
		this._model._layer.draw();
	},

	cellClicked : function(color)	{
		if(this._model._round >= this.calcMaxRounds())
		{
			//don't let them keep playing if they used up all the rounds
			this.updateRoundsText('Game Over');
			return;
		}
		//if the cell clicked has a different color than the current color
		if(this._model._currentColor != color)
		{
			//update all the applicable cells already flooded
			this.floodFill(color);

			//update the current color to the new color
			this._model._currentColor = color;

			//increment what round we're on
			this.updateRoundsText(++this._model._round + " / " + this.calcMaxRounds());

			//redraw the rects
			this._model._layer.draw();
		}
	}
};