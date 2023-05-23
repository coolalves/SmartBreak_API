const { expect } = require('chai');

let token_with_access;
let id_with_access;
let token_without_access;
let id_without_access;
let new_metric_id;

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

const login_user_without_access = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email: "without_access@smartbreak.com",
        password : "123123123",
    }),
}

describe('test /metrics', () => {
    describe('auth/login', () => {
        it("allow user with access login", (done) => {
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
        it("allow user without access login", (done) => {
            fetch("https://sb-api.herokuapp.com/auth/login", login_user_without_access)
                .then((response) => {
                    expect(response.status).to.equal(200);
                    return response.json();
                })
                .then((json) => {
                    token_without_access = json.token
                    id_without_access = json.id
                    done();
                })
                .catch((error) => done(error));
        });
    });
    describe('metrics/', () => {
        it("prevent user to add a metric if the user doesn't have access", (done) => {
            fetch("https://sb-api.herokuapp.com/metrics", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_without_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: 'metrics metrics metrics',
                    type: 'Computer'
                })
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
        it("allow user to add a metric if the user has access", (done) => {
            fetch("https://sb-api.herokuapp.com/metrics", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: 'metrics metrics metrics',
                    type: 'Computer'
                })
            })
                .then((response) => {
                    expect(response.status).to.equal(201);
                    return response.json();
                })
                .then((json) => {
                    new_metric_id = json.id
                    done();
                })
                .catch((error) => done(error));
        });
        it("prevent user to delete a metric if the user doesn't have access", (done) => {
            fetch("https://sb-api.herokuapp.com/metrics/" + new_metric_id, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token_without_access,
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
        it("allow user to delete a metric if the user has access", (done) => {
            fetch("https://sb-api.herokuapp.com/metrics/" + new_metric_id, {
                method: "DELETE",
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

