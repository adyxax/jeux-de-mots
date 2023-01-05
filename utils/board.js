export const emptyBoard = [
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ],
	[ '', '', '', '', '','', '', '', '', '', '', '', '', '', '' ]
];

export const letters_total = 102;

export class Bag {
	constructor() {
		this.letters = {
			JOKER:{count:2, points:0 },
			E:{count:15, points:1}, A:{count:9, points:1}, I:{count:9, points:1}, N:{count:6, points:1}, O:{count:6, points:1}, R:{count:6, points:1}, S:{count:6, points:1}, T:{count:6, points:1}, U:{count:6, points:1}, L:{count:5, points:1},
			D:{count:3, points:2}, G:{count:2, points:2}, M:{count:3, points:2},
			B:{count:2, points:3}, C:{count:2, points:3}, P:{count:2, points:3},
			F:{count:2, points:4}, H:{count:2, points:4}, V:{count:2, points:4},
			J:{count:1, points:8}, Q:{count:1, points:8},
			K:{count:1, points:10}, W:{count:1, points:10}, X:{count:1, points:10}, Y:{count:1, points:10}, Z:{count:1, points:10},
		};
		this.remaining = letters_total;
	}
	pick(count) {
		if (count > this.remaining) {
			count = this.remaining;
		}
		let ret = [];
		for (let i=0; i<count; i++) {
			let n = Math.floor(Math.random() * this.remaining);
			let j = 0;
			for (;;) {
				if (this.letters[allLetters[j]].count === 0) {
					j++;
				} else if (this.letters[allLetters[j]].count < n) {
					n -= this.letters[allLetters[j]].count;
					j++;
				} else {
					n = 0;
					break;
				}
			}
			this.letters[allLetters[j]].count--;
			this.remaining--;
			ret.push(allLetters[j]);
		}
		return ret;
	}
}

const allLetters = Object.keys(new Bag().letters);
