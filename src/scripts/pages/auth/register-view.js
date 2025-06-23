export class RegisterView {
    render() {
      document.getElementById('app-view').innerHTML = this.getTemplate();
    }
  
    getTemplate() {
      return `
        <div class="auth-container">
          <h2>Register</h2>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="name">Nama:</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required minlength="8">
              <small>Minimal 8 karakter</small>
            </div>
            <button type="submit">Register</button>
            <p>Sudah punya akun? <a href="#/login">Login</a></p>
          </form>
        </div>
      `;
    }
  
    afterRender() {
      this.form = document.getElementById('register-form');
      this.form.onsubmit = (e) => {
        e.preventDefault();
        this.onSubmit({
          name: this.form.name.value,
          email: this.form.email.value,
          password: this.form.password.value,
        });
      };
    }
  
    onSubmit(callback) {
      this.onSubmit = callback;
    }
  
    showAlert(message) {
      alert(message);
    }
  
    navigateTo(path) {
      location.hash = path;
    }
  }