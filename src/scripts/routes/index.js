import HomeView from '../pages/home/home-view.js';
import HomePresenter from '../pages/home/home-presenter.js';
import { HomeModel } from '../pages/home/home-model.js';
import * as storyService from '../data/storyModel.js';
import { initLoginPage } from '../pages/auth/init-login.js';
import { showRegister } from '../pages/auth/init-register.js';
import { FormPresenter } from '../pages/about/form-presenter.js';
import FormView from '../pages/about/form-view.js';
import SavedStories from '../pages/saved/saved-stories.js';

let currentPresenter = null;

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
    currentPresenter = presenter;
    presenter.init();
  },

  '/login': () => {
    destroyCurrentPresenter();
    initLoginPage();
  },

  '/register': () => {
    destroyCurrentPresenter();
    showRegister();
  },

  // --- INI ADALAH PERBAIKAN FINAL ---
  '/saved': async () => { // Jadikan fungsinya async
    destroyCurrentPresenter();
    
    // Dapatkan elemen utama untuk menampilkan konten
    const appViewContainer = document.getElementById('app-view');
    
    // Panggil render() untuk mendapatkan HTML, lalu tampilkan
    appViewContainer.innerHTML = await SavedStories.render();
    
    // Setelah HTML ada di halaman, panggil afterRender() untuk menjalankan logikanya
    await SavedStories.afterRender();

    // Simpan SavedStories sebagai presenter saat ini agar bisa dihancurkan
    currentPresenter = SavedStories;
  },
};

function destroyCurrentPresenter() {
  if (currentPresenter) {
    // Ganti 'destroy' dengan 'cleanup' jika methodnya bernama lain,
    // atau tambahkan pengecekan untuk keduanya.
    if (typeof currentPresenter.destroy === 'function') {
      currentPresenter.destroy();
    } else if (typeof currentPresenter.cleanup === 'function') {
      currentPresenter.cleanup();
    }
    // Untuk SavedStories, kita tidak punya method destroy, jadi ini tidak akan melakukan apa-apa,
    // tapi itu tidak masalah.
    currentPresenter = null;
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);
}

function handleRoute() {
  const path = location.hash.replace('#', '') || '/';
  if (path.startsWith('main-content')) return;

  const viewFunction = routes[path];
  if (viewFunction) {
    viewFunction();
  } else {
    destroyCurrentPresenter();
    document.getElementById('app-view').innerHTML = '<h2>404 - Halaman tidak ditemukan</h2>';
  }
}