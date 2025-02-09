import {afterAll, beforeAll, describe, expect, jest, test} from '@jest/globals';
import request from 'supertest'
import {Dati} from '../../types';
import app from '../app';
import { mongoose } from '../db';

describe('GET `/generalInfo`', () => {
    beforeAll(async ()=>{
        jest.setTimeout(10000);
    });
    afterAll(async ()=>{
        mongoose.connection.close();
    });
    test('Correct response, should return 200 and a `Dati.DatiGenericiCitta` object', async () => {
        const response = await request(app).get('/api/v1/generalInfo');
        expect(response.status).toBe(200);
        
        const data = response.body as Dati.DatiGenericiCitta;
        expect(data).toMatchObject({
            self: '/api/v1/generalInfo',
            popolazione: expect.any(Number),
            superficie: expect.any(Number),
            etaMedia: expect.any(Number),
            soddisfazioneMedia: expect.any(Number),
        });
    });
});




