const { expect } = require('chai');

let token_with_access;
let token_without_access;
let id_with_access;
let id_without_access;
let new_device_id;
let new_routine_id;
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

describe('test /devices', () => {
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
    })
    describe('devices/:id', () => {
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
            fetch("https://sb-api.herokuapp.com/devices/" + new_device_id, {
                method: "GET",
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
        it("allow user to get a device of their own", (done) => {
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
        it("allow user to edit a device of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/devices/" + new_device_id, {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: 'new_name',
                }),
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
        it("prevent the user to delete a device from another user", (done) => {
            fetch("https://sb-api.herokuapp.com/devices/" + new_device_id, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token_without_access,
                    "Content-Type": "application/json"
                },
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
        it("allow the user to delete a device of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/devices/" + new_device_id, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
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
    describe('devices/user/:id', () => {
        it("allow the user to get all of their own devices", (done) => {
            fetch("https://sb-api.herokuapp.com/devices/user/" + id_with_access, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
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
        it("prevent the user to get all of other user devices", (done) => {
            fetch("https://sb-api.herokuapp.com/devices/user/" + id_without_access, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
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
    })
})

describe('test /routines', () => {
    describe('routines/', () => {
        it("allow user add routine", (done) => {
            fetch("https://sb-api.herokuapp.com/routines", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    end: '1100',
                    start: '1040',
                    days: [false, false, true, true, false, true, false],
                    user: id_with_access
                })
            })
                .then((response) => {
                    expect(response.status).to.equal(201);
                    return response.json();
                })
                .then((json) => {
                    new_routine_id  = json.id
                    done();
                })
                .catch((error) => done(error));
        });
    })
    describe('routines/:id', () => {
        it("prevent getting a nonexistent routine", (done) => {
            fetch("https://sb-api.herokuapp.com/routines/646000000000000000000000", {
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
        it("prevent getting a routine from another user", (done) => {
            fetch("https://sb-api.herokuapp.com/routines/" + new_routine_id, {
                method: "GET",
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
        it("allow user to get a routine of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/routines/" + new_routine_id, {
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
        it("allow user to edit a routine of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/routines/" + new_routine_id, {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    end: '1120',
                }),
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
        it("prevent the user to delete a routine of another user", (done) => {
            fetch("https://sb-api.herokuapp.com/routines/" + new_routine_id, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token_without_access,
                    "Content-Type": "application/json"
                },
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
        it("allow the user to delete a routine of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/routines/" + new_routine_id, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
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
    describe('routines/user/:id', () => {
        it("allow the user to get all of their own routines", (done) => {
            fetch("https://sb-api.herokuapp.com/routines/user/" + id_with_access, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
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
        it("prevent the user to get all of other user routines", (done) => {
            fetch("https://sb-api.herokuapp.com/routines/user/" + id_without_access, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
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
    })
})
