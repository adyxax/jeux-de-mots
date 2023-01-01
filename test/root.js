import test from "ava";
import supertest from "supertest";

import app from "../main.js";

const request = supertest(app);

test("get / when not logged should redirect to /login", async function(t) {
	await request.get("/")
		.expect("Content-Type", /text\/plain/)
		.expect(302, /Redirecting to \/login$/);
	t.pass();
});
test("get /login when not logged in should display the login page", async function(t) {
	await request.get("/login")
		.expect("Content-Type", /text\/html/)
		.expect(200, /<form action="\/login" method="post">/);
	t.pass();
});
test("get /logout when not logged in should redirect to the root", async function(t) {
	await request.get("/logout")
		.expect("Content-Type", /text\/plain/)
		.expect(302, /Redirecting to \/$/);
	t.pass();
});
test("post /login with valid credentials should set a cookie and redirect to the games list", async function(t) {
	await request.post("/login")
		.send("username=Alice&password=Alice42!")
		.expect("Content-Type", /text\/plain/)
		.expect("set-cookie", /JDMSessionId=/)
		.expect(302, /Redirecting to \/games$/);
	t.pass();
});
test("get / when logged in should redirect to the /games page", async function(t) {
	const authResponse = await request.post("/login")
		.send("username=Alice&password=Alice42!")
		.expect("Content-Type", /text\/plain/)
		.expect("set-cookie", /JDMSessionId=/)
		.expect(302, /Redirecting to \/games$/);
	let cookie = authResponse.get("Set-Cookie");
	await request.get("/")
		.set("Cookie", cookie)
		.expect("Content-Type", /text\/plain/)
		.expect(302, /Redirecting to \/games$/);
	t.pass();
});
test("get /login when already logged in should redirect to the games page", async function(t) {
	const authResponse = await request.post("/login")
		.send("username=Alice&password=Alice42!")
		.expect("Content-Type", /text\/plain/)
		.expect("set-cookie", /JDMSessionId=/)
		.expect(302, /Redirecting to \/games$/);
	let cookie = authResponse.get("Set-Cookie");
	await request.get("/login")
		.set("Cookie", cookie)
		.expect("Content-Type", /text\/plain/)
		.expect(302, /Redirecting to \/games$/);
	t.pass();
});
test("get /logout when logged in should delog and redirect to the root", async function(t) {
	const authResponse = await request.post("/login")
		.send("username=Alice&password=Alice42!")
		.expect("Content-Type", /text\/plain/)
		.expect("set-cookie", /JDMSessionId=/)
		.expect(302, /Redirecting to \/games$/);
	let cookie = authResponse.get("Set-Cookie");
	await request.get("/logout")
		.set("cookie", cookie)
		.expect("content-type", /text\/plain/)
		.expect("set-cookie", /JDMSessionId=;/)
		.expect(302, /Redirecting to \/$/);
	t.pass();
});
test("get / with an now invalid cookie should redirect to the /login page", async function(t) {
	const authResponse = await request.post("/login")
		.send("username=Alice&password=Alice42!")
		.expect("Content-Type", /text\/plain/)
		.expect("set-cookie", /JDMSessionId=/)
		.expect(302, /Redirecting to \/games$/);
	let cookie = authResponse.get("Set-Cookie");
	await request.get("/logout")
		.set("cookie", cookie)
		.expect("content-type", /text\/plain/)
		.expect("set-cookie", /JDMSessionId=;/)
		.expect(302, /Redirecting to \/$/);
	await request.get("/")
		.set("Cookie", cookie)
		.expect("Content-Type", /text\/plain/)
		.expect(302, /Redirecting to \/login$/);
	t.pass();
});
