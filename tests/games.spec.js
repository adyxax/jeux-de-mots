import { beforeEach, describe, test } from 'vitest';
import supertest from 'supertest';

import app from '../main.js';

const request = supertest(app);

describe('Games handlers tests', function() {
	describe('When not logged in', function() {
		test('GET /games', async function() { await request.get('/games').expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/login$/); });
		test('GET /games/1', async function() { await request.get('/games/1').expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/login$/); });
		test('GET /games/2', async function() { await request.get('/games/2').expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/login$/); });
	});
	describe('With valid credentials', function() {
		beforeEach(async function(ctx) {
			const authResponse = await request.post('/login')
				.send('username=Alice&password=Alice42!')
				.expect('Content-Type', /text\/plain/)
				.expect('set-cookie', /JDMSessionId=/)
				.expect(302, /Redirecting to \/games$/);
			ctx.cookie = authResponse.get('Set-Cookie');
		});
		test('GET /games', async function(ctx) { await request.get('/games').set('Cookie', ctx.cookie).expect('Content-Type', /text\/html/).expect(200, /<td><a href="\/games\/1">Alice vs Bob<\/a><\/td>/); });
		test('GET /games/1', async function(ctx) { await request.get('/games/1').set('Cookie', ctx.cookie).expect('Content-Type', /text\/html/).expect(200, /<h2>Alice vs Bob<\/h2>/); });
		test('GET /games/2', async function(ctx) { await request.get('/games/2').set('Cookie', ctx.cookie).expect('Content-Type', /text\/plain/).expect(302, /Redirecting to \/games/); });
	});
});
