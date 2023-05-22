//TODO: Probably we need add a field to check if the account have permissions to view all users in database
const { expect } = require('chai'); 


// 1. CREATE A USER

describe('test /auth', () => {
  describe('auth /register', () => {
    it('should create a new user', async () => {
      const response = await fetch(
        "https://sb-api.herokuapp.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: 'User',
            surname: 'Test',
            email: 'usertest@smartbreak.com',
            password: '123123123',
            admin: false,
            department: 'Vendas',
          }),
        }
      );
      expect(response.status).to.equal(201);
      const json = await response.json();
      console.log('Response JSON:', json);

      expect(json.status).to.equal('OK');
    });
  });
});




  
// GET ONE USER
// Need to check if the user can only access the information about themselves