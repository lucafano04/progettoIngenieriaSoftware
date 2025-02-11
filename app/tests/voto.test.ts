import { describe, beforeAll, jest, afterAll, test, expect } from '@jest/globals';
import { mongoose } from '../db';
import request from 'supertest';
import app from '../app';
import { BASE_URL, RESPONSE_MESSAGES } from '../variables';
import { Sondaggi, Utenti, Voti } from '../../types';
import jwt from 'jsonwebtoken';
import { Sondaggio, User, Voti as Voto } from '../db/models';


const JWT_C = (process.env.JWT_SECRET as string) + (process.env.RANDOM_SECRET as string);
// Since the quartiere is not editable by any user, we can use a fixed value 
const VALID_QUARTIERE = '674046040edc403969cceaef';

const VALID_TOKEN_OTHER = jwt.sign({
        self: `${BASE_URL}/user/123456789012345678901234`,
        email: 'test@pippo.com',
        nome: 'test',
        cognome: 'test',
        ruolo: 'Sondaggista',
        imageUrl: 'test'
    }, JWT_C, { expiresIn: '1h' });


let sondaggio: string;
let token: string;
let userID: string;
let votoID: string;
beforeAll(async () => {
    const user = await User.insertOne({
        _id: new mongoose.Types.ObjectId(),
        email: 'test@test.com',
        nome: 'test',
        cognome: 'test',
        password: 'test',
        ruolo: 'Sondaggista',
        imageUrl: 'test'
    });
    userID = user._id.toString();
    const utente: Utenti.User = {
        self: `${BASE_URL}/user/${user._id.toString()}`,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        ruolo: user.ruolo,
        imageUrl: user.imageUrl
    };
    expect(user).not.toBeNull();
    token = jwt.sign(utente, JWT_C, { expiresIn: '1h' });
    const sondaggioObj = await Sondaggio.insertOne({
        titolo: 'test',
        dataInizio: new Date(),
        sondaggista: user._id,
        isAperto: true,
        statoApprovazione: 'In attesa'
    });
    expect(sondaggioObj).not.toBeNull();
    sondaggio = sondaggioObj._id.toString();
    const voto = await Voto.insertOne({
        voto: 5,
        sondaggio: sondaggio,
        eta: 25,
        quartiere: VALID_QUARTIERE,
        dataOra: new Date(),
    });
    expect(voto).not.toBeNull();
    votoID = voto._id.toString();
});

describe('GET `/voti`', () => {
    test('Valid survey, should return 200 and an array of `Voti.Voto` objects', async () => {
        const response = await request(app)
            .get(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        const data = response.body as Voti.Voto[];
        data.forEach((voto) => {
            expect(voto).toMatchObject({
                self: expect.any(String),
                voto: expect.any(Number),
                quartiere: expect.any(String),
                dataOra: expect.any(String),
                eta: expect.anything(),
            });
        });
    });
    test('Invalid survey, but well formatted id, should return 404 and an `Errors` object', async () => {
        const response = await request(app)
            .get(`${BASE_URL}/voti?idSondaggio=123456789012345678901234`)
            .set('Authorization', `Bearer ${token}`);
        checkError(response, 404);
    });
    test('Invalid survey, wrong formatted id, should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .get(`${BASE_URL}/voti?idSondaggio=1234`)
            .set('Authorization', `Bearer ${token}`);
        checkError(response, 400);
    });
    test('No token, should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .get(`${BASE_URL}/voti?idSondaggio=${sondaggio}`);
        checkError(response, 401);
    });
    test('Invalid token, should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .get(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer 1234`);
        checkError(response, 401);
    });
    test('Other user token, should return 403 and an `Errors` object', async () => {
        const response = await request(app)
            .get(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${VALID_TOKEN_OTHER}`);
        checkError(response, 403);
    });
});

describe('POST `/voti`', () => {
    test('Valid vote without age, valid token and valid survey, should return 201 and the id via a location header', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                voto: 5,
                eta: 24,
                quartiere: VALID_QUARTIERE
            });
        expect(response.status).toBe(201);
        expect(response.header).toHaveProperty('location');
    });
    test('Valid vote with age, valid token and valid survey, should return 201 and the id via a location header', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                voto: 5,
                eta: 24,
                quartiere: VALID_QUARTIERE
            });
        expect(response.status).toBe(201);
        expect(response.header).toHaveProperty('location');
    });
    test('Invalid vote, valid token and valid survey, should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                voto: 6,
                eta: 24,
                quartiere: VALID_QUARTIERE
            });
        checkError(response, 400);
    });
    test('Invalid vote (not existing quartiere) valid token and valid survey, should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                voto: 5,
                eta: 24,
                quartiere: '123456789012345678901234'
            });
        checkError(response, 400);
    });
    test('Invalid vote (negative age), valid token and valid survey, should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                voto: 5,
                eta: -24,
                quartiere: VALID_QUARTIERE
            });
        expect(response.status).toBe(400);
    });
    test('Empty body, valid token and valid survey, should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${token}`)
            .send();
        checkError(response, 400);
    });
    test('Nonexistent survey, valid token and valid vote, should return 404 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=123456789012345678901234`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                voto: 5,
                eta: 24,
                quartiere: VALID_QUARTIERE
            });
        checkError(response, 404);
    });
    test('Invalid survey, valid token and valid vote, should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=12345678901234567890123`)
            .set('Authorization', `Bearer ${token}`)
            .send({ 
                voto: 5,
                eta; 24,
                quartiere: VALID_QUARTIERE
            });
        checkError(response, 400);
    });
    test('Not authenticated user, should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .send({ 
                voto: 5,
                eta: 24,
                quartiere: VALID_QUARTIERE
            });
        checkError(response, 401);
    });
    test('Invalid token, should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer 1234`)
            .send({ 
                voto: 5,
                eta: 24,
                quartiere: VALID_QUARTIERE
            });
        checkError(response, 401);
    });
    test('Other user token, should return 403 and an `Errors` object', async () => {
        const response = await request(app)
            .post(`${BASE_URL}/voti?idSondaggio=${sondaggio}`)
            .set('Authorization', `Bearer ${VALID_TOKEN_OTHER}`)
            .send({ 
                voto: 5,
                eta: 24,
                quartiere: VALID_QUARTIERE
            });
        checkError(response, 403);
    });
});

describe('DELETE `/voti/:id`', () => {
    test('Valid vote, valid token, not the same user, should return 403 and an `Errors` object', async () => {
        const response = await request(app)
            .delete(`${BASE_URL}/voti/${votoID}`)
            .set('Authorization', `Bearer ${VALID_TOKEN_OTHER}`);
        checkError(response, 403);
    });
    test('Invalid vote, valid token, should return 404 and an `Errors` object', async () => {
        const response = await request(app)
            .delete(`${BASE_URL}/voti/123456789012345678901234`)
            .set('Authorization', `Bearer ${token}`);
        checkError(response, 404);
    });
    test('Not well formatted id, valid token, should return 400 and an `Errors` object', async () => {
        const response = await request(app)
            .delete(`${BASE_URL}/voti/1234`)
            .set('Authorization', `Bearer ${token}`);
        checkError(response, 400);
    });
    test('Valid vote, valid token, should return 204', async () => {
        const response = await request(app)
            .delete(`${BASE_URL}/voti/${votoID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });
    test('Not authenticated user, should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .delete(`${BASE_URL}/voti/${votoID}`);
        checkError(response, 401);
    });
    test('Invalid token, should return 401 and an `Errors` object', async () => {
        const response = await request(app)
            .delete(`${BASE_URL}/voti/${votoID}`)
            .set('Authorization', `Bearer 1234`);
        checkError(response, 401);
    });
});


afterAll(async () => {
    User.deleteOne({ _id: userID });
    Sondaggio.deleteOne({ _id: sondaggio });
    mongoose.connection.close();
});

function checkError(response: request.Response, code: number){
    expect(response.status).toBe(code);
    expect(response.body).toMatchObject({
        code: code,
        message: RESPONSE_MESSAGES[code],
        details: expect.any(String)
    });
}