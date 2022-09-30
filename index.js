'use strict';

var CW = function(){
	//   0 point : blanches × 2.
	//   1 point : E ×15, A ×9, I ×8, N ×6, O ×6, R ×6, S ×6, T ×6, U ×6, L ×5
	//   2 points : D ×3, G ×2, M ×3
	//   3 points : B ×2, C ×2, P ×2
	//   4 points : F ×2, H ×2, V ×2
	//   8 points : J ×1, Q ×1
	//   10 points : K ×1, W ×1, X ×1, Y ×1, Z ×1
	var letters = [
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
	]
	const points = {
		" ": 0,
		E:1, A:1, I:1, N:1, O:1, R:1, S:1, T:1, U:1, L:1,
		D:2, G:2, M:2,
		B:3, C:3, P:3,
		F:4, H:4, V:4,
		J:8, Q:8,
		K:10, W:10, X:10, Y:10, Z:10
	};
	var cursor = undefined;
	var placed = [];
	var selected = undefined;

	function makeBoardTileOnCLick(x, y) {
		return function() {
			var me = document.getElementById(["s", y, "_", x].join(""));
			var dst = undefined;
			var oth = undefined;
			var l = me.innerHTML;
			var n;
			var i;
			if (l === "") {
				if (selected === undefined) {
					moveCursor(x, y);
				} else {
					// place the selected letter
					me.classList.add("letter");
					me.classList.add("placed");
					me.innerHTML = selected.letter;
					dst = document.getElementById(["l", selected.index].join(""));
					dst.classList.replace("selected", "letter");
					dst.classList.add("placed");
					placed.push({x:x, y:y, index:selected.index, letter: selected.letter});
					selected = undefined;
				}
			} else if (me.classList.contains("placed")) {
				for(n=placed.length-1; n>=0; n--) {
					if (placed[n].x === x && placed[n].y === y) {
						break;
					}
				}
				// return the placed letter to the rack
				dst = document.getElementById(["l", placed[n].index].join(""));
				dst.classList.remove("placed");
				if (selected === undefined) {
					// simply remove from the board
					me.innerHTML = "";
					me.classList.remove("placed");
					me.classList.remove("letter");
					placed.splice(n, 1);
				} else {
					// place the selected letter in its place on the board
					me.innerHTML = selected.letter;
					oth = document.getElementById(["l", selected.index].join(""));
					oth.classList.replace("selected", "letter");
					oth.classList.add("placed");
					i = placed[n].index;
					placed.splice(n, 1, { x: x, y: y, index: selected.index, letter: selected.letter });
					// select the letter that was returned to the rack
					selected = { index: i, letter: dst.innerHTML };
					dst.classList.replace("letter", "selected");
				}
			} else if (cursor !== undefined && cursor.x == x && cursor.y == y) {
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
			var n = 0;
			var me = document.getElementById(["l", i].join(""));
			var dst = undefined;
			var cur = undefined;
			var l = me.innerHTML;
			if (me.classList.contains("placed")) {
				if (selected === undefined) {
					// we return the letter to the rack
					for(n=placed.length-1; n>=0; n--) {
						if (placed[n].index === i) {
							break;
						}
					}
					dst = document.getElementById(["s", placed[n].y, "_", placed[n].x].join(""));
					dst.innerHTML = "";
					dst.classList.remove("letter");
					dst.classList.remove("placed");
					me.classList.remove("placed");
					moveCursor(placed[n].x, placed[n].y)
					// clean the placed array
					placed.splice(n, 1);
				} else {
					// We do nothing, we do move the rack position of a placed letter
				}
			} else {
				if (selected === undefined) {
					if (cursor === undefined) {
						selected = { index: i, letter: l };
						me.classList.replace("letter", "selected");
					} else {
						// Place the letter on the cursor's position
						dst = document.getElementById(["s", cursor.y, "_", cursor.x].join(""));
						dst.innerHTML = me.innerHTML;
						dst.classList.add("letter");
						dst.classList.add("placed");
						me.classList.add("placed");
						placed.push({x: cursor.x, y: cursor.y, index:i, letter: me.innerHTML});
						// Move the cursor if possible
						while(cursor.x < 15 && cursor.y < 15) {
							if (cursor.direction === "right") {
								cursor.x++;
							} else {
								cursor.y++;
							}
							dst = document.getElementById(["s", cursor.y, "_", cursor.x].join(""));
							if (dst === null || dst.innerHTML === "") {
								break;
							}
						}
						if (cursor.x >= 15 || cursor.y >= 15) {
							cursor = undefined;
						} else {
							if (cursor.direction === "right") {
								dst.innerHTML = "▶";
							} else {
								dst.innerHTML = "▼";
							}
						}
					}
				} else if (selected.index === i) {
					selected = undefined;
					me.classList.replace("selected", "letter");
				} else {
					dst = document.getElementById(["l", selected.index].join(""));
					dst.innerHTML = l;
					me.innerHTML = selected.letter;
					dst.classList.replace("selected", "letter");
					selected = undefined;
				}
			}
		};
	}

	function moveCursor(x, y) {
		var me = document.getElementById(["s", y, "_", x].join(""));
		var dst = undefined;
		if (cursor === undefined) {
			cursor = { x: x, y: y};
		} else {
			// Move the cursor
			dst = document.getElementById(["s", cursor.y, "_", cursor.x].join(""));
			dst.innerHTML = "";
			cursor.x = x;
			cursor.y = y;
		}
		// try to guess word direction if several letters are already placed
		if (placed.length >= 2 && placed[0].x === placed[1].x) {
			cursor.direction = "down";
			me.innerHTML = "▼";
		} else {
			cursor.direction = "right";
			me.innerHTML = "▶";
		}
	}

	return {
		init: function() {
			var elt = undefined;
			var idx = undefined;
			var letter;
			var x = 0;
			var y = 0;
			// populate the board
			for (y=0; y<CWDATA.board.length; y++) {
				const line = CWDATA.board[y];
				for(x=0; x<line.length; x++) {
					letter = line[x];
					elt = document.getElementById(['s', y, '_', x].join(''));
					if (letter !== "") {
						elt.className = "letter";
						elt.innerHTML = [letter, '<div class="points">', points[letter], "</div>"].join("");
						// we also remove the letter from the pool
						idx = letters.findIndex(function(elt) { return elt === letter; });
						if (idx != -1) {
							letters.splice(idx, 1);
						}
					}
					elt.onclick = makeBoardTileOnCLick(x, y);
				}
			}
			// populate the rack
			for (x=0; x<CWDATA.letters.length; x++) {
				letter = CWDATA.letters[x];
				elt = document.getElementById(["l", x].join(""));
				elt.className = "letter";
				elt.innerHTML = [letter, '<div class="points">', points[letter], "</div>"].join("");
				elt.onclick = makeRackTileOnClick(x);
				// we also remove the letter from the pool
				idx = letters.findIndex(function(elt) { return elt === letter; });
				if (idx != -1) {
					letters.splice(idx, 1);
				}
			}
			// initialize buttons
			document.getElementById("validate").disabled = true;
			// populate remaining letters
			var letters_left = [ "Lettres restantes: ", letters.length, "<br>" ];
			var prev = undefined;
			y = 1;
			for (x=0; x<letters.length; x++) {
				letter = letters[x];
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
						letters_left = letters_left.concat(prev, 'x', y, ', ');
					} else {
						letters_left = letters_left.concat(prev, ', ');
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
					letters_left = letters_left.concat(prev, 'x', y, '.');
				} else {
					letters_left = letters_left.concat(prev, '.');
				}
			}
			document.getElementById('letters_left').innerHTML = letters_left.join('');
		}
	};
}();

CW.init();
