import HomeView from '../pages/home/home-view.js'; 
import HomePresenter from '../pages/home/home-presenter.js';
import { HomeModel } from '../pages/home/home-model.js';
import * as storyService from '../data/storyModel.js';
import { initLoginPage } from '../pages/auth/init-login.js';
import { showRegister } from '../pages/auth/init-register.js';
import { FormPresenter } from '../pages/about/form-presenter.js';
import FormView from '../pages/about/form-view.js';
import SavedStories from '../pages/saved/saved-stories.js';

const routes = {
  '/': async () => {
  destroyCurrentPresenter();
  const view = new HomeView();
  const model = new HomeModel(storyService);
  const presenter = new HomePresenter(view, model);
  currentPresenter = presenter;
  presenter.init();
},

  '/tambah': () => {
    destroyCurrentPresenter();
    const presenter = new FormPresenter(new FormView());
    presenter.init();
    currentPresenter = presenter;
  },

  '/login': () => {
    destroyCurrentPresenter();
    initLoginPage();
  },

  '/register': () => {
    destroyCurrentPresenter();
    showRegister();
  },
  '/saved': SavedStories,
};

function destroyCurrentPresenter() {
  if (currentPresenter && typeof currentPresenter.destroy === 'function') {
    currentPresenter.destroy();
    currentPresenter = null;
  }
}

export function initRouter() {
  handleRoute();
}

function handleRoute() {
  const path = location.hash.replace('#', '') || '/';

  if (path.startsWith('main-content')) return;

  const view = routes[path];
  if (view) {
    view();
  } else {
    destroyCurrentPresenter(); 
    document.getElementById('app-view').innerHTML = '<h2>404 - Halaman tidak ditemukan</h2>';
  }
}
