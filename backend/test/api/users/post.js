var expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');
const conn = require('../../../routes/users');

const createdAt = new Date();
const updatedAt = new Date();
describe('POST /users', () => {
    it('OK, creating a new user', (done) => {
        request(app)
            .post('/users')
            .send({
                firstName: 'abcd',
                lastName: 'vadla',
                email: 'abcd@gmail.com',
                createdAt,
                updatedAt,
            })
            .then((res) => {
                const body = res.body;
                console.log(res.body);
                // expect(body).to.contain.property('id');
                expect(res.statusCode).to.equal(200);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});
