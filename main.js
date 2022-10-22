import express from "express";

export const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	return res.render("index", {});
});

app.use(express.static("static"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}!`));
