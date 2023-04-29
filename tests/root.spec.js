import { beforeEach, describe, it } from 'vitest';
import supertest from 'supertest';

import app from '../main.js';

const request = supertest(app);

describe.concurrent('Root handlers tests', function() {
	describe.concurrent('When not logged in', function() {
		it('GET /', async function() { await request.get('/').expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/login$/); });
		it('GET /login', async function() { await request.get('/login').expect('Content-Type', /text\/html/).expect(200, /<form action="\/login" method="post">/); });
		it('GET /logout', async function() { await request.get('/logout').expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/$/); });
	});

	describe.concurrent('With valid credentials', function() {
		beforeEach(async function(ctx) {
			const authResponse = await request.post('/login')
				.send('username=Alice&password=Alice42!')
				.expect('Content-Type', /text\/plain/)
				.expect('set-cookie', /JDMSessionId=/)
				.expect(302, /Redirecting to \/games$/);
			ctx.cookie = authResponse.get('Set-Cookie');
		});
		it('GET /', async function(ctx) { await request.get('/').set('Cookie', ctx.cookie).expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/games$/); });
		it('GET /login', async function(ctx) { await request.get('/login').set('Cookie', ctx.cookie).expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/games$/); });
		describe('logout', function() {
			beforeEach(async function(ctx) {
				await request.get('/logout').set('cookie', ctx.cookie).expect('content-type', /text\/plain/).expect('set-cookie', /JDMSessionId=;/).expect(302, /Redirecting to \/$/);
			});
			describe.concurrent('all handlers with the now invalid cookie', async function() {
				it('GET /', async function(ctx) { await request.get('/').set('Cookie', ctx.cookie).expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/login$/); });
				it('GET /login', async function(ctx) { await request.get('/login').set('Cookie', ctx.cookie).expect('Content-Type', /text\/html/).expect(200, /<form action="\/login" method="post">/); });
				it('GET /logout', async function(ctx) { await request.get('/logout').set('Cookie', ctx.cookie).expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/$/); });
			});
		});
	});

	describe.concurrent('With invalid credentials', function() {
		it('POST /login', async function() {
			await request.post('/login').send('username=NonExistant&password=Alice42!')
				.expect('Content-Type', /text\/html/)
				.expect(403, /erreur de connexion/);
		});
		it('POST /login', async function() {
			await request.post('/login').send('username=Alice&password=Invalid')
				.expect('Content-Type', /text\/html/)
				.expect(403, /erreur de connexion/);
		});
	});
});
