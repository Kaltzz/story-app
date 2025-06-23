class XxxView {
  getTemplate() { ... }
  afterRender() { ... }
  setEventHandlers(handlers) { ... }
  showError(message) { ... }
}

class XxxModel {
  // API calls dan data handling
}

class XxxPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    // Setup event handlers
  }
  // Business logic
}

export function initXxxPage() {
  const view = new XxxView();
  const model = new XxxModel();
  const presenter = new XxxPresenter(view, model);
  
  const container = document.getElementById('app-view');
  container.innerHTML = view.getTemplate();
  view.afterRender();
  return presenter;
}