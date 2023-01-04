import { beforeEach, describe, test } from "vitest";
import supertest from "supertest";

import app from "../main.js";

describe.concurrent("Games handlers tests", function() {
	describe.concurrent("When not logged in", function() {
		test("GET /games", async function() { await supertest(app).get("/games").expect("Content-Type", /text\/plain/).expect(302, /Redirecting to \/login$/); });
		test("GET /games/1", async function() { await supertest(app).get("/games").expect("Content-Type", /text\/plain/).expect(302, /Redirecting to \/login$/); });
	});
	describe.concurrent("With valid credentials", function() {
		beforeEach(async function(ctx) {
			const authResponse = await supertest(app).post("/login")
				.send("username=Alice&password=Alice42!")
				.expect("Content-Type", /text\/plain/)
				.expect("set-cookie", /JDMSessionId=/)
				.expect(302, /Redirecting to \/games$/);
			ctx.cookie = authResponse.get("Set-Cookie");
		});
		test("GET /games", async function(ctx) { await supertest(app).get("/games").set("Cookie", ctx.cookie).expect("Content-Type", /text\/html/).expect(200, /<td><a href="\/games\/1">Alice vs Bob<\/a><\/td>/); });
		test("GET /games/1", async function(ctx) { await supertest(app).get("/games/1").set("Cookie", ctx.cookie).expect("Content-Type", /text\/html/).expect(200, /<h2>Alice vs Bob<\/h2>/); });
	});
});
