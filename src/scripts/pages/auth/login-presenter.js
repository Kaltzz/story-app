export class LoginPresenter {
    constructor(view, model) {
      this.view = view;
      this.model = model;
      this.view.setSubmitHandler(this.onSubmit.bind(this));
    }
  
    async onSubmit(credentials) {
      try {
        await this.model.login(credentials);
        this.view.showSuccess('Login berhasil!');
        this.view.redirectTo('#/');
      } catch (error) {
        this.view.showError(error.message || 'Terjadi kesalahan saat login');
      }
    }
  }