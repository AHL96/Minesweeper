let grid = []
let cellSize = 30 // size of squares
let gameOver
let cols, rows
let difficulty = 50
let draw

let winner, loser

function load(canvasName) {
	setup(canvasName)
	alert("1) Click on a box\n2) The number in the box shows how many bombs are in the surrounding boxes\n3) Press shift and click on a box at the same time to flag the box as a bomb\n4) You won the game when theres nothing but bombs left\n\n Good Luck!\n(the game will start over after three seconds of the game ending)")
}

function setup(canvasName) {
	gameOver = false
	grid = []
	draw = new Shapes(canvasName)

	cols = Math.floor(draw.canvas.width / cellSize)
	rows = Math.floor(draw.canvas.height / cellSize)
	// console.log(cols);
	// console.log(rows);

	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			grid.push(new Cell(i, j, cellSize, canvasName))
		}
	}

	for (let i = 0; i < difficulty; i++) {
		let r = Math.floor(Math.random() * cols * rows)
		//console.log(r)
		if (grid[r].bomb === false) {
			grid[r].bomb = true;
		} else {
			i--
		}
	}

	for (let i = 0; i < grid.length; i++) {
		grid[i].neighborCount(grid)
	}

	update()
}

function update() {
	draw.clear()

	for (let i = 0; i < grid.length; i++) {
		grid[i].show()
	}

	if (gameOver) {
		for (let i = 0; i < grid.length; i++) {
			if (grid[i].bomb && !hasWon()) {
				grid[i].revealed = true;
			}
		}
		setTimeout(function () {
			setup(draw.canvas.id)

			if (hasWon()) {
				winner.style.display = "none"
			} else {
				loser.style.display = "none"
			}


		}, 3000);
	}

}

function index(i, j) {
	if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
		return -1;
	}
	return i + j * cols;
}

function mouseClick(event) {
	// console.log(event);

	let x = Math.floor((event.x - draw.canvas.offsetLeft) / cellSize)
	let y = Math.floor((event.y - draw.canvas.offsetTop) / cellSize)

	if (event.shiftKey) {
		grid[index(x, y)].flag()
	} else {

		grid[index(x, y)].reveal();

		if (grid[index(x, y)].bomb) {
			gameOver = true;
			loser = document.getElementById("loser")
			loser.style.display = "inline"
			for (let i = 0; i < grid.length; i++) {
				grid[i].lost = true
			}
			update()
		} else if (hasWon()) {
			gameOver = true
			winner = document.getElementById("winner")
			winner.style.display = "inline"
			for (let i = 0; i < grid.length; i++) {
				grid[i].won = true
			}
		}
	}
	update()
}

function hasWon() {
	return grid.every(function (item, index, arr) {
		if (item.bomb) {
			return !item.revealed
		} else {
			return item.revealed
		}
	})
}