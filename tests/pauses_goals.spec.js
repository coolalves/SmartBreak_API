const { expect } = require('chai');

let token_with_access;
let token_without_access;
let new_metric_id;
let new_reward_id;

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
    describe('rewards/', () => {
        it("prevent user to add a reward if the user doesn't have access", (done) => {
            fetch("https://sb-api.herokuapp.com/rewards", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_without_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: '10€ vale Radio Popular',
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
        it("allow user to add a reward if the user has access", (done) => {
            fetch("https://sb-api.herokuapp.com/rewards", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token_with_access,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: '10€ vale Radio Popular',
                    type: 'Computer'
                })
            })
                .then((response) => {
                    expect(response.status).to.equal(201);
                    return response.json();
                })
                .then((json) => {
                    new_reward_id = json.id
                    done();
                })
                .catch((error) => done(error));
        });
        it("prevent user to delete a metric if the user doesn't have access", (done) => {
            fetch("https://sb-api.herokuapp.com/rewards/" + new_reward_id, {
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
            fetch("https://sb-api.herokuapp.com/rewards/" + new_reward_id, {
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
        it("prevent user to get all metrics if the user is not admin", (done) => {
            fetch("https://sb-api.herokuapp.com/rewards/" , {
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
        it("allow user to get all metrics if the user is admin", (done) => {
            fetch("https://sb-api.herokuapp.com/rewards/", {
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

