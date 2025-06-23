import { LoginView } from './login-view.js';
import { LoginModel } from './login-model.js';
import { LoginPresenter } from './login-presenter.js';

export function initLoginPage() {
  const view = new LoginView();
  const model = new LoginModel();
  const presenter = new LoginPresenter(view, model);

  const container = document.getElementById('app-view');
  container.innerHTML = view.getTemplate();
  view.afterRender();
  return presenter;
}