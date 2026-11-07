import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  App.addListener('backButton', () => {
    const current = document.body.dataset.screen || 'home';
    if (current !== 'home' && window.history.length > 1) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
}
