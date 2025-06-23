export class RegisterPresenter {
    constructor(view, model) {
      this.view = view;
      this.model = model;
      this.view.onSubmit(this.handleSubmit.bind(this));
    }
  
    async handleSubmit(payload) {
      try {
        await this.model.register(payload);
        this.view.showAlert('Register berhasil! Silakan login.');
        this.view.navigateTo('#/login');
      } catch (error) {
        this.view.showAlert(error.message);
      }
    }
  }