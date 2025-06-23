import { initRouter } from './scripts/routes/index.js';
import './styles/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.startViewTransition) {
    initRouter();
    return;
  }

  navigation.addEventListener('navigate', (event) => {
    const toUrl = new URL(event.destination.url);
    
    if (location.origin !== toUrl.origin) return;

    event.intercept({
      async handler() {
        await document.startViewTransition(() => {
          initRouter();
        }).finished;
      },
    });
  });

  initRouter();
});