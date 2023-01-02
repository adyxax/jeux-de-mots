import { beforeEach, describe, it } from "vitest";
import supertest from "supertest";

import app from "../main.js";

const request = supertest(app);

describe.concurrent("Root handlers tests", async function() {
	describe.concurrent("When not logged in", async function() {
		it("/", async function() { request.get("/").expect("Content-Type", /text\/plain/).expect(302, /Redirecting to \/login$/); });
		it("/login", async function() { request.get("/login").expect("Content-Type", /text\/html/).expect(200, /<form action="\/login" method="post">/); });
		it("/logout", async function() { request.get("/logout").expect("Content-Type", /text\/plain/).expect(302, /Redirecting to \/$/); });
	});

	describe.concurrent("With valid credentials", async function() {
		beforeEach(async function(ctx) {
			const authResponse = await request.post("/login")
				.send("username=Alice&password=Alice42!")
				.expect("Content-Type", /text\/plain/)
				.expect("set-cookie", /JDMSessionId=/)
				.expect(302, /Redirecting to \/games$/);
			ctx.cookie = authResponse.get("Set-Cookie");
		});
		it("/", async function(ctx) { request.get("/").set("Cookie", ctx.cookie).expect("Content-Type", /text\/plain/).expect(302, /Redirecting to \/games$/); });
		it("/login", async function(ctx) { request.get("/login").set("Cookie", ctx.cookie).expect("Content-Type", /text\/plain/).expect(302, /Redirecting to \/games$/); });
		describe("logout", async function(ctx) {
			it("/logout", async function() { request.get("/logout").set("cookie", ctx.cookie).expect("content-type", /text\/plain/).expect("set-cookie", /JDMSessionId=;/).expect(302, /Redirecting to \/$/); });
			describe.concurrent("all handlers with the now invalid cookie", async function() {
				it("/", async function() { request.get("/").set("Cookie", ctx.cookie).expect("Content-Type", /text\/plain/).expect(302, /Redirecting to \/login$/); });
				it("/", async function() { request.get("/login").set("Cookie", ctx.cookie).expect("Content-Type", /text\/html/).expect(200, /<form action="\/login" method="post">/); });
				it("/", async function() { request.get("/logout").set("Cookie", ctx.cookie).expect("Content-Type", /text\/plain/).expect(302, /Redirecting to \/$/); });
			});
		});
	});
});
