import { describe, beforeAll, jest, afterAll, test, expect } from '@jest/globals';
import { mongoose } from '../db';
import request from 'supertest';
import app from '../app';
import { BASE_URL, RESPONSE_MESSAGES } from '../variables';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Utenti } from '../../types';
import { createHash } from 'crypto';


const JWT_C = (process.env.JWT_SECRET as string) + (process.env.RANDOM_SECRET as string);

describe('GET `/session`', () => {
    const user: Utenti.User = {
        self: `${BASE_URL}/users/6732253c07ef96ce5576ebd4`,
        email: 'amministratore@test.com',
        nome: 'Amministratore',
        cognome: 'Test',
        ruolo: 'Amministratore',
        imageUrl: '6732253c07ef96ce5576ebd4'
    }
    const VALID_TOKEN = jwt.sign(user, JWT_C, { expiresIn: '6h' });
    const INVALID_WELL_FORMATTED_TOKEN = jwt.sign(user, JWT_C, { expiresIn: '6h' }).slice(1);
    const INVALID_NOT_WELL_FORMATTED_TOKEN = 'anything';

    beforeAll(async ()=>{
        jest.setTimeout(10000);
    });
    test('If the session is valid and the user is logged in, it should return 200 and a `Utenti.User` object', async () => {
        const response = await request(app)
            .get('/api/v1/session')
            .set('Authorization', `Bearer ${VALID_TOKEN}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
    });
    test('If the token is not present, it should return 401 and an `Errors` object', async () => {
        const response = await request(app).get('/api/v1/session');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: expect.any(String)
        });
    });
    test('If the token is well formatted but invalid, it should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .get('/api/v1/session')
            .set('Authorization', `Bearer ${INVALID_WELL_FORMATTED_TOKEN}`);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: expect.any(String)
        });
    });
    test('If the token is not well formatted, it should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .get('/api/v1/session')
            .set('Authorization', `Bearer ${INVALID_NOT_WELL_FORMATTED_TOKEN}`);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: expect.any(String)
        });
    });
    test('If the token is valid, well formatted but on the TRL, it should return 401 and an `Errors` object', async () => {
        const revocation = await request(app)
            .delete('/api/v1/session')
            .set('Authorization', `Bearer ${VALID_TOKEN}`);
        expect(revocation.status).toBe(204);
        const response = await request(app)
            .get('/api/v1/session')
            .set('Authorization', `Bearer ${VALID_TOKEN}`);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: expect.any(String)
        });
    });
});

describe('POST `/session`', () => {
    const validEmail = 'sondaggista@test.com';
    const validPassword = 'password'
    const validPassword_hash = createHash('sha256').update(validPassword).digest('hex');
    const ruoli_aspettati = ['Amministratore', 'Sondaggista', 'Analista', 'Circoscrizione'];

    beforeAll(async ()=>{
        jest.setTimeout(10000);
    });
    test('If the email and password are correct, it should return 200 and a token and a `Utenti.User` object', async () => {
        const response = await request(app)
            .post('/api/v1/session')
            .send({ email: validEmail, password: validPassword_hash });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            token: expect.any(String),
            user: {
                self: expect.any(String),
                email: validEmail,
                nome: expect.any(String),
                cognome: expect.any(String),
                ruolo: expect.any(String),
                imageUrl: expect.any(String)
            }
        });
        expect(ruoli_aspettati).toContain(response.body.user.ruolo);
    });
    test('If the email is not present, it should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .post('/api/v1/session')
            .send({ password: validPassword_hash });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: expect.any(String)
        });
    });
    test('If the password is not present, it should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .post('/api/v1/session')
            .send({ email: validEmail });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: expect.any(String)
        });
    });
    test('If the email is present and valid, the password is present but incorrect, it should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .post('/api/v1/session')
            .send({ email: validEmail, password: 'incorrect' });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: expect.any(String)
        });
    });
});

describe('DELETE `/session`', () => {
    const user: Utenti.User = {
        self: `${BASE_URL}/users/6732253c07ef96ce5576ebd4`,
        email: 'amministratore@test.com',
        nome: 'Amministratore2',
        cognome: 'Test2',
        ruolo: 'Amministratore',
        imageUrl: '6732253c07ef96ce5576ebd4'
    }
    const VALID_TOKEN = jwt.sign(user, JWT_C, { expiresIn: '6h' });
    test('If the token is valid, it should return 204', async () => {
        const response = await request(app)
            .delete('/api/v1/session')
            .set('Authorization', `Bearer ${VALID_TOKEN}`);
        console.log(response.body);
        expect(response.status).toBe(204);
    });
    test('If the token is not present, it should return 401 and an `Errors` object', async () => {
        const response = await request(app).delete('/api/v1/session');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: expect.any(String)
        });
    });
    test('If the token is well formatted but invalid, it should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .delete('/api/v1/session')
            .set('Authorization', `Bearer ${jwt.sign(user, JWT_C, { expiresIn: '6h' }).slice(1)}`);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: expect.any(String)
        });
    });
    test('If the token is not well formatted, it should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .delete('/api/v1/session')
            .set('Authorization', `Bearer anything`);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: 401,
            message: RESPONSE_MESSAGES[401],
            details: expect.any(String)
        });
    });
});

afterAll(async ()=>{
    mongoose.connection.close();
});
