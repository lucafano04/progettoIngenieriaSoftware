import { describe, beforeAll, jest, afterAll, test, expect } from '@jest/globals';
import { mongoose } from '../db';
import request from 'supertest';
import app from '../app';
import { BASE_URL, RESPONSE_MESSAGES } from '../variables';
import { Sondaggi, Utenti, Voti } from '../../types';
import jwt from 'jsonwebtoken';
import schemas from '../db/schemas';
import { Sondaggio } from '../db/models';

const stati_possibili = ["Approvato","In attesa", "Rifiutato"];
const ruoli_possibili = ["Sondaggista", "Amministratore", "Analista"];
const JWT_C = process.env.JWT_SECRET as string + process.env.RANDOM_SECRET as string;
const SONDAGGISTA_VALIDO: Utenti.User = {
    self: `${BASE_URL}/user/673b61ddb3868e9047a8ea35`,
    nome: "Sondaggista Nome",
    cognome: "Sondaggista Cognome",
    email: "sondaggista@test.com",
    ruolo: "Sondaggista",
    imageUrl: "29db262914ce2f8e932e8c04d23c892126bcbbf735815ef25fee47ae72ccdda7"
}
const VALID_TOKEN_SONDAGGISTA = jwt.sign(SONDAGGISTA_VALIDO, JWT_C, {expiresIn: '6h'});
const SONDAGGISTA_VALIDO2: Utenti.User = {
    self: `${BASE_URL}/user/673b61ddb3868e9047a8ea36`,
    nome: "Sondaggista Nome 2",
    cognome: "Sondaggista Cognome 2",
    email: "sondaggista2@test.com",
    ruolo: "Sondaggista",
    imageUrl: "29db262914ce2f8e932e8c04d23c892126bcbbf735815ef25fee47ae72ccdda7"
}
const VALID_TOKEN_SONDAGGISTA2 = jwt.sign(SONDAGGISTA_VALIDO2, JWT_C, {expiresIn: '6h'});
const AMMINISTRATORE_VALIDO: Utenti.User = {
    self: `${BASE_URL}/user/6732253c07ef96ce5576ebd4`,
    nome: "Amministratore Nome",
    cognome: "Amministratore Cognome",
    email: "test@test.com",
    ruolo: "Amministratore",
    imageUrl: "29db262914ce2f8e932e8c04d23c892126bcbbf735815ef25fee47ae72ccdda7"
}
const VALID_TOKEN_AMMINISTRATORE = jwt.sign(AMMINISTRATORE_VALIDO, JWT_C, {expiresIn: '6h'});
const ANALISTA_VALIDO: Utenti.User = {
    self: `${BASE_URL}/user/67547f0ce28d21186db9756a`,
    nome: "Analista Nome",
    cognome: "Analista Cognome",
    email: "analista@test.com",
    ruolo: "Analista",
    imageUrl: "29db262914ce2f8e932e8c04d23c892126bcbbf735815ef25fee47ae72cc"
}
const VALID_TOKEN_ANALISTA = jwt.sign(ANALISTA_VALIDO, JWT_C, {expiresIn: '6h'});

beforeAll(async ()=>{
    jest.setTimeout(10000);
});


// Test per la rotta GET `/sondaggi`
describe('GET `/sondaggi`', () => {
    beforeAll(async ()=>{
        jest.setTimeout(10000);
    });
    test('User authenticated and `Sondaggista`, should return 200 and an array of `Sondaggi.Sondaggio` objects', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi?deepData=true')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        
        expect(response.status).toBe(200);
        const data = response.body as Sondaggi.Sondaggio[];
        data.forEach((sondaggio) => {
            checkSondaggio(sondaggio);
        });
    });
    test('User authenticated and `Sondaggista`, should return 200 and an array of `Sondaggi.Minimal` objects', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        
        expect(response.status).toBe(200);
        const data = response.body as Sondaggi.Minimal[];
        data.forEach((sondaggio) => {
            checkSondaggioMinimal(sondaggio);
        });
    });
    test('User authenticated and `Amministratore`, should return 200 and an array of `Sondaggi.Sondaggio` objects', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi?deepData=true')
            .set('Authorization', `Bearer ${VALID_TOKEN_AMMINISTRATORE}`);
        
        expect(response.status).toBe(200);
        const data = response.body as Sondaggi.Sondaggio[];
        data.forEach((sondaggio) => {
            checkSondaggio(sondaggio);
        });
    });
    test('User authenticated and `Amministratore`, should return 200 and an array of `Sondaggi.Minimal` objects', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_AMMINISTRATORE}`);
        
        expect(response.status).toBe(200);
        const data = response.body as Sondaggi.Minimal[];
        data.forEach((sondaggio) => {
            checkSondaggioMinimal(sondaggio);
        });
    });
    test('User authenticated and `Analista`, should return 403 and an error message', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_ANALISTA}`);
        
        checkError(response, 403);
    });
    test('User not authenticated, should return 401 and an error message', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi?deepData=true');
        
        checkError(response, 401);
    });
    test('User not authenticated, should return 401 and an error message', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA.slice(0, -1)}`);
        
        checkError(response, 401);
    });
});

// Test per la rotta POST `/sondaggi`
describe('POST `/sondaggi`', () => {
    let createdID: string;
    afterAll(async ()=>{
        const resp = await Sondaggio.deleteOne({_id: createdID.split('/').pop()});
        expect(resp.deletedCount).toBe(1);
    });

    test('User authenticated and `Sondaggista`, should return 201 and a Location header that will be valid', async () => {
        // Make the original request
        const response = await request(app)
            .post('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`)
            .send({
                titolo: "Sondaggio di prova",
            });
        expect(response.status).toBe(201);
        expect(response.header).toHaveProperty('location');
        createdID = response.header['location'];
    });
    test('User authenticated and `Amministratore`, should return 403 and an error message', async () => {
        const response = await request(app)
            .post('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_AMMINISTRATORE}`)
            .send({
                titolo: "Sondaggio di prova",
            });
        checkError(response, 403);
    });
    test('User authenticated and `Analista`, should return 403 and an error message', async () => {
        const response = await request(app)
            .post('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_ANALISTA}`)
            .send({
                titolo: "Sondaggio di prova",
            });
        checkError(response, 403);
    });
    test('User not authenticated, should return 401 and an error message', async () => {
        const response = await request(app)
            .post('/api/v1/sondaggi')
            .send({
                titolo: "Sondaggio di prova",
            });
        checkError(response, 401);
    });
    test('User authenticated and `Sondaggista`, and body is missing, should return 400 and an error message', async () => {
        const response = await request(app)
            .post('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 400);
    });
    test('User authenticated and `Sondaggista`, and the title is missing, should return 400 and an error message', async () => {
        const response = await request(app)
            .post('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`)
            .send({});
        checkError(response, 400);
    });
    test('User authenticated and `Sondaggista`, and the title is empty, should return 400 and an error message', async () => {
        const response = await request(app)
            .post('/api/v1/sondaggi')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`)
            .send({
                titolo: "",
            });
        checkError(response, 400);
    });
});

// Test per la rotta GET `/sondaggi/:id`
describe('GET `/sondaggi/:id`', () => {
    // Creo un sondaggio fasullo per testare la rotta (lo creo direttamente nel database in modo da isolare il test dalle altre operazioni)
    let location: string;
    beforeAll(async ()=>{
        // Aspetto che la connessione al database sia pronta prima di fare operazioni
        while(mongoose.connection.readyState !== 1){
            await new Promise((resolve)=>setTimeout(resolve, 250));
        }
        const sondaggio = await Sondaggio.create({
            titolo: "Sondaggio di prova",
            sondaggista: SONDAGGISTA_VALIDO.self.split('/').pop(),
            dataInizio: new Date(),
            isAperto: true,
            statoApprovazione: "In attesa"
        });
        location = `${BASE_URL}/sondaggi/${sondaggio._id}`;
    });
    // Elimino il sondaggio creato per i test dopo averli eseguiti (anche qui lo elimino direttamente dal database per lo stesso motivo di prima)
    afterAll(async ()=>{
        const resp = await Sondaggio.deleteOne({_id: location.split('/').pop()});
        expect(resp.deletedCount).toBe(1);
    });
    test('User authenticated and same `Sondaggista`, should return 200 and a `Sondaggi.Sondaggio` object', async () => {
        const response = await request(app)
            .get(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        expect(response.status).toBe(200);
        checkSondaggio(response.body);
    });
    test('User authenticated and different `Sondaggista`, should return 403 and an error message', async () => {
        const response = await request(app)
            .get(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA2}`);
        checkError(response, 403);
    });
    test('User authenticated and `Amministratore`, should return 200 and a `Sondaggi.Sondaggio` object', async () => {
        const response = await request(app)
            .get(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_AMMINISTRATORE}`);
        expect(response.status).toBe(200);
        checkSondaggio(response.body);
    });
    test('User authenticated and `Analista`, should return 403 and an error message', async () => {
        const response = await request(app)
            .get(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_ANALISTA}`);
        checkError(response, 403);
    });
    test('User not authenticated, should return 401 and an error message', async () => {
        const response = await request(app)
            .get(location);
        checkError(response, 401);
    });
    test('User authenticated and `Sondaggista`, and the ID is invalid, should return 400 and an error message', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi/123')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 400);
    });
    test('User authenticated and `Sondaggista`, and the ID is valid but the sondaggio does not exist, should return 404 and an error message', async () => {
        const response = await request(app)
            .get('/api/v1/sondaggi/123456789012345678901234')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 404);
    });
});
describe('PATCH `/sondaggi/:id`', () => {
    let location: string;
    let location2: string;
    beforeAll(async ()=>{
        // Soluzione un po' "gangsta" per aspettare che la connessione al database sia pronta
        while(mongoose.connection.readyState !== 1){
            await new Promise((resolve)=>setTimeout(resolve, 250));
        }
        // Valid to be closed by the same `Sondaggista`
        const sondaggio = await Sondaggio.create({
            titolo: "Sondaggio di prova",
            sondaggista: SONDAGGISTA_VALIDO.self.split('/').pop(),
            dataInizio: new Date(),
            isAperto: true,
            statoApprovazione: "In attesa"
        });
        location = `${BASE_URL}/sondaggi/${sondaggio._id}`;
        // Valid but already closed by the same `Sondaggista`
        const sondaggio2 = await Sondaggio.create({
            titolo: "Sondaggio di prova",
            sondaggista: SONDAGGISTA_VALIDO.self.split('/').pop(),
            dataInizio: new Date(),
            isAperto: false,
            statoApprovazione: "In attesa"
        });
        location2 = `${BASE_URL}/sondaggi/${sondaggio2._id}`;
    });
    afterAll(async ()=>{
        const resp = await Sondaggio.deleteOne({_id: location.split('/').pop()});
        expect(resp.deletedCount).toBe(1);
        const resp2 = await Sondaggio.deleteOne({_id: location2.split('/').pop()});
        expect(resp2.deletedCount).toBe(1);
    });
    test('User authenticated but not same `Sondaggista`, should return 403 and an error message', async () => {
        const response = await request(app)
            .patch(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA2}`)
            .send({
                isAperto: false,
            });
        checkError(response, 403);
    });
    test('User authenticated but not `Sondaggista`, should return 403 and an error message', async () => {
        const response = await request(app)
            .patch(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_AMMINISTRATORE}`)
            .send({
                isAperto: false,
            });
        checkError(response, 403);
    });
    test('User authenticated and `Sondaggista`, should return 200 and the header location updated', async () => {
        const response = await request(app)
            .patch(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`)
            .send({
                isAperto: false,
            });
        expect(response.status).toBe(200);
        expect(response.header).toHaveProperty('location');
        const locationI = response.header['location'];
        const sondaggio = await Sondaggio.findById(locationI.split('/').pop());
        expect(sondaggio).not.toBeNull();
        expect(sondaggio?.isAperto).toBe(false);
    });
    test('User authenticated and `Sondaggista` but sondaggio is already closed, should return 403 and an error message', async () => {
        const response = await request(app)
            .patch(location2)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`)
            .send({
                isAperto: false,
            });
        checkError(response, 403);
    });
    test('User authenticated and `Sondaggista`, and the ID is invalid, should return 400 and an error message', async () => {
        const response = await request(app)
            .patch('/api/v1/sondaggi/123')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`)
            .send({
                isAperto: false,
            });
        checkError(response, 400);
    });
    test('User authenticated and `Sondaggista`, and the ID is valid but the sondaggio does not exist, should return 404 and an error message', async () => {
        const response = await request(app)
            .patch('/api/v1/sondaggi/123456789012345678901234')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`)
            .send({
                isAperto: false,
            });
        checkError(response, 404);
    });
    test('User authenticated and `Sondaggista`, and the body is missing, should return 400 and an error message', async () => {
        const response = await request(app)
            .patch(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 400);
    });
});
describe('DELETE `/sondaggi/:id`', () => {
    // Creo un sondaggio fasullo per testare la rotta (lo creo direttamente nel database in modo da isolare il test dalle altre operazioni)
    let location: string;
    let location2: string;
    let location3: string;
    let location4: string;
    beforeAll(async ()=>{
        // Aspetto che la connessione al database sia pronta prima di fare operazioni
        while(mongoose.connection.readyState !== 1){
            await new Promise((resolve)=>setTimeout(resolve, 250));
        }
        // Eliminabile solo da `Sondaggista` stesso
        const sondaggio = await Sondaggio.create({
            titolo: "Sondaggio di prova",
            sondaggista: SONDAGGISTA_VALIDO.self.split('/').pop(),
            dataInizio: new Date(),
            isAperto: true,
            statoApprovazione: "In attesa"
        });
        location = `${BASE_URL}/sondaggi/${sondaggio._id}`;
        // Impossibile da eliminare per tutti
        const sondaggio2 = await Sondaggio.create({
            titolo: "Sondaggio di prova",
            sondaggista: SONDAGGISTA_VALIDO.self.split('/').pop(),
            dataInizio: new Date(),
            isAperto: false,
            statoApprovazione: "In attesa"
        });
        location2 = `${BASE_URL}/sondaggi/${sondaggio2._id}`;
        // Impossibile da eliminare per tutti
        const sondaggio3 = await Sondaggio.create({
            titolo: "Sondaggio di prova",
            sondaggista: SONDAGGISTA_VALIDO.self.split('/').pop(),
            dataInizio: new Date(),
            isAperto: false,
            statoApprovazione: "Approvato"
        });
        location3 = `${BASE_URL}/sondaggi/${sondaggio3._id}`;
        // Eliminabile solo da `Amministratore`
        const sondaggio4 = await Sondaggio.create({
            titolo: "Sondaggio di prova",
            sondaggista: SONDAGGISTA_VALIDO.self.split('/').pop(),
            dataInizio: new Date(),
            isAperto: false,
            statoApprovazione: "Rifiutato"
        });
        location4 = `${BASE_URL}/sondaggi/${sondaggio4._id}`;
    });
    // Elimino quelli che non sono stati eliminati dai test
    afterAll(async ()=>{
        const resp = await Sondaggio.deleteOne({_id: location2.split('/').pop()});
        expect(resp.deletedCount).toBe(1);
        const resp3 = await Sondaggio.deleteOne({_id: location3.split('/').pop()});
        expect(resp3.deletedCount).toBe(1);
    });
    test('User authenticated but not same `Sondaggista`, should return 403 and an error message', async () => {
        const response = await request(app)
            .delete(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA2}`);
        checkError(response, 403);
    });
    test('User authenticated but not `Sondaggista`, should return 403 and an error message', async () => {
        const response = await request(app)
            .delete(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_ANALISTA}`);
        checkError(response, 403);
    });
    test('User authenticated and `Amministratore` but the sondaggio is still open, should return 403 and an error message', async () => {
        const response = await request(app)
            .delete(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_AMMINISTRATORE}`);
        checkError(response, 403);
    });
    test('User authenticated and `Sondaggista`, should return 204 and no content', async () => {
        const response = await request(app)
            .delete(location)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        expect(response.status).toBe(204);
    });
    test('User authenticated and `Sondaggista` but sondaggio is already closed, should return 403 and an error message', async () => {
        const response = await request(app)
            .delete(location2)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 403);
    });
    test('User authenticated and `Sondaggista` but sondaggio is already approved, should return 403 and an error message', async () => {
        const response = await request(app)
            .delete(location3)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 403);
    });
    test('User authenticated and `Sondaggista` but sondaggio is already refused, should return 403 and an error message', async () => {
        const response = await request(app)
            .delete(location4)
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 403);
    });
    test('User authenticated and `Sondaggista`, and the ID is invalid, should return 400 and an error message', async () => {
        const response = await request(app)
            .delete('/api/v1/sondaggi/123')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 400);
    });
    test('User authenticated and `Sondaggista`, and the ID is valid but the sondaggio does not exist, should return 404 and an error message', async () => {
        const response = await request(app)
            .delete('/api/v1/sondaggi/123456789012345678901234')
            .set('Authorization', `Bearer ${VALID_TOKEN_SONDAGGISTA}`);
        checkError(response, 404);
    });
    test('User authenticated and `Amministratore`, the sondaggio exists and it is closed and refused, should return 204 and no content', async () => {
        const response = await request(app)
            .delete(location4)
            .set('Authorization', `Bearer ${VALID_TOKEN_AMMINISTRATORE}`);
        expect(response.status).toBe(204);
    });
    test('User authenticated and `Amministratore`, the sondaggio exists and it is closed and approved, should return 403 and an error message', async () => {
        const response = await request(app)
            .delete(location3)
            .set('Authorization', `Bearer ${VALID_TOKEN_AMMINISTRATORE}`);
        checkError(response, 403);
    });
});

// Alla fine di tutti i test di questa suite, chiudo la connessione al database
afterAll(async ()=>{
    // Soluzione un po' "gangsta" per aspettare che vengano eseguite le operazioni di pulizia del database
    await new Promise((resolve)=>setTimeout(resolve, 750));
    mongoose.connection.close();
});


function checkSondaggio(sondaggio: Sondaggi.Sondaggio){
    expect(sondaggio).toMatchObject({
        self: expect.any(String),
        dataInizio: expect.any(String),
        isAperto: expect.any(Boolean),
        statoApprovazione: expect.any(String),
        sondaggista: {
            self: expect.any(String),
            email: expect.any(String),
            nome: expect.any(String),
            cognome: expect.any(String),
            ruolo: expect.any(String),
            imageUrl: expect.any(String),
        },
        voti: expect.any(Array<Voti.Voto>),
        mediaVoti: expect.any(Array<Voti.Media>),
        titolo: expect.any(String),
    });
    expect(stati_possibili).toContain(sondaggio.statoApprovazione);
    expect(ruoli_possibili).toContain(sondaggio.sondaggista.ruolo);
}

function checkSondaggioMinimal(sondaggio: Sondaggi.Minimal) {
    expect(sondaggio).toMatchObject({
        self: expect.any(String),
        dataInizio: expect.any(String),
        isAperto: expect.any(Boolean),
        statoApprovazione: expect.any(String),
        sondaggista: {
            self: expect.any(String),
            email: expect.any(String),
            nome: expect.any(String),
            cognome: expect.any(String),
            ruolo: expect.any(String),
            imageUrl: expect.any(String),
        },
        titolo: expect.any(String),
    });
    expect(stati_possibili).toContain(sondaggio.statoApprovazione);
    expect(ruoli_possibili).toContain(sondaggio.sondaggista.ruolo);
    expect(sondaggio).not.toHaveProperty('voti');
    expect(sondaggio).not.toHaveProperty('mediaVoti');
}

function checkError(response: request.Response, code: number){
    expect(response.status).toBe(code);
    expect(response.body).toMatchObject({
        code: code,
        message: RESPONSE_MESSAGES[code],
        details: expect.any(String)
    });
}