var size = 14;		//the size of the grid
var turn;
var grid = [];		//internal grid
var original = [];
var cells = [];		//grid of jquery objects
var seen = [];		//marks seen positions during flooding
var computingMode = false;
var solved = false;
var solveLabel;

/**
 * Clears seen grid
 */
function clearSeen() {
	for(var i = 0; i < size; i++)
		for(var j = 0; j < size; j++)
			seen[i][j] = false;
}

/**
 * Starts a new game
 */
function makeGrid() {

  solved = false;
	
	//initialize grids
	for(var i = 0; i < size; i++) {
		grid[i] = [];
		original[i] = [];
		cells[i] = [];
		seen[i] = [];
	}

	//populate table
	var $table = $('#grid');
	$table.empty();
	for(var i = 0; i < size; i++) {
		var $tr = $('<tr></tr>');
		$table.append($tr);
		for(var j = 0; j < size; j++) {
			var $td = $('<td></td>');
			$td.addClass('cell');
			$tr.append($td);
			var rand =  Math.floor(Math.random() * colours.length);
			$td.css("background-color", '#' + colours[rand]);
			$td.height(Math.floor(420/size));
			$td.width(Math.floor(420/size));
			cells[i][j] = $td;
			grid[i][j] = rand;
			original[i][j] = rand;
		}
	}	
	computerSolve();
	updateTurn(0);
}

/**
 * Makes the colour changing palette
 */
function makeControls() {
	var $palette = $('#palette');
	$palette.empty();
	for(var i = 0; i < colours.length; i++) {
		var $button = $('<button></button>');
		$button.addClass('palette-colour');
		$button.attr('value', i);
		$button.css('background-color', '#' + colours[i]);
		$palette.append($button);
	}

	$('.palette-colour').click(function() {
		flood(Number($(this).val()));
	});
}

/**
 * Checks if the grid is completely filled
 */
function check() {	
	for(var i = 0; i < size; i++)
		for(var j = 0; j < size; j++) {
			if(grid[i][j] != grid[0][0])
				return false;
		}
	return true;
}

/**
 * Updates the turn text
 */
function updateTurn(n) {
	turn = n;
	$('#counter').html(n);
	if(n === 0)		
		$('#solve-button').show();
}

/**
 * Resets the game
 */
function reset() {	
	for(var i = 0; i < size; i++)
		for(var j = 0; j < size; j++) {
			grid[i][j] = original[i][j];
			if(!computingMode)
				cells[i][j].css('background-color', '#' + colours[grid[i][j]]);
		}
	updateTurn(0);
}

/**
 * Refreshes the board with a new color
 */
function refresh() {	
	for(var i = 0; i < size; i++)
		for(var j = 0; j < size; j++) {
			cells[i][j].css('background-color', '#' + colours[grid[i][j]]);
		}
}

/**
 * Recursive flooding helper function
 */
function _flood(i, j, original, replace) {
	if(i < 0 || j < 0 || i >= size || j >= size || seen[i][j])
		return;
	seen[i][j] = true;
	if(grid[i][j] == original) {
		grid[i][j] = replace;
		if(!computingMode)
			cells[i][j].css('background-color', '#' + colours[replace]);
	} else
		return;
	_flood(i, j + 1, original, replace);
	_flood(i, j - 1, original, replace);
	_flood(i + 1, j, original, replace);
	_flood(i - 1, j, original, replace);
}

/**
 * Floods the grid with a certain colour
 */
function flood(c) {
	if(grid[0][0] == c) {
		return;
	}
	clearSeen();
	_flood(0, 0, grid[0][0], c);
	updateTurn(++turn);

	if(!solved && !computingMode && check()) {
		if(turn <= computerSolution)
			alert("You completed the challenge!");
		else
			alert("Puzzle cleared in " + turn + " moves!");
    solved = true;
		$('#solve-button').hide();
	} else if(computerSolution === turn) {
		alert("You failed to complete the challenge.");
	}
}

/**
 * Solver functions
 */

var list = [];
var computerSolution = -1;

function countConnected(i, j, c) {
	if(i < 0 || j < 0 || i >= size || j >= size || seen[i][j] || grid[i][j] != c)
		return 0;
	seen[i][j] = true;
	return countConnected(i, j - 1, c) +
		countConnected(i, j + 1, c) +
		countConnected(i - 1, j, c) +
		countConnected(i + 1, j, c) + 1;
}

function _inspect(i, j) {	
	if(i < 0 || j < 0 || i >= size || j >= size || seen[i][j])
		return;
	if(grid[i][j] === grid[0][0]) {
		seen[i][j] = true;
		_inspect(i, j - 1);
		_inspect(i, j + 1);
		_inspect(i - 1, j);
		_inspect(i + 1, j);
	} else {
		list[grid[i][j]] += countConnected(i, j, grid[i][j]);
	}
}

function inspect() {
	clearSeen();
	for(var i = 0; i < colours.length; i++)
		list[i] = 0;
	_inspect(0, 0);
	var max = 0;
	for(var i = 0; i < colours.length; i++)
		if(list[i] > list[max])
			max = i;
	return max;
}

function floodMax() {
	var c = inspect();
	flood(c);
}

function computerSolve() {
	computingMode = true;
	computerSolution = 0;
	while(!check()) {
		floodMax();
		computerSolution++;
	}	
	$('#computer-solution').html(computerSolution);
	reset();
	computingMode = false;
}

/**
 * Solves the puzzle for the user
 */
function solve() {
	var $solve_button = $('#solve-button');
	var robot = setInterval(function() {		
		if(check()) {
			clearInterval(robot);
			$solve_button.html(solveLabel);
		} else
			floodMax();
	}, 500);
	$solve_button.html('Stop!').unbind().click(function() {
		clearInterval(robot);
		$solve_button.html(solveLabel).click(solve);
	});
}

$(document).ready(function() {
	colours = themes[0].colours;
	makeGrid();
	makeControls();
	solveLabel = $('#solve-button').html();
	$('#solve-button').click(solve);

	for(var i = 0; i < themes.length; i++) {
		$('#themes').append('<option value="' + i + '">' + themes[i].name + '</option>');
	}

	$('#themes').change(function() {
		colours = themes[Number($('#themes option:selected').val())].colours;
		refresh();
		makeControls();
	});

	$('#size').change(function() {
		if(!confirm("This will start a new game. Continue?"))
			return;
		size = Number($('#size option:selected').val());
		makeGrid();
	});

});

