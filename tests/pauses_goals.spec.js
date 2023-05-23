const { expect } = require('chai');

let token_with_access;
let id_with_access;
let token_without_access;
let id_without_access;
let new_pause_id;

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

describe('test /pauses', () => {
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
    describe('pauses/', () => {
        it('if not have access, not allow viewing the content', (done) => {
            fetch('https://sb-api.herokuapp.com/pauses/',
              {
                method: "GET",
                headers: {
                  "Authorization": "Bearer " + token_without_access,
                }
              })
              .then((response) => {
                expect(response.status).to.equal(403);
                return response.json();
              })
              .then((json) => {
                // Additional assertions on the response JSON if needed
                done();
              })
              .catch((error) => done(error));
          });
          it('if have access, allow viewing the content', (done) => {
            fetch('https://sb-api.herokuapp.com/pauses/',
              {
                method: "GET",
                headers: {
                  "Authorization": "Bearer " + token_with_access,
                }
              })
              .then((response) => {
                expect(response.status).to.equal(200);
                return response.json();
              })
              .then((json) => {
                // Additional assertions on the response JSON if needed
                done();
              })
              .catch((error) => done(error));
          });

        it("allow user add pause", (done) => {
            fetch("https://sb-api.herokuapp.com/devices", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    start_date: 1519211809934,
                    end_date: 1519215809934,
                    user: id_with_access
                })
            })
                .then((response) => {
                    expect(response.status).to.equal(201);
                    return response.json();
                })
                .then((json) => {
                    new_pause_id  = json.id
                    done();
                })
                .catch((error) => done(error));
        });
    })
    describe('pauses/:id', () => {
        it("prevent getting a nonexistent pause", (done) => {
            fetch("https://sb-api.herokuapp.com/pauses/646000000000000000000000", {
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
            fetch("https://sb-api.herokuapp.com/pauses/" + new_pause_id, {
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
            fetch("https://sb-api.herokuapp.com/devices/user/646b7a61cec499ffa20b6e83", {
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
