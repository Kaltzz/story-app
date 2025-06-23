export class RegisterModel {
    constructor() {
      this.apiUrl = 'https://story-api.dicoding.dev/v1/register';
    }
  
    async register({ name, email, password }) {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.message || 'Terjadi kesalahan saat registrasi');
      }
  
      return data;
    }
  }