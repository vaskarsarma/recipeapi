const request = require('supertest');
const server = require('../../server');
const mockAddRecipe= require('../../mockdata/addrecipe.json');

beforeAll(async () => {
    // do something before anything else runs
    console.log('Jest starting!');
});

// close the server after each test
afterAll(() => {
    server.close;
    console.log('server closed!');
});

describe('basic route tests', () => {
    it('get recipe route GET /', async () => {
        request(server.listen())
            .get(`/recipe`)
            .send([])
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {

                if (err) return done.fail(err);
                expect(res.body).toBeDefined();
                expect(res.body).toBeLength(0);

                done();
            });
    });

    it('add recipe route POST /', async () => {
        request(server.listen())
            .post(`/recipe/add`)
            .send(mockAddRecipe.request)
            .expect('Content-Type',/json/)
            .expect(200)
            .end((err,res) => {
                if(err) return done.fail(err);

                expect(res.body).toBeDefined();
                expect(res.body.status).toEqual(mockAddRecipe.response.status);
                expect(res.body.data.rcp_name).toEqual(mockAddRecipe.response.data.rcp_name);
                expect(res.body.data.rcp_route).toEqual(mockAddRecipe.response.data.rcp_route);

                done();
            });
    });
}); 