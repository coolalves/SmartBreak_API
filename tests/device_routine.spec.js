const { expect } = require('chai');

let token_with_access;
let id_with_access;
const login_user_with_access = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email: 'geral@smartbreak.com',
        password: '123123123',
    }),
}


describe('test /devices', () => {
    describe('auth/login', () => {
        it("allow user login", (done) => {
            fetch("https://sb-api.herokuapp.com/auth/login", login_user_with_access)
                .then((response) => {
                    expect(response.status).to.equal(200);
                    return response.json();
                })
                .then((json) => {
                    token_with_access = json.token
                    id_with_access = json.id
                    done();
                })
                .catch((error) => done(error));
        });
    });
    describe('devices/', () => {
        it("allow user add device", (done) => {
            fetch("https://sb-api.herokuapp.com/devices", {
                method: "POST",
                headers: {
                    "Authorization" : "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: 'device test',
                    energy: '5',
                    type: 'Computer',
                    user: id_with_access
                })
            })
                .then((response) => {
                    expect(response.status).to.equal(201);
                    return response.json();
                })
                .then((json) => {
                    token_with_access = json.token
                    id_with_access = json.id
                    done();
                })
                .catch((error) => done(error));
        });
    })
})
