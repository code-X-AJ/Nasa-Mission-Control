const request = require('supertest');
const app = require('../../app'); 
const { 
    connectDB,
    mongoDisconnect
} = require('../../services/mongo');  

describe('Launches API', () => { 

    beforeAll(async() =>{
        await connectDB();
    })
    
    afterAll(async() =>{
        await mongoDisconnect();
    })
    
    describe('Test GET/launches', () => { 
        test('it should respond with 200 success', async() => {
            const response = await request(app)
            .get('/launches')
            .expect('Content-Type',/json/)
            .expect(200);
            expect(response.statusCode).toBe(200);
        });
    });
    
    describe('Test POST/launch', () => { 
        const completeLaunchData = {
            mission : 'Dora the Kepler Explorer',
            rocket : 'Suzume-san',
            target : 'Kepler-62 f',
            launchDate: '18 May 2030',
        }
        
        const launchDataWithInvalidDate = {
            mission : 'Dora the Kepler Explorer',
            rocket : 'Suzume-san',
            target : 'Kepler-62 f',
            launchDate: 'baka',
        }
    
        const launchDataWithoutDate = {
            mission : 'Dora the Kepler Explorer',
            rocket : 'Suzume-san',
            target : 'Kepler-62 f',
        }
    
        test('It should respond with 201 success', async() =>{
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type',/json/)
                .expect(201)
            
            const requestDate = new Date(completeLaunchData.launchDate);
            const responseDate = new Date(response.body.launchDate);
            expect(responseDate).toStrictEqual(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate)
        });
        test('It should catch missing required properties', async() => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type',/json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Mission required data is invalid...',
            });
        });
        test('It should catch invalid dates', async() => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error : 'Invalid launch date.'
            });
        });
    });
})
