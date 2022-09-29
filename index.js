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
		' ': 0,
		E:1, A:1, I:1, N:1, O:1, R:1, S:1, T:1, U:1, L:1,
		D:2, G:2, M:2,
		B:3, C:3, P:3,
		F:4, H:4, V:4,
		J:8, Q:8,
		K:10, W:10, X:10, Y:10, Z:10
	};
	var cursor = undefined;
	var selected = undefined;

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
						elt.innerHTML = [letter, '<div class="points">', points[letter], '</div>'].join('');
						// we also remove the letter from the pool
						idx = letters.findIndex(function(elt) { return elt === letter; });
						if (idx != -1) {
							letters.splice(idx, 1);
						}
					}
				}
			}
			// populate the rack
			for (x=0; x<CWDATA.letters.length; x++) {
				letter = CWDATA.letters[x];
				elt = document.getElementById(['l', x].join(''));
				elt.innerHTML = [letter, '<div class="points">', points[letter], '</div>'].join('');
				// we also remove the letter from the pool
				idx = letters.findIndex(function(elt) { return elt === letter; });
				if (idx != -1) {
					letters.splice(idx, 1);
				}
			}
			// initialize buttons
			document.getElementById('validate').disabled = true;
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
