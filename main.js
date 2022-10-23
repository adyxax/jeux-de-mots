import express from "express";

export const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

let CWDATA = {
	board: [
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "T", "E", "S","T", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ],
		[ "", "", "", "", "","", "", "", "", "","", "", "", "", "" ]
	],
	letters: [ "A", "B", "C", "D", "E", "F", "JOKER" ]
};

app.get("/", (req, res) => {
	return res.render("index", {CWDATA: CWDATA});
});

app.use(express.static("static"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
