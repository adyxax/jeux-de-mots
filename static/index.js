"use strict";

let CW = function() {
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
	let placed = []; // a sorted array of letters to place

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
		CWDATA.board[y][x] = "";
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
		if (src.innerHTML.charAt(21) === "&") {
			dst.innerHTML = "&nbsp;";
		} else {
			dst.innerHTML = src.innerHTML;
		}
		dst.classList.add("letter");
		src.classList.remove("letter");
		src.classList.remove("placed");
		// Place the cursor in the freed spot
		moveCursor(x, y);
		// Remove the letter from the placed array
		placed.splice(n, 1);
		// update the validate button
		updateUI();
	}

	function moveFromRackToBoard(src, x, y) {
		let dst = document.getElementById(["s", y, "_", x].join(""));
		if (src.innerHTML === "&nbsp;") {
			let letter = prompt("Entrez la lettre à utiliser", "A");
			if (letter === null || !/^[A-Za-z]$/.test(letter)) {
				return;
			}
			letter = letter.toUpperCase();
			dst.innerHTML = [letter, "<div class=\"points\">&nbsp;</div>"].join("");
			CWDATA.board[y][x] = {joker: letter};
		} else {
			dst.innerHTML = src.innerHTML;
			CWDATA.board[y][x] = dst.innerHTML.charAt(0);
		}
		dst.classList.add("letter");
		dst.classList.add("placed");
		src.classList.remove("letter");
		src.innerHTML = "";
		// insert in the placed sorted array
		placed.push({x: cursor.x, y: cursor.y, letter: dst.innerHTML});
		for (let i=placed.length-1;i>0 && placed[i].y <= placed[i-1].y && placed[i].x <= placed[i-1].x;i--) {
			let tmp = placed[i];
			placed[i] = placed[i-1];
			placed[i-1] = tmp;
		}
		// advance the cursor
		moveCursorForwardIfPossible();
		// update the validate button and pending points
		updateUI();
	}

	function isValidPlay() {
		// special case of no letters placed
		if (placed.length === 0) {
			return false;
		}
		// common definitions
		let connected = false;
		let x = placed[0].x;
		let y = placed[0].y;
		const lastx = placed[placed.length-1].x;
		const lasty = placed[placed.length-1].y;
		if (y>0) { // we check if we are connected above the first letter
			connected ||= CWDATA.board[y-1][x] != "";
		}
		if (x>0) { // we check if we are connected on the left of the first letter
			connected ||= CWDATA.board[y][x-1] != "";
		}
		if (x === 7 && y === 7 && placed.length > 1) connected = true; // starting tile
		// check if the placed letters are aligned and complete connection checks on the first and last letters
		let direction = undefined;
		if (x === lastx) {
			direction = "down";
			if (x<14) { // we are going down so we check for a connection on the right of the first letter
				connected ||= CWDATA.board[y][x+1] != "";
			}
			if (lasty<14) { // we check bellow the last letter
				connected ||= CWDATA.board[lasty+1][x] != "";
			}
		}
		if (y === lasty) {
			direction = "right";
			if (lastx<14) { // we are going right so we check for a connection bellow the first letter
				connected ||= CWDATA.board[y+1][x] != "";
			}
			if (lastx<14) { // we check on the right of the last letter
				connected ||= CWDATA.board[y][lastx+1] != "";
			}
		}
		// Now we check around the placed letters
		let i=1;
		while(i<placed.length && !(x === lastx && y === lasty)) {
			if (direction === "down") {
				y++;
			} else {
				x++;
			}
			if (x === 7 && y === 7) connected = true; // starting tile
			if (placed[i].x === x && placed[i].y === y) {
				// check around this letter
				if (direction === "down") {
					if (x > 0) { // we check for connection on the left
						connected ||= CWDATA.board[y][x-1] != "";
					}
					if (x < 14) { // we check for connection on the right
						connected ||= CWDATA.board[y][x+1] != "";
					}
				} else {
					if (y>0) { // we check for connection on top
						connected ||= CWDATA.board[y-1][x] != "";
					}
					if (y < 14) { // we check for connection bellow
						connected ||= CWDATA.board[y+1][x] != "";
					}
				}
				i++;
			} else {
				if (CWDATA.board[y][x] === "") {
					break;
				}
				connected = true;
			}
		}
		return connected && i === placed.length;
	}

	function getNewWordsAndScores() {
		function getLetterScore(letter, elt, modifiers) {
			let multiplier = 1;
			if (elt.classList.contains("placed")) {
				if (elt.classList.contains("tl")) {
					multiplier = 3;
				} else if (elt.classList.contains("dl")) {
					multiplier = 2;
				}
				if (elt.classList.contains("tw")) {
					modifiers.push("tw");
				} else if (elt.classList.contains("dw")) {
					modifiers.push("dw");
				}
			}
			if (typeof letter === "object") {
				return 0;
			}
			return multiplier * letters[letter].points;
		}
		function getHorizontalWordFrom(x, y) {
			let word = "";
			let points = 0;
			let modifiers = [];
			// Go to the left
			for(let i=x;i>=0 && CWDATA.board[y][i] != "";i--) {
				let letter = CWDATA.board[y][i];
				let elt = document.getElementById(["s", y, "_", i].join(""));
				let p = getLetterScore(letter, elt, modifiers);
				if (typeof letter === "object") {
					word = letter.joker + word;
				} else {
					word = letter + word;
					points += p;
				}
			}
			// Go to the right
			for(let i=x+1;i<15 && CWDATA.board[y][i] != "";i++) {
				let letter = CWDATA.board[y][i];
				let elt = document.getElementById(["s", y, "_", i].join(""));
				let p = getLetterScore(letter, elt, modifiers);
				if (typeof letter === "object") {
					word = word + letter.joker;
				} else {
					word = word + letter;
					points += p;
				}
			}
			// score modifiers
			modifiers.forEach(function(m) { if (m === "dw") { points *= 2; } else { points *= 3; } });
			return { word: word, points: points };
		}
		function getVerticalWordFrom(x, y) {
			let word = "";
			let points = 0;
			let modifiers = [];
			// Go to the top
			for(let i=y;i>=0 && CWDATA.board[i][x] != "";i--) {
				let letter = CWDATA.board[i][x];
				let elt = document.getElementById(["s", i, "_", x].join(""));
				let p = getLetterScore(letter, elt, modifiers);
				if (typeof letter === "object") {
					word = letter.joker + word;
				} else {
					word = letter + word;
					points += p;
				}
			}
			// Go to the bottom
			for(let i=y+1;i<15 && CWDATA.board[i][x] != "";i++) {
				let letter = CWDATA.board[i][x];
				let elt = document.getElementById(["s", i, "_", x].join(""));
				let p = getLetterScore(letter, elt, modifiers);
				if (typeof letter === "object") {
					word = word + letter.joker;
				} else {
					word = word + letter;
					points += p;
				}
			}
			// score modifiers
			modifiers.forEach(function(m) { if (m === "dw") { points *= 2; } else { points *= 3; } });
			return { word: word, points: points };
		}
		let words = [];
		words.push(getHorizontalWordFrom(placed[0].x, placed[0].y));
		words.push(getVerticalWordFrom(placed[0].x, placed[0].y));
		for (let i=1; i<placed.length;i++) {
			if (placed[i].x === placed[0].x) { // going down
				words.push(getHorizontalWordFrom(placed[i].x, placed[i].y));
			} else { // going right
				words.push(getVerticalWordFrom(placed[i].x, placed[i].y));
			}
		}
		// we strip one letter words
		for(let i=words.length-1;i>=0;i--) {
			if (words[i].word.length < 2) {
				words.splice(i, 1);
			}
		}
		return words;
	}

	function updateUI() {
		let validate = document.getElementById("validate");
		if (isValidPlay()) {
			let words = getNewWordsAndScores();
			console.log(words);
			let total = 0;
			words.forEach(function(word) {
				total += word.points;
			});
			validate.innerHTML = [total, " - Validate"].join("");
			validate.disabled = false;
		} else {
			validate.innerHTML = "0 - Validate";
			validate.disabled = true;
		}
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
						if (typeof letter === "object") {
							elt.innerHTML = [letter.joker, "<div class=\"points\">&nbsp;</div>"].join("");
							letter = "JOKER";
						} else {
							elt.innerHTML = [letter, "<div class=\"points\">", letters[letter].points, "</div>"].join("");
						}
						// we also remove the letter from the pool
						letters[letter].count--;
						total_remaining_letters--;
					}
					elt.onclick = makeBoardTileOnCLick(x, y);
				}
			}
			// populate the rack
			for (let x=0; x<7; x++) {
				let letter = CWDATA.letters[x];
				let elt = document.getElementById(["l", x].join(""));
				if (letter !== undefined) {
					elt.className = "letter";
					// we remove the letter from the pool
					letters[letter].count--;
					total_remaining_letters--;
					if (letter === "JOKER") {
						elt.innerHTML = "&nbsp;";
					} else {
						elt.innerHTML = [letter, "<div class=\"points\">", letters[letter].points, "</div>"].join("");
					}
				}
				elt.onclick = makeRackTileOnClick(x);
			}
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
		},
	};
}();

CW.init();
