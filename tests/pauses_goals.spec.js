const { expect } = require('chai');

let token_with_access;
let id_with_access;
let token_without_access;
let id_without_access;
let new_pause_id;
let new_goal_id;
let organization = "UA"
let department = "DEMAT"

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
        password: "123123123",
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
            fetch("https://sb-api.herokuapp.com/pauses", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    start_date: '2023-03-20T10:00:00.000+00:00',
                    end_date: '2023-03-20T10:10:00.000+00:00',
                    user: id_with_access
                })
            })
                .then((response) => {
                    expect(response.status).to.equal(201);
                    return response.json();
                })
                .then((json) => {
                    new_pause_id = json.id
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
        it("prevent getting a pause from another user", (done) => {
            fetch("https://sb-api.herokuapp.com/pauses/" + new_pause_id, {
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
        it("allow user to get a pause of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/pauses/" + new_pause_id, {
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
        it("allow user to edit a pause of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/pauses/" + new_pause_id, {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    end_date: '2023-03-20T10:20:00.000+00:00',
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
        it("prevent the user to delete a pause of another user", (done) => {
            fetch("https://sb-api.herokuapp.com/pauses/" + new_pause_id, {
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
        it("allow the user to delete a pause of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/pauses/" + new_pause_id, {
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
    describe('pauses/user/:id', () => {
        it("allow the user to get all of their own pauses", (done) => {
            fetch("https://sb-api.herokuapp.com/pauses/user/" + id_with_access, {
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
        it("prevent the user to get all of other user pauses", (done) => {
            fetch("https://sb-api.herokuapp.com/pauses/user/" + id_without_access, {
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

describe('test /goals', () => {
    it('if not have access, not allow viewing the content', (done) => {
        fetch('https://sb-api.herokuapp.com/goals/',
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
        fetch('https://sb-api.herokuapp.com/goals/',
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
    it("prevent user add goal if is not admin", (done) => {
        fetch("https://sb-api.herokuapp.com/goal", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token_with_access,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                start_date: '2023-03-20T10:00:00.000+00:00',
                end_date: '2023-03-20T10:10:00.000+00:00',
                user: id_with_access
            })
        })
            .then((response) => {
                expect(response.status).to.equal(201);
                return response.json();
            })
            .then((json) => {
                new_pause_id = json.id
                done();
            })
            .catch((error) => done(error));
    });
    it("allow user add goal", (done) => {
        fetch("https://sb-api.herokuapp.com/goal", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token_without_access,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description: req.body.description,
                destination: req.body.destination,
                organization: user.organization,
                priority: req.body.priority,
                date: req.body.date,
                types: req.body.types,
                active: req.body.active,
            })
        })
            .then((response) => {
                expect(response.status).to.equal(201);
                return response.json();
            })
            .then((json) => {
                new_pause_id = json.id
                done();
            })
            .catch((error) => done(error));
    });
})
