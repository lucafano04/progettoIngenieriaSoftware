import { describe, beforeAll, jest, afterAll, test, expect } from '@jest/globals';
import { mongoose } from '../db';
import request from 'supertest';
import app from '../app';
import { Quartieri } from '../../types';
import { RESPONSE_MESSAGES } from '../variables';


const QUARTIERE_VALIDO = '674046040edc403969cceaef';

describe('GET `/quartieri`', () => {
    beforeAll(async ()=>{
        jest.setTimeout(10000);
    });
    test('deepData false coordinate false', async () => {
        const response = await request(app).get('/api/v1/quartieri?deepData=false&coordinate=false');
        expect(response.status).toBe(200);
        
        const data = response.body as Quartieri.MinimalBase[];
        data.forEach((quartiere) => {
            expect(quartiere).toMatchObject({
                self: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
                circoscrizione: {
                    self: expect.any(String),
                    nome: expect.any(String),
                    soddisfazioneMedia: expect.any(Number),
                },
                nome: expect.any(String),
            });
            expect(quartiere).not.toHaveProperty('coordinate');
            expect(quartiere).not.toHaveProperty('popolazione');
            expect(quartiere).not.toHaveProperty('superficie');
            expect(quartiere).not.toHaveProperty('serviziTotali');
            expect(quartiere).not.toHaveProperty('interventiPolizia');
            expect(quartiere).not.toHaveProperty('etaMedia');
            expect(quartiere).not.toHaveProperty('servizi');
            expect(quartiere).not.toHaveProperty('sicurezza');
            expect(quartiere.circoscrizione).not.toHaveProperty('popolazione');
            expect(quartiere.circoscrizione).not.toHaveProperty('coordinate');
        });
    })
    test('deepData true coordinate false', async () => {
        const response = await request(app).get('/api/v1/quartieri?deepData=true&coordinate=false');
        expect(response.status).toBe(200);
        
        const data = response.body as Quartieri.QuartiereNoC[];
        data.forEach((quartiere) => {
            expect(quartiere).toMatchObject({
                self: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
                circoscrizione: {
                    self: expect.any(String),
                    nome: expect.any(String),
                    soddisfazioneMedia: expect.any(Number),
                },
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
            expect(quartiere).not.toHaveProperty('coordinate');
            expect(quartiere.circoscrizione).not.toHaveProperty('coordinate');
        });
    })
    test('deepData false coordinate true', async () => {
        const response = await request(app).get('/api/v1/quartieri?deepData=false&coordinate=true');
        expect(response.status).toBe(200);
        
        const data = response.body as Quartieri.Minimal[];
        data.forEach((quartiere) => {
            expect(quartiere).toMatchObject({
                self: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
                circoscrizione: {
                    self: expect.any(String),
                    nome: expect.any(String),
                    soddisfazioneMedia: expect.any(Number),
                },
                nome: expect.any(String),
                coordinate: expect.any(Object),
            });
            expect(quartiere).not.toHaveProperty('popolazione');
            expect(quartiere).not.toHaveProperty('superficie');
            expect(quartiere).not.toHaveProperty('serviziTotali');
            expect(quartiere).not.toHaveProperty('interventiPolizia');
            expect(quartiere).not.toHaveProperty('etaMedia');
            expect(quartiere).not.toHaveProperty('servizi');
            expect(quartiere).not.toHaveProperty('sicurezza');
            expect(quartiere.circoscrizione).not.toHaveProperty('popolazione');
        });
    })
    test('deepData true coordinate true', async () => {
        const response = await request(app).get('/api/v1/quartieri?deepData=true&coordinate=true');
        expect(response.status).toBe(200);
        
        const data = response.body as Quartieri.Quartiere[];
        data.forEach((quartiere) => {
            expect(quartiere).toMatchObject({
                self: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
                circoscrizione: {
                    self: expect.any(String),
                    nome: expect.any(String),
                    soddisfazioneMedia: expect.any(Number),
                },
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
                coordinate: expect.any(Object),
            });
        });
    })
});

describe('GET `/quartieri/:id`', () => {
    beforeAll(async ()=>{
        jest.setTimeout(10000);
    });
    test('Quartiere inesistente - IdValido', async () => {
        const response = await request(app).get('/api/v1/quartieri/674046040edc403969cceae0');
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            code: 404,
            message: RESPONSE_MESSAGES[404],
            details: expect.any(String),
        })
    });
    test('Quartiere inesistente - IdNonValido', async () => {
        const response = await request(app).get('/api/v1/quartieri/123');
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            code: 400,
            message: RESPONSE_MESSAGES[400],
            details: expect.any(String),
        })
    });
    test('Quartiere esistente senza coordinate', async () => {
        const response = await request(app).get(`/api/v1/quartieri/${QUARTIERE_VALIDO}?coordinate=false`);
        expect(response.status).toBe(200);
        
        const data = response.body as Quartieri.MinimalBase;
        expect(data).toMatchObject({
            self: expect.any(String),
            nome: expect.any(String),
            soddisfazioneMedia: expect.any(Number),
            circoscrizione: {
                self: expect.any(String),
                nome: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
            },
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
        expect(data.circoscrizione).not.toHaveProperty('coordinate');
    })
    test('Quartiere esistente con coordinate', async () => {
        const response = await request(app).get(`/api/v1/quartieri/${QUARTIERE_VALIDO}?coordinate=true`);
        expect(response.status).toBe(200);
        
        const data = response.body as Quartieri.Quartiere;
        expect(data).toMatchObject({
            self: expect.any(String),
            nome: expect.any(String),
            soddisfazioneMedia: expect.any(Number),
            circoscrizione: {
                self: expect.any(String),
                nome: expect.any(String),
                soddisfazioneMedia: expect.any(Number),
            },
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
            coordinate: expect.any(Object),
        });
    })
});

afterAll(async () => {
    await mongoose.connection.close();
});