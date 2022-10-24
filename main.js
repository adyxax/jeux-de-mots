import express from "express";

import playRouter from "./routes/play.js";

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("static"));
app.use("/play", playRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
