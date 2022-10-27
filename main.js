import express from "express";

import helmet from "./middlewares/helmet.js";
import loginRouter from "./routes/login.js";
import playRouter from "./routes/play.js";
import rootRouter from "./routes/root.js";

const app = express();
app.use(helmet);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/login", loginRouter);
app.use("/play", playRouter);
app.use("/static", express.static("static"));
app.use("/", rootRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
