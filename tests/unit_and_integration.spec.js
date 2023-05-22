//TODO: Probably we need add a field to check if the account have permissions to view all users in database
const { expect } = require('chai');

const email = 'user_2@smartbreak.com'
const password = '123123123'
const password_incorrect = 'abc'
let token_with_access;
let token_without_access;

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
    email: email,
    password: password,
  }),
}
const register_new_user = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: 'User',
    surname: 'Test',
    email: email,
    password: password,
    admin: false,
    department: 'Vendas',
    access: false
  }),
}
const register_new_user_missing_field = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: 'User',
    surname: 'Test',
    email: "missingfields@smartbreak.com",
    password: password,
    admin: false
  }),
}
const login_user_incorrect = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password_incorrect,
  }),
}
const login_user_nonexistent = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "email@email.com",
    password: password,
  }),
}

// 1. AUTH
describe('test /auth', () => {
  describe('auth/register', () => {
    // it('allow to create a new user', (done) => {
    //   fetch('https://sb-api.herokuapp.com/auth/register', register_new_user)
    //     .then((response) => {
    //       expect(response.status).to.equal(201);
    //       return response.json();
    //     })
    //     .then((json) => {
    //       // Additional assertions on the response JSON if needed
    //       done();
    //     })
    //     .catch((error) => done(error));
    // });
    it('prevent creating a user with an existing email', (done) => {
      fetch("https://sb-api.herokuapp.com/auth/register", register_new_user)
        .then((response) => {
          expect(response.status).to.equal(400);
          return response.json();
        })
        .then((json) => {
          // Additional assertions on the response JSON if needed
          done();
        })
        .catch((error) => done(error));
    });
    it('prevent creating a user with missing fields', (done) => {
      fetch("https://sb-api.herokuapp.com/auth/register", register_new_user_missing_field)
        .then((response) => {
          expect(response.status).to.equal(400);
          return response.json();
        })
        .then((json) => {
          // Additional assertions on the response JSON if needed
          done();
        })
        .catch((error) => done(error));
    });
  });
  describe('auth/login', () => {
    it("prevent logging in with an email that doesn't exist", (done) => {
      fetch("https://sb-api.herokuapp.com/auth/login", login_user_nonexistent)
        .then((response) => {
          expect(response.status).to.equal(400);
          return response.json();
        })
        .then((json) => {
          // Additional assertions on the response JSON if needed
          done();
        })
        .catch((error) => done(error));
    });
    it("prevent logging in with a wrong password", (done) => {
      fetch("https://sb-api.herokuapp.com/auth/login", login_user_incorrect)
        .then((response) => {
          expect(response.status).to.equal(400);
          return response.json();
        })
        .then((json) => {
          // Additional assertions on the response JSON if needed
          done();
        })
        .catch((error) => done(error));
    });
    it("allow user login", (done) => {
      fetch("https://sb-api.herokuapp.com/auth/login", login_user_with_access)
        .then((response) => {
          expect(response.status).to.equal(200);
          return response.json();
        })
        .then((json) => {
          token_with_access = json.token
          done();
        })
        .catch((error) => done(error));
    });
    it("allow user login", (done) => {
      fetch("https://sb-api.herokuapp.com/auth/login", login_user_without_access)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          token_without_access = json.token
          done();
        })
        .catch((error) => done(error));
    });
  });
});

// 2. USER
describe('test /users', () => {
  describe('users/', () => {
    it('if not have access, not allow viewing the content', (done) => {
      fetch('https://sb-api.herokuapp.com/users/',
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
      fetch('https://sb-api.herokuapp.com/users/',
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
  })
  describe('users/:id', () => {
    it('user tries access information about themselves', (done) => {
      fetch('https://sb-api.herokuapp.com/users/646b7a61cec499ffa20b6e82',
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
    it('user tries access information about another user', (done) => {
      fetch('https://sb-api.herokuapp.com/users/646b7a61cec499ffa20b6e82',
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
    it('user tries edit information about other user', (done) => {
      fetch('https://sb-api.herokuapp.com/users/646b7a61cec499ffa20b6e82',
        {
          method: "PATCH",
          headers: {
            "Authorization": "Bearer " + token_without_access,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: 'Marketing',
          }),
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
    it('user tries edit information about themselves', (done) => {
      fetch('https://sb-api.herokuapp.com/users/646b7a61cec499ffa20b6e82',
        {
          method: "PATCH",
          headers: {
            "Authorization": "Bearer " + token_with_access,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: 'Marketing',
          }),
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
    // it("prevent user from deleting another user's account", (done) => {
    //   fetch('https://sb-api.herokuapp.com/users/646b7a61cec499ffa20b6e82',
    //     {
    //       method: "PATCH",
    //       headers: {
    //         "Authorization": "Bearer " + token_with_access,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         department: 'Marketing',
    //       }),
    //     })
    //     .then((response) => {
    //       expect(response.status).to.equal(200);
    //       return response.json();
    //     })
    //     .then((json) => {
    //       // Additional assertions on the response JSON if needed
    //       done();
    //     })
    //     .catch((error) => done(error));
    // });
  })

});


// GET ONE USER
// Need to check if the user can only access the information about themselves