const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

describe('DELETE /users', () => {
    it('Status', (done) => {
        const id = 5;
        request(app)
            .delete(`/users/${id}`)
            .then((res) => {
                const body = res.body;
                // console.log(res);
                expect(res.statusCode).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
