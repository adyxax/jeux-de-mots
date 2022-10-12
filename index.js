"use strict";

let CW = function(){
	//   102 letter tiles
	//   0 point : blanches × 2.
	//   1 point : E ×15, A ×9, I ×8, N ×6, O ×6, R ×6, S ×6, T ×6, U ×6, L ×5
	//   2 points : D ×3, G ×2, M ×3
	//   3 points : B ×2, C ×2, P ×2
	//   4 points : F ×2, H ×2, V ×2
	//   8 points : J ×1, Q ×1
	//   10 points : K ×1, W ×1, X ×1, Y ×1, Z ×1
	let total_remaining_letters = 102;
	let letters = {
		JOKER:{count:2, points:0 },
		E:{count:15, points:1}, A:{count:9, points:1}, I:{count:9, points:1}, N:{count:6, points:1}, O:{count:6, points:1}, R:{count:6, points:1}, S:{count:6, points:1}, T:{count:6, points:1}, U:{count:6, points:1}, L:{count:5, points:1},
		D:{count:3, points:2}, G:{count:2, points:2}, M:{count:3, points:2},
		B:{count:2, points:3}, C:{count:2, points:3}, P:{count:2, points:3},
		F:{count:2, points:4}, H:{count:2, points:4}, V:{count:2, points:4},
		J:{count:1, points:8}, Q:{count:1, points:8},
		K:{count:1, points:10}, W:{count:1, points:10}, X:{count:1, points:10}, Y:{count:1, points:10}, Z:{count:1, points:10},
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
					cursor.direction = "right";
					me.innerHTML = "▶";
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
						elt.innerHTML = [letter, "<div class=\"points\">", letters[letter].points, "</div>"].join("");
						// we also remove the letter from the pool
						letters[letter].count--;
						total_remaining_letters--;
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
					elt.innerHTML = [letter, "<div class=\"points\">", letters[letter].points, "</div>"].join("");
					// we remove the letter from the pool
					letters[letter].count--;
					total_remaining_letters--;
				}
				elt.onclick = makeRackTileOnClick(x);
			}
			// initialize buttons
			document.getElementById("validate").disabled = true;
			// populate remaining letters
			let remaining_letters = [ "Lettres restantes: ", total_remaining_letters, "<br>" ];
			let first = true;
			for (const [key, value] of Object.entries(letters)) {
				if (value.count > 0) {
					if (first) {
						remaining_letters = remaining_letters.concat(key, "x", value.count);
						first = false;
					} else {
						remaining_letters = remaining_letters.concat(", ", key, "x", value.count);
					}
				}
			}
			document.getElementById("remaining_letters").innerHTML = remaining_letters.join("");
		}
	};
}();

CW.init();
