export class LoginView {
    getTemplate() {
      return `
        <div class="auth-container" view-transition-name="auth-form">
          <h2>Login</h2>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Login</button>
            <p>Belum punya akun? <a href="#/register">Register</a></p>
          </form>
        </div>
      `;
    }
  
    afterRender() {
      this.form = document.getElementById('login-form');
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.onSubmit({
          email: this.form.email.value,
          password: this.form.password.value,
        });
      });
    }
  
    setSubmitHandler(handler) {
      this.onSubmit = handler;
    }
  
    showError(message) {
      alert(message);
    }
  
    showSuccess(message) {
      alert(message);
    }
  
    redirectTo(path) {
      location.hash = path;
    }
  }