const { expect } = require('chai');

let token_with_access;
let id_with_access;
let token_without_access;
let id_without_access;
let new_department_id;
let organization_with_access;
let organization_without_access;

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

describe('test /departments', () => {
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
                    organization_with_access = json.organization
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
                    organization_without_access = json.organization
                    done();
                })
                .catch((error) => done(error));
        });
    });
    describe('departments/', () => {
        it('if not have access, not allow viewing the content', (done) => {
            fetch('https://sb-api.herokuapp.com/departments/',
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
            fetch('https://sb-api.herokuapp.com/departments/',
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
        it("allow user add department", (done) => {
            fetch("https://sb-api.herokuapp.com/departments", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "DEMU",
                    description: "Departamento de Música",
                    organization: organization_with_access,
                })
            })
                .then((response) => {
                    expect(response.status).to.equal(201);
                    return response.json();
                })
                .then((json) => {
                    new_organization_id = json.id
                    done();
                })
                .catch((error) => done(error));
        });
        it("prevent user add department if not admin", (done) => {
            fetch("https://sb-api.herokuapp.com/departments", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_without_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "DEMU",
                    description: "Departamento de Música",
                    organization: organization_without_access,
                })
            })
                .then((response) => {
                    expect(response.status).to.equal(201);
                    return response.json();
                })
                .then((json) => {
                    done();
                })
                .catch((error) => done(error));
        });
    })
    describe('departments/:id', () => {
        it("prevent getting a nonexistent department", (done) => {
            fetch("https://sb-api.herokuapp.com/departments/646000000000000000000000", {
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
        it("prevent getting a department from another organization", (done) => {
            fetch("https://sb-api.herokuapp.com/departments/64257855ff893e21d7c54415" , {
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
        it("allow user to get a department if admin", (done) => {
            fetch("https://sb-api.herokuapp.com/departments/" + new_department_id, {
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
        it("prevent user to get a department if not admin", (done) => {
            fetch("https://sb-api.herokuapp.com/departments/" + new_department_id, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token_without_access,
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
        it("allow user to edit a department if admin", (done) => {
            fetch("https://sb-api.herokuapp.com/departments/" + new_pause_id, {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: "DEMUSICA",
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
        it("prevent the user to delete a department of another organizarion", (done) => {
            fetch("https://sb-api.herokuapp.com/departments/64257855ff893e21d7c54415" , {
                method: "DELETE",
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
        it("allow the user to delete a department of their own", (done) => {
            fetch("https://sb-api.herokuapp.com/departments/" + new_department_id, {
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
    describe('departments/organization', () => {
        it("allow the user to get all of departments if belongs to user organization", (done) => {
            fetch("https://sb-api.herokuapp.com/departments/organization/" , {
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
    })
})

