"use strict";

let CW = function(){
	//   0 point : blanches × 2.
	//   1 point : E ×15, A ×9, I ×8, N ×6, O ×6, R ×6, S ×6, T ×6, U ×6, L ×5
	//   2 points : D ×3, G ×2, M ×3
	//   3 points : B ×2, C ×2, P ×2
	//   4 points : F ×2, H ×2, V ×2
	//   8 points : J ×1, Q ×1
	//   10 points : K ×1, W ×1, X ×1, Y ×1, Z ×1
	let letters = [
		" ", " ",
		"E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E",
		"A", "A", "A", "A", "A", "A", "A", "A", "A",
		"I", "I", "I", "I", "I", "I", "I", "I",
		"N", "N", "N", "N", "N", "N",
		"O", "O", "O", "O", "O", "O",
		"R", "R", "R", "R", "R", "R",
		"S", "S", "S", "S", "S", "S",
		"T", "T", "T", "T", "T", "T",
		"U", "U", "U", "U", "U", "U",
		"L", "L", "L", "L", "L",
		"D", "D", "D",
		"M", "M", "M",
		"G", "G",
		"B", "B",
		"C", "C",
		"P", "P",
		"F", "F",
		"H", "H",
		"V", "V",
		"J", "Q", "K", "W", "X", "Y", "Z"
	];
	const points = {
		" ": 0,
		E:1, A:1, I:1, N:1, O:1, R:1, S:1, T:1, U:1, L:1,
		D:2, G:2, M:2,
		B:3, C:3, P:3,
		F:4, H:4, V:4,
		J:8, Q:8,
		K:10, W:10, X:10, Y:10, Z:10
	};
	let cursor = undefined;
	let placed = [];

	function makeBoardTileOnCLick(x, y) {
		return function() {
			let me = document.getElementById(["s", y, "_", x].join(""));
			if (me.innerHTML === "") {
				moveCursor(x, y);
			} else if (me.classList.contains("placed")) {
				moveFromBoardToRack(x, y, me);
			} else if (cursor !== undefined && cursor.x == x && cursor.y == y) {
				// if we just clicked the cursor, swap its direction
				if (cursor.direction === "right") {
					cursor.direction = "down";
					me.innerHTML = "▼";
				} else {
					cursor = undefined;
					me.innerHTML = "";
				}
			}
		};
	}
	function makeRackTileOnClick(i) {
		return function() {
			if (cursor !== undefined) {
				let me = document.getElementById(["l", i].join(""));
				if (me.innerHTML != "") {
					moveFromRackToBoard(me, cursor.x, cursor.y);
				}
			}
		};
	}

	function moveCursor(x, y) {
		if (cursor === undefined) {
			// No previous cursor, just set the new position
			cursor = { x: x, y: y};
		} else {
			// Remove the cursor from its former position
			let src = document.getElementById(["s", cursor.y, "_", cursor.x].join(""));
			src.innerHTML = "";
			cursor.x = x;
			cursor.y = y;
		}
		// try to guess word direction if several letters are already placed
		let dst = document.getElementById(["s", y, "_", x].join(""));
		if (placed.length >= 2 && placed[0].x === placed[1].x) {
			cursor.direction = "down";
			dst.innerHTML = "▼";
		} else {
			cursor.direction = "right";
			dst.innerHTML = "▶";
		}
	}
	function moveCursorForwardIfPossible() {
		while(cursor.x < 15 && cursor.y < 15) {
			if (cursor.direction === "right") {
				cursor.x++;
			} else {
				cursor.y++;
			}
			if (cursor.x >= 15 || cursor.y >= 15) {
				cursor = undefined;
				return;
			}
			let dst = document.getElementById(["s", cursor.y, "_", cursor.x].join(""));
			if (dst.innerHTML === "") {
				if (cursor.direction === "right") {
					dst.innerHTML = "▶";
				} else {
					dst.innerHTML = "▼";
				}
				return;
			}
		}
	}

	function moveFromBoardToRack(x, y, src) {
		// Find the letter in the placed array
		let n = undefined;
		for(n=placed.length-1; n>=0; n--) {
			if (placed[n].x === x && placed[n].y === y) {
				break;
			}
		}
		// Find a free spot on the rack
		let i = 0;
		let dst = undefined;
		do {
			dst = document.getElementById(["l", i].join(""));
			if (dst.innerHTML == "")
				break;
			i++;
		} while (i<7);
		// Move the board letter to the rack
		dst.innerHTML = src.innerHTML;
		dst.classList.add("letter");
		src.classList.remove("letter");
		src.classList.remove("placed");
		// Place the cursor in the freed spot
		moveCursor(x, y);
		// Remove the letter from the placed array
		placed.splice(n, 1);
	}

	function moveFromRackToBoard(src, x, y) {
		let dst = document.getElementById(["s", y, "_", x].join(""));
		dst.innerHTML = src.innerHTML;
		dst.classList.add("letter");
		dst.classList.add("placed");
		src.classList.remove("letter");
		src.innerHTML = "";
		placed.push({x: cursor.x, y: cursor.y, letter: src.innerHTML});
		moveCursorForwardIfPossible();
	}

	return {
		init: function() {
			// populate the board
			for (let y=0; y<CWDATA.board.length; y++) {
				const line = CWDATA.board[y];
				for(let x=0; x<line.length; x++) {
					let letter = line[x];
					let elt = document.getElementById(["s", y, "_", x].join(""));
					if (letter !== "") {
						elt.className = "letter";
						elt.innerHTML = [letter, "<div class=\"points\">", points[letter], "</div>"].join("");
						// we also remove the letter from the pool
						let idx = letters.findIndex(function(elt) { return elt === letter; });
						if (idx != -1) {
							letters.splice(idx, 1);
						}
					}
					elt.onclick = makeBoardTileOnCLick(x, y);
				}
			}
			// populate the rack
			for (let x=0; x<8; x++) {
				let letter = CWDATA.letters[x];
				let elt = document.getElementById(["l", x].join(""));
				if (letter !== undefined) {
					elt.className = "letter";
					elt.innerHTML = [letter, "<div class=\"points\">", points[letter], "</div>"].join("");
					// we remove the letter from the pool
					let idx = letters.findIndex(function(elt) { return elt === letter; });
					if (idx != -1) {
						letters.splice(idx, 1);
					}
				}
				elt.onclick = makeRackTileOnClick(x);
			}
			// initialize buttons
			document.getElementById("validate").disabled = true;
			// populate remaining letters
			let letters_left = [ "Lettres restantes: ", letters.length, "<br>" ];
			let prev = undefined;
			let y = 1;
			for (let x=0; x<letters.length; x++) {
				let letter = letters[x];
				if (prev === undefined) {
					prev = letter;
				}
				if (prev === letter) {
					y++;
				} else {
					if (prev === " ") {
						prev = "JOKER";
					}
					if (y > 1) {
						letters_left = letters_left.concat(prev, "x", y, ", ");
					} else {
						letters_left = letters_left.concat(prev, ", ");
					}
					prev = letter;
					y = 1;
				}
			}
			if (prev !== undefined) {
				if (prev === " ") {
					prev = "blanc";
				}
				if (y > 1) {
					letters_left = letters_left.concat(prev, "x", y, ".");
				} else {
					letters_left = letters_left.concat(prev, ".");
				}
			}
			document.getElementById("letters_left").innerHTML = letters_left.join("");
		}
	};
}();

CW.init();
