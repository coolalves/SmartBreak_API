const { expect } = require('chai');

let token_with_access;
let id_with_access;
let new_device_id;

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
                    "Authorization": "Bearer " + token_with_access,
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
                    new_device_id  = json.id
                    done();
                })
                .catch((error) => done(error));
        });
        it("prevent getting a nonexistent device", (done) => {
            fetch("https://sb-api.herokuapp.com/devices/646000000000000000000000", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    expect(response.status).to.equal(404);
                    return response.json();
                })
                .then((json) => {
                    done();
                })
                .catch((error) => done(error));
        });
        it("prevent getting a device from another user", (done) => {
            fetch("https://sb-api.herokuapp.com/devices/642444865e0aba6c620f0845", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    expect(response.status).to.equal(403);
                    return response.json();
                })
                .then((json) => {
                    done();
                })
                .catch((error) => done(error));
        });
        it("allow the user to get a device from themselves", (done) => {
            fetch("https://sb-api.herokuapp.com/devices/" + new_device_id, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                }
            })
                .then((response) => {
                    expect(response.status).to.equal(200);
                    return response.json();
                })
                .then((json) => {
                    done();
                })
                .catch((error) => done(error));
        });
    })
})
