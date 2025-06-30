import { initRouter } from './scripts/routes/index.js';
import './styles/styles.css';

function updateNavigation() {
  const authNav = document.getElementById('auth-nav');
  const token = localStorage.getItem('token');

  if (!authNav) return;

  if (token) {
    authNav.innerHTML = `
      <a href="#/profile">Profile</a>
      <a href="#" id="logout">Logout</a>
    `;

    document.getElementById('logout').onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      location.hash = '#/login';
      updateNavigation();
    };
  } else {
    authNav.innerHTML = `
      <a href="#/login">Login</a>
      <a href="#/register">Register</a>
    `;
  }
}

function renderApp() {
  initRouter();
  updateNavigation();
}

document.addEventListener('DOMContentLoaded', () => {

  if (!document.startViewTransition) {
    renderApp();
    return;
  }

  document.startViewTransition(() => renderApp());
});

window.addEventListener('hashchange', () => {
  if (!document.startViewTransition) {
    renderApp();
    return;
  }

  document.startViewTransition(() => renderApp());
});
