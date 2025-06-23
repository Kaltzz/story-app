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

async function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', registration);

      // Minta izin notifikasi
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
        });
        console.log('📩 Push Notification Subscribed:', subscription);
      }
    } catch (err) {
      console.error('❌ Service Worker registration failed:', err);
    }
  }
}

function renderApp() {
  initRouter();
  updateNavigation();
}

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();

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
