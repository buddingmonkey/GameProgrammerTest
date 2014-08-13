/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */
function FlooditModel() {
	this._cellSize = 30;
	this._numCellsInRow = 14;
	this._textHeight = 50;
	this._settingsHeight = 55;
	this._buttonsHeight = 90;
	this._numColors = 6;
	this._colorsArray = ['green', 'yellow', 'red', 'blue', 'cyan', 'purple', 'orange', 'black'];
	this._cells = [];
	this._round = 0;
	this._currentColor = null;

	this._stage = new Kinetic.Stage({
		container: 'container',
		width: this._cellSize * this._numCellsInRow,
		height: this._cellSize * this._numCellsInRow + this._textHeight + this._settingsHeight + this._buttonsHeight
	});
	this._layer = new Kinetic.Layer();

	this._simpleText = new Kinetic.Text({
		x: this._stage.width() / 2,
		y: this._stage.height() - this._textHeight - this._buttonsHeight,
		fontSize: 30,
		fontFamily: 'Calibri',
		fill: 'green'
	});

};