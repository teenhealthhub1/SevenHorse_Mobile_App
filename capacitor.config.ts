import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sevenhorse.app',
  appName: '7Horse',
  webDir: 'out',
  server: {
    url: 'https://www.7horse.in',  // Your live site
    cleartext: false,              // false for HTTPS
    allowNavigation: [
      'www.7horse.in',
      '7horse.in',
      '*.7horse.in'
    ]
  },
};

export default config;