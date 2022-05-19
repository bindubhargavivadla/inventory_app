const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

describe('GET /users', () => {
    it('Ok, get users', (done) => {
        request(app)
            .get(`/users`)
            .then((res) => {
                const body = res.body;
                console.log(res);
                expect(res.statusCode).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
