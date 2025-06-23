export class LoginModel {
    constructor() {
      this.apiUrl = 'https://story-api.dicoding.dev/v1/login';
    }
  
    async login(credentials) {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.message);
      }
  
      this.saveToken(data.loginResult.token);
      this.saveUser(data.loginResult);
      return data;
    }
  
    saveToken(token) {
      localStorage.setItem('token', token);
    }
  
    saveUser({ userId, name }) {
      localStorage.setItem('user', JSON.stringify({ id: userId, name }));
    }
  }