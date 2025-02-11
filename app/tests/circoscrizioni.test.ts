import { describe, beforeAll, jest, afterAll, test, expect } from '@jest/globals';
import { mongoose } from '../db';
import request from 'supertest';
import app from '../app';
import { Circoscrizioni } from '../../types';
import { RESPONSE_MESSAGES } from '../variables';

const CIRCOSCRIZIONE_VALIDA = '674042d50edc403969cceaac';

describe('GET `/circoscrizioni`', () => {
    beforeAll(async ()=>{
        jest.setTimeout(10000);
    });
    test('deepData false coordinate false', async () => {
        const response = await request(app).get('/api/v1/circoscrizioni?deepData=false&coordinate=false');
        expect(response.status).toBe(200);
        
        const data = response.body as Circoscrizioni.MinimalBase[];
        data.forEach((circoscrizione) => {
            expect(circoscrizione).toMatchObject({
                self: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
                nome: expect.any(String),
            });
            expect(circoscrizione).not.toHaveProperty('coordinate');
            expect(circoscrizione).not.toHaveProperty('popolazione');
            expect(circoscrizione).not.toHaveProperty('superficie');
            expect(circoscrizione).not.toHaveProperty('serviziTotali');
            expect(circoscrizione).not.toHaveProperty('interventiPolizia');
            expect(circoscrizione).not.toHaveProperty('etaMedia');
            expect(circoscrizione).not.toHaveProperty('servizi');
            expect(circoscrizione).not.toHaveProperty('sicurezza');
        });
    })
    test('deepData true coordinate false', async () => {
        const response = await request(app).get('/api/v1/circoscrizioni?deepData=true&coordinate=false');
        expect(response.status).toBe(200);
        
        const data = response.body as Circoscrizioni.CircoscrizioneNoC[];
        data.forEach((circoscrizione) => {
            expect(circoscrizione).toMatchObject({
                self: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
                nome: expect.any(String),
                popolazione: expect.any(Number),
                superficie: expect.any(Number),
                serviziTotali: expect.any(Number),
                interventiPolizia: expect.any(Number),
                etaMedia: expect.any(Number),
                servizi: {
                    areeVerdi: expect.any(Number),
                    scuole: expect.any(Number),
                    serviziRistorazione: expect.any(Number),
                    localiNotturni: expect.any(Number),
                },
                sicurezza: {
                    numeroInterventi: expect.any(Number),
                    incidenti: expect.any(Number),
                    tassoCriminalita: expect.any(Number),
                },
            });
            expect(circoscrizione).not.toHaveProperty('coordinate');
        });
    });
    test('deepData false coordinate true', async () => {
        const response = await request(app).get('/api/v1/circoscrizioni?deepData=false&coordinate=true');
        expect(response.status).toBe(200);
        
        const data = response.body as Circoscrizioni.MinimalBase[];
        data.forEach((circoscrizione) => {
            expect(circoscrizione).toMatchObject({
                self: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
                nome: expect.any(String),
                coordinate: expect.any(Array<Array<number>>),
            });
            expect(circoscrizione).not.toHaveProperty('popolazione');
            expect(circoscrizione).not.toHaveProperty('superficie');
            expect(circoscrizione).not.toHaveProperty('serviziTotali');
            expect(circoscrizione).not.toHaveProperty('interventiPolizia');
            expect(circoscrizione).not.toHaveProperty('etaMedia');
            expect(circoscrizione).not.toHaveProperty('servizi');
            expect(circoscrizione).not.toHaveProperty('sicurezza');
        });
    });
    test('deepData true coordinate true', async () => {
        const response = await request(app).get('/api/v1/circoscrizioni?deepData=true&coordinate=true');
        expect(response.status).toBe(200);
        
        const data = response.body as Circoscrizioni.Circoscrizione[];
        data.forEach((circoscrizione) => {
            expect(circoscrizione).toMatchObject({
                self: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
                nome: expect.any(String),
                coordinate: expect.any(Array<Array<number>>),
                popolazione: expect.any(Number),
                superficie: expect.any(Number),
                serviziTotali: expect.any(Number),
                interventiPolizia: expect.any(Number),
                etaMedia: expect.any(Number),
                servizi: {
                    areeVerdi: expect.any(Number),
                    scuole: expect.any(Number),
                    serviziRistorazione: expect.any(Number),
                    localiNotturni: expect.any(Number),
                },
                sicurezza: {
                    numeroInterventi: expect.any(Number),
                    incidenti: expect.any(Number),
                    tassoCriminalita: expect.any(Number),
                },
            });
        });
    });
});

describe('GET `/circoscrizioni/:id`', () => {
    test('Circoscrizione non esistente - ID non valido', async () => {
        const response = await request(app).get('/api/v1/circoscrizioni/123');
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: expect.any(String),
        });
    });
    test('Circoscrizione non esistente - ID valido', async () => {
        const response = await request(app).get('/api/v1/circoscrizioni/123456789012345678901234');
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            code: 404,
            message: RESPONSE_MESSAGES[404],
            details: expect.any(String),
        });
    });
    test('Circoscrizione esistente - Coordinate false', async () => {
        const response = await request(app).get(`/api/v1/circoscrizioni/${CIRCOSCRIZIONE_VALIDA}?coordinate=false`);
        expect(response.status).toBe(200);
        
        const data = response.body as Circoscrizioni.CircoscrizioneNoC;
        expect(data).toMatchObject({
            self: expect.any(String),
            soddisfazioneMedia: expect.any(Number),
            nome: expect.any(String),
            popolazione: expect.any(Number),
            superficie: expect.any(Number),
            serviziTotali: expect.any(Number),
            interventiPolizia: expect.any(Number),
            etaMedia: expect.any(Number),
            servizi: {
                areeVerdi: expect.any(Number),
                scuole: expect.any(Number),
                serviziRistorazione: expect.any(Number),
                localiNotturni: expect.any(Number),
            },
            sicurezza: {
                numeroInterventi: expect.any(Number),
                incidenti: expect.any(Number),
                tassoCriminalita: expect.any(Number),
            },
        });
        expect(data).not.toHaveProperty('coordinate');
    });
    test('Circoscrizione esistente - Coordinate true', async () => {
        const response = await request(app).get(`/api/v1/circoscrizioni/${CIRCOSCRIZIONE_VALIDA}?coordinate=true`);
        expect(response.status).toBe(200);
        
        const data = response.body as Circoscrizioni.Circoscrizione;
        expect(data).toMatchObject({
            self: expect.any(String),
            soddisfazioneMedia: expect.any(Number),
            nome: expect.any(String),
            coordinate: expect.any(Array<Array<number>>),
            popolazione: expect.any(Number),
            superficie: expect.any(Number),
            serviziTotali: expect.any(Number),
            interventiPolizia: expect.any(Number),
            etaMedia: expect.any(Number),
            servizi: {
                areeVerdi: expect.any(Number),
                scuole: expect.any(Number),
                serviziRistorazione: expect.any(Number),
                localiNotturni: expect.any(Number),
            },
            sicurezza: {
                numeroInterventi: expect.any(Number),
                incidenti: expect.any(Number),
                tassoCriminalita: expect.any(Number),
            },
        });
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});