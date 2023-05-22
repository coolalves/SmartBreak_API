//TODO: Probably we need add a field to check if the account have permissions to view all users in database
const { expect } = require('chai'); 
const chaiHttp = require('chai-http');

// chai.use(chaiHttp);

const email = 'usertest4@smartbreak.com'
const password = '123123123'
const password_incorrect = '123'
let token;
const new_user = {
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
  }),
}
const new_user_missing_field = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: 'User',
    surname: 'Test',
    email: "missingfields@smartbreak.com",
    password: password,
    admin: false,
  }),
}
const user_correct = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password,
  }),
}
const user_incorrect = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password_incorrect,
  }),
}
const user_nonexistent = {
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
    //   fetch('https://sb-api.herokuapp.com/auth/register', new_user)
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
      fetch("https://sb-api.herokuapp.com/auth/register", new_user)
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
      fetch("https://sb-api.herokuapp.com/auth/register", new_user_missing_field)
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
      fetch("https://sb-api.herokuapp.com/auth/login", user_nonexistent)
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
      fetch("https://sb-api.herokuapp.com/auth/login", user_incorrect)
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
      fetch("https://sb-api.herokuapp.com/auth/login", user_correct)
        .then((response) => {
          expect(response.status).to.equal(200);
          return response.json();
        })
        .then((json) => {
          token = json.token
          done();  
        })
        .catch((error) => done(error));  
    });
  });
});

// 2. USER
describe('test /users', () => {
  describe ('users/')

});

  
// GET ONE USER
// Need to check if the user can only access the information about themselves