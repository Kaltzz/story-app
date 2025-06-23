import { RegisterView } from './register-view.js';
import { RegisterModel } from './register-model.js';
import { RegisterPresenter } from './register-presenter.js';

export function showRegister() {
  const view = new RegisterView();
  const model = new RegisterModel();
  const presenter = new RegisterPresenter(view, model);
  view.render();
  view.afterRender();
  return presenter;
}