const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../app.js');

describe('GET /products', () => {
    describe('GET /products', () => {
        it('get 500 status has token is not provided', (done) => {
            request(app)
                .get(`/products`)
                .then((res) => {
                    const body = res.body;
                    console.log(res);
                    expect(res.statusCode).to.equal(500);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });
    it('OK get products', (done) => {
        request(app)
            .get(`/products`, {
                headers: {
                    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibWFuaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjY1NDMyMSJ9LCJpYXQiOjE2NTI5NDA5NjIsImV4cCI6MTY1Mjk0Mjc2Mn0.BlTxmhHo9zms7BTrEQlhL8_fTIfFcTxjNGJ1wWMFSpE',
                },
            })
            .then((res) => {
                const body = res.body;
                console.log(res.body);
                expect(res.statusCode).to.equal(200);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
